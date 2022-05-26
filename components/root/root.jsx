// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import deepEqual from 'fast-deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import throttle from 'lodash/throttle';

import classNames from 'classnames';

import {rudderAnalytics, RudderTelemetryHandler} from 'mattermost-redux/client/rudder';
import {Client4} from 'mattermost-redux/client';
import {setUrl} from 'mattermost-redux/actions/general';
import {setSystemEmojis} from 'mattermost-redux/actions/emojis';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {loadRecentlyUsedCustomEmojis} from 'actions/emoji_actions';
import * as GlobalActions from 'actions/global_actions';
import {trackLoadTime} from 'actions/telemetry_actions.jsx';

import {makeAsyncComponent} from 'components/async_load';
import CompassThemeProvider from 'components/compass_theme_provider/compass_theme_provider';
import GlobalHeader from 'components/global_header/global_header';
import GlobalHeaderStyle from 'components/global_header_style/global_header_style';
import NewHeader from 'components/new_header/new_header';
import ModalController from 'components/modal_controller';
import {HFTRoute,LoggedInHFTRoute} from 'components/header_footer_template_route';
import {HFTRouteLog,LoginHFTRoute} from 'components/header_footer_login_route';
import {HFTRouteLogNS,LoginHFTRouteNS} from 'components/header_footer_login_route_ns';
import {HFTRouteLogF,LoginHFTRouteF} from 'components/header_footer_login_route_fluid';
import {HFTRouteLogFNS,LoginHFTRouteFNS} from 'components/header_footer_login_route_fluid_ns';
import IntlProvider from 'components/intl_provider';
import NeedsTeam from 'components/needs_team';

import {initializePlugins} from 'plugins';
import 'plugins/export.js';
import Pluggable from 'plugins/pluggable';
import BrowserStore from 'stores/browser_store';
import Constants, {StoragePrefixes, WindowSizes} from 'utils/constants';
import {EmojiIndicesByAlias} from 'utils/emoji.jsx';
import * as UserAgent from 'utils/user_agent';
import * as Utils from 'utils/utils.jsx';
import webSocketClient from 'client/web_websocket_client.jsx';

