// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';

import homeImage from 'images/homeFeed.png';
import coverImage from 'images/cover-photo.png';
import profPic from 'images/profiles/user-profile-1.png'
import ImgIcon from 'images/profiles/image.svg';
import LayoutIcon from 'images/profiles/columns-gap.svg';
import MusicIcon from 'images/profiles/music-note-beamed.svg';
import VideoIcon from 'images/profiles/camera-video.svg';
import GeoIcon from 'images/profiles/geo-alt.svg';
import AttachIcon from 'images/profiles/paperclip.svg';
import SplitIcon from 'images/profiles/menu-icon.svg';
import DoneIcon from 'images/profiles/done.svg';
import UndoneIcon from 'images/profiles/undone.svg';
import postImage from 'images/post-1.png';
import postPic from 'images/profiles/user-profile-2.png';
import completion from 'images/profiles/completion.png';
import waveIcon from 'images/wave-skew.png';
import waveIconMobilbe from 'imageswave-skew-mobile.png';
import styled from 'styled-components';

import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';
import ChannelHeaderMobile from 'components/channel_header_mobile';

import Sidebar from 'components/sidebar';
import SidebarRight from 'components/sidebar_right';
import SidebarRightMenu from 'components/sidebar_right_menu';
import { CssFontSource } from '@stripe/stripe-js';

type Props = {
    status?: string;
    userId: string;
    coverPhoto: Promise<string>;
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
    coverUrl:string;
};

