// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import deferComponentRender from 'components/deferComponentRender';
import PostView from 'components/post_view_new';
import EditPostModal from 'components/edit_post_modal';
import Post from 'components/post_view_new/post';

import homeImage from 'images/homeFeed.png';
import LogoBlack from 'images/logoBlack.png'
import coverImage from 'images/cover-photo.png';
import profPic from 'images/profiles/user-profile-1.png';
import ImgIcon from 'images/profiles/image.svg';
import LayoutIcon from 'images/profiles/columns-gap.svg';
import MusicIcon from 'images/profiles/music-note-beamed.svg';
import VideoIcon from 'images/profiles/camera-video.svg';
import GeoIcon from 'images/profiles/geo-alt.svg';
import AttachIcon from 'images/profiles/paperclip.svg';
import GlobeIcon from 'images/icon-global2.png';
import SmileIcon from 'images/emoji-smile-fill.svg';
import xIcon from 'images/x.svg';
import postImage from 'images/post-1.png';
import postPic from 'images/profiles/user-profile-2.png';
import completion from 'images/profiles/completion.png';
import ShareMobile from 'images/icon-share2.png';
import GlobeMobile from 'images/icon-globe2.png';
import VideoMobile from 'images/icon-cideo-camera.png';
import DoneIcon from 'images/profiles/done.svg';
import UndoneIcon from 'images/profiles/undone.svg';
import styled from 'styled-components';

import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import PostModal from 'components/user_settings/modal_post/post_modal';
import CreatePostProfile from 'components/create_post_profile';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';
import ChannelHeaderMobile from 'components/channel_header_mobile';

import Sidebar from 'components/sidebar';
import SidebarRight from 'components/sidebar_right';
import SidebarRightMenu from 'components/sidebar_right_menu';
import { CssFontSource } from '@stripe/stripe-js';
import { toggleRHSPlugin } from 'actions/views/rhs';
import { SocialCount } from 'mattermost-redux/types/crypto';
import { PostList } from 'mattermost-redux/types/posts';
import { post } from 'jquery';

type Props = {
    //status?: string;
    userId: string;
    //coverPhoto: Promise<string>;
    profilePicture: string;
    currentUser: UserProfile;
    /*autoResetPref?: string;
    actions: {
        openModal: <P>(modalData: ModalData<P>) => void;
        setStatus: (status: UserStatus) => ActionFunc;
        unsetCustomStatus: () => ActionFunc;
        setStatusDropdown: (open: boolean) => void;
    };
    socialCount: Promise<SocialCount>;
    customStatus?: UserCustomStatus;
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
    getPostList: Promise<PostList>;*/
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
    coverUrl: string;
    completionResult: number;
    currentUser: UserProfile;
    uploading: boolean;
    deferredPostView: any;
    userLocation: string;
    userActivity: string;
    shareInfo: string;
    feeling: boolean;
    socialCount: SocialCount;
    postList: PostList;
};

