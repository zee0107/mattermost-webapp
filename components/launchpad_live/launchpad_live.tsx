// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import classNames from 'classnames';
import CurrencyIcons from 'components/currency_icons';
import TrendingListComp from 'components/trending_crypto';
import CreateLock from 'components/create_lock';
import CreateToken from 'components/create_token';
import ProjectLive from 'components/projects_live';
import ProjectUpcoming from 'components/projects_upcoming';
import RightDetails from 'components/right_details';

import homeImage from 'images/homeFeed.png';
import rocketImage from 'images/rocket.svg';
import fillImage from 'images/fill.svg';
import trendImage from 'images/trending-up.svg';
import trenddownImage from 'images/trending-down.svg';
import fireImage from 'images/fire.png';
import clockImage from 'images/clock.svg';
import btcImage from 'images/currency-icons/btc.svg';
import ltcImage from 'images/currency-icons/ltc.svg';
import bnbImage from 'images/currency-icons/bnb.svg';
import ethImage from 'images/currency-icons/eth.svg';
import graphImage from 'images/graph-up.svg';
import graphdownImage from 'images/graph-down.svg';
import triangleupImage from 'images/caret-up.svg';
import triangledownImage from 'images/caret-down.svg';

import {ModalData} from 'types/actions';
import ChannelHeaderMobile from 'components/channel_header_mobile';

import Sidebar from 'components/sidebar';
import SidebarRight from 'components/sidebar_right';
import SidebarRightMenu from 'components/sidebar_right_menu';
import { AllListing, GainerListing, NewListing, TrendListing } from 'mattermost-redux/types/crypto';
import RSDetails from 'components/right_side_details/right_side_details';

type Props = {
    status?: string;
    userId: string;
    profilePicture: string;
    autoResetPref?: string;
    actions: {
        openModal: <P>(modalData: ModalData<P>) => void;
        setStatus: (status: UserStatus) => ActionFunc;
        unsetCustomStatus: () => ActionFunc;
        setStatusDropdown: (open: boolean) => void;
    };
    customStatus?: UserCustomStatus;
    currentUser: UserProfile;
    isCustomStatusEnabled: boolean;
    isCustomStatusExpired: boolean;
    isMilitaryTime: boolean;
    isStatusDropdownOpen: boolean;
    showCustomStatusPulsatingDot: boolean;
    timezone?: string;
    globalHeader?: boolean;
    lhsOpen: boolean;
    rhsOpen: boolean;
    rhsMenuOpen: boolean;
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
    middleView: string;
};

export default class LaunchpadLive extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '', allCrypto: [],trendCrypto: [],newCrypto: [],gainerCrypto: []}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', middleView: 'create-launchpad',img_path: homeImage,logo_url: [], data: []};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    setDocumentTitle = (siteName: string) => {
        if (siteName) {
            document.title = 'Crypter';
        }
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {return null;}
        return (<Avatar size={size} url={this.props.profilePicture} />);
    }

    renderHandler = (view: string) => {
        this.setState({middleView: view});
    }

    sideBoxRender = (code: string) => {
        return (
            <div>
                <RightDetails symbol={code} />
            </div>
        );
    }

    render= (): JSX.Element => {
        const {globalHeader, currentUser} = this.props;
        
        let btcContent;
        let ltcContent;
        let ethContent;
        let bnbContent;

        btcContent = this.sideBoxRender("BTC");
        ltcContent = this.sideBoxRender("LTC");
        ethContent = this.sideBoxRender("ETH");
        bnbContent = this.sideBoxRender("BNB");
        return (
            <div className='div-bg'>
                <div className='col-lg-12 bodyBgElipseLaunchpad bgGrey'>
                    <div>
                        <div className='col-lg-12 removePadding'>
                            <div className='row'>
                                <div className='col-sm-9'>
                                    <ProjectLive/>
                                </div>
                                <div className='col-sm-3' id="side_menu_right">
                                    {btcContent}
                                    {ltcContent}
                                    {ethContent}
                                    {bnbContent}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
