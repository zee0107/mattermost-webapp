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
                                        <img src={cImage}></img>
                                        <h5>Portfolio Tracker</h5>
                                        <p>Crypter’s Portfolio Tracker provides a simple overview of the current value of your DeFi cryptocurrency tokens in one location. </p>
                                        <a href="#">Know More</a>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={safeImage}></img>
                                        <h5>Social Network</h5>
                                        <p>A Facebook-like platform for crypto enthusiasts. Share your gains and losses, flex your NFTs, or create private groups and chat with your crypto friends: Crypter is the place to do it all. Some dapps will also be integrated on this platform.</p>
                                        <a href="#">Know More</a>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={btcImage}></img>
                                        <h5>Crypter Wallet</h5>
                                        <p>The development of our own wallet will start early next year. This will have features unique to Crypter: an NFT tracker, a P2P service, and many more. A physical debit card connected to this wallet is also an option that is currently being evaluated.</p>
                                        <a href="#">Know More</a>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="col-lg-12 knowmore-box">
                                        <img src={playImage}></img>
                                        <h5>Crypter Marketplace</h5>
                                        <p>This will essentially be an online marketplace, where CRYPT or any other token can be used as payment. The development of Crypter Pay will be a major part of this project: Crypter Pay will become a payment processor that can be used on Wordpress and Shopify sites.</p>
                                        <a href="#">Know More</a>
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
