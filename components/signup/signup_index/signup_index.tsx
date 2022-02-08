// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable react/no-string-refs */

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';

import {UserProfile} from 'mattermost-redux/types/users';
import {ServerError} from 'mattermost-redux/types/errors';

import {isEmail} from 'mattermost-redux/utils/helpers';

import {trackEvent} from 'actions/telemetry_actions.jsx';
import * as GlobalActions from 'actions/global_actions';
import {browserHistory} from 'utils/browser_history';
import Constants, {ValidationErrors} from 'utils/constants';
import * as Utils from 'utils/utils.jsx';

import logoImage from 'images/logo.png';
import logoImageWhite from 'images/logoWhite.png';
import polygonImage from 'images/polygon.svg';
import arrowImage from 'images/arrow-right.svg';
import briefcaseImage from 'images/briefcase.svg';
import peopleImage from 'images/people.svg';

import BackButton from 'components/common/back_button';
import LoadingScreen from 'components/loading_screen';
import SiteNameAndDescription from 'components/common/site_name_and_description';

import FormattedMarkdownMessage from 'components/formatted_markdown_message.jsx';

type TeamInviteInfo = {
    display_name: string;
    description: string;
    name: string;
    id: string;
};

export type Actions = {
    createUser: (user: UserProfile, token: string, inviteId: string, redirect: string) => Promise<{data: UserProfile} | {error: ServerError}>;
    loginById: (id: string, password: string, mfaToken?: string) => Promise<{data: boolean} | {error: ServerError}>;
    setGlobalItem: (name: string, value: string) => {data: boolean};
    getTeamInviteInfo: (inviteId: string) => Promise<{data: TeamInviteInfo} | {error: ServerError}>;
};

export type Props = {
    location?: {search: string};
    enableSignUpWithEmail: boolean;
    siteName?: string;
    termsOfServiceLink?: string;
    privacyPolicyLink?: string;
    customDescriptionText?: string;
    passwordConfig: Utils.PasswordConfig;
    hasAccounts: boolean;
    actions: Actions;
};

export type State = {
    loading: boolean;
    inviteId?: string;
    token?: string;
    email?: string;
    teamName?: string;
    reminderInterval?: string;
    noOpenServerError?: boolean;
    isSubmitting?: boolean;
    nameError?: React.ReactNode;
    emailError?: React.ReactNode;
    passwordError?: React.ReactNode;
    serverError?: React.ReactNode;
};

