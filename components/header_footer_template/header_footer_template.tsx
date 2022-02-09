// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

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
                <header>
                    <nav class="navbar navbar-expand-lg navbar-light nav-menu-desktop">
                        <div class="container">

                            <a class="navbar-toggler" data-toggle="collapse" href="#"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                            aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon">
                                </span>
                            </a>

                            <div class="collapse navbar-collapse">
                                <div class="row">
                                    <div class="col-2">
                                        <a href="/home" target="_self">
                                            <img src={logoLight}>
                                           
                                        </a>
                                    </div>
                                </div>
                                <ul class="navbar-nav mb-2 mb-lg-0 text-center" id="home_nav">
                                    <li class="nav-item nav-item-divider  ms-4">
                                    <li class="nav-item d-flex align-items-center ms-1" id="hiw_emp">
                                        <a class="nav-link nav_list_emp active" aria-current="page" href="#">
                                            About Us
                                        </a>
                                    </li>
                                    <li class="nav-item d-flex align-items-center" id="ts_emp">
                                        <a class="nav-link nav_list_emp" href="#">
                                            Docs
                                        </a>
                                    </li>
                                    <li class="nav-item d-flex align-items-center" id="affi">
                                        <a class="nav-link nav_list_emp" href="#">
                                            Help
                                        </a>
                                    </li>
                                    <li class="nav-item d-flex align-items-center" id="pr_emp">
                                        <a class="nav-link nav_list_emp" href="#">
                                            Contact Us
                                        </a>
                                    </li>
                                    <li class="nav-item nav-item-divider  ms-4">
                                    </li>
                                    <li class="nav-item d-flex align-items-center" id="discover">
                                        <a class="nav-link nav_list_emp" href="#">
                                            EN
                                        </a>
                                    </li>
                                </ul>

                                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 text-center" id="account_nav">
                                    <li class="nav-item d-flex align-items-center me-3" id="signin">
                                        <a class="nav-link nav_list_emp" aria-current="page" href="/signup_index">
                                            Register
                                        </a>
                                    </li>
                                    <li class="nav-item d-flex align-items-center me-3" id="signin">
                                        <a class="nav-link nav_list_emp" aria-current="page" href="/login">
                                            Login
                                        </a>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </nav>

                    <nav class="navbar navbar-expand-lg navbar-light nav-menu-mobile">
                        <div class="container">

                            <div class="btn-group group-padding-mobile-menu" role="group" aria-label="Group mobile">
                                <a href="/home" target="_self" class="img-logo-mobile">
                                    <img src={logoLight}>
                                </a>
                            </div>

                            <a class="navbar-toggler onClickmobilenavbar" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                            aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </a>

                            <a class="navbar-toggler onClickmobilenavbarclose" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                            aria-label="Toggle navigation">
                                <span class="bi-arrow-up bi-arrow-up-padding"></span>
                            </a>

                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav mb-2 mb-lg-0">
                                    <li class="nav-item d-flex align-items-center">
                                        <a class="nav-link nav_list_emp" href="#">
                                            About Us
                                        </a>
                                    </li>
                                    <li class="nav-item d-flex align-items-center">
                                        <a class="nav-link" href="#">
                                            Docs
                                        </a>
                                    </li>
                                    <li class="nav-item d-flex align-items-center">
                                        <a class="nav-link" href="#">
                                            Help
                                        </a>
                                    </li>
                                    <li class="nav-item d-flex align-items-center">
                                        <a class="nav-link" href="#">
                                            Contact Us
                                        </a>
                                    </li>
                                    <li class="nav-item nav-item-divider">
                                    <li class="nav-item d-flex align-items-center">
                                        <a class="nav-link" href="#">
                                            En
                                        </a>
                                    </li>
                                </ul>

                                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                                    <li class="nav-item d-flex align-items-center">
                                        <a class="nav-link" href="/signup_index">
                                            Register
                                        </a>
                                    </li>
                                    <li class="nav-item d-flex align-items-center">
                                        <a class="nav-link" href="/login">
                                            Login
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>

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
                                        <p>About Us</p>
                                        <p>News</p>
                                        <p>Events</p>
                                        <p>Careers</p>
                                        <p>Contact Us</p>
                                    </div>
                                    <div className="col-lg-6">
                                        <h4>Platform</h4>
                                        <p>Social Network</p>
                                        <p>Platform Overview</p>
                                        <p>Security</p>
                                        <p>Block Chain</p>
                                        <p>NFT</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="d-flex">
                                    <div className="col-lg-6">
                                        <h4>Documentation</h4>
                                        <p>Deployment</p>
                                        <p>Admin</p>
                                        <p>API Reference</p>
                                        <p>All Docs</p>
                                    </div>
                                    <div className="col-lg-6">
                                        <h4>Support</h4>
                                        <p>Forums</p>
                                        <p>Help Center</p>
                                        <p>Terms</p>
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

