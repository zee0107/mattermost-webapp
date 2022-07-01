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
import logoImageBlack from 'images/logoBlack.png';
import lockIcon from 'images/icons/lock_icon.svg';

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
    getMe: () => void;
    updateMe: (user: UserProfile) => Promise<{
        data: boolean;
        error?: {
            server_error_id: string;
            message: string;
        };
    }>;
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
    currentUser: UserProfile;
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
    locationError?: React.ReactNode;
    passwordError?: React.ReactNode;
    serverError?: React.ReactNode;
    isDark?: string;
    img_path?: string;
    isMatchWidth: boolean;
    name: string;
    address: string;
    location: string;
};

export default class SignupProfile extends React.PureComponent<Props, State> {
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

    private codeRef: React.RefObject<HTMLInputElement>;
    private nameRef: React.RefObject<HTMLInputElement>;
    private phoneRef: React.RefObject<HTMLInputElement>;
    private addressRef: React.RefObject<HTMLInputElement>;
    private locationRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        const data = (new URLSearchParams(this.props.location!.search)).get('d');
        const token = (new URLSearchParams(this.props.location!.search)).get('t');
        const inviteId = (new URLSearchParams(this.props.location!.search)).get('id');

        this.state = {loading: false,isDark:'light',img_path:'',isMatchWidth: window.matchMedia("(min-width: 768px)").matches};
        if (token && token.length > 0) {
            this.state = this.getTokenData(token, data!);
        } else if (inviteId && inviteId.length > 0) {
            this.state = {
                loading: true,
                inviteId,
            };
        }