export default class ProfilPage extends React.PureComponent<Props, State> {
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
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.coverPhoto != null){
            Promise.resolve(this.props.coverPhoto).then(value => this.setState({coverUrl: value}));
        }
    }

    componentDidUpdate(){

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

    renderProfilePictureText = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
                text='plain'
            />
        );
    }


    render= (): JSX.Element => {
        const {globalHeader, currentUser} = this.props;
        const { coverUrl } = this.state;

        let coverImg;
        if(coverUrl !== undefined && coverUrl !== 'unavailable' && coverUrl !== ''){
            coverImg = (<img className='img-cover' src={coverUrl}></img>);
        }
        else{
            coverImg = (<img className='img-cover' src={coverImage}></img>);
        }

        return (
            <div>
                <div className='profile-header-desktop'>
                    <section id='profile' className='profile-views'>
                        <div className='container'>
                            <div className='box-top-profile-verion text-center'>
                                <div className='row'>
                                    <div className='col-4'>
                                        <div className='blur-effects text-white'>
                                            <div className='row'>
                                                <div className='p-0'>
                                                    <div className='col-12'>
                                                        {this.renderProfilePictureText('mxl')}
                                                        <ToggleModalButtonRedux
                                                            id='accountSettings'
                                                            ariaLabel='Profile'
                                                            modalId={ModalIdentifiers.USER_SETTINGS}
                                                            dialogType={UserSettingsModal}
                                                            dialogProps={{isContentProductSettings: false}}
                                                            className={'float-end onEditclicks mt-1'}
                                                            showUnread={false}
                                                        >
                                                            Edit
                                                        </ToggleModalButtonRedux>
                                                        <h3 className='float-start ml-2 mt-2 name-query-style'>{`${currentUser.first_name} ${currentUser.last_name}`}</h3>
                                                        <br/>
                                                        <br/>
                                                        <h4 className='float-start ml-2 little-medium-text name-quuery-at'>{'@' + currentUser.username}</h4>
                                                        <br/>
                                                        <h4 className='float-start ml-2 little-medium-text text-muted'>{currentUser.position}</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-8'>
                                        <div className='row'>
                                            <div className='col-4'></div>
                                            <div className='col-8'>
                                                <div className='row'>
                                                    <div className='col-md-3 mt-5 text-center text-white'><p></p><br/><h4><label></label></h4></div>
                                                    <div className='col-md-3 mt-5 text-center text-white'><p>Posts<br/></p><h4><label>2.6K</label></h4></div>
                                                    <div className='col-md-3 mt-5 text-center text-white'><p>Following<br/></p><h4><label>561</label></h4></div>
                                                    <div className='col-md-3 mt-5 text-center text-white'><p>Followers<br/></p><h4><label>16.2K</label></h4></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='blur-effects-menu-heading'>
                                            <div className='p-0'>
                                                <div className='row'>
                                                    <div className='col-md-2'>
                                                    <a className='float-start mr-5 ml-5'><img width='18' src={LayoutIcon} /></a></div>
                                                    <div className='col-md-2'>
                                                    <a className='float-start mr-5 ml-5'><img width='18' src={ImgIcon} /></a></div>
                                                    <div className='col-md-2'>
                                                    <a className='float-start mr-5 ml-5'><img width='18' src={VideoIcon} /></a></div>
                                                    <div className='col-md-2'>
                                                    <a className='float-md-start mr-5 ml-5'><img width='18' src={MusicIcon} /></a></div>
                                                    <div className='col-md-2'>
                                                    <a className='float-md-start mr-5 ml-5'><img width='18' src={AttachIcon} /></a></div>
                                                    <div className='col-2'>
                                                    <a className='float-md-start mr-5 ml-5'><img width='18' src={GeoIcon} /></a></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className='profile-header-mobile'>
                    <section id='profile-mobile' className='profile-views'>
                            <div className='container-fluid'>
                                <div className='box-top-profile-mobile text-center'>
                                    <div className='row'>
                                        <div className='col-md-10 mx-auto'>
                                        
                                        <div className='blur-effects-mobile text-white'>
                                            <div className='row'>
                                                <div className='col-lg-3 text-center'>
                                                    {this.renderProfilePicture('mxl')}
                                                </div>
                                                <div className='col-lg-5 text-center'>
                                                    <h3 className='name-query-mobile-style'>{`${currentUser.first_name} ${currentUser.last_name}`}</h3>
                                                    <br/>
                                                    <h4 className='hash-name'>{'@' + currentUser.username}</h4>
                                                    <br/>
                                                    <h4 className='little-medium-text name-quuery-at'>{currentUser.position}</h4>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className='d-grid w-50 mx-auto'>
                                                        <ToggleModalButtonRedux
                                                            id='accountSettings'
                                                            ariaLabel='Profile'
                                                            modalId={ModalIdentifiers.USER_SETTINGS}
                                                            dialogType={UserSettingsModal}
                                                            dialogProps={{isContentProductSettings: false}}
                                                            className={'float-end onEditclicks mt-1'}
                                                            showUnread={false}
                                                        >
                                                            Edit
                                                        </ToggleModalButtonRedux>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-10 mx-auto mt-3 mb-1'>
                                        <div className='row'>
                                            <div className='col-4 text-center text-white'><p>Posts</p><br/><h4><strong>2.6K</strong></h4></div>
                                            <div className='col-4 text-center text-white'><p>Following</p><br/><h4><strong>561</strong></h4></div>
                                            <div className='col-4 text-center text-white'><p>Followers</p><br/><h4><strong>16.2K</strong></h4></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <section id='crypter-section' className='crypter-section-profile-desktop'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-8 profile-post-page'>
                                <div className='col-12 text-center reload-loading'>
                                    <div className='spinner-border' role='status'>
                                        <span className='visually-hidden'>Loading...</span>
                                    </div>
                                </div>
                                <div className='box-middle-panel'>

                                <div className='row'>
                                    <div className='col-5 text-center'>
                                        <div className='input-group float-start'>
                                            <span className='input-group-text input-search-crypter-whats-going-on' id='basic-addon22'>
                                            {this.renderProfilePicture('md')}</span>
                                            <input type='text' className='form-control input-search-crypter-whats-going-on onCreatepost' placeholder='What`s going on, Name goes here' aria-label='What`s going on, Name goes here' aria-describedby='basic-addon55' data-bs-toggle='modal' data-bs-target='#staticBackdrop' />
                                            <span className='input-group-text input-search-crypter-whats-going-on onPhotoaddpost' id='basic-addon33' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>
                                            <a href='#'><img width='18' className='img-fluid' src='assets/images/photo-icon-img.png' /></a></span>
                                            <span className='input-group-text input-search-crypter-whats-going-on onEmoji p-2' id='basic-addon44'>
                                            <a href='#'><img width='18' className='img-fluid' src='assets/images/smile-box.png' /></a>
                                            </span>
                                        </div>
                                        </div>
                                        <div className='col-3'><div className='d-grid'><button className='box-live-post btn-sm'>
                                            <img width='22' className='img-fluid' src='assets/images/icon-globe2.png' />Everyone</button></div></div>
                                            <div className='col-2'><div className='d-grid'><button className='box-live-post btn-sm'><img width='22' className='img-fluid' src='assets/images/icon-cideo-camera.png'/> Live</button></div></div>
                                            <div className='col-2'><div className='d-grid'><button className='box-button-share btn-sm text-white'>Share</button></div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className='col-md-4'>
                                <div className='position-sticky float-right-panel'>
                                    <div className='box-left-panel-egzo'>
                                        <div className='row'>
                                            <div className='position-relative'>
                                            <div className='position-absolute top-0 start-50 translate-middle-x'>
                                                <div><img height='63' src={waveIcon} /></div>
                                            </div>
                                            </div>  

                                            <div className='col-7'>
                                            <div className='profile-completion-desktop text-center text-white'><small>Profile completion</small></div>
                                            </div>
                                            <div className='col-5'>
                                            <div className='profile-completion-percent text-center'><small>80%</small></div>
                                            </div>
                                        </div>

                                        
                                        <ul className='list-group p-3'>
                                            <li className='list-group-item border-0'><img className='bg-check-arrow rounded-circle' src='https://crypter.polywickstudio.ph/static/files/36b5fa1eb4642d0032b03f7d37373b95.svg' alt='' /> <label className='ms-2'>Add Your Photo</label></li>
                                            <li className='list-group-item border-0'><img className='bg-check-arrow rounded-circle' src='https://crypter.polywickstudio.ph/static/files/36b5fa1eb4642d0032b03f7d37373b95.svg' alt='' /> <label className='ms-2'>Add Your Name</label></li>
                                            <li className='list-group-item border-0'><img className='bg-check-arrow rounded-circle' src='https://crypter.polywickstudio.ph/static/files/36b5fa1eb4642d0032b03f7d37373b95.svg' alt='' /> <label className='ms-2'>Add Your Workspace</label></li>
                                            <li className='list-group-item border-0'><img className='bg-check-arrow-plus rounded-circle' src='https://crypter.polywickstudio.ph/static/files/c6f3df12536981a6cbac7d57f3198df6.svg' alt='' /> <label className='ms-2'>Add Your Address</label></li>
                                        </ul>
                                    </div>

                                    <div className='col-lg-12 chat-box removePadding margin-top-30'>
                                        <div className='d-flex'>
                                            <div className='col-lg-4 width-100'>
                                                <div className='d-flex'>
                                                    <div className='col-sm-3'>
                                                        <h4>
                                                            <a href='#' title='Personal Chat'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-person" viewBox="0 0 16 16">
                                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                                            </svg></a>
                                                        </h4>
                                                    </div>
                                                    <div className='col-sm-3'>
                                                        <h4>
                                                            <a href='#' title='Group Chat'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-people" viewBox="0 0 16 16">
                                                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                                                            </svg></a>
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 width-100 text-center'>
                                                <h4 className='getStartPrimaryText'>Chat</h4>
                                            </div>
                                            <div className='col-lg-4 width-100 chat-setting'>
                                                <h4><a href='#' title='Settings'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-gear" viewBox="0 0 16 16">
                                                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                                </svg></a>
                                                </h4>
                                            </div>
                                        </div>
                                        <br />
                                        <div className='col-lg-12 chat-hover removePadding'>
                                            <div className='d-flex'>
                                                <div className='col-lg-3 marginTopImg'>
                                                    <img src={profPic} className='chat-img'></img>
                                                </div>
                                                <div className='col-lg-9 width-100 removePaddingLeft'>
                                                    <div className='d-flex'>
                                                        <div className='col-sm-6 width-100 removePaddingLeft'>
                                                            <h6 className='getStartPrimaryText'>Allysa Kate</h6>
                                                        </div>
                                                        <div className='col-sm-6 removePaddingLeft chat-text'>
                                                            <h6 className='getStartPrimaryText'>Today, 12:04</h6>
                                                        </div>
                                                    </div>
                                                    <h6 className='getSecondaryText'>A Facebook-like platform...</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-12 chat-hover removePadding'>
                                            <div className='d-flex'>
                                                <div className='col-lg-3 marginTopImg'>
                                                    <img src={profPic} className='chat-img'></img>
                                                </div>
                                                <div className='col-lg-9 width-100 removePaddingLeft'>
                                                    <div className='d-flex'>
                                                        <div className='col-sm-6 width-100 removePaddingLeft'>
                                                            <h6 className='getStartPrimaryText'>Mark Olympus</h6>
                                                        </div>
                                                        <div className='col-sm-6 removePaddingLeft chat-text'>
                                                            <h6 className='getStartPrimaryText'>Today, 12:04</h6>
                                                        </div>
                                                    </div>
                                                    <h6 className='getSecondaryText'>A Facebook-like platform...</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-12 chat-hover removePadding'>
                                            <div className='d-flex'>
                                                <div className='col-lg-3 marginTopImg'>
                                                    <img src={profPic} className='chat-img'></img>
                                                </div>
                                                <div className='col-lg-9 width-100 removePaddingLeft'>
                                                    <div className='d-flex'>
                                                        <div className='col-sm-6 width-100 removePaddingLeft'>
                                                            <h6 className='getStartPrimaryText'>Janine Tenoso</h6>
                                                        </div>
                                                        <div className='col-sm-6 removePaddingLeft chat-text'>
                                                            <h6 className='getStartPrimaryText'>Today, 12:04</h6>
                                                        </div>
                                                    </div>
                                                    <h6 className='getSecondaryText'>A Facebook-like platform...</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
