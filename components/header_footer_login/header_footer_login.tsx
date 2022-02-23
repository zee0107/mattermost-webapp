// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {FormattedMessage} from 'react-intl';
import Menu from 'components/menu_login/Navbar';

import {ClientConfig} from 'mattermost-redux/types/config';
import logoLight from 'images/logoLight.png';
import fillCircle from 'images/fill.svg';
import logoDark from 'images/logoWhite.png';
import ModalController from 'components/modal_controller';
import GlobalHeader from 'components/global_header/global_header';

import Google from 'images/icons/google.svg';
import Twitter from 'images/icons/twitter.svg';
import LinkedIn from 'images/icons/linkedin.svg';
import Instagram from 'images/icons/instagram.svg';
import Heart from 'images/icons/heart-fill.svg';

type Props = {
    config: Partial<ClientConfig> | undefined;
}

export default class LoggedInHFT extends React.PureComponent<Props> {
    static propTypes = {

        /*
         * Content of the pagez
         */
        children: PropTypes.object,

        /*
         * Mattermost configuration
         */
        config: PropTypes.object,
    };

    state = {
        isDark: 'light',
        logo_img: logoLight,
    }

    darkModeToggle = () => {
        const newThemeValue = this.state.isDark === 'light' ? 'dark' : 'light';
        window.localStorage.setItem('theme', newThemeValue);
        this.setState({isDark: newThemeValue});

        if(this.state.isDark === 'dark'){
            this.setState({logo_img: logoLight});
        }
        else{
            this.setState({logo_img: logoDark});
        }
    }

    componentDidMount() {
        document.body.classList.add('sticky');
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
        if(this.state.isDark === 'dark'){
            this.setState({logo_img: logoDark});
        }

        if(this.state.isDark === 'light'){
            this.setState({logo_img: logoLight});
        }

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
            <div className='inner-wrap' data-theme={this.state.isDark}>
                <ModalController/>
                <Menu/>
                <div className='row content'>
                    {React.cloneElement(this.props.children, {mode: this.state.isDark})}
                </div>

                <div className='row footer border-top'>
                    <div id='footer_section' className='footer-pane col-xs-12'>
                        <br />
                        <div className="col-lg-12 text-center">
                            <div className="parent">
                                <img src={fillCircle} className="image1"></img>
                                <img src={Heart} className="image3"></img>
                            </div>
                            <h5>Copyright {'\u00A9'} Crypter.io </h5>
                            <button className='btn buttonBgGreen buttonTogglePostion' onClick={this.darkModeToggle}>Switch Theme</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

