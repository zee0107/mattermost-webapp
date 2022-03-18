// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import classNames from 'classnames';
import CurrencyIcons from 'components/currency_icons';
import TrendingListComp from 'components/trending_crypto';

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

import SidebarRightMenu from 'components/sidebar_right_menu';
import { AllListing, GainerListing, NewListing, TrendListing } from 'mattermost-redux/types/crypto';

type Props = {
    status?: string;
    userId: string;
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
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
};

export default class LaunchPad extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '', allCrypto: [],trendCrypto: [],newCrypto: [],gainerCrypto: []}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    render= (): JSX.Element => {
        return (
            <div className='margin-top-20'>
                <div className='col-md-12 removePadding'>
                    <button type='button' className='btn btn-primary create-lock-btn'>Connect</button>
                    <button type='button' className='btn buttonBgWhite create-lock-btn'>BSC Mainnet</button>
                    <button type='button' className='btn buttonBgWhite create-lock-btn'>Create</button>
                </div>
                <div id='create-lock' className='col-md-12 create-token-box'>
                    <div className='col-md-12'>
                        <h4 className='text-primary'>Create Your Lock</h4>
                    </div>
                    <div className='col-md-12 removePadding border-bot-div'>
                    <div className='col-md-12'>
                        <div className='create-lock-input'>
                            <h5 className='text-secondary'>PinkSale is Audited by Certik</h5>
                            <input type='text' className='form-control custom-token-input' placeholder='Ex. https://leaderboard.certik.io/group/links'></input>
                        </div>
                        <div className='create-lock-input'>
                            <h5 className='text-secondary'>Token or LP Token Address</h5>
                            <input type='text' className='form-control custom-token-input' placeholder='Token or LP Token Address'></input>
                        </div>
                        <div className='create-lock-input'>
                            <h5 className='text-secondary'>* Amount</h5>
                            <input type='text' className='form-control custom-token-input' placeholder='Ex. PinkMoon'></input>
                        </div>
                        <div className='create-lock-input'>
                            <h5 className='text-secondary'>Lock Until</h5>
                            <input type='date' className='form-control custom-token-input' placeholder='Select Time'></input>
                        </div>
                        <div className='info-lock-box'>
                            <p className='text-primary small-font'>we ensure that featured projects are all completely legitimate, as their ads must undergo a vetting process.</p>
                        </div>
                        <div className='text-center create-lock-input'>
                            <label className='text-seconary'>You will pay <label className='text-percent'>0.00</label> BTC</label>
                            <br></br>
                            <button type='button' className='btn buttonBgWhite'>LOCK</button>
                        </div>
                    </div>
                </div>

                <div className='col-lg-12 text-center margin-top-30-responsive'>
                    <label className='text-secondary small'>Nobody likes scams and Rug Pulls. Here at Crypter, we ensure that featured projects are all completely legitimate, as their ads must undergo a vetting process; this way, we can eliminate promotions of scam projects, so nobody has to suffer the consequences.</label>
                </div>
            </div>
        );
    }
}
