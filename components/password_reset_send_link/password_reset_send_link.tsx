// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import {ServerError} from 'mattermost-redux/types/errors';
import {isEmail} from 'mattermost-redux/utils/helpers';

import BackButton from 'components/common/back_button';
import LocalizedInput from 'components/localized_input/localized_input';

import {t} from 'utils/i18n.jsx';

interface Props {
    actions: {
        sendPasswordResetEmail: (email: string) => Promise<{data: any; error: ServerError}>;
    };
}

interface State {
    error: React.ReactNode;
    updateText: React.ReactNode;
}

export default class PasswordResetSendLink extends React.PureComponent<Props, State> {
    state = {
        error: null,
        updateText: null,
    };
    resetForm = React.createRef<HTMLFormElement>();
    emailInput = React.createRef<HTMLInputElement>();

    handleSendLink = async (e: React.FormEvent) => {
        e.preventDefault();

        const email = this.emailInput.current!.value.trim().toLowerCase();
        if (!email || !isEmail(email)) {
            this.setState({
                error: (
                    <FormattedMessage
                        id='password_send.error'
                        defaultMessage='Please enter a valid email address.'
                    />
                ),
            });
            return;
        }

        // End of error checking clear error
        this.setState({error: null});

        const {data, error} = await this.props.actions.sendPasswordResetEmail(email);
        if (data) {
            this.setState({
                error: null,
                updateText: (
                    <div
                        id='passwordResetEmailSent'
                        className='reset-form alert alert-success'
                    >
                        <FormattedMessage
                            id='password_send.link'
                            defaultMessage='If the account exists, a password reset email will be sent to:'
                        />
                        <div>
                            <b>{email}</b>
                        </div>
                        <br/>
                        <FormattedMessage
                            id='password_send.checkInbox'
                            defaultMessage='Please check your inbox.'
                        />
                    </div>
                ),
            });
            if (this.resetForm.current) {
                this.resetForm.current.hidden = true;
            }
        } else if (error) {
            this.setState({
                error: error.message,
                updateText: null,
            });
        }
    };

    render() {
        let error = null;
        if (this.state.error) {
            error = (
                <div className='form-group has-error'>
                    <label className='control-label'>{this.state.error}</label>
                </div>
            );
        }

        let formClass = 'form-group';
        if (error) {
            formClass += ' has-error';
        }

        return (
            <div>
                <div className='col-sm-12 bodyBgElipse'>
                    <div className="row">
                        <div className="col-sm-5 divfullheight">
                            <br />
                            <div className="divLogo"></div>
                        </div>
                        <div className="col-sm-7">
                            <div className='signup-team__container'>
                                {/*<FormattedMessage
                                    id='password_send.title'
                                    tagName='h1'
                                    defaultMessage='Password Reset'
                                />*/}
                                <p>
                                    <a href='/login' className='removeTextDecor'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                    </svg> Back</a>
                                </p>
                                <hr className='bg-white'/>
                                <h1>Forgot Password</h1>
                                {this.state.updateText}
                                <form
                                    onSubmit={this.handleSendLink}
                                    ref={this.resetForm}
                                >
                                    <h5>
                                    For the purpose of industry regulation, your details are required.
                                        {/*<FormattedMessage
                                            id='password_send.description'
                                            defaultMessage=''
                                        />*/}
                                    </h5>
                                    <br />
                                    <div className={formClass}>
                                        <label>Email Address*</label>
                                        <LocalizedInput
                                            id='passwordResetEmailInput'
                                            type='email'
                                            className='form-control'
                                            name='email'
                                            placeholder={{
                                                id: t('password_send.email'),
                                                defaultMessage: 'Email',
                                            }}
                                            ref={this.emailInput}
                                            spellCheck='false'
                                            autoFocus={true}
                                        />
                                    </div>
                                    {error}
                                    <button
                                        id='passwordResetButton'
                                        type='submit'
                                        className='btn buttonBgGreen fullWidth'
                                    >
                                        <FormattedMessage
                                            id='password_send.reset'
                                            defaultMessage='Reset my password'
                                        />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
