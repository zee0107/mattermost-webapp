// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import RightDetails from 'components/right_details';
import CurrencyIcon from 'components/currency_icons';

import homeImage from 'images/homeFeed.png';

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

export default class LaunchpadToken extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '', allCrypto: [],trendCrypto: [],newCrypto: [],gainerCrypto: []}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light',img_path: homeImage,logo_url: [], data: []};
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
                                <div className='col-sm-10'>
                                    <div className='margin-top-20'>
                                        <div className='col-md-12 removePadding'>
                                            <button type='button' className='btn buttonBgGreen create-lock-btn'>Connect</button>
                                            <button type='button' className='btn buttonBgWhite create-lock-btn'>BSC Mainnet</button>
                                            <button type='button' className='btn buttonBgWhite create-lock-btn'>Create</button>
                                        </div>
                                        <br></br>
                                        <br></br>
                                        <div id='create-lock' className='col-md-12 create-token-box'>
                                            <div className='col-md-12'>
                                                <div className='d-flex'>
                                                    <div className='width-50'>
                                                        <h4 className='text-primary'>Token</h4>
                                                    </div>
                                                    <div className='width-50 text-end'>
                                                        <a href='#' className='text-secondary'><label className='text-secondary'>All</label></a>
                                                        <a href='#' className='text-secondary'><label className='text-secondary'>My Lock</label></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-12 removePadding border-bot-div'></div>
                                            <br></br>
                                            <div className='col-md-12'>
                                                <input type='text' className='form-control custom-token-input' placeholder='Search by Token'></input>
                                            </div>
                                            <br></br>
                                            <div className='col-md-12 removePadding border-bot-div'></div>
                                            <div className='col-md-12'>
                                            <div className='d-flex'>
                                                    <div className='col-md-5'>
                                                        <label className='text-primary'>Token</label>
                                                    </div>
                                                    <div className='col-md-5'>
                                                        <label className='text-primary'>Amount</label>
                                                    </div>
                                                    <div className='col-md-2'>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-md-5'>
                                                        <div className='d-flex'>
                                                            <div className='col-md-2 removePaddingRight'>
                                                                <CurrencyIcon code='BTC'/>
                                                            </div>
                                                            <div className='col-md-9 removePaddingLeft'>
                                                                <label className='text-primary'>Lorem ipsum</label>
                                                                <p className='text-secondary'>LEP</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-5'>
                                                        <label className='text-primary'>900.5320 LEP</label>
                                                    </div>
                                                    <div className='col-md-2'>
                                                        <a href='#' className='text-percent'>View</a>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-md-5'>
                                                        <div className='d-flex'>
                                                            <div className='col-md-2 removePaddingRight'>
                                                                <CurrencyIcon code='BTC'/>
                                                            </div>
                                                            <div className='col-md-9 removePaddingLeft'>
                                                                <label className='text-primary'>Lorem ipsum</label>
                                                                <p className='text-secondary'>LEP</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-5'>
                                                        <label className='text-primary'>900.5320 LEP</label>
                                                    </div>
                                                    <div className='col-md-2'>
                                                        <a href='#' className='text-percent'>View</a>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-md-5'>
                                                        <div className='d-flex'>
                                                            <div className='col-md-2 removePaddingRight'>
                                                                <CurrencyIcon code='BTC'/>
                                                            </div>
                                                            <div className='col-md-9 removePaddingLeft'>
                                                                <label className='text-primary'>Lorem ipsum</label>
                                                                <p className='text-secondary'>LEP</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-5'>
                                                        <label className='text-primary'>900.5320 LEP</label>
                                                    </div>
                                                    <div className='col-md-2'>
                                                        <a href='#' className='text-percent'>View</a>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-md-5'>
                                                        <div className='d-flex'>
                                                            <div className='col-md-2 removePaddingRight'>
                                                                <CurrencyIcon code='BTC'/>
                                                            </div>
                                                            <div className='col-md-9 removePaddingLeft'>
                                                                <label className='text-primary'>Lorem ipsum</label>
                                                                <p className='text-secondary'>LEP</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-5'>
                                                        <label className='text-primary'>900.5320 LEP</label>
                                                    </div>
                                                    <div className='col-md-2'>
                                                        <a href='#' className='text-percent'>View</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-lg-12 text-center margin-top-30-responsive'>
                                            <label className='text-secondary small'>Nobody likes scams and Rug Pulls. Here at Crypter, we ensure that featured projects are all completely legitimate, as their ads must undergo a vetting process; this way, we can eliminate promotions of scam projects, so nobody has to suffer the consequences.</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm-2' id="side_menu_right">
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
