// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {ClientConfig} from 'mattermost-redux/types/config';
import logoLight from 'images/logoLight.png';
import fillCircle from 'images/fill.svg';
import logoDark from 'images/logoWhite.png';

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
                <div className='row content'>
                    {this.props.children}
                </div>
                <div className='row footer'>
                    <div id='footer_section' className='footer-pane col-xs-12'>
                        <br />
                        <div className="row">
                            <div className="col-lg-2"></div>
                            <div className="col-lg-2">
                                <img src={logoLight}></img>
                                <p>The first social media platform for crypto to launch the revolutionary Engage-to-Earn reward system. Enjoy $BUSD rewards while holding $CRYPT tokens.</p>
                                <div className="d-flex">
                                    <div className="col-lg-3">
                                        <img src={fillCircle}></img>
                                    </div>
                                    <div className="col-lg-3">
                                        <img src={fillCircle}></img>
                                    </div>
                                    <div className="col-lg-3">
                                        <img src={fillCircle}></img>
                                    </div>
                                    <div className="col-lg-3">
                                        <img src={fillCircle}></img>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
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
                            <div className="col-lg-4">
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
                        </div>
                        <br />
                        <div className="col-lg-12 text-center">
                            <img src={fillCircle}></img>
                            <h5>Copyright {'\u00A9'} Crypter.io </h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