const LazyErrorPage = React.lazy(() => import('components/error_page'));
const LazyLoginController = React.lazy(() => import('components/login/login_controller'));
const LazyAdminConsole = React.lazy(() => import('components/admin_console'));
const LazyLoggedIn = React.lazy(() => import('components/logged_in'));
const LazyPasswordResetSendLink = React.lazy(() => import('components/password_reset_send_link'));
const LazyPasswordResetForm = React.lazy(() => import('components/password_reset_form'));
const LazySignupController = React.lazy(() => import('components/signup/signup_controller'));
const LazySignupEmail = React.lazy(() => import('components/signup/signup_email'));
const LazySignupBusiness = React.lazy(() => import('components/signup/signup_business'));
const LazySignupIndex = React.lazy(() => import('components/signup/signup_index'));
const LazySignupProfile = React.lazy(() => import('components/signup/signup_profile'));
const LazyProfilePage = React.lazy(() => import('components/profile_page'));
const LazyNewsFeed = React.lazy(() => import('components/newsfeed'));
const LazyGroup = React.lazy(() => import('components/groups'));
const LazyAlbum = React.lazy(() => import('components/albums'));
const LazyAlbumView = React.lazy(() => import('components/album_view'));
const LazyCreateStory = React.lazy(() => import('components/create_story'));
const LazyCreateAlbum = React.lazy(() => import('components/create_album'));
const LazyCreatePage = React.lazy(() => import('components/create_page'));
const LazyViewStory = React.lazy(() => import('components/view_story'));
const LazyDocuments = React.lazy(() => import('components/documents'));
const LazyDocumentsBuyPresale = React.lazy(() => import('components/documents-buy-presale'));
const LazyDocumentsClaimTokens = React.lazy(() => import('components/documents-claim-tokens'));
const LazyDocumentsPresaleVesting = React.lazy(() => import('components/documents-presale-vesting'));
const LazyDocumentsTeamVesting = React.lazy(() => import('components/documents-team-vesting'));
const LazyDocumentsStablecoin = React.lazy(() => import('components/documents-presale-stablecoin'));
const LazyDocumentsWhitelist = React.lazy(() => import('components/documents-whitelist'));
const LazyDocumentsFinalizeLaunchpad = React.lazy(() => import('components/documents-finalize-launchpad'));
const LazyDocumentsCreateLaunchpad = React.lazy(() => import('components/documents-create-launchpad'));
const LazyDocumentsUpdateLaunchpad = React.lazy(() => import('components/documents-update-launchpad'));
const LazyDocumentsBabyToken = React.lazy(() => import('components/documents-baby-token'));
const LazyDocumentsBuybackToken = React.lazy(() => import('components/documents-buyback-token'));
const LazyDocumentsLiquidity = React.lazy(() => import('components/documents-liquidity-token'));
const LazyDocumentsStandardToken = React.lazy(() => import('components/documents-standard-token'));
const LazyDocumentsPresale = React.lazy(() => import('components/documents-presale'));
const LazyDocumentsBrand = React.lazy(() => import('components/documents-brand'));
const LazyDocumentsYT = React.lazy(() => import('components/documents-youtube'));
const LazyDocumentsDevelopers = React.lazy(() => import('components/documents-developers'));
const LazyDocumentsCrypterSale = React.lazy(() => import('components/documents-cryptersale'));
const LazyDocumentsSociallinks = React.lazy(() => import('components/documents-social-links'));
const LazyDocumentsContactus = React.lazy(() => import('components/documents-contact-us'));
const LazyDocumentsServiceFees = React.lazy(() => import('components/documents-service-fees'));
const LazyDocumentsRoadmap = React.lazy(() => import('components/documents-roadmap'));
const LazyDocumentsKyc = React.lazy(() => import('components/documents-kyc'));
const LazyDocumentsTokenMetrics = React.lazy(() => import('components/documents-token-metrics'));
const LazyDocumentsTokenUtility = React.lazy(() => import('components/documents-token-utility'));
const LazyDocumentsAntiRug = React.lazy(() => import('components/documents-anti-rug'));
const LazyDocumentsPartnership = React.lazy(() => import('components/documents-partnership'));
const LazyLaunchPad = React.lazy(() => import('components/launch_pad'));
const LazyLaunchpadViewPool = React.lazy(() => import('components/launchpad_view_pool'));
const LazyLaunchPadToken = React.lazy(() => import('components/launchpad_token'));
const LazyLaunchPadLiquidity = React.lazy(() => import('components/launchpad_liquidity'));
const LazyLaunchPadLive = React.lazy(() => import('components/launchpad_live'));
const LazyLaunchPadUpcoming = React.lazy(() => import('components/launchpad_upcoming'));
const LazyLaunchPadCreateToken = React.lazy(() => import('components/launchpad_createtoken'));
const LazyTermsOfService = React.lazy(() => import('components/terms_of_service'));
const LazyShouldVerifyEmail = React.lazy(() => import('components/should_verify_email'));
const LazyDoVerifyEmail = React.lazy(() => import('components/do_verify_email'));
const LazyClaimController = React.lazy(() => import('components/claim'));
const LazyHelpController = React.lazy(() => import('components/help/help_controller'));
const LazyLinkingLandingPage = React.lazy(() => import('components/linking_landing_page'));
const LazySelectTeam = React.lazy(() => import('components/select_team'));
const LazyAuthorize = React.lazy(() => import('components/authorize'));
const LazyCreateTeam = React.lazy(() => import('components/create_team'));
const LazyMfa = React.lazy(() => import('components/mfa/mfa_controller'));
const LazyLandingPage = React.lazy(() => import('components/landing_page'));

import store from 'stores/redux_store.jsx';
import {getSiteURL} from 'utils/url';
import {enableDevModeFeatures, isDevMode} from 'utils/utils';

import A11yController from 'utils/a11y_controller';

import TeamSidebar from 'components/team_sidebar';

import {applyLuxonDefaults} from './effects';

import RootRedirect from './root_redirect';
import landing_page from 'components/landing_page';
import albums from 'components/albums';

