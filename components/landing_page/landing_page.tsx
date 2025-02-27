// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import {ServerError} from 'mattermost-redux/types/errors';
import {isEmail} from 'mattermost-redux/utils/helpers';
import logoImage from 'images/logoWhite.png';
import homeImage from 'images/homeFeed.png';
import homedarkImage from 'images/homeFeed-dark.png';
import cImage from 'images/icons/cicon.png';
import safeImage from 'images/icons/safeicon.png';
import btcImage from 'images/icons/bitcoinicon.png';
import playImage from 'images/icons/playicon.png';
import createImage from 'images/icons/get-started-icon-1.png';
import bankImage from 'images/icons/get-started-icon-2.png';
import buildImage from 'images/icons/get-started-icon-3.png';
import profilesImage from 'images/profiles.svg';

import BackButton from 'components/common/back_button';
import LocalizedInput from 'components/localized_input/localized_input';
import Carousel from 'components/carousel/carousel'

import {t} from 'utils/i18n.jsx';
import { ThemeConsumer } from 'styled-components';

interface Props {
    actions: {
        sendPasswordResetEmail: (email: string) => Promise<{data: any; error: ServerError}>;
    };
}

interface State {
    error: React.ReactNode;
    updateText: React.ReactNode;
    isDark: string;
    img_path: string;
    siteName: string;
}

export default class LandingPage extends React.PureComponent<Props, State> {
    state = {
        error: null,
        updateText: null,
        isDark:'light',
        img_path: homeImage,
        siteName: 'Crypter'
    };

