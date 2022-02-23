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
import CompassThemeProvider from 'components/compass_theme_provider/compass_theme_provider';
import GlobalHeader from 'components/global_header_style/global_header_style';
import {enableDevModeFeatures, isDevMode} from 'utils/utils';
import Constants, {StoragePrefixes, WindowSizes} from 'utils/constants';
import BrowserStore from 'stores/browser_store';
import {rudderAnalytics, RudderTelemetryHandler} from 'mattermost-redux/client/rudder';
import {Client4} from 'mattermost-redux/client';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

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
        theme: PropTypes.object,
        telemetryEnabled: PropTypes.bool,
        telemetryId: PropTypes.string,
        noAccounts: PropTypes.bool,
        /*
         * Content of the pagez
         */
        children: PropTypes.object,

        /*
         * Mattermost configuration
         */
        config: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.currentCategoryFocus = 0;
        this.currentSidebarFocus = 0;
        this.mounted = false;

        // Redux
        setUrl(getSiteURL());

        // Disable auth header to enable CSRF check
        Client4.setAuthHeader = false;

        setSystemEmojis(EmojiIndicesByAlias);

        // Force logout of all tabs if one tab is logged out
        window.addEventListener('storage', this.handleLogoutLoginSignal);

        // Prevent drag and drop files from navigating away from the app
        document.addEventListener('drop', (e) => {
            if (e.dataTransfer.items.length > 0 && e.dataTransfer.items[0].kind === 'file') {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        document.addEventListener('dragover', (e) => {
            if (!document.body.classList.contains('focalboard-body')) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        this.state = {
            configLoaded: false,
            isDark: 'light',
            logo_img: logoLight,
        };

        // Keyboard navigation for accessibility
        if (!UserAgent.isInternetExplorer()) {
            this.a11yController = new A11yController();
        }

        // set initial window size state
        this.desktopMediaQuery = window.matchMedia(`(min-width: ${Constants.DESKTOP_SCREEN_WIDTH + 1}px)`);
        this.smallDesktopMediaQuery = window.matchMedia(`(min-width: ${Constants.TABLET_SCREEN_WIDTH + 1}px) and (max-width: ${Constants.DESKTOP_SCREEN_WIDTH}px)`);
        this.tabletMediaQuery = window.matchMedia(`(min-width: ${Constants.MOBILE_SCREEN_WIDTH + 1}px) and (max-width: ${Constants.TABLET_SCREEN_WIDTH}px)`);
        this.mobileMediaQuery = window.matchMedia(`(max-width: ${Constants.MOBILE_SCREEN_WIDTH}px)`);

        this.updateWindowSize();

        store.subscribe(() => applyLuxonDefaults(store.getState()));
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

    onConfigLoaded = () => {
        if (isDevMode()) {
            enableDevModeFeatures();
        }

        const telemetryId = this.props.telemetryId;

        let rudderKey = Constants.TELEMETRY_RUDDER_KEY;
        let rudderUrl = Constants.TELEMETRY_RUDDER_DATAPLANE_URL;

        if (rudderKey.startsWith('placeholder') && rudderUrl.startsWith('placeholder')) {
            rudderKey = process.env.RUDDER_KEY; //eslint-disable-line no-process-env
            rudderUrl = process.env.RUDDER_DATAPLANE_URL; //eslint-disable-line no-process-env
        }

        if (rudderKey != null && rudderKey !== '' && this.props.telemetryEnabled) {
            Client4.setTelemetryHandler(new RudderTelemetryHandler());

            rudderAnalytics.load(rudderKey, rudderUrl);

            rudderAnalytics.identify(telemetryId, {}, {
                context: {
                    ip: '0.0.0.0',
                },
                page: {
                    path: '',
                    referrer: '',
                    search: '',
                    title: '',
                    url: '',
                },
                anonymousId: '00000000000000000000000000',
            });

            rudderAnalytics.page('ApplicationLoaded', {
                path: '',
                referrer: '',
                search: '',
                title: '',
                url: '',
            },
            {
                context: {
                    ip: '0.0.0.0',
                },
                anonymousId: '00000000000000000000000000',
            });
        }

        if (this.props.location.pathname === '/' && this.props.noAccounts) {
            this.props.history.push('/signup_user_complete');
        }

        initializePlugins().then(() => {
            if (this.mounted) {
                // supports enzyme tests, set state if and only if
                // the component is still mounted on screen
                this.setState({configLoaded: true});
            }
        });

        loadRecentlyUsedCustomEmojis()(store.dispatch, store.getState);

        const iosDownloadLink = getConfig(store.getState()).IosAppDownloadLink;
        const androidDownloadLink = getConfig(store.getState()).AndroidAppDownloadLink;

        const toResetPasswordScreen = this.props.location.pathname === '/reset_password_complete';

        // redirect to the mobile landing page if the user hasn't seen it before
        let mobileLanding;
        if (UserAgent.isAndroidWeb()) {
            mobileLanding = androidDownloadLink;
        } else if (UserAgent.isIosWeb()) {
            mobileLanding = iosDownloadLink;
        }

        if (mobileLanding && !BrowserStore.hasSeenLandingPage() && !toResetPasswordScreen && !this.props.location.pathname.includes('/landing')) {
            this.props.history.push('/landing#' + this.props.location.pathname + this.props.location.search);
            BrowserStore.setLandingPageSeen(true);
        }

        Utils.applyTheme(this.props.theme);
    }

    componentWillUnmount() {
        document.body.classList.remove('sticky');
        const rootElement: HTMLElement | null = document.getElementById('root');
        if (rootElement) {
            rootElement.classList.remove('container-fluid');
        }
    }
    
    componentDidUpdate(prevProps) {
        if (!deepEqual(prevProps.theme, this.props.theme)) {
            Utils.applyTheme(this.props.theme);
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
            <CompassThemeProvider theme={this.props.theme}>
                <ModalController/>
                <GlobalHeader/>
                <div className='inner-wrap' data-theme={this.state.isDark}>
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
            </CompassThemeProvider>
        );
    }
}