export default class NewHeader extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false,width: 0,isStatusSet: false,isDark:'light',img_path: homeImage,completionResult: 0};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
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
        const {currentUser} = this.props;
        console.log(currentUser);

        return (
            <header className='header-crypter-menu position-sticky float-top-panel header-menus'>
                <div className='crypter-menu-desktop'>
                    <div className='container-fluid'>
                        <div className='d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start'>
                            <a href='/cryter/channels/town-square' className='d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none'>
                                <img className='img-fluid' src={LogoBlack} alt='logo' title='logo'/>
                            </a>
                            <div className='col-12 me-lg-auto mb-2 justify-content-center mb-md-0 col-lg-3 input-search-div'>
                                <form>
                                    <div className='input-group mb-0'>
                                        <span className='input-group-text input-search-crypter-span' id='basic-addon1'><i className='bi bi-search'></i></span>
                                        <input type='text' className='form-control form-control-dark input-search-crypter' placeholder='Search people, Pages, Groups & #Hashtag' aria-label='Search people, Pages, Groups & #Hashtag'/>
                                    </div>
                                </form>
                            </div>
                            <div className='text-end'>
                                <a className='btn-add-post text-white onCreatepost' data-toggle='modal' data-target='#staticBackdrop'>+</a>
                                <a className='position-relative onDekstopaddfriends' data-toggle='offcanvas' data-target='#offcanvasRightLabelfriendsdesktop' aria-controls='offcanvasRightLabelfriendsdesktop'>
                                    <svg xmlns='http://www.w3.org/2000/svg' fill='var(--text-primary)' className='bi bi-person-plus menu-align bi-person-plus-style' viewBox='0 0 16 16'><path d='M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z'></path><path fillRule='evenodd' d='M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z'></path></svg>
                                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-style'>3</span>
                                </a>
                                <a className='position-relative onDekstopaddmessages' data-toggle='offcanvas' data-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'>
                                    <svg xmlns='http://www.w3.org/2000/svg' fill='var(--text-primary)' className='bi bi-chat-right-text menu-align bi-chat-right-text-style' viewBox='0 0 16 16'><path d='M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z'></path><path d='M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z'></path></svg>
                                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-style'>10</span>
                                </a>
                                <a className='position-relative onDekstopaddnotifications' data-toggle='offcanvas' data-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'>
                                    <svg xmlns='http://www.w3.org/2000/svg' fill='var(--text-primary)' className='bi bi-bell menu-align bi-bell-styles' viewBox='0 0 16 16'><path d='M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z'></path></svg>
                                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-style'>5</span>
                                </a>
                            </div>
                            <div className='dropdown'>
                                    <button className='btn-crypter-user' type='button' id='dropdownMenuButton1' data-toggle='dropdown' aria-expanded='false'>
                                    {/*<img width='25' className='img-fluid user-photo' src='assets/images/sample-user-primary-picture.png' alt='User name' title='Username'/>*/ this.renderProfilePicture('md')} {/*currentUser.first_name} <i className='bi bi-chevron-down'></i>
                                    </button>
                                    <ul className='dropdown-menu dropdown-menu-dark mt-1' aria-labelledby='dropdownMenuButton1'>
                                        <li><a className='dropdown-item' href='profile.html'><i className='bi bi-person'></i> Profile</a></li>
                                        <li><a className='dropdown-item onGivefeedback'><i className='bi bi-exclamation-square'></i> Give Feedback</a></li>
                                        <li><a className='dropdown-item onHelpsupport'><i className='bi bi-question-diamond'></i> Help & Support</a></li>
                                        <li><a className='dropdown-item onSettingsandprivacy'><i className='bi bi-gear-wide'></i> Settings & Privacy</a></li>
                                    </ul>
                            </div>
                            <div className='text-end'>
                                <a className='onLogout'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-in-right logout-icon" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" fill='var(--text-primary)'/>
                                    <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" fill='var(--text-primary)'/>
                                </svg> Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            
                {/*<div className='crypter-menu-mobile'>
                    <div className='container-fluid'>
                        <div className='row'>
            
                        <div className='position-relative'>
                            <div className='position-absolute top-0 start-50 translate-middle-x'>
                            <a className='text-center'><img width='100' className='' src='assets/images/logo.png' alt='logo'/></a>
                            </div>
                        </div>
                        
                        <p>
                            <a className='float-start' data-toggle='collapse' href='#collapseMobilprofile' role='button' aria-expanded='true' aria-controls='collapseMobilprofile'><i className='bi bi-filter-left filter-left-style'></i></a>
            
                            <a className='float-start mt-2 ms-2 position-relative' href='#' data-toggle='offcanvas' data-target='#offcanvasRightnotification' aria-controls='offcanvasRightnotification'><i className='bi bi-bell' style='font-size:22px;'></i>
                                <span className='position-absolute top-0 end-0 badge rounded-pill bg-danger badge-style-mobile'>5</span>
                            </a>
            
                            <a className='float-end' data-toggle='collapse' href='#collapseMobilprofile' role='button' aria-expanded='true' aria-controls='collapseMobilprofile'><img style=' z-index: 99;' width='40' className='float-start border border-2 rounded-circle border-success' src='assets/images/evan-yates-photos.png' alt='Username' title='Username'/></a>
            
                            <a className='float-end position-relative' href='#' data-toggle='offcanvas' data-target='#offcanvasRight' aria-controls='offcanvasRight'><i className='bi bi-chat-left-text search-icon-mobile ms-2 me-2'></i>
                            <span className='position-absolute top-0 end-0 badge rounded-pill bg-danger badge-style-mobile'>3</span>
                            </a>
            
                            <a className='float-end' href='#collapseMobilesearch' data-toggle='collapse' aria-expanded='true' aria-controls='collapseMobilesearch'><i className='bi bi-search search-icon-mobile ms-2 me-2'></i></a>
                        </p>
            
                        </div>
            
                        <div className='collapse' id='collapseMobilesearch'>
                        <div className='card border-0'>
                                <form>
                                <div className='input-group'>
                                    <span className='input-group-text input-search-crypter-span' id='basic-addon1'><i className='bi bi-search'></i></span>
                                    <input type='text' className='form-control form-control-dark input-search-crypter' placeholder='Search people, Pages, Groups & #Hashtag' aria-label='Search people, Pages, Groups & #Hashtag'/>
                                </div>
                                </form>
                        </div>
                        </div>
            
                        <div className='collapse' id='collapseMobilprofile'>
                        <div className='card mt-3'>
                            <ul className='list-group'>
                            <li className='list-group-item'><a href='profile.html' target='_self'><i className='bi bi-person'></i> Profile</a></li>
                            <li className='list-group-item'>
                            <div className='box-left-panel'>
                                <div className='row'>
                                <div className='col-12'>
                                    <img width='60' className='img-fluid float-start border border-2 rounded-circle border-success' src='assets/images/sample-user-primary-picture-6.png' alt='Username' title='Username' />
                                    <a className='float-end text-muted'>Edit</a>
                                    <label className='float-start ms-2'><strong>Full name goes here</strong></label>
                                    <br/>
                                    <label className='float-start ms-2 little-medium-text'>@fullnamegoeshere <br/> country, city, country code</label>
                                </div>
                                </div>
                                <hr/>
                                <div className='row'>
                                <div className='col-4 text-center'><p>Posts<br/><strong>2.6K</strong></p></div>
                                <div className='col-4 text-center'><p>Following<br/><strong>561</strong></p></div>
                                <div className='col-4 text-center'><p>Followers<br/><strong>16.2K</strong></p></div>
                                </div>
                            </div> 
                            </li> 
                                            <li className='list-group-item'>
                                            <a>
                                                <i className='bi bi-wallet-fill bi-wallet-style float-start mt-1 onWallet'></i><label className='float-start mt-2 ms-1 onWallet'> 
                                                    Wallet <i className='bi bi-question-diamond-fill' data-toggle='tooltip' data-bs-placement='top' title='What is Crypter Wallet?'></i></label>
                                                <strong>
                                                    <label className='float-end mt-1 ms-3'>
                                                    <i className='bi bi-arrow-down-circle-fill onCharicons' data-toggle='collapse' href='#collapseWallet' role='button' aria-expanded='true' aria-controls='collapseWallet'></i>
                                                    <i className='bi bi-arrow-up-circle-fill onChariconsup' data-toggle='collapse' href='#collapseWallet' role='button' aria-expanded='true' aria-controls='collapseWallet'></i>
                                                    </label>
                                                    <label className='float-end mt-2 text-success'>$1.00</label>
                                                </strong>
                                            </a>
                                            </li>    
                                            <div className='collapse' id='collapseWallet'>
                                            <div className='border-0'>
                                                <ul className='list-group'>
                                                <li className='list-group-item border-0'>
                                                    <a className='onSendmoney'><i className='bi bi-wallet2'></i> Send money</a>
                                                </li>
                                                <li className='list-group-item border-0'>
                                                    <a className='onRecievedmoney'><i className='bi bi-chat-square-dots'></i> Recieved money</a>
                                                </li>
                                                <li className='list-group-item border-0'>
                                                    <a className='onWidrawdeposit'><i className='bi bi-currency-dollar'></i> Withdraw / Deposit</a>
                                                </li>
                                                <li className='list-group-item border-0'>
                                                    <a className='onTransaction'><i className='bi bi-list-check'></i> Transaction</a>
                                                </li>
                                                </ul>
                                            </div>
                                            </div>    
                            <li className='list-group-item onGivefeedback'><a><i className='bi bi-exclamation-square'></i> Give Feedback</a></li>     
                            <li className='list-group-item onHelpsupport'><a><i className='bi bi-question-diamond'></i> Help & Support</a></li>
                            <li className='list-group-item onSettingsandprivacy'><a><i className='bi bi-gear-wide'></i> Settings & Privacy</a></li>
                            </ul>
                        </div>
                        <div className='card mt-3'>
                            <ul className='list-group'>
                            <li className='list-group-item'><a className='onNewsfeeds'><i className='bi bi-grid-1x2'></i> News feed</a></li>
                            <li className='list-group-item'><a className='onCreatephotosandalbumsmobile'><i className='bi bi-journal-album'></i> Albums</a></li>
                            <li className='list-group-item'><a className='onMygroups' href='mygroups.html'><i className='bi bi-people'></i> My Groups</a></li>
                            <li className='list-group-item'><a className='onCreatemypage'><i className='bi bi-flag'></i> My Page</a></li>
                            </ul>
                        </div>
                        <div className='card mt-3'>
                                    <ul className='list-group'>
                                    <li className='list-group-item'><a><i className='bi bi-cursor'></i> Launchpad</a></li>
                                    </ul>
                        </div>
                        <div className='card mt-3'>
                            <ul className='list-group'>
                            <li className='list-group-item'><p className='mt-1 mb-0'>Trending <a className='float-end text-muted'>View All</a></p></li>
                            <li className='list-group-item'><p className='mt-1 mb-0'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-graph-up-arrow' viewBox='0 0 16 16'>
                                <path fillRule='evenodd' d='M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z'/>
                                </svg>
                                <a href='#' className='trendinggroups-links'>#Games</a> <label className='text-muted'>10408 post</label></p></li>
                            <li className='list-group-item'><p className='mt-1 mb-0'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-graph-up-arrow' viewBox='0 0 16 16'>
                                <path fillRule='evenodd' d='M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z'/>
                                </svg> 
                                <a href='#' className='trendinggroups-links'>#Games</a> <label className='text-muted'>10408 post</label></p></li>
                            <li className='list-group-item'><p className='mt-1 mb-0'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-graph-up-arrow' viewBox='0 0 16 16'>
                                <path fillRule='evenodd' d='M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z'/>
                                </svg>
                                <a href='#' className='trendinggroups-links'>C#</a> <label className='text-muted'>10408 post</label></p></li>
                            </ul>
                        </div>
                        <div className='card mt-3'>
                            <ul className='list-group'>
                            <li className='list-group-item'><a href='#' target='_self'>Logout</a></li>
                            </ul>
                        </div>
                        </div>
            
                    </div>
                </div>*/}
            </header>
        );
    }
}
