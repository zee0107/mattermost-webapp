// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import classNames from 'classnames';

import homeImage from 'images/homeFeed.png';
import rocketImage from 'images/rocket.svg';
import fillImage from 'images/fill.svg';
import trendImage from 'images/trending-up.svg';
import fireImage from 'images/fire.png';
import clockImage from 'images/clock.svg';
import digiImage from 'images/currency-icons/digibyte.svg';
import btcImage from 'images/currency-icons/btc.svg';
import ltcImage from 'images/currency-icons/ltc.svg';
import bnbImage from 'images/currency-icons/bnb.svg';
import ethImage from 'images/currency-icons/eth.svg';
import graphImage from 'images/currency-icons/graph-up.png';
import lccImage from 'images/currency-icons/litecoin.svg';


import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';
import ChannelHeaderMobile from 'components/channel_header_mobile';

import Sidebar from 'components/sidebar';
import SidebarRight from 'components/sidebar_right';
import SidebarRightMenu from 'components/sidebar_right_menu';

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
};

export default class LaunchPad extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
        /*status: UserStatuses.OFFLINE,*/
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            openUp: false,
            width: 0,
            isStatusSet: false,
            isDark:'light',
            img_path: homeImage,
            data: [],
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
        const uri = new URL("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest");
        
        let apiKey = "5b439fd8-90e5-467c-b61a-c586252c7e2c";
        const sendData={
            start: "1",
            limit: "5000",
            convert: "USD",
            CMC_PRO_API_KEY:apiKey
        }

        uri.search = new URLSearchParams(sendData).toString();
        const config = {
            method: "GET",
            mode: "cors",
            headers: {
                Accepts: "application/json",
                "Content-Type":"application/json",
                "Access-Control-Allow-Origin":"*"
            }
        }

        fetch(uri,config)
        .then(response => console.log(response.json()))
        .then(value => this.setState({data: value}))
        .catch(function(error) {
            console.log(error);
        });
    }

    setDocumentTitle = (siteName: string) => {
        if (siteName) {
            document.title = siteName;
        }
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
            />
        );
    }

    render= (): JSX.Element => {
        const {globalHeader, currentUser} = this.props;
        /*const list = this.state.data.map((item, i) => {
            return <li key={i}>{item}</li>
          });*/
          console.log(this.state.data);
        return (
            <div className='div-bg'>
                {/*<SidebarRight/>*/}
                <SidebarRightMenu/>
                {/*<Sidebar/>*/}
                <div
                    key='inner-wrap'
                    className={classNames('inner-wrap', 'channel__wrap', {
                        'move--right': this.props.lhsOpen,
                        'move--left': this.props.rhsOpen,
                        'move--left-small': this.props.rhsMenuOpen,
                    })}
                >
                    <div className='row header'>
                        <div id='navbar_wrapper'>
                            <ChannelHeaderMobile classes={'removeMargin'}/>
                        </div>
                    </div>
                    <div className='col-lg-12 bodyBgElipseProfile bgGrey removePadding'>
                        <div className='wrap-launchpad-section'>
                            <div className='col-lg-12 removePadding'>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <div className='col-sm-12'>
                                            <div className='sidemenuBox'>
                                                <ul className='ul-collapse'>
                                                    <li className='sidemenu-padding'><a href='#' className='sidemenu-item1'><svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className='side-menu-align'>
                                                        <path d="M3.03033 12.4859H10.4389V14.3381H3.03033V12.4859ZM3.03033 16.1902H10.4389V18.0423H3.03033V16.1902ZM3.03033 8.78166H10.4389V10.6338H3.03033V8.78166ZM3.03033 5.07739H10.4389V6.92953H3.03033V5.07739ZM17.8474 6.92953V16.1902H14.1431V6.92953H17.8474ZM19.6995 5.07739H12.291V18.0423H19.6995V5.07739Z" fill="#FF8D08"/>
                                                        </svg> New Feed</a>
                                                    </li>
                                                    <li className='sidemenu-padding'><a href='#' className='sidemenu-item2'>
                                                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className='side-menu-align'>
                                                        <path d="M15.5387 3.35472V12.6154H6.27804V3.35472H15.5387ZM15.5387 1.81128H6.27804C5.42914 1.81128 4.73459 2.50583 4.73459 3.35472V12.6154C4.73459 13.4643 5.42914 14.1588 6.27804 14.1588H15.5387C16.3876 14.1588 17.0821 13.4643 17.0821 12.6154V3.35472C17.0821 2.50583 16.3876 1.81128 15.5387 1.81128ZM8.97906 9.27383L10.2833 11.0179L12.1971 8.62559L14.767 11.8437H7.04976L8.97906 9.27383ZM1.64771 4.89817V15.7023C1.64771 16.5512 2.34225 17.2457 3.19115 17.2457H13.9953V15.7023H3.19115V4.89817H1.64771Z" fill="#3F8CFF"/>
                                                        </svg> Albums</a>
                                                    </li>
                                                    <li className='sidemenu-padding'><a href='#' className='sidemenu-item3'>
                                                        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className='side-menu-align'>
                                                        <path d="M3.95634 12.8045C4.97502 12.8045 5.80848 11.971 5.80848 10.9524C5.80848 9.93368 4.97502 9.10022 3.95634 9.10022C2.93767 9.10022 2.10421 9.93368 2.10421 10.9524C2.10421 11.971 2.93767 12.8045 3.95634 12.8045ZM5.0028 13.8232C4.66015 13.7676 4.31751 13.7306 3.95634 13.7306C3.03954 13.7306 2.16903 13.925 1.38188 14.2677C1.04637 14.4111 0.760415 14.6499 0.559546 14.9545C0.358677 15.2591 0.251757 15.616 0.252076 15.9809V17.4348H4.41938V15.9439C4.41938 15.1752 4.63237 14.4529 5.0028 13.8232V13.8232ZM18.7734 12.8045C19.7921 12.8045 20.6255 11.971 20.6255 10.9524C20.6255 9.93368 19.7921 9.10022 18.7734 9.10022C17.7547 9.10022 16.9213 9.93368 16.9213 10.9524C16.9213 11.971 17.7547 12.8045 18.7734 12.8045ZM22.4777 15.9809C22.4777 15.2308 22.0332 14.564 21.3479 14.2677C20.5358 13.9133 19.6594 13.7305 18.7734 13.7306C18.4122 13.7306 18.0696 13.7676 17.727 13.8232C18.0974 14.4529 18.3104 15.1752 18.3104 15.9439V17.4348H22.4777V15.9809ZM15.2914 13.4064C14.2079 12.9249 12.8744 12.573 11.3649 12.573C9.85539 12.573 8.52185 12.9341 7.43835 13.4064C6.95036 13.6264 6.53665 13.9832 6.24736 14.4336C5.95807 14.884 5.80561 15.4086 5.80848 15.9439V17.4348H16.9213V15.9439C16.9213 14.8511 16.2915 13.8509 15.2914 13.4064V13.4064ZM7.72543 15.5827C7.80878 15.3697 7.84582 15.2215 8.56815 14.9437C9.46644 14.5918 10.411 14.4251 11.3649 14.4251C12.3187 14.4251 13.2633 14.5918 14.1616 14.9437C14.8747 15.2215 14.9117 15.3697 15.0043 15.5827H7.72543ZM11.3649 8.17415C11.8742 8.17415 12.2909 8.59088 12.2909 9.10022C12.2909 9.60956 11.8742 10.0263 11.3649 10.0263C10.8555 10.0263 10.4388 9.60956 10.4388 9.10022C10.4388 8.59088 10.8555 8.17415 11.3649 8.17415ZM11.3649 6.32202C9.82761 6.32202 8.58668 7.56295 8.58668 9.10022C8.58668 10.6375 9.82761 11.8784 11.3649 11.8784C12.9021 11.8784 14.1431 10.6375 14.1431 9.10022C14.1431 7.56295 12.9021 6.32202 11.3649 6.32202Z" fill="#2CD889"/>
                                                        </svg> My Groups</a>
                                                    </li>
                                                    <li className='sidemenu-padding'>
                                                        <div className='d-flex'>
                                                            <a href='#' className='sidemenu-item1'>
                                                            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='side-menu-align'>
                                                            <path d="M3.1911 12.1623H13.891C14.0377 12.1622 14.1813 12.1204 14.305 12.0417C14.4287 11.963 14.5274 11.8506 14.5896 11.7178C14.6518 11.585 14.6749 11.4373 14.6561 11.2918C14.6374 11.1464 14.5776 11.0093 14.4837 10.8967L11.68 7.53194L14.4837 4.16724C14.5776 4.05456 14.6374 3.91748 14.6561 3.77205C14.6749 3.62662 14.6518 3.47885 14.5896 3.34605C14.5274 3.21325 14.4287 3.10092 14.305 3.02221C14.1813 2.9435 14.0377 2.90167 13.891 2.90161H3.1911V16.7926" stroke="#FF8A00" strokeWidth="1.67969" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg> My Pages</a>
                                                            <a href="#" className='view-all'>View all</a>
                                                        </div>
                                                        
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='menu-wrapper-collapse sidemenuBox'>
                                                <input type="checkbox" id="list-item-1"></input>
                                                <label htmlFor="list-item-1" className="first collapsible-label-title"><img src={rocketImage} className="sidemenu-title-img"></img>Launchpad</label>
                                                <ul className='ul-collapse'>
                                                    <li className='sidemenu-padding'><a href="#" className='list-sidemenu-a'>Create Launchpad</a></li>
                                                    <li className='sidemenu-padding'>
                                                        <input type="checkbox" id="list-item-2"></input>
                                                        <label htmlFor="list-item-2" className="first collapsible-label">Projects</label>
                                                        <ul className='ul-collapse'>
                                                            <li><a href="#" className='list-sidemenu-b'>Live</a></li>
                                                            <li><a href="#" className='list-sidemenu-b'>Upcoming</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className='sidemenu-padding'>
                                                        <input type="checkbox" id="list-item-3"></input>
                                                        <label htmlFor="list-item-3" className="first collapsible-label">Crypter Lock</label>
                                                        <ul className='ul-collapse'>
                                                            <li><a href="#" className='list-sidemenu-b'>Create Lock</a></li>
                                                            <li><a href="#" className='list-sidemenu-b'>Token</a></li>
                                                            <li><a href="#" className='list-sidemenu-b'>Liquidity</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className='sidemenu-padding'><a href="#" className='list-sidemenu-a'>KYC &amp; Audit</a></li>
                                                    <li className='sidemenu-padding'><a href="#" className='list-sidemenu-a'>Docs</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='sidemenuBox'>
                                                <div className='d-flex'>
                                                    <label className='text-primary label-title'><img src={fireImage} className='fire-img'></img>Trending</label>
                                                    <a href='#' className='view-all-box'>View all</a>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={digiImage}></img>
                                                    </div>
                                                    <div className='col-sm-5'>
                                                        <label className='text-primary'>GXCHAIN</label>
                                                        <p className='text-secondary small-font'>GXS</p>
                                                    </div>
                                                    <div className='col-sm-5 removePadding text-end'>
                                                        <br></br>
                                                        <label className='currency-value-text small-font'>&#36; 0.00065</label>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={digiImage}></img>
                                                    </div>
                                                    <div className='col-sm-5'>
                                                        <label className='text-primary'>DigiByte</label>
                                                        <p className='text-secondary small-font'>DGB</p>
                                                    </div>
                                                    <div className='col-sm-5 removePadding text-end'>
                                                        <br></br>
                                                        <label className='currency-value-text small-font'>&#36; 0.00065</label>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={digiImage}></img>
                                                    </div>
                                                    <div className='col-sm-5'>
                                                        <label className='text-primary'>Icon</label>
                                                        <p className='text-secondary small-font'>ICX</p>
                                                    </div>
                                                    <div className='col-sm-5 removePadding text-end'>
                                                        <br></br>
                                                        <label className='currency-value-text small-font'>&#36; 0.00065</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='sidemenuBox'>
                                                <div className='d-flex'>
                                                    <label className='text-primary label-title'><img src={trendImage} className='fire-img'></img>Biggest Gainers</label>
                                                    <a href='#' className='view-all-box'>View all</a>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={digiImage}></img>
                                                    </div>
                                                    <div className='col-sm-5'>
                                                        <label className='text-primary'>Apollo</label>
                                                        <p className='text-secondary small-font'>APL</p>
                                                    </div>
                                                    <div className='col-sm-5 removePadding text-end'>
                                                        <br></br>
                                                        <label className='currency-value-text small-font'>&#36; 0.00065</label>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={digiImage}></img>
                                                    </div>
                                                    <div className='col-sm-5'>
                                                        <label className='text-primary'>CloakCoin</label>
                                                        <p className='text-secondary small-font'>Cloak</p>
                                                    </div>
                                                    <div className='col-sm-5 removePadding text-end'>
                                                        <br></br>
                                                        <label className='currency-value-text small-font'>&#36; 0.00065</label>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={digiImage}></img>
                                                    </div>
                                                    <div className='col-sm-5'>
                                                        <label className='text-primary'>LiteCoin</label>
                                                        <p className='text-secondary small-font'>LCC</p>
                                                    </div>
                                                    <div className='col-sm-5 removePadding text-end'>
                                                        <br></br>
                                                        <label className='currency-value-text small-font'>&#36; 0.00065</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='sidemenuBox'>
                                                <div className='d-flex'>
                                                    <label className='text-primary label-title'><img src={clockImage} className='fire-img'></img>Recently Added</label>
                                                    <a href='#' className='view-all-box'>View all</a>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={digiImage}></img>
                                                    </div>
                                                    <div className='col-sm-5'>
                                                        <label className='text-primary'>GXCHAIN</label>
                                                        <p className='text-secondary small-font'>GXS</p>
                                                    </div>
                                                    <div className='col-sm-5 removePadding text-end'>
                                                        <br></br>
                                                        <label className='currency-value-text small-font'>&#36; 0.00065</label>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={digiImage}></img>
                                                    </div>
                                                    <div className='col-sm-5'>
                                                        <label className='text-primary'>DigiByte</label>
                                                        <p className='text-secondary small-font'>DGB</p>
                                                    </div>
                                                    <div className='col-sm-5 removePadding text-end'>
                                                        <br></br>
                                                        <label className='currency-value-text small-font'>&#36; 0.00065</label>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={digiImage}></img>
                                                    </div>
                                                    <div className='col-sm-5'>
                                                        <label className='text-primary'>Icon</label>
                                                        <p className='text-secondary small-font'>ICX</p>
                                                    </div>
                                                    <div className='col-sm-5 removePadding text-end'>
                                                        <br></br>
                                                        <label className='currency-value-text small-font'>&#36; 0.00065</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-6'>
                                        <div id="createToken" className='col-lg-12'>
                                            <div className='d-flex margin-top-30'>
                                                <div className='col-lg-2 removePaddingRight'>
                                                    <div className='d-flex'>
                                                        <img src={fillImage} className='fill-img'></img>
                                                        <p className='fill-text'>1</p>
                                                    </div>
                                                </div>
                                                <div className='col-lg-10 removePaddingLeft'>
                                                    <h3 className='text-primary'>Verify Token</h3>
                                                    <p className='text-primary'>Please enter your verification token from your account.</p>
                                                </div>
                                            </div>
                                            <div className='d-flex margin-top-30'>
                                                <div className='col-lg-2 removePaddingRight'>
                                                    <div className='d-flex'>
                                                        <img src={fillImage} className="fill-img"></img>
                                                        <p className='fill-text'>2</p>
                                                    </div>
                                                </div>
                                                <div className='col-lg-10 removePaddingLeft'>
                                                    <h3 className='text-primary'>Defi Launchpad Info</h3>
                                                    <p className='text-primary'>Fill in your defi launchpad information</p>
                                                </div>
                                            </div>
                                            <div className='d-flex margin-top-30'>
                                                <div className='col-lg-2 removePaddingRight'>
                                                    <div className='d-flex'>
                                                        <img src={fillImage} className="fill-img"></img>
                                                        <p className='fill-text'>3</p>
                                                    </div>
                                                </div>
                                                <div className='col-lg-10 removePaddingLeft'>
                                                    <h3 className='text-primary'>Additional Info</h3>
                                                    <p className='text-primary'>Othre information.</p>
                                                </div>
                                            </div>
                                            <div className='d-flex margin-top-30'>
                                                <div className='col-lg-2 removePaddingRight'>
                                                    <div className='d-flex'>
                                                        <img src={fillImage} className="fill-img"></img>
                                                        <p className='fill-text'>4</p>
                                                    </div>
                                                </div>
                                                <div className='col-lg-10 removePaddingLeft'>
                                                    <h3 className='text-primary'>Finish</h3>
                                                    <p className='text-primary'>Save all information to your launchpad.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-3'>
                                        <div className='col-sm-12'>
                                            <div className='sidemenuBox'>
                                                <div className='d-flex'>
                                                    <div className='col-lg-6 removePaddingLeft'>
                                                        <img src={btcImage} className="current-conversion-img"></img>
                                                        <h5 className='text-primary'>BTC <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="var(--text-primary)" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                                                        </svg> USD</h5>
                                                        <h3 className='text-secondary'>9784.79</h3>
                                                        <p className='text-percent'><img src={trendImage}></img> 7.2%</p>
                                                    </div>
                                                    <div className='col-lg-6 removePaddingRight'>
                                                        <img src={graphImage} className="graph-img"></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='sidemenuBox'>
                                                <div className='d-flex'>
                                                    <div className='col-lg-6 removePaddingLeft'>
                                                        <img src={ltcImage} className="current-conversion-img"></img>
                                                        <h5 className='text-primary'>LTC <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="var(--text-primary)" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                                                        </svg> USD</h5>
                                                        <h3 className='text-secondary'>8741.79</h3>
                                                        <p className='text-percent'><img src={trendImage}></img> 5.2%</p>
                                                    </div>
                                                    <div className='col-lg-6 removePaddingRight'>
                                                        <img src={graphImage} className="graph-img"></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='sidemenuBox'>
                                                <div className='d-flex'>
                                                    <div className='col-lg-6 removePaddingLeft'>
                                                        <img src={ethImage} className="current-conversion-img"></img>
                                                        <h5 className='text-primary'>ETH <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="var(--text-primary)" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                                                        </svg> USD</h5>
                                                        <h3 className='text-secondary'>4567.16</h3>
                                                        <p className='text-percent'><img src={trendImage}></img> 6.2%</p>
                                                    </div>
                                                    <div className='col-lg-6 removePaddingRight'>
                                                        <img src={graphImage} className="graph-img"></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='sidemenuBox'>
                                                <div className='d-flex'>
                                                    <div className='col-lg-6 removePaddingLeft'>
                                                        <img src={bnbImage} className="current-conversion-img"></img>
                                                        <h5 className='text-primary'>BNB <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="var(--text-primary)" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                                                        </svg> USD</h5>
                                                        <h3 className='text-secondary'>6547.79</h3>
                                                        <p className='text-percent'><img src={trendImage}></img> 9.5%</p>
                                                    </div>
                                                    <div className='col-lg-6 removePaddingRight'>
                                                        <img src={graphImage} className="graph-img"></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
