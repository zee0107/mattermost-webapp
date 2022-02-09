// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import FaAlignRight from 'images/icons/toggleIcon.svg';

import {ClientConfig} from 'mattermost-redux/types/config';
import logoLight from 'images/logoLight.png';
import fillCircle from 'images/fill.svg';
import logoDark from 'images/logoWhite.png';

import Google from 'images/icons/google.svg';
import Twitter from 'images/icons/twitter.svg';
import LinkedIn from 'images/icons/linkedin.svg';
import Instagram from 'images/icons/instagram.svg';
import Heart from 'images/icons/heart-fill.svg';

type Props = {
    config: Partial<ClientConfig> | undefined;
}

export default class NotLoggedIn extends React.PureComponent<Props> {
    static propTypes = {

        /*
         * Content of the page
         */
        children: PropTypes.object,

        /*
         * Mattermost configuration
         */
        config: PropTypes.object,
    };

    state = {
        toggle:false
    }

    Toggle = () => {
        this.setState({toggle:!this.state.toggle})
    }

    componentDidMount() {
        document.body.classList.add('sticky');
        const rootElement: HTMLElement | null = document.getElementById('root');
        if (rootElement) {
            rootElement.classList.add('container-fluid');
        }
    }
    componentWillUnmount() {
        document.body.classList.remove('sticky');
        const rootElement: HTMLElement | null = document.getElementById('root');
        if (rootElement) {
            rootElement.classList.remove('container-fluid');
        }
    }

    render() {
        const content = [];

        if (!this.props.config) {
            return null;
        }

        if (this.props.config.AboutLink) {
            content.push(
                <a
                    key='about_link'
                    id='about_link'
                    className='footer-link'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={this.props.config.AboutLink}
                >
                    <FormattedMessage id='web.footer.about'/>
                </a>,
            );
        }

        if (this.props.config.PrivacyPolicyLink) {
            content.push(
                <a
                    key='privacy_link'
                    id='privacy_link'
                    className='footer-link'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={this.props.config.PrivacyPolicyLink}
                >
                    <FormattedMessage id='web.footer.privacy'/>
                </a>,
            );
        }

        if (this.props.config.TermsOfServiceLink) {
            content.push(
                <a
                    key='terms_link'
                    id='terms_link'
                    className='footer-link'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={this.props.config.TermsOfServiceLink}
                >
                    <FormattedMessage id='web.footer.terms'/>
                </a>,
            );
        }

        if (this.props.config.HelpLink) {
            content.push(
                <a
                    key='help_link'
                    id='help_link'
                    className='footer-link'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={this.props.config.HelpLink}
                >
                    <FormattedMessage id='web.footer.help'/>
                </a>,
            );
        }

        return (
            <div className='inner-wrap'>
                <div className="navBar">
                    <button className="buttonToggle" onClick={this.Toggle}>
                        <img src={FaAlignRight}></img>
                    </button>
                    
                    <ul className={this.state.toggle ? "nav-links show-nav" : "nav-links"}>
                        <li className="nav-item" href="#">About Us</li>
                        <li className="nav-item" href="#">Docs</li>
                        <li className="nav-item" href="#">Help</li>
                        <li className="nav-item" href="#">Contact Us</li>
                        <li className="nav-item" href="/signup_index">Register</li>
                        <li className="nav-item" href="/login">Login</li>
                    </ul>
              </div>

                <div className='row content'>
                    {this.props.children}
                </div>

                <div className='row footer border-top'>
                    <div id='footer_section' className='footer-pane col-xs-12'>
                        <br />
                        <div className="row">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-2">
                                <img src={logoLight}></img>
                                <p className="footerText">The first social media platform for crypto to launch the revolutionary Engage-to-Earn reward system. Enjoy $BUSD rewards while holding $CRYPT tokens.</p>
                                <div className="d-flex">
                                    <div className="col-lg-3">
                                        <div className="parent">
                                            <img src={fillCircle} className="image1"></img>
                                            <img src={Google} className="image2"></img>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="parent">
                                            <img src={fillCircle} className="image1"></img>
                                            <img src={Twitter} className="image2"></img>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="parent">
                                            <img src={fillCircle} className="image1"></img>
                                            <img src={Instagram} className="image2"></img>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="parent">
                                            <img src={fillCircle} className="image1"></img>
                                            <img src={LinkedIn} className="image2"></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="d-flex">
                                    <div className="col-lg-6">
                                        <h4>Company</h4>
                                        <a href="#">About Us</a>
                                        <a href="#">News</a>
                                        <a href="#">Events</a>
                                        <a href="#">Careers</a>
                                        <a href="#">Contact Us</a>
                                    </div>
                                    <div className="col-lg-6">
                                        <h4>Platform</h4>
                                        <a href="#">Social Network</a>
                                        <a href="#">Platform Overview</a>
                                        <a href="#">Security</a>
                                        <a href="#">Block Chain</a>
                                        <a href="#">NFT</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="d-flex">
                                    <div className="col-lg-6">
                                        <h4>Documentation</h4>
                                        <a href="#">Deployment</a>
                                        <a href="#">Admin</a>
                                        <a href="#">API Reference</a>
                                        <a href="#">All Docs</a>
                                    </div>
                                    <div className="col-lg-6">
                                        <h4>Support</h4>
                                        <a href="#">Forums</a>
                                        <a href="#">Help Center</a>
                                        <a href="#">Terms</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2"></div>
                        </div>
                        <br />
                        <div className="col-lg-12 text-center">
                            <div className="parent">
                                <img src={fillCircle} className="image1"></img>
                                <img src={Heart} className="image3"></img>
                            </div>
                            <h5>Copyright {'\u00A9'} Crypter.io </h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

