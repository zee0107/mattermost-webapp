// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import {ServerError} from 'mattermost-redux/types/errors';
import {isEmail} from 'mattermost-redux/utils/helpers';
import logoImage from 'images/logoWhite.png';
import homeImage from 'images/homeFeed.png';
import cImage from 'images/icons/cicon.png';
import safeImage from 'images/icons/safeicon.png';
import btcImage from 'images/icons/bitcoinicon.png';
import playImage from 'images/icons/playicon.png';

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

export default class LandingPage extends React.PureComponent<Props, State> {
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
                <div className='col-sm-12 bodyBgElipseLanding bgGrey'>
                    <div className="inner-wrap-section">
                        <div className="col-sm-8 text-center">
                            <h1 className="headerText">The Social Network for Crypto Enthusiasts</h1>
                            <h4>The first social media platform for crypto to launch the revolutionary Engage-to-Earn reward system. Enjoy $BUSD rewards while holding $CRYPT tokens.</h4>
                            <a href="/signup_index" className="btn buttonBgGreen btnPaddingText">Getting Started</a>
                        </div>
                        <div className="col-lg-12 text-center homeImage">
                            <img src={homeImage}></img>
                        </div>
                        
                    </div>
                    <div className="inner-wrap-knowmore">
                        <div className="col-sm-8 text-center">
                                <h1 className="headerText">BRINGING THE DEFI COMMUNITY TOGETHER</h1>
                                <h4>Nobody likes scams and Rug Pulls. Here at Crypter, we ensure that featured projects are all completely legitimate, as their ads must undergo a vetting process; this way, we can eliminate promotions of scam projects, so nobody has to suffer the consequences. Our goal is to establish a community where everyone looks out for each other, while users who are sharing scam projects will be banned permanently.</h4>
                        </div>
                        <div className="col-lg-12 marginTopBottom">
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={cImage} className="imgIcons-knowmore"></img>
                                        <h4 className="textBold">Portfolio Tracker</h4>
                                        <p>Crypter’s Portfolio Tracker provides a simple overview of the current value of your DeFi cryptocurrency tokens in one location. </p>
                                        <a href="#" className="link-knowmore">Know More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg></a>
                                        <br></br>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={safeImage} className="imgIcons-knowmore"></img>
                                        <h4 className="textBold">Social Network</h4>
                                        <p>A Facebook-like platform for crypto enthusiasts. Share your gains and losses, flex your NFTs, or create private groups chat with friends.</p>
                                        <a href="#" className="link-knowmore">Know More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg></a>
                                        <br></br>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={btcImage} className="imgIcons-knowmore"></img>
                                        <h4 className="textBold">Crypter Wallet</h4>
                                        <p>The development of our own wallet will start early next year. This will have features unique to Crypter: P2P service, and more.</p>
                                        <a href="#" className="link-knowmore">Know More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg></a>
                                        <br></br>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={playImage} className="imgIcons-knowmore"></img>
                                        <h4 className="textBold">Crypter Marketplace</h4>
                                        <p>The development of Crypter Pay will be a major part of this project: It will become a payment that can be used on Wordpress and Shopify.</p>
                                        <a href="#" className="link-knowmore">Know More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg></a>
                                        <br></br>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br></br>
                    </div>
                </div>
            </div>
        );
    }
}