    resetForm = React.createRef<HTMLFormElement>();
    emailInput = React.createRef<HTMLInputElement>();

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
        this.setDocumentTitle(this.state.siteName);
    }

    componentDidUpdate(){
        if(this.props.mode === 'dark'){
            this.setState({img_path: homedarkImage});
        }
        else{
            this.setState({img_path: homeImage});
        }

        this.setDocumentTitle(this.state.siteName);
    }

    setDocumentTitle = (siteName: string) => {
        if (siteName) {
            document.title = siteName;
        }
    }

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

        /*if(this.props.mode === 'dark'){
            imgFeed = (
                <img src={homedarkImage}></img>
            );
        }else{
            imgFeed = (
                <img src={homeImage}></img>
            );
        }*/

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
                <div className='col-sm-12 bodyBgElipseLanding bgGrey removePadding'>
                    <div className="inner-wrap-section">
                        <div className="col-sm-8 text-center">
                            <h2 className="headerText">WELCOME</h2>
                            <h2 className='getSecondaryText'>Connect with your crypto friends all over the world. The largest social network for crypto enthusiasts.</h2>
                            <a href="/signup_index" className="btn buttonBgGreen btnPaddingText">Getting Started</a>
                        </div>
                        <div className="col-lg-12 text-center homeImage">
                            {this.props.mode !== "dark" && <img src={homeImage}></img>}
                            {this.props.mode === "dark" && <img src={homedarkImage}></img>}
                            {/*<img src={this.state.img_path}></img>*/}
                        </div>
                        
                    </div>
                    <div className="inner-wrap-knowmore">
                        <div className="col-sm-12 text-center">
                                <h1 className="headerText">BRINGING THE DEFI COMMUNITY TOGETHER</h1>
                                <h2 className='getSecondaryText'>Nobody likes scams and Rug Pulls. Here at Crypter, we ensure that featured projects are all completely legitimate, as their ads must undergo a vetting process; this way, we can eliminate promotions of scam projects, so nobody has to suffer the consequences.</h2>
                        </div>
                        <div className="col-lg-12 marginTopBottom">
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={cImage} className="imgIcons-knowmore"></img>
                                        <h4 className="textBold">SHARE</h4>
                                        <p>Share your calls, flex your gains and your losses to your friends.</p>
                                        <br></br>
                                        <a href="#" className="link-knowmore">Know More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 -5 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg></a>
                                        <br></br>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={safeImage} className="imgIcons-knowmore"></img>
                                        <h4 className="textBold">100% PRIVACY</h4>
                                        <p>Unlike other platforms, we don’t track our user data.</p>
                                        <br></br>
                                        <a href="#" className="link-knowmore">Know More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 -5 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg></a>
                                        <br></br>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={btcImage} className="imgIcons-knowmore"></img>
                                        <h4 className="textBold">DISCOVER</h4>
                                        <p>Create new connections, discover new projects.</p>
                                        <br></br>
                                        <a href="#" className="link-knowmore">Know More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 -5 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg></a>
                                        <br></br>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={playImage} className="imgIcons-knowmore"></img>
                                        <h4 className="textBold">PLAY WITH YOUR FRIENDS</h4>
                                        <p>Play your favorite games while communicating with your friends.</p>
                                        <br></br>
                                        <a href="#" className="link-knowmore">Know More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 -5 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg></a>
                                        <br></br>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br></br>
                    </div>
                    <div className="inner-wrap-knowmore">
                        <div className="col-lg-12">
                            <div className='col-lg-12 learnmoreBox'>
                                <div className='row p-4'>
                                    <div className="col-lg-9">
                                        <h3>New In Cryptocurrency?</h3>
                                        <h4 className='getSecondaryText mb-5'>We'll tell you what cryptocurrencies are, how they work and why you should own one right now. So let's do it.</h4>
                                    </div>
                                    <div className="col-lg-3 displayCenter mt-5">
                                        <a href="/signup_index" className="buttonBgGreen btnLearnText">Learn &amp; Explore Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inner-wrap-knowmore">
                        <div className="col-lg-12 marginTopBottom">
                            <div className="row">
                                <div className="col-lg-6 mb-6">
                                    <h1 className="headerTextGettingStarted">How To Get Started</h1>
                                    <h4 className='getSecondaryText mb-4'>Simple and easy way to start your investment in cryptocurrency</h4>
                                    <br />
                                    <a href="/signup_index" className="buttonBgGreen btnGettingStartedText mt-4 mb-4">Getting Started</a>
                                </div>
                                <div className="col-lg-6">
                                    <div className="col-lg-12 removePadding">
                                        <div className="d-flex gettingstartedBox p-2">
                                            <div className="col-lg-2 text-center">
                                                <img src={createImage} className="gettingstartedImg"></img>
                                            </div>
                                            <div className="col-lg-10">
                                                <h3 className='getStartPrimaryText'>Create Your Account</h3>
                                                <h5 className='getSecondaryText'>Your account and personal identity are guaranteed safe.</h5>
                                            </div>
                                        </div>
                                        <div className="d-flex gettingstartedBox p-2">
                                            <div className="col-lg-2 text-center">
                                                <img src={bankImage} className="gettingstartedImg"></img>
                                            </div>
                                            <div className="col-lg-10">
                                                <h3 className='getStartPrimaryText'>Connect Bank Account</h3>
                                                <h5 className='getSecondaryText'>Connect the bank account to start transactions.</h5>
                                            </div>
                                        </div>
                                        <div className="d-flex gettingstartedBox p-2">
                                            <div className="col-lg-2 text-center">
                                                <img src={buildImage} className="gettingstartedImg"></img>
                                            </div>
                                            <div className="col-lg-10">
                                                <h3 className='getStartPrimaryText'>Start Build Portfolio</h3>
                                                <h5 className='getSecondaryText'>Buy and sell popular currencies and keep track of them.</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="whiteBackground">
                        <div className="inner-wrap-feedback">
                            <div className="col-lg-12 marginTopBottom">
                                <div className='col-lg-12'>
                                    <div className="row">
                                        <div className="col-lg-6 feedback-box">
                                            <h1 className="headerFeedbackText">Engage to Earn</h1>
                                            <h4 className='getSecondaryText'>Crypter is the first project to launch the revolutionary Engage-to-Earn system that rewards members who engage with their friends and with the community; imagine getting paid for every like, post, comment you make on your Crypter profile.</h4>
                                        </div>
                                        <div className="col-lg-6 feedback-box">
                                            <Carousel />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inner-wrap-knowmore">
                        <div className="col-lg-12 marginBottom">
                            <div className='col-lg-12 joinusBox'>
                                <div className="row">
                                    <div className="col-lg-5">
                                        <h1>Join the largest social Crypto community</h1>
                                        <p>Join with more 2.5M+ Global Users</p>
                                        <a href="#" className="linkText"><img src={profilesImage}></img> and others</a>
                                    </div>
                                    <div className="col-lg-4 mb-4"></div>
                                    <div className="col-lg-3 mt-5">
                                        <a href="/signup_index" className="btnNowBgWhite">Register Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