        this.changeLocation = this.changeLocation.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.codeRef = React.createRef();
        this.phoneRef = React.createRef();
        this.addressRef = React.createRef();
        this.locationRef = React.createRef();
    }

    darkModeToggle = () => {
        const newThemeValue = this.state.isDark === 'light' ? 'dark' : 'light';
        window.localStorage.setItem('theme', newThemeValue);
        this.setState({isDark: newThemeValue});
        const theme = this.state.isDark === 'dark' ? true : false;
        const handler = e => this.setState({isMatchWidth: e.matches});
        window.matchMedia("(min-width: 768px)").addEventListener('change', handler);
        if(theme){
            if(!this.state.isMatchWidth){
                this.setState({img_path: logoImageBlack});
            }
            else{
                this.setState({img_path: logoImageWhite});
            }
        }
        else{
            this.setState({img_path: logoImageWhite});
        }
    }

    componentDidMount() {
        trackEvent('signup', 'signup_user_01_welcome');

        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
        const theme = this.state.isDark === 'dark' ? true : false;
        const handler = e => this.setState({isMatchWidth: e.matches});
        window.matchMedia("(min-width: 768px)").addEventListener('change', handler);
        if(theme){
            if(!this.state.isMatchWidth){
                this.setState({img_path: logoImageBlack});
            }
            else{
                this.setState({img_path: logoImageWhite});
            }
        }
        else{
            this.setState({img_path: logoImageWhite});
        }

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
    }

    isUserValid = () => {
        return true;
    }

    handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const user = Object.assign({}, this.props.currentUser);
        if (!this.state.name) {
            this.setState({nameError: 'Please input your full name.'});
            return;
        }

        if (!this.state.address) {
            this.setState({locationError: 'Please fill in your address.'});
            return;
        }

        if (!this.state.location) {
            this.setState({locationError: 'Please select your country.'});
            return;
        }
        const adr1 = this.state.address.trim();
        const adr2 = this.state.location.trim();
        const position = adr1 + ', ' + adr2;
        const first = this.state.name.substring(0, this.state.name.indexOf(' '));
        const last = this.state.name.substring(this.state.name.indexOf(' ') + 1);

        user.position = position;
        user.first_name = first;
        user.last_name = last;

        this.submitUser(user, false);
        browserHistory.push('/login');
    }

    submitUser = (user: UserProfile, emailUpdated: boolean) => {
        this.props.actions.updateMe(user).
            then(({data, error: err}) => {
                if (data) {
                    this.props.actions.getMe();
                } else if (err) {
                    let serverError;
                    if (err.server_error_id &&
                        err.server_error_id === 'api.user.check_user_password.invalid.app_error') {
                        serverError = 'Incorrect Password';
                    } else if (err.message) {
                        serverError = err.message;
                    } else {
                        serverError = err;
                    }
                    console.log(serverError);
                }
            });
    }

    changeLocation(event) {
        this.setState({location: event.target.value});
    }

    updateName(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({name: event.target.value});
    }

    updateAddress(e: React.ChangeEvent<HTMLInputElement>){
        this.setState({address: event.target.value});
    }

    renderEmailSignup = () => {
        let locationError = null;
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
        if (this.state.locationError) {
            locationError = (<label className='control-label'>{this.state.locationError}</label>);
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
                    {/*<div className={emailContainerStyle}>
                        <h5 id='email_label'>
                            <strong>
                                Phone Number
                            </strong>
                        </h5>
                        <div className={emailDivStyle}>
                            <div className='d-flex'>
                                <div className='col-md-3 removePadding'>
                                    <select id='PhoneCode' className='form-control codeInput custom-input'>
                                        <option value="213">+213</option>
                                        <option value="376">+376</option>
                                        <option value="244">+244</option>
                                        <option value="1264">+1264</option>
                                        <option value="1268">+1268</option>
                                        <option value="54">+54</option>
                                        <option value="374">+374</option>
                                        <option value="297">+297</option>
                                        <option value="61">+61</option>
                                        <option value="43">+43</option>
                                        <option value="994">+994</option>
                                        <option value="1242">+1242</option>
                                        <option value="973">+973</option>
                                        <option value="880">+880</option>
                                        <option value="1246">+1246</option>
                                        <option value="375">+375</option>
                                        <option value="32">+32</option>
                                        <option value="501">+501</option>
                                        <option value="229">+229</option>
                                        <option value="1441">+1441</option>
                                        <option value="975">+975</option>
                                        <option value="591">+591</option>
                                        <option value="387">+387</option>
                                        <option value="267">+267</option>
                                        <option value="55">+55</option>
                                        <option value="673">+673</option>
                                        <option value="359">+359</option>
                                        <option value="226"> Fas+226</option>
                                        <option value="257">+257</option>
                                        <option value="855">+855</option>
                                        <option value="237">+237</option>
                                        <option value="1">+1</option>
                                        <option value="238">+238</option>
                                        <option value="1345">+1345</option>
                                        <option value="236">+236</option>
                                        <option value="56">+56</option>
                                        <option value="86">+86</option>
                                        <option value="57">+57</option>
                                        <option value="269">+269</option>
                                        <option value="242">+242</option>
                                        <option value="682">+682</option>
                                        <option value="506">+506</option>
                                        <option value="385">+385</option>
                                        <option value="90">+90</option>
                                        <option value="357">+357</option>
                                        <option value="420">+420</option>
                                        <option value="45">+45</option>
                                        <option value="253">+253</option>
                                        <option value="1809">+1809</option>
                                        <option value="1809">+1809</option>
                                        <option value="593">+593</option>
                                        <option value="20">+20</option>
                                        <option value="503">+503</option>
                                        <option value="240">+240</option>
                                        <option value="291">+291</option>
                                        <option value="372">+372</option>
                                        <option value="251">+251</option>
                                        <option value="500">+500</option>
                                        <option value="298">+298</option>
                                        <option value="679">+679</option>
                                        <option value="358">+358</option>
                                        <option value="33">+33</option>
                                        <option value="594">+594</option>
                                        <option value="689">+689</option>
                                        <option value="241">+241</option>
                                        <option value="220">+220</option>
                                        <option value="7880">+7880</option>
                                        <option value="49">+49</option>
                                        <option value="233">+233</option>
                                        <option value="350">+350</option>
                                        <option value="30">+30</option>
                                        <option value="299">+299</option>
                                        <option value="1473">+1473</option>
                                        <option value="590">+590</option>
                                        <option value="671">+671</option>
                                        <option value="502">+502</option>
                                        <option value="224">+224</option>
                                        <option value="245">+245</option>
                                        <option value="592">+592</option>
                                        <option value="509">+509</option>
                                        <option value="504">+504</option>
                                        <option value="852">+852</option>
                                        <option value="36">+36</option>
                                        <option value="354">+354</option>
                                        <option value="91">+91</option>
                                        <option value="62">+62</option>
                                        <option value="964">+964</option>
                                        <option value="98">+98</option>
                                        <option value="353">+353</option>
                                        <option value="972">+972</option>
                                        <option value="39">+39</option>
                                        <option value="1876">+1876</option>
                                        <option value="81">+81</option>
                                        <option value="962">+962</option>
                                        <option value="7">+7</option>
                                        <option value="254">+254</option>
                                        <option value="686">+686</option>
                                        <option value="850">+850</option>
                                        <option value="82">+82</option>
                                        <option value="965">+965</option>
                                        <option value="996">+996</option>
                                        <option value="856">+856</option>
                                        <option value="371">+371</option>
                                        <option value="961">+961</option>
                                        <option value="266">+266</option>
                                        <option value="231">+231</option>
                                        <option value="218">+218</option>
                                        <option value="417">+417</option>
                                        <option value="370">+370</option>
                                        <option value="352">+352</option>
                                        <option value="853">+853</option>
                                        <option value="389">+389</option>
                                        <option value="261">+261</option>
                                        <option value="265">+265</option>
                                        <option value="60">+60</option>
                                        <option value="960">+960</option>
                                        <option value="223">+223</option>
                                        <option value="356">+356</option>
                                        <option value="692">+692</option>
                                        <option value="596">+596</option>
                                        <option value="222">+222</option>
                                        <option value="269">+269</option>
                                        <option value="52">+52</option>
                                        <option value="691">+691</option>
                                        <option value="373">+373</option>
                                        <option value="377">+377</option>
                                        <option value="976">+976</option>
                                        <option value="1664">+1664</option>
                                        <option value="212">+212</option>
                                        <option value="258">+258</option>
                                        <option value="95">+95</option>
                                        <option value="264">+264</option>
                                        <option value="674">+674</option>
                                        <option value="977">+977</option>
                                        <option value="31">+31</option>
                                        <option value="687">+687</option>
                                        <option value="64">+64</option>
                                        <option value="505">+505</option>
                                        <option value="227">+227</option>
                                        <option value="234">+234</option>
                                        <option value="683">+683</option>
                                        <option value="672">+672</option>
                                        <option value="670">+670</option>
                                        <option value="47">+47</option>
                                        <option value="968">+968</option>
                                        <option value="92">+92</option>
                                        <option value="680">+680</option>
                                        <option value="507">+507</option>
                                        <option value="675">+675</option>
                                        <option value="595">+595</option>
                                        <option value="51">+51</option>
                                        <option value="63">+63</option>
                                        <option value="48">+48</option>
                                        <option value="351">+351</option>
                                        <option value="1787">+1787</option>
                                        <option value="974">+974</option>
                                        <option value="262">+262</option>
                                        <option value="40">+40</option>
                                        <option value="7">+7</option>
                                        <option value="250">+250</option>
                                        <option value="378">+378</option>
                                        <option value="239">+239</option>
                                        <option value="966">+966</option>
                                        <option value="221">+221</option>
                                        <option value="381">+381</option>
                                        <option value="248">+248</option>
                                        <option value="232">+232</option>
                                        <option value="65">+65</option>
                                        <option value="421">+421</option>
                                        <option value="386">+386</option>
                                        <option value="677">+677</option>
                                        <option value="252">+252</option>
                                        <option value="27">+27</option>
                                        <option value="34">+34</option>
                                        <option value="94">+94</option>
                                        <option value="290">+290</option>
                                        <option value="1869">+1869</option>
                                        <option value="1758">+1758</option>
                                        <option value="597">+597</option>
                                        <option value="249">+249</option>
                                        <option value="268">+268</option>
                                        <option value="46">+46</option>
                                        <option value="41">+41</option>
                                        <option value="963">+963</option>
                                        <option value="886">+886</option>
                                        <option value="992">+992</option>
                                        <option value="66">+66</option>
                                        <option value="228">+228</option>
                                        <option value="676">+676</option>
                                        <option value="1868">+1868</option>
                                        <option value="216">+216</option>
                                        <option value="90">+90</option>
                                        <option value="993">+993</option>
                                        <option value="1649">+1649</option>
                                        <option value="688">+688</option>
                                        <option value="256">+256</option>
                                        <option value="44">+44</option>
                                        <option value="380">+380</option>
                                        <option value="971">+971</option>
                                        <option value="598">+598</option>
                                        <option value="1">+1</option>
                                        <option value="998">+998</option>
                                        <option value="678">+678</option>
                                        <option value="379">+379</option>
                                        <option value="58">+58</option>
                                        <option value="84">+84</option>
                                        <option value="681">+681</option>
                                        <option value="969">+969</option>
                                        <option value="967">+967</option>
                                        <option value="260">+260</option>
                                        <option value="263">+263</option>
                                    </select>
                                </div>
                                <div className='col-md-9 removePadding width-100'>
                                    <input
                                        id='email'
                                        type='number'
                                        className='form-control phoneInput custom-input'
                                        defaultValue={this.state.email}
                                        placeholder='ex. 09091234567'
                                        maxLength={128}
                                        autoFocus={true}
                                    />
                                </div>
                            </div>
                            {emailError}
                            emailHelpText
                        </div>
                    </div>*/}
                    <div className='mt-8'>
                        <h5 id='name_label'>
                            <strong>
                                Fullname
                            </strong>
                        </h5>
                        <div className={nameDivStyle}>
                            <input
                                id='name'
                                type='text'
                                className='form-control custom-input'
                                placeholder='Please enter your fullname'
                                spellCheck='false'
                                autoCapitalize='off'
                                onChange={this.updateName}
                            />
                            {nameError}
                        </div>
                    </div>
                    <div className='mt-8'>
                        <h5 id='name_label'>
                            <strong>
                                Your Address
                            </strong>
                        </h5>
                        <div className={nameDivStyle}>
                            <input
                                id='address'
                                type='text'
                                className='form-control custom-input'
                                placeholder='Please enter your city'
                                spellCheck='false'
                                autoCapitalize='off'
                                onChange={this.updateAddress}
                            />
                            {locationError}
                        </div>
                    </div>
                    <div className='mt-8'>
                        <h5 id='password_label'>
                            <strong>
                                Country of residence
                            </strong>
                        </h5>
                        <div className={passwordDivStyle}>
                            <select id='location' className='form-control custom-input' onChange={this.changeLocation} value={this.state.location}>
                                <option selected>Please select</option>
                                <option value="AF">Afghanistan</option>
                                <option value="AL">Albania</option>
                                <option value="DZ">Algeria</option>
                                <option value="AS">American Samoa</option>
                                <option value="AD">Andorra</option>
                                <option value="AO">Angola</option>
                                <option value="AI">Anguilla</option>
                                <option value="AQ">Antarctica</option>
                                <option value="AG">Antigua And Barbuda</option>
                                <option value="AR">Argentina</option>
                                <option value="AM">Armenia</option>
                                <option value="AW">Aruba</option>
                                <option value="AU">Australia</option>
                                <option value="AT">Austria</option>
                                <option value="AZ">Azerbaijan</option>
                                <option value="BS">Bahamas</option>
                                <option value="BH">Bahrain</option>
                                <option value="BD">Bangladesh</option>
                                <option value="BB">Barbados</option>
                                <option value="BY">Belarus</option>
                                <option value="BE">Belgium</option>
                                <option value="BZ">Belize</option>
                                <option value="BJ">Benin</option>
                                <option value="BM">Bermuda</option>
                                <option value="BT">Bhutan</option>
                                <option value="BO">Bolivia</option>
                                <option value="BA">Bosnia And Herzegovina</option>
                                <option value="BW">Botswana</option>
                                <option value="BV">Bouvet Island</option>
                                <option value="BR">Brazil</option>
                                <option value="IO">British Indian Ocean Territory</option>
                                <option value="BN">Brunei Darussalam</option>
                                <option value="BG">Bulgaria</option>
                                <option value="BF">Burkina Faso</option>
                                <option value="BI">Burundi</option>
                                <option value="KH">Cambodia</option>
                                <option value="CM">Cameroon</option>
                                <option value="CA">Canada</option>
                                <option value="CV">Cape Verde</option>
                                <option value="KY">Cayman Islands</option>
                                <option value="CF">Central African Republic</option>
                                <option value="TD">Chad</option>
                                <option value="CL">Chile</option>
                                <option value="CN">China</option>
                                <option value="CX">Christmas Island</option>
                                <option value="CC">Cocos (keeling) Islands</option>
                                <option value="CO">Colombia</option>
                                <option value="KM">Comoros</option>
                                <option value="CG">Congo</option>
                                <option value="CD">Congo, The Democratic Republic Of The</option>
                                <option value="CK">Cook Islands</option>
                                <option value="CR">Costa Rica</option>
                                <option value="CI">Cote D'ivoire</option>
                                <option value="HR">Croatia</option>
                                <option value="CU">Cuba</option>
                                <option value="CY">Cyprus</option>
                                <option value="CZ">Czech Republic</option>
                                <option value="DK">Denmark</option>
                                <option value="DJ">Djibouti</option>
                                <option value="DM">Dominica</option>
                                <option value="DO">Dominican Republic</option>
                                <option value="TP">East Timor</option>
                                <option value="EC">Ecuador</option>
                                <option value="EG">Egypt</option>
                                <option value="SV">El Salvador</option>
                                <option value="GQ">Equatorial Guinea</option>
                                <option value="ER">Eritrea</option>
                                <option value="EE">Estonia</option>
                                <option value="ET">Ethiopia</option>
                                <option value="FK">Falkland Islands (malvinas)</option>
                                <option value="FO">Faroe Islands</option>
                                <option value="FJ">Fiji</option>
                                <option value="FI">Finland</option>
                                <option value="FR">France</option>
                                <option value="GF">French Guiana</option>
                                <option value="PF">French Polynesia</option>
                                <option value="TF">French Southern Territories</option>
                                <option value="GA">Gabon</option>
                                <option value="GM">Gambia</option>
                                <option value="GE">Georgia</option>
                                <option value="DE">Germany</option>
                                <option value="GH">Ghana</option>
                                <option value="GI">Gibraltar</option>
                                <option value="GR">Greece</option>
                                <option value="GL">Greenland</option>
                                <option value="GD">Grenada</option>
                                <option value="GP">Guadeloupe</option>
                                <option value="GU">Guam</option>
                                <option value="GT">Guatemala</option>
                                <option value="GN">Guinea</option>
                                <option value="GW">Guinea-bissau</option>
                                <option value="GY">Guyana</option>
                                <option value="HT">Haiti</option>
                                <option value="HM">Heard Island And Mcdonald Islands</option>
                                <option value="VA">Holy See (vatican City State)</option>
                                <option value="HN">Honduras</option>
                                <option value="HK">Hong Kong</option>
                                <option value="HU">Hungary</option>
                                <option value="IS">Iceland</option>
                                <option value="IN">India</option>
                                <option value="ID">Indonesia</option>
                                <option value="IR">Iran, Islamic Republic Of</option>
                                <option value="IQ">Iraq</option>
                                <option value="IE">Ireland</option>
                                <option value="IL">Israel</option>
                                <option value="IT">Italy</option>
                                <option value="JM">Jamaica</option>
                                <option value="JP">Japan</option>
                                <option value="JO">Jordan</option>
                                <option value="KZ">Kazakstan</option>
                                <option value="KE">Kenya</option>
                                <option value="KI">Kiribati</option>
                                <option value="KP">Korea, Democratic People's Republic Of</option>
                                <option value="KR">Korea, Republic Of</option>
                                <option value="KV">Kosovo</option>
                                <option value="KW">Kuwait</option>
                                <option value="KG">Kyrgyzstan</option>
                                <option value="LA">Lao People's Democratic Republic</option>
                                <option value="LV">Latvia</option>
                                <option value="LB">Lebanon</option>
                                <option value="LS">Lesotho</option>
                                <option value="LR">Liberia</option>
                                <option value="LY">Libyan Arab Jamahiriya</option>
                                <option value="LI">Liechtenstein</option>
                                <option value="LT">Lithuania</option>
                                <option value="LU">Luxembourg</option>
                                <option value="MO">Macau</option>
                                <option value="MK">Macedonia, The Former Yugoslav Republic Of</option>
                                <option value="MG">Madagascar</option>
                                <option value="MW">Malawi</option>
                                <option value="MY">Malaysia</option>
                                <option value="MV">Maldives</option>
                                <option value="ML">Mali</option>
                                <option value="MT">Malta</option>
                                <option value="MH">Marshall Islands</option>
                                <option value="MQ">Martinique</option>
                                <option value="MR">Mauritania</option>
                                <option value="MU">Mauritius</option>
                                <option value="YT">Mayotte</option>
                                <option value="MX">Mexico</option>
                                <option value="FM">Micronesia, Federated States Of</option>
                                <option value="MD">Moldova, Republic Of</option>
                                <option value="MC">Monaco</option>
                                <option value="MN">Mongolia</option>
                                <option value="MS">Montserrat</option>
                                <option value="ME">Montenegro</option>
                                <option value="MA">Morocco</option>
                                <option value="MZ">Mozambique</option>
                                <option value="MM">Myanmar</option>
                                <option value="NA">Namibia</option>
                                <option value="NR">Nauru</option>
                                <option value="NP">Nepal</option>
                                <option value="NL">Netherlands</option>
                                <option value="AN">Netherlands Antilles</option>
                                <option value="NC">New Caledonia</option>
                                <option value="NZ">New Zealand</option>
                                <option value="NI">Nicaragua</option>
                                <option value="NE">Niger</option>
                                <option value="NG">Nigeria</option>
                                <option value="NU">Niue</option>
                                <option value="NF">Norfolk Island</option>
                                <option value="MP">Northern Mariana Islands</option>
                                <option value="NO">Norway</option>
                                <option value="OM">Oman</option>
                                <option value="PK">Pakistan</option>
                                <option value="PW">Palau</option>
                                <option value="PS">Palestinian Territory, Occupied</option>
                                <option value="PA">Panama</option>
                                <option value="PG">Papua New Guinea</option>
                                <option value="PY">Paraguay</option>
                                <option value="PE">Peru</option>
                                <option value="PH" selected="selected">Philippines</option>
                                <option value="PN">Pitcairn</option>
                                <option value="PL">Poland</option>
                                <option value="PT">Portugal</option>
                                <option value="PR">Puerto Rico</option>
                                <option value="QA">Qatar</option>
                                <option value="RE">Reunion</option>
                                <option value="RO">Romania</option>
                                <option value="RU">Russian Federation</option>
                                <option value="RW">Rwanda</option>
                                <option value="SH">Saint Helena</option>
                                <option value="KN">Saint Kitts And Nevis</option>
                                <option value="LC">Saint Lucia</option>
                                <option value="PM">Saint Pierre And Miquelon</option>
                                <option value="VC">Saint Vincent And The Grenadines</option>
                                <option value="WS">Samoa</option>
                                <option value="SM">San Marino</option>
                                <option value="ST">Sao Tome And Principe</option>
                                <option value="SA">Saudi Arabia</option>
                                <option value="SN">Senegal</option>
                                <option value="RS">Serbia</option>
                                <option value="SC">Seychelles</option>
                                <option value="SL">Sierra Leone</option>
                                <option value="SG">Singapore</option>
                                <option value="SK">Slovakia</option>
                                <option value="SI">Slovenia</option>
                                <option value="SB">Solomon Islands</option>
                                <option value="SO">Somalia</option>
                                <option value="ZA">South Africa</option>
                                <option value="GS">South Georgia And The South Sandwich Islands</option>
                                <option value="ES">Spain</option>
                                <option value="LK">Sri Lanka</option>
                                <option value="SD">Sudan</option>
                                <option value="SR">Suriname</option>
                                <option value="SJ">Svalbard And Jan Mayen</option>
                                <option value="SZ">Swaziland</option>
                                <option value="SE">Sweden</option>
                                <option value="CH">Switzerland</option>
                                <option value="SY">Syrian Arab Republic</option>
                                <option value="TW">Taiwan, Province Of China</option>
                                <option value="TJ">Tajikistan</option>
                                <option value="TZ">Tanzania, United Republic Of</option>
                                <option value="TH">Thailand</option>
                                <option value="TG">Togo</option>
                                <option value="TK">Tokelau</option>
                                <option value="TO">Tonga</option>
                                <option value="TT">Trinidad And Tobago</option>
                                <option value="TN">Tunisia</option>
                                <option value="TR">Turkey</option>
                                <option value="TM">Turkmenistan</option>
                                <option value="TC">Turks And Caicos Islands</option>
                                <option value="TV">Tuvalu</option>
                                <option value="UG">Uganda</option>
                                <option value="UA">Ukraine</option>
                                <option value="AE">United Arab Emirates</option>
                                <option value="GB">United Kingdom</option>
                                <option value="US">United States</option>
                                <option value="UM">United States Minor Outlying Islands</option>
                                <option value="UY">Uruguay</option>
                                <option value="UZ">Uzbekistan</option>
                                <option value="VU">Vanuatu</option>
                                <option value="VE">Venezuela</option>
                                <option value="VN">Viet Nam</option>
                                <option value="VG">Virgin Islands, British</option>
                                <option value="VI">Virgin Islands, U.s.</option>
                                <option value="WF">Wallis And Futuna</option>
                                <option value="EH">Western Sahara</option>
                                <option value="YE">Yemen</option>
                                <option value="ZM">Zambia</option>
                                <option value="ZW">Zimbabwe</option>
                            </select>
                            {locationError}
                        </div>
                    </div>
                    <p className='mt-5'>
                        <button
                            id='saveDetails'
                            type='submit'
                            onClick={this.handleSubmit}
                            className='btn buttonBgGreen fullWidth'
                            disabled={this.state.isSubmitting}
                        >
                            <FormattedMessage
                                id='continueLogin'
                                defaultMessage='Save &amp; Continue'
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
            <div data-theme={this.state.isDark}> 
                {/*hasAccounts && <BackButton onClick={() => trackEvent('signup_email', 'click_back')}/>*/}
                <div
                    id='signup_email_section'
                    className='col-sm-12 bodyBgElipse'
                >
                    <div className='row'>
                        <div className='col-sm-5 divfullheight'>
                            <br />
                            <a href='/' className="divLogo"></a>
                        </div>
                        <div className='col-sm-7'>
                            <div className='signup-team__container padding--less'>
                                <img
                                    alt={'signup team logo'}
                                    className='signup-team-logo'
                                    src={logoImage}
                                />
                                <br />
                                <SiteNameAndDescription
                                    customDescriptionText={customDescriptionText}
                                    siteName="Complete Your Profile"
                                />
                                
                                <hr className='bg-white' />
                                {emailSignup}
                                {serverError}
                                <br></br>
                                <div className="text-center">
                                    <span className='small getSecondaryText text-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="var(--seconday-headers)">
                                            <path d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                        </svg> Your Info is safely secured
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-12'>
                            <button className='btn buttonBgGreen buttonTogglePostion float-end' onClick={this.darkModeToggle}>Switch Theme</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
/* eslint-enable react/no-string-refs */
