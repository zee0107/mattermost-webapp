// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {FormattedMessage} from 'react-intl';
import Menu from 'components/menu/Navbar';

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

/*const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const [isDark, setIsDark] = useState(localStorage.getItem("theme") === defaultDark ? 'dark' : 'light');

const darkModeToggle = () => {
    const newThemeValue = isDark === 'light' ? 'dark' : 'light';
    setIsDark(newThemeValue);
}*/

export default class NotLoggedIn extends React.PureComponent<Props> {
    static propTypes = {

        /*
         * Content of the pagez
         */
        children: PropTypes.object,

        /*
         * Mattermost configuration
         */
        config: PropTypes.object,
        darkmode: PropTypes.string,
    };

    

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

        /*const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;*/
        const [isDark, setIsDark] = useState(localStorage.getItem("theme") === true ? 'dark' : 'light');

        const darkModeToggle = () => {
            const newThemeValue = isDark === 'light' ? 'dark' : 'light';
            setIsDark(newThemeValue);
        }

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
            <div className='inner-wrap' data-theme={isDark}>
                <Menu />
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
                                        <div className="parent-icons">
                                            <img src={fillCircle} className="image1"></img>
                                            <img src={Google} className="image2"></img>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="parent-icons">
                                            <img src={fillCircle} className="image1"></img>
                                            <img src={Twitter} className="image2"></img>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="parent-icons">
                                            <img src={fillCircle} className="image1"></img>
                                            <img src={Instagram} className="image2"></img>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="parent-icons">
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
                                        <ul className="footerUl">
                                            <li className="ulLinks">
                                                <a href="#">About Us</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">News</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Events</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Careers</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Contact Us</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-6">
                                        <h4>Platform</h4>
                                        <ul className="footerUl">
                                            <li className="ulLinks">
                                                <a href="#">Social Network</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Platform Overview</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Security</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Security</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Block Chain</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">NFT</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="d-flex">
                                    <div className="col-lg-6">
                                        <h4>Documentation</h4>
                                        <ul className="footerUl">
                                            <li className="ulLinks">
                                                <a href="#">Deployment</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Admin</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">API Reference</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">All Docs</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-6">
                                        <h4>Support</h4>
                                        <ul className="footerUl">
                                            <li className="ulLinks">
                                                <a href="#">Forums</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Help Center</a>
                                            </li>
                                            <li className="ulLinks">
                                                <a href="#">Terms</a>
                                            </li>
                                        </ul>
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
                            <button>Switch</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