const CreateTeam = makeAsyncComponent('CreateTeam', LazyCreateTeam);
const ErrorPage = makeAsyncComponent('ErrorPage', LazyErrorPage);
const TermsOfService = makeAsyncComponent('TermsOfService', LazyTermsOfService);
const LoginController = makeAsyncComponent('LoginController', LazyLoginController);
const AdminConsole = makeAsyncComponent('AdminConsole', LazyAdminConsole);
const LoggedIn = makeAsyncComponent('LoggedIn', LazyLoggedIn);
const PasswordResetSendLink = makeAsyncComponent('PasswordResedSendLink', LazyPasswordResetSendLink);
const PasswordResetForm = makeAsyncComponent('PasswordResetForm', LazyPasswordResetForm);
const SignupController = makeAsyncComponent('SignupController', LazySignupController);
const SignupEmail = makeAsyncComponent('SignupEmail', LazySignupEmail);
const SignupBusiness = makeAsyncComponent('SignupBusiness', LazySignupBusiness);
const SignupIndex = makeAsyncComponent('SignupIndex', LazySignupIndex);
const SignupProfile = makeAsyncComponent('SignupProfile', LazySignupProfile);
const ProfilePage = makeAsyncComponent('ProfilePage', LazyProfilePage);
const NewsFeed = makeAsyncComponent('Newsfeed', LazyNewsFeed);
const Groups = makeAsyncComponent('Group', LazyGroup);
const Albums = makeAsyncComponent('Albums', LazyAlbum);
const AlbumView = makeAsyncComponent('AlbumView', LazyAlbumView);
const CreateStory = makeAsyncComponent('CreateStory', LazyCreateStory);
const CreateAlbum = makeAsyncComponent('CreateAlbum', LazyCreateAlbum);
const CreatePage = makeAsyncComponent('CreatePage', LazyCreatePage);
const ViewStory = makeAsyncComponent('ViewStory', LazyViewStory);
const Documents = makeAsyncComponent('Documents', LazyDocuments);
const DocumentsBuyPresale = makeAsyncComponent('DocumentsBuyPresale', LazyDocumentsBuyPresale);
const DocumentsClaimTokens = makeAsyncComponent('DocumentsClaimTokens', LazyDocumentsClaimTokens);
const DocumentsPresaleVesting = makeAsyncComponent('DocumentsPresaleVesting', LazyDocumentsPresaleVesting);
const DocumentsTeamVesting = makeAsyncComponent('DocumentsTeamVesting', LazyDocumentsTeamVesting);
const DocumentsStablecoin = makeAsyncComponent('DocumentsStablecoin', LazyDocumentsStablecoin);
const DocumentsWhitelist = makeAsyncComponent('DocumentsWhitelist', LazyDocumentsWhitelist);
const DocumentsFinalizeLaunchpad = makeAsyncComponent('DocumentsFinalizeLaunchpad', LazyDocumentsFinalizeLaunchpad);
const DocumentsUpdateLaunchpad = makeAsyncComponent('DocumentsUpdateLaunchpad', LazyDocumentsUpdateLaunchpad);
const DocumentsCreateLaunchpad = makeAsyncComponent('DocumentsCreateLaunchpad', LazyDocumentsCreateLaunchpad);
const DocumentsBabyToken = makeAsyncComponent('DocumentsBabyToken', LazyDocumentsBabyToken);
const DocumentsBuybackToken = makeAsyncComponent('DocumentsBuybackToken', LazyDocumentsBuybackToken);
const DocumentsLiquidity = makeAsyncComponent('DocumentsLiquidity', LazyDocumentsLiquidity);
const DocumentsStandardToken = makeAsyncComponent('DocumentsStandardToken', LazyDocumentsStandardToken);
const DocumentsPresale = makeAsyncComponent('DocumentsPresale', LazyDocumentsPresale);
const DocumentsBrand = makeAsyncComponent('DocumentsBrand', LazyDocumentsBrand);
const DocumentsYT = makeAsyncComponent('DocumentsYT', LazyDocumentsYT);
const DocumentsDevelopers = makeAsyncComponent('DocumentsDevelopers', LazyDocumentsDevelopers);
const DocumentsCrypterSale = makeAsyncComponent('DocumentsCrypterSale', LazyDocumentsCrypterSale);
const DocumentsSociallinks = makeAsyncComponent('DocumentsSociallinks', LazyDocumentsSociallinks);
const DocumentsContactus = makeAsyncComponent('DocumentsContactus', LazyDocumentsContactus);
const DocumentsServiceFees = makeAsyncComponent('DocumentsServiceFees', LazyDocumentsServiceFees);
const DocumentsRoadmap = makeAsyncComponent('DocumentsRoadmap', LazyDocumentsRoadmap);
const DocumentsKyc = makeAsyncComponent('DocumentsKyc', LazyDocumentsKyc);
const DocumentsTokenMetrics = makeAsyncComponent('DocumentsTokenMetrics', LazyDocumentsTokenMetrics);
const DocumentsTokenUtility = makeAsyncComponent('DocumentsTokenUtility', LazyDocumentsTokenUtility);
const DocumentsAntiRug = makeAsyncComponent('DocumentsAntiRug', LazyDocumentsAntiRug);
const DocumentsPartnership = makeAsyncComponent('DocumentsPartnership', LazyDocumentsPartnership);
const LaunchPad = makeAsyncComponent('LaunchPad', LazyLaunchPad);
const LaunchpadViewPool = makeAsyncComponent('LaunchpadViewPool', LazyLaunchpadViewPool);
const LaunchPadToken = makeAsyncComponent('LaunchPadToken', LazyLaunchPadToken);
const LaunchPadLiquidity = makeAsyncComponent('LaunchPadLiquidity', LazyLaunchPadLiquidity);
const LaunchPadLive = makeAsyncComponent('LaunchPadLive', LazyLaunchPadLive);
const LaunchPadUpcoming = makeAsyncComponent('LaunchPadUpcoming', LazyLaunchPadUpcoming);
const LaunchPadCreateToken = makeAsyncComponent('LaunchPadCreateToken', LazyLaunchPadCreateToken);
const ShouldVerifyEmail = makeAsyncComponent('ShouldVerifyEmail', LazyShouldVerifyEmail);
const DoVerifyEmail = makeAsyncComponent('DoVerifyEmail', LazyDoVerifyEmail);
const ClaimController = makeAsyncComponent('ClaimController', LazyClaimController);
const HelpController = makeAsyncComponent('HelpController', LazyHelpController);
const LinkingLandingPage = makeAsyncComponent('LinkingLandingPage', LazyLinkingLandingPage);
const SelectTeam = makeAsyncComponent('SelectTeam', LazySelectTeam);
const Authorize = makeAsyncComponent('Authorize', LazyAuthorize);
const Mfa = makeAsyncComponent('Mfa', LazyMfa);
const LandingPage = makeAsyncComponent('LandingPage', LazyLandingPage);

const LoggedInRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={(props) => (
            <LoggedIn {...props}>
                <Component {...props}/>
            </LoggedIn>
        )}
    />
);

export default class Root extends React.PureComponent {
    static propTypes = {
        theme: PropTypes.object,
        telemetryEnabled: PropTypes.bool,
        telemetryId: PropTypes.string,
        noAccounts: PropTypes.bool,
        showTermsOfService: PropTypes.bool,
        permalinkRedirectTeamName: PropTypes.string,
        actions: PropTypes.shape({
            loadMeAndConfig: PropTypes.func.isRequired,
            emitBrowserWindowResized: PropTypes.func.isRequired,
        }).isRequired,
        plugins: PropTypes.array,
        products: PropTypes.array,
    }

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

    componentDidUpdate(prevProps) {
        if (!deepEqual(prevProps.theme, this.props.theme)) {
            Utils.applyTheme(this.props.theme);
        }
        if (this.props.location.pathname === '/') {
            if (this.props.noAccounts) {
                prevProps.history.push('/signup_user_complete');
            } else if (this.props.showTermsOfService) {
                prevProps.history.push('/terms_of_service');
            }
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.props.actions.loadMeAndConfig().then((response) => {
            if (this.props.location.pathname === '/' && response[2] && response[2].data) {
                GlobalActions.redirectUserToDefaultTeam();
            }
            this.onConfigLoaded();
        });
        trackLoadTime();

        if (this.desktopMediaQuery.addEventListener) {
            this.desktopMediaQuery.addEventListener('change', this.handleMediaQueryChangeEvent);
            this.smallDesktopMediaQuery.addEventListener('change', this.handleMediaQueryChangeEvent);
            this.tabletMediaQuery.addEventListener('change', this.handleMediaQueryChangeEvent);
            this.mobileMediaQuery.addEventListener('change', this.handleMediaQueryChangeEvent);
        } else if (this.desktopMediaQuery.addListener) {
            this.desktopMediaQuery.addListener(this.handleMediaQueryChangeEvent);
            this.smallDesktopMediaQuery.addListener(this.handleMediaQueryChangeEvent);
            this.tabletMediaQuery.addListener(this.handleMediaQueryChangeEvent);
            this.mobileMediaQuery.addListener(this.handleMediaQueryChangeEvent);
        } else {
            window.addEventListener('resize', this.handleWindowResizeEvent);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener('storage', this.handleLogoutLoginSignal);

        if (this.desktopMediaQuery.removeEventListener) {
            this.desktopMediaQuery.removeEventListener('change', this.handleMediaQueryChangeEvent);
            this.smallDesktopMediaQuery.removeEventListener('change', this.handleMediaQueryChangeEvent);
            this.tabletMediaQuery.removeEventListener('change', this.handleMediaQueryChangeEvent);
            this.mobileMediaQuery.removeEventListener('change', this.handleMediaQueryChangeEvent);
        } else if (this.desktopMediaQuery.removeListener) {
            this.desktopMediaQuery.removeListener(this.handleMediaQueryChangeEvent);
            this.smallDesktopMediaQuery.removeListener(this.handleMediaQueryChangeEvent);
            this.tabletMediaQuery.removeListener(this.handleMediaQueryChangeEvent);
            this.mobileMediaQuery.removeListener(this.handleMediaQueryChangeEvent);
        } else {
            window.removeEventListener('resize', this.handleWindowResizeEvent);
        }
    }

    handleLogoutLoginSignal = (e) => {
        // when one tab on a browser logs out, it sets __logout__ in localStorage to trigger other tabs to log out
        const isNewLocalStorageEvent = (event) => event.storageArea === localStorage && event.newValue;

        if (e.key === StoragePrefixes.LOGOUT && isNewLocalStorageEvent(e)) {
            console.log('detected logout from a different tab'); //eslint-disable-line no-console
            GlobalActions.emitUserLoggedOutEvent('/', false, false);
        }
        if (e.key === StoragePrefixes.LOGIN && isNewLocalStorageEvent(e)) {
            const isLoggedIn = getCurrentUser(store.getState());

            // make sure this is not the same tab which sent login signal
            // because another tabs will also send login signal after reloading
            if (isLoggedIn) {
                return;
            }

            // detected login from a different tab
            function onVisibilityChange() {
                location.reload();
            }
            document.addEventListener('visibilitychange', onVisibilityChange, false);
        }
    }

    handleWindowResizeEvent = throttle(() => {
        this.props.actions.emitBrowserWindowResized();
    }, 100);

    handleMediaQueryChangeEvent = (e) => {
        if (e.matches) {
            this.updateWindowSize();
        }
    }

    updateWindowSize = () => {
        switch (true) {
        case this.desktopMediaQuery.matches:
            this.props.actions.emitBrowserWindowResized(WindowSizes.DESKTOP_VIEW);
            break;
        case this.smallDesktopMediaQuery.matches:
            this.props.actions.emitBrowserWindowResized(WindowSizes.SMALL_DESKTOP_VIEW);
            break;
        case this.tabletMediaQuery.matches:
            this.props.actions.emitBrowserWindowResized(WindowSizes.TABLET_VIEW);
            break;
        case this.mobileMediaQuery.matches:
            this.props.actions.emitBrowserWindowResized(WindowSizes.MOBILE_VIEW);
            break;
        }
    }

    render() {
        if (!this.state.configLoaded) {
            return <div/>;
        }

        return (
            <IntlProvider>
                <Switch>
                    <Route
                        path={'/error'}
                        component={ErrorPage}
                    />
                    <Route
                        path={'/login'}
                        component={LoginController}
                    />
                    <Route
                        path={'/reset_password'}
                        component={PasswordResetSendLink}
                    />
                    <Route
                        path={'/reset_password_complete'}
                        component={PasswordResetForm}
                    />
                    <Route
                        path={'/signup_user_complete'}
                        component={SignupController}
                    />
                    <Route
                        path={'/signup_business'}
                        component={SignupBusiness}
                    />
                    <Route
                        path={'/signup_index'}
                        component={SignupIndex}
                    />
                    <Route
                        path={'/completeprofile'}
                        component={SignupProfile}
                    />
                    <HFTRoute
                        path={'/home'}
                        component={LandingPage}
                    />
                    
                    <Route
                        path={'/signup_email'}
                        component={SignupEmail}
                    />
                    <Route
                        path={'/should_verify_email'}
                        component={ShouldVerifyEmail}
                    />
                    <Route
                        path={'/do_verify_email'}
                        component={DoVerifyEmail}
                    />
                    <Route
                        path={'/claim'}
                        component={ClaimController}
                    />
                    <Route
                        path={'/help'}
                        component={HelpController}
                    />
                    <LoggedInRoute
                        path={'/terms_of_service'}
                        component={TermsOfService}
                    />
                    <Route
                        path={'/landing'}
                        component={LinkingLandingPage}
                    />
                    <LoggedInRoute
                        path={'/admin_console'}
                        component={AdminConsole}
                    />
                    <LoggedInRoute
                        path={'/select_team'}
                        component={SelectTeam}
                    />
                    <LoggedInRoute
                        path={'/oauth/authorize'}
                        component={Authorize}
                    />
                    <LoggedInRoute
                        path={'/create_team'}
                        component={CreateTeam}
                    />
                    <LoggedInRoute
                        path={'/mfa'}
                        component={Mfa}
                    />
                    <LoginHFTRouteFNS
                        path={'/stories/create'}
                        component={CreateStory}
                    />
                    <LoginHFTRouteFNS
                        path={'/albums/create'}
                        component={CreateAlbum}
                    />
                    <LoginHFTRouteFNS
                        path={'/pages/create'}
                        component={CreatePage}
                    />
                    <LoginHFTRouteFNS
                        path={'/stories/view'}
                        component={ViewStory}
                    />
                    <Redirect
                        from={'/_redirect/integrations/:subpath*'}
                        to={`/${this.props.permalinkRedirectTeamName}/integrations/:subpath*`}
                    />
                    <Redirect
                        from={'/_redirect/pl/:postid'}
                        to={`/${this.props.permalinkRedirectTeamName}/pl/:postid`}
                    />
                    
                    <CompassThemeProvider theme={this.props.theme}>
                        <ModalController/>
                        <GlobalHeaderStyle/>
                        <div className='mainContentRow d-flex flex-row page-content'>
                            <TeamSidebar/>
                            <Switch>
                                {this.props.products?.map((product) => (
                                    <Route
                                        key={product.id}
                                        path={product.baseURL}
                                        render={(props) => (
                                            <LoggedIn {...props}>
                                                <div className={classNames(['product-wrapper', {wide: !product.showTeamSidebar}])}>
                                                    <Pluggable
                                                        pluggableName={'Product'}
                                                        subComponentName={'mainComponent'}
                                                        pluggableId={product.id}
                                                        webSocketClient={webSocketClient}
                                                    />
                                                </div>
                                            </LoggedIn>
                                        )}
                                    />
                                ))}
                                {this.props.plugins?.map((plugin) => (
                                    <Route
                                        key={plugin.id}
                                        path={'/plug/' + plugin.route}
                                        render={() => (
                                            <Pluggable
                                                pluggableName={'CustomRouteComponent'}
                                                pluggableId={plugin.id}
                                            />
                                        )}
                                    />
                                ))}
                                <LoginHFTRouteNS
                                    path={'/profile'}
                                    component={ProfilePage}
                                />
                                
                                <LoginHFTRouteNS
                                    path={'/documents/intro'}
                                    component={Documents}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/how-to-buy-a-presale'}
                                    component={DocumentsBuyPresale}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/how-to-claim-tokens'}
                                    component={DocumentsClaimTokens}
                                />
                                 <LoginHFTRouteNS
                                    path={'/documents/team-vesting-guide'}
                                    component={DocumentsTeamVesting}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/presale-vesting-guide'}
                                    component={DocumentsPresaleVesting}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/create-a-presale-using-stablecoin'}
                                    component={DocumentsStablecoin}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/add-remove-whitelist'}
                                    component={DocumentsWhitelist}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/create-a-launchpad'}
                                    component={DocumentsCreateLaunchpad}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/update-a-launchpad'}
                                    component={DocumentsUpdateLaunchpad}
                                />
                                 <LoginHFTRouteNS
                                    path={'/documents/finalize-a-launchpad'}
                                    component={DocumentsFinalizeLaunchpad}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/create-a-baby-token'}
                                    component={DocumentsBabyToken}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/create-a-buyback-baby-token'}
                                    component={DocumentsBuybackToken}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/create-a-liquidity-generator-token'}
                                    component={DocumentsLiquidity}
                                />
                                 <LoginHFTRouteNS
                                    path={'/documents/create-a-standard-token'}
                                    component={DocumentsStandardToken}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/presale-support'}
                                    component={DocumentsPresale}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/brand-assets'}
                                    component={DocumentsBrand}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/youtube-tutorial'}
                                    component={DocumentsYT}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/contact-developers'}
                                    component={DocumentsDevelopers}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/crypter-sale-calculator'}
                                    component={DocumentsCrypterSale}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/social-links'}
                                    component={DocumentsSociallinks}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/contact-us'}
                                    component={DocumentsContactus}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/service-fees'}
                                    component={DocumentsServiceFees}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/roadmap'}
                                    component={DocumentsRoadmap}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/kyc'}
                                    component={DocumentsKyc}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/token-metrics'}
                                    component={DocumentsTokenMetrics}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/token-utility'}
                                    component={DocumentsTokenUtility}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/anti-rug-system'}
                                    component={DocumentsAntiRug}
                                />
                                <LoginHFTRouteNS
                                    path={'/documents/partnership'}
                                    component={DocumentsPartnership}
                                />
                                <LoginHFTRouteF
                                    path={'/launchpad'}
                                    component={LaunchPad}
                                />
                                <LoginHFTRouteF
                                    path={'/launchpad-view-pool'}
                                    component={LaunchpadViewPool}
                                />
                                <LoginHFTRouteF
                                    path={'/launchpad-live'}
                                    component={LaunchPadLive}
                                />
                                <LoginHFTRouteF
                                    path={'/launchpad-upcoming'}
                                    component={LaunchPadUpcoming}
                                />
                                <LoginHFTRouteF
                                    path={'/laucnhpad-create-lock'}
                                    component={LaunchPadCreateToken}
                                />
                                <LoginHFTRouteF
                                    path={'/mygroups'}
                                    component={Groups}
                                />
                                <LoginHFTRouteF
                                    path={'/albums/myalbums'}
                                    component={Albums}
                                />
                                <LoginHFTRouteF
                                    path={'/albums/view'}
                                    component={AlbumView}
                                />
                                <LoginHFTRouteF
                                    path={'/launchpadtoken'}
                                    component={LaunchPadToken}
                                />
                                <LoginHFTRouteF
                                    path={'/launchpad-liquidity'}
                                    component={LaunchPadLiquidity}
                                />
                                <LoggedInRoute
                                    path={'/:team'}
                                    component={NeedsTeam}
                                />
                                <RootRedirect/>
                            </Switch>
                        </div>
                        <Pluggable pluggableName='Global'/>
                    </CompassThemeProvider>
                </Switch>
            </IntlProvider>
        );
    }
}