export default class SignupIndex extends React.PureComponent<Props, State> {
    static propTypes = {
        location: PropTypes.object,
        enableSignUpWithEmail: PropTypes.bool.isRequired,
        siteName: PropTypes.string,
        termsOfServiceLink: PropTypes.string,
        privacyPolicyLink: PropTypes.string,
        customDescriptionText: PropTypes.string,
        passwordConfig: PropTypes.object,
        hasAccounts: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            createUser: PropTypes.func.isRequired,
            loginById: PropTypes.func.isRequired,
            setGlobalItem: PropTypes.func.isRequired,
            getTeamInviteInfo: PropTypes.func.isRequired,
        }).isRequired,
    }

    private emailRef: React.RefObject<HTMLInputElement>;
    private nameRef: React.RefObject<HTMLInputElement>;
    private passwordRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        const data = (new URLSearchParams(this.props.location!.search)).get('d');
        const token = (new URLSearchParams(this.props.location!.search)).get('t');
        const inviteId = (new URLSearchParams(this.props.location!.search)).get('id');

        this.state = {loading: false};
        if (token && token.length > 0) {
            this.state = this.getTokenData(token, data!);
        } else if (inviteId && inviteId.length > 0) {
            this.state = {
                loading: true,
                inviteId,
            };
        }

        this.emailRef = React.createRef();
        this.nameRef = React.createRef();
        this.passwordRef = React.createRef();
    }

    componentDidMount() {
        trackEvent('signup', 'signup_user_01_welcome');

        this.setDocumentTitle(this.props.siteName!);

        const {inviteId} = this.state;
        if (inviteId && inviteId.length > 0) {
            this.getInviteInfo(inviteId);
        }

        if (!this.props.hasAccounts) {
            document.body.classList.remove('sticky');
        }
    }

    componentDidUpdate() {
        this.setDocumentTitle(this.props.siteName!);
    }

    setDocumentTitle = (siteName: string) => {
        if (siteName) {
            document.title = siteName;
        }
    }

    getTokenData = (token: string, data: string) => {
        const parsedData = JSON.parse(data);

        return {
            loading: false,
            token,
            email: parsedData.email,
            teamName: parsedData.name,
            reminderInterval: parsedData.reminder_interval,
        };
    }

    getInviteInfo = async (inviteId: string) => {
        const teamInviteInfo = await this.props.actions.getTeamInviteInfo(inviteId);
        if ('data' in teamInviteInfo) {
            this.setState({
                loading: false,
                noOpenServerError: false,
                serverError: '',
                teamName: teamInviteInfo.data.name,
            });
        } else if ('error' in teamInviteInfo) {
            this.setState({
                loading: false,
                noOpenServerError: true,
                serverError: (
                    <FormattedMessage
                        id='signup_user_completed.invalid_invite'
                        defaultMessage='The invite link was invalid.  Please speak with your Administrator to receive an invitation.'
                    />
                ),
            });
        }
    }

    handleSignupSuccess = (user: UserProfile, data: UserProfile) => {
        trackEvent('signup', 'signup_user_02_complete');
        if (this.state.reminderInterval) {
            trackEvent('signup', 'signup_from_reminder_' + this.state.reminderInterval, {user: user.id});
        }
        const redirectTo = (new URLSearchParams(this.props.location!.search)).get('redirect_to');

        this.props.actions.loginById(data.id, user.password, '').then((result: {data: boolean} | {error: ServerError}) => {
            if ('error' in result) {
                if (result.error.server_error_id === 'api.user.login.not_verified.app_error') {
                    let verifyUrl = '/should_verify_email?email=' + encodeURIComponent(user.email);
                    if (this.state.teamName) {
                        verifyUrl += '&teamname=' + encodeURIComponent(this.state.teamName);
                    }
                    if (redirectTo) {
                        verifyUrl += '&redirect_to=' + redirectTo;
                    }
                    browserHistory.push(verifyUrl);
                } else {
                    this.setState({
                        serverError: result.error.message,
                        isSubmitting: false,
                    });
                }

                return;
            }

            if (this.state.token && this.state.token.length > 0) {
                this.props.actions.setGlobalItem(this.state.token, JSON.stringify({usedBefore: true}));
            }

            if (redirectTo) {
                browserHistory.push(redirectTo);
            } else {
                GlobalActions.redirectUserToDefaultTeam();
            }
        });
    }

    isUserValid = () => {
        const providedEmail = this.emailRef.current?.value.trim();
        if (!providedEmail) {
            this.setState({
                nameError: '',
                emailError: (<FormattedMessage id='signup_user_completed.required'/>),
                passwordError: '',
                serverError: '',
            });
            return false;
        }

        if (!isEmail(providedEmail)) {
            this.setState({
                nameError: '',
                emailError: (<FormattedMessage id='signup_user_completed.validEmail'/>),
                passwordError: '',
                serverError: '',
            });
            return false;
        }

        const providedUsername = this.nameRef.current?.value.trim().toLowerCase();
        if (!providedUsername) {
            this.setState({
                nameError: (<FormattedMessage id='signup_user_completed.required'/>),
                emailError: '',
                passwordError: '',
                serverError: '',
            });
            return false;
        }

        const usernameError = Utils.isValidUsername(providedUsername);
        if (usernameError) {
            let errObj;
            if (usernameError.id === ValidationErrors.RESERVED_NAME) {
                errObj = {
                    nameError: (<FormattedMessage id='signup_user_completed.reserved'/>),
                    emailError: '',
                    passwordError: '',
                    serverError: '',
                };
            } else {
                errObj = {
                    nameError: (
                        <FormattedMessage
                            id='signup_user_completed.usernameLength'
                            values={{
                                min: Constants.MIN_USERNAME_LENGTH,
                                max: Constants.MAX_USERNAME_LENGTH,
                            }}
                        />
                    ),
                    emailError: '',
                    passwordError: '',
                    serverError: '',
                };
            }
            this.setState(errObj);
            return false;
        }

        const providedPassword = this.passwordRef.current?.value ?? '';
        const {valid, error} = Utils.isValidPassword(providedPassword, this.props.passwordConfig);
        if (!valid && error) {
            this.setState({
                nameError: '',
                emailError: '',
                passwordError: error,
                serverError: '',
            });
            return false;
        }

        return true;
    }

    handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        trackEvent('signup_email', 'click_create_account');

        // bail out if a submission is already in progress
        if (this.state.isSubmitting) {
            return;
        }

        if (this.isUserValid()) {
            this.setState({
                nameError: '',
                emailError: '',
                passwordError: '',
                serverError: '',
                isSubmitting: true,
            });

            const user = {
                email: this.emailRef.current?.value.trim(),
                username: this.nameRef.current?.value.trim().toLowerCase(),
                password: this.passwordRef.current?.value,
                allow_marketing: true,
            } as UserProfile;

            const redirectTo = (new URLSearchParams(this.props.location!.search)).get('redirect_to');

            this.props.actions.createUser(user, this.state.token as string, this.state.inviteId as string, redirectTo as string).then((result: {data: UserProfile} | {error: ServerError}) => {
                if ('error' in result) {
                    this.setState({
                        serverError: result.error.message,
                        isSubmitting: false,
                    });
                    return;
                }

                this.handleSignupSuccess(user, result.data);
            });
        }
    }

    renderEmailSignup = () => {
        let emailError = null;
        let emailHelpText: React.ReactNode = (
            <span
                id='valid_email'
                className='help-block'
            >
                <FormattedMessage
                    id='signup_user_completed.emailHelp'
                    className='color--light'
                    defaultMessage='Valid email required for sign-up'
                />
            </span>
        );
        let emailDivStyle = 'form-group';
        if (this.state.emailError) {
            emailError = (<label className='control-label'>{this.state.emailError}</label>);
            emailHelpText = '';
            emailDivStyle += ' has-error';
        }

        let nameError = null;
        let nameHelpText: React.ReactNode = (
            <span
                id='valid_name'
                className='help-block'
            >
                <FormattedMessage
                    id='signup_user_completed.userHelp'
                    className='color--light'
                    defaultMessage='You can use lowercase letters, numbers, periods, dashes, and underscores.'
                />
            </span>
        );
        let nameDivStyle = 'form-group';
        if (this.state.nameError) {
            nameError = <label className='control-label'>{this.state.nameError}</label>;
            nameHelpText = '';
            nameDivStyle += ' has-error';
        }

        let passwordError = null;
        let passwordDivStyle = 'form-group';
        if (this.state.passwordError) {
            passwordError = <label className='control-label'>{this.state.passwordError}</label>;
            passwordDivStyle += ' has-error';
        }

        let yourEmailIs = null;
        if (this.state.email) {
            yourEmailIs = (
                <FormattedMarkdownMessage
                    id='signup_user_completed.emailIs'
                    className='color--light'
                    defaultMessage="Your email address is **{email}**. You'll use this address to sign in to {siteName}."
                    values={{
                        email: this.state.email,
                        siteName: this.props.siteName,
                    }}
                />
            );
        }

        let emailContainerStyle = 'mt-8';
        if (this.state.email) {
            emailContainerStyle = 'hidden';
        }

        return (
            <form>
                <div className='inner__content'>
                    <div className={emailContainerStyle}>
                        <h5 id='email_label'>
                            <strong>
                                {/*<FormattedMessage
                                    id='signup_user_completed.whatis'
                                    defaultMessage="What's your email address?"
                                />*/}
                                Email address*
                            </strong>
                        </h5>
                        <div className={emailDivStyle}>
                            <input
                                id='email'
                                type='email'
                                ref={this.emailRef}
                                className='form-control'
                                defaultValue={this.state.email}
                                placeholder='Email'
                                maxLength={128}
                                autoFocus={true}
                                spellCheck='false'
                                autoCapitalize='off'
                            />
                            {emailError}
                            {/*emailHelpText*/}
                        </div>
                    </div>
                    {yourEmailIs}
                    <div className='mt-8'>
                        <h5 id='name_label'>
                            <strong>
                                {/*<FormattedMessage
                                    id='signup_user_completed.chooseUser'
                                    defaultMessage='Choose your username'
                                />*/}
                                Username*
                            </strong>
                        </h5>
                        <div className={nameDivStyle}>
                            <input
                                id='name'
                                type='text'
                                ref={this.nameRef}
                                className='form-control'
                                placeholder='Username'
                                maxLength={Constants.MAX_USERNAME_LENGTH}
                                spellCheck='false'
                                autoCapitalize='off'
                            />
                            {nameError}
                            {/*nameHelpText*/}
                        </div>
                    </div>
                    <div className='mt-8'>
                        <h5 id='password_label'>
                            <strong>
                                {/*<FormattedMessage
                                    id='signup_user_completed.choosePwd'
                                    defaultMessage='Choose your password'
                                />*/}
                                Password*
                            </strong>
                        </h5>
                        <div className={passwordDivStyle}>
                            <input
                                id='password'
                                type='password'
                                ref={this.passwordRef}
                                className='form-control'
                                placeholder='Password'
                                maxLength={128}
                                spellCheck='false'
                            />
                            {passwordError}
                        </div>
                    </div>
                    <p className='mt-5'>
                        <button
                            id='createAccountButton'
                            type='submit'
                            onClick={this.handleSubmit}
                            className='btn buttonBgGreen fullWidth'
                            disabled={this.state.isSubmitting}
                        >
                            <FormattedMessage
                                id='signup_user_completed.create'
                                defaultMessage='Create Account'
                            />
                        </button>
                    </p>
                </div>
            </form>
        );
    }

    render() {
        const {
            customDescriptionText,
            enableSignUpWithEmail,
            location,
            privacyPolicyLink,
            siteName,
            termsOfServiceLink,
            hasAccounts,
        } = this.props;

        let serverError = null;
        if (this.state.serverError) {
            serverError = (
                <div
                    id='existingEmailErrorContainer'
                    className={'form-group has-error'}
                >
                    <label className='control-label'>{this.state.serverError}</label>
                </div>
            );
        }

        if (this.state.loading) {
            return (<LoadingScreen/>);
        }

        let emailSignup;
        if (enableSignUpWithEmail) {
            emailSignup = this.renderEmailSignup();
        } else {
            return null;
        }

        let terms = null;
        if (!this.state.noOpenServerError && emailSignup) {
            terms = (
                <p id='signup_agreement'>
                    <FormattedMarkdownMessage
                        id='create_team.agreement'
                        defaultMessage='By proceeding to create your account and use {siteName}, you agree to our [Terms of Use]({TermsOfServiceLink}) and [Privacy Policy]({PrivacyPolicyLink}). If you do not agree, you cannot use {siteName}.'
                        values={{
                            siteName,
                            TermsOfServiceLink: `!${termsOfServiceLink}`,
                            PrivacyPolicyLink: `!${privacyPolicyLink}`,
                        }}
                    />
                </p>
            );
        }

        if (this.state.noOpenServerError) {
            emailSignup = null;
        }

        return (
            <div>
                {/*hasAccounts && <BackButton onClick={() => trackEvent('signup_email', 'click_back')}/>*/}
                <div
                    id='signup_email_section'
                    className='col-sm-12 bodyBgElipse'
                >
                    <div className='row'>
                        <div className='col-sm-5 divfullheight'>
                            <br />
                            <a href='/'>
                                <img src={logoImageWhite}></img>
                            </a>
                        </div>
                        <div className='col-sm-7 divMarginTop'>
                            <div className='signup-team__container padding--less'>
                                <img
                                    alt={'signup team logo'}
                                    className='signup-team-logo'
                                    src={logoImage}
                                />
                                <SiteNameAndDescription
                                    customDescriptionText='To begin this journey, tell us what type of account you’d be opening.'
                                    siteName="Join us!"
                                />
                                <br />
                                <div onClick={event => window.location.href = '/signup_email'} className="col-sm-12 ButtonSignup">
                                    <div className="d-flex">
                                        <div className="col-sm-3">
                                            <img src={polygonImage} className='imagePadding'></img>
                                            <img src={peopleImage} className='imagePeoplePadding'></img>
                                        </div>
                                        <div className="col-sm-7">
                                            <h5>Individual</h5>
                                            <h6>Personal account to manage all your activities.</h6>
                                        </div>
                                        <div className="col-sm-2 text-center">
                                            <img src={arrowImage} className='imagearrowPadding'></img>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={event => window.location.href = '/signup_business'} className="col-sm-12 ButtonSignup">
                                    <div className="d-flex">
                                        <div className="col-sm-3">
                                            <img src={polygonImage} className='imagePadding'></img>
                                            <img src={briefcaseImage} className='imageCasePadding'></img>
                                        </div>
                                        <div className="col-sm-7">
                                            <h5>Business</h5>
                                            <h6>Own or belong to a company, this is for you.</h6>
                                        </div>
                                        <div className="col-sm-2 text-center">
                                            <img src={arrowImage} className='imagearrowPadding'></img>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <br />
                                <h5
                                    id='signin_account'
                                    className='text-white text-center'
                                >
                                    <FormattedMessage
                                        id='signup_user_completed.haveAccount'
                                        defaultMessage='Already have an account?'
                                    />
                                    {' '}
                                    <Link
                                        id='signin_account_link'
                                        to={'/login' + location!.search}
                                        onClick={() => trackEvent('signup_email', 'click_signin_account')}
                                    >
                                        {/*<FormattedMessage
                                            id='signup_user_completed.signIn'
                                            defaultMessage='Sign in.'
                                        />*/}
                                        Sign in
                                    </Link>
                                </h5>
                                {/*terms*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
/* eslint-enable react/no-string-refs */
