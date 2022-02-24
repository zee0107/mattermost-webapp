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

import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';
import ChannelHeaderMobile from 'components/channel_header_mobile';

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
        const ThemeValue = window.localStorage.getItem("theme");
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
        const {globalHeader, currentUser} = this.props;
        return (
            <div>
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
                            <ChannelHeaderMobile/>
                        </div>
                    </div>
                </div>
                <div className='col-sm-12 bodyBgElipseProfile bgGrey removePadding'>
                    <div className="inner-wrap-section">
                        <div className='d-flex'>
                            <div className="col-lg-12">
                                <img className='img-cover' src={coverImage}></img>
                            </div>
                            <div className='col-lg-6 profile-div'>
                                <div className='row'>
                                    <div className='col-lg-5 profile-details-box'>
                                        <div className='d-flex'>
                                            <div className='col-lg-2 profile-img-div'>
                                                {this.renderProfilePicture('mxl')}
                                                {/*<img src={} className='profile-img-box'></img>*/}
                                            </div>
                                            
                                            <div className='col-lg-8'>
                                                <h4>{`${currentUser.first_name} ${currentUser.last_name}`}</h4>
                                                <h5>{'@' + currentUser.username}</h5>
                                                <h5>{currentUser.position}</h5>
                                            </div>
                                            <div className='col-lg-2'>
                                                {/*<button type='button' className='btn btneditProfile'>Edit</button>*/}
                                                <ToggleModalButtonRedux
                                                    id='accountSettings'
                                                    ariaLabel='Profile'
                                                    modalId={ModalIdentifiers.USER_SETTINGS}
                                                    dialogType={UserSettingsModal}
                                                    dialogProps={{isContentProductSettings: false}}
                                                    className={'btn btneditProfile'}
                                                    showUnread={false}
                                                >
                                                    Edit
                                                </ToggleModalButtonRedux>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-1'></div>
                                    <div className='col-lg-6'>
                                        <div className='col-lg-12 profile-count-box'>
                                            <div className='d-flex'>
                                                <div className='col-lg-3'>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <h5>Post</h5>
                                                    <h4>2.0k</h4>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <h5>Following</h5>
                                                    <h4>2.0k</h4>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <h5>Followers</h5>
                                                    <h4>2.0k</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div id='profileMenu' className='col-lg-12 profile-menu-box'>
                                            <div className='d-flex'>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={LayoutIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={SplitIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={ImgIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={VideoIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={MusicIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={AttachIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={GeoIcon}></img></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                    <br></br>
                    <div className="inner-wrap-profile">
                        <div id='profileMenuMobile' className='col-lg-12 profile-menu-box-mobile width-100'>
                            <div className='d-flex'>
                                <div className='col-lg-2 profile-menu-icon'>
                                    <a href='#'><img src={LayoutIcon}></img></a>
                                </div>
                                <div className='col-lg-2 profile-menu-icon'>
                                    <a href='#'><img src={SplitIcon}></img></a>
                                </div>
                                <div className='col-lg-2 profile-menu-icon'>
                                    <a href='#'><img src={ImgIcon}></img></a>
                                </div>
                                <div className='col-lg-2 profile-menu-icon'>
                                    <a href='#'><img src={VideoIcon}></img></a>
                                </div>
                                <div className='col-lg-2 profile-menu-icon'>
                                    <a href='#'><img src={MusicIcon}></img></a>
                                </div>
                                <div className='col-lg-2 profile-menu-icon'>
                                    <a href='#'><img src={AttachIcon}></img></a>
                                </div>
                                <div className='col-lg-2 profile-menu-icon'>
                                <a href='#'><img src={GeoIcon}></img></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className='col-lg-12 share-div'>
                                        <div className='d-flex'>
                                            <div className='col-md-6 share-div-input removePaddingRight'>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        {this.renderProfilePicture('md')}
                                                        {/*<img src={profPic} className='share-img'></img>*/}
                                                    </div>
                                                    <div className='col-sm-8 removePadding'>
                                                        <input className='share-input' placeholder={'Whats going on ' + `${currentUser.first_name}` + '?'} />
                                                    </div>
                                                    <div className='col-sm-2 removePadding padding-top-share-icons'>
                                                        <a href='#' className='icon-margin-right'><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M13.7555 4.41165H11.7685L10.6215 3.15802H6.86061V4.41165H10.0699L11.217 5.66527H13.7555V13.187H3.72656V7.54571H2.47293V13.187C2.47293 13.8765 3.03706 14.4406 3.72656 14.4406H13.7555C14.445 14.4406 15.0092 13.8765 15.0092 13.187V5.66527C15.0092 4.97578 14.445 4.41165 13.7555 4.41165ZM5.60699 9.42614C5.60699 11.1561 7.01105 12.5602 8.74105 12.5602C10.4711 12.5602 11.8751 11.1561 11.8751 9.42614C11.8751 7.69614 10.4711 6.29208 8.74105 6.29208C7.01105 6.29208 5.60699 7.69614 5.60699 9.42614ZM8.74105 7.54571C9.77529 7.54571 10.6215 8.3919 10.6215 9.42614C10.6215 10.4604 9.77529 11.3066 8.74105 11.3066C7.70681 11.3066 6.86061 10.4604 6.86061 9.42614C6.86061 8.3919 7.70681 7.54571 8.74105 7.54571ZM3.72656 4.41165H5.60699V3.15802H3.72656V1.27759H2.47293V3.15802H0.592499V4.41165H2.47293V6.29208H3.72656V4.41165Z" fill="var(--text-primary)"/>
                                                            </svg></a>
                                                        <a href='#'><svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8.75 7.875C8.75 8.10706 8.65781 8.32962 8.49372 8.49372C8.32962 8.65781 8.10706 8.75 7.875 8.75C7.64294 8.75 7.42038 8.65781 7.25628 8.49372C7.09219 8.32962 7 8.10706 7 7.875C7 7.64294 7.09219 7.42038 7.25628 7.25628C7.42038 7.09219 7.64294 7 7.875 7C8.10706 7 8.32962 7.09219 8.49372 7.25628C8.65781 7.42038 8.75 7.64294 8.75 7.875V7.875ZM13.125 8.75C13.3571 8.75 13.5796 8.65781 13.7437 8.49372C13.9078 8.32962 14 8.10706 14 7.875C14 7.64294 13.9078 7.42038 13.7437 7.25628C13.5796 7.09219 13.3571 7 13.125 7C12.8929 7 12.6704 7.09219 12.5063 7.25628C12.3422 7.42038 12.25 7.64294 12.25 7.875C12.25 8.10706 12.3422 8.32962 12.5063 8.49372C12.6704 8.65781 12.8929 8.75 13.125 8.75V8.75ZM1.75 5.25C1.75 4.32174 2.11875 3.4315 2.77513 2.77513C3.4315 2.11875 4.32174 1.75 5.25 1.75H15.75C16.6783 1.75 17.5685 2.11875 18.2249 2.77513C18.8812 3.4315 19.25 4.32174 19.25 5.25V13.125C19.2502 13.24 19.2277 13.3539 19.1839 13.4602C19.1401 13.5665 19.0757 13.6631 18.9945 13.7445L13.7445 18.9945C13.6631 19.0757 13.5665 19.1401 13.4602 19.1839C13.3539 19.2277 13.24 19.2502 13.125 19.25H5.25C4.32174 19.25 3.4315 18.8812 2.77513 18.2249C2.11875 17.5685 1.75 16.6783 1.75 15.75V5.25ZM5.25 3.5C4.78587 3.5 4.34075 3.68437 4.01256 4.01256C3.68437 4.34075 3.5 4.78587 3.5 5.25V15.75C3.5 16.2141 3.68437 16.6592 4.01256 16.9874C4.34075 17.3156 4.78587 17.5 5.25 17.5H10.5V14.0175H10.493C9.3065 14.0175 8.442 13.419 7.91175 12.8852C7.59864 12.5698 7.33015 12.213 7.11375 11.8247L7.09975 11.7985L7.09625 11.7897L7.0945 11.7862L7.09275 11.7845C6.99319 11.5745 6.98115 11.3335 7.05925 11.1146C7.13736 10.8957 7.29923 10.7168 7.50925 10.6172C7.71927 10.5177 7.96023 10.5056 8.17913 10.5838C8.39804 10.6619 8.57694 10.8237 8.6765 11.0337C8.80777 11.2579 8.9665 11.4649 9.149 11.6497C9.492 11.9927 9.9365 12.2675 10.493 12.2675C10.6679 12.2677 10.8417 12.2394 11.0075 12.1835C11.62 11.1737 12.7312 10.5 14 10.5H17.5V5.25C17.5 4.78587 17.3156 4.34075 16.9874 4.01256C16.6592 3.68437 16.2141 3.5 15.75 3.5H5.25ZM17.5 12.25H14C13.5359 12.25 13.0908 12.4344 12.7626 12.7626C12.4344 13.0908 12.25 13.5359 12.25 14V17.5H12.7627L17.5 12.7627V12.25Z" fill="var(--text-primary)"/>
                                                        </svg></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-3 removePaddingRight margin-top-share'>
                                                <select id='selectDesktop' className='share-select'>
                                                    <option value='Everyone'>&#127760; Everyone</option>
                                                    <option value='Friends'>&#128101; Friends Only</option>
                                                    <option value='Private'>&#128100; Private</option>
                                                </select>

                                                <select id='selectMobile' className='share-select'>
                                                    <option value='Everyone'>&#127760;</option>
                                                    <option value='Friends'>&#128101;</option>
                                                    <option value='Private'>&#128100;</option>
                                                </select>
                                            </div>
                                            <div className='col-md-3 removePaddingRight margin-top-share'>
                                                <div id='buttonsDesktop'>
                                                    <a href='#' className='btn buttonBgWhite btn-margin-right'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#44cc4b" className="bi bi-camera-video" viewBox="0 -2 16 16">
                                                        <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z" fill="#44cc4b"/>
                                                    </svg> Live</a>
                                                    <a href='#' className='btn buttonBgGreen btn-padding'>Share</a>
                                                </div>
                                                <div id='buttonsMobile'>
                                                    <a href='#' className='btn-margin-right'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#44cc4b" className="bi bi-camera-video" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z" fill="var(--text-primary)"/>
                                                    </svg></a>
                                                    <a href='#' className='btn-padding'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" fill="var(--text-primary)"/>
                                                        <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" fill="var(--text-primary)"/>
                                                    </svg></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className='col-lg-12 post-div margin-top-30'>
                                        <div className='d-flex'>
                                            <div className='col-lg-2 text-center removePaddingRight'>
                                                <img src={postPic} className='post-img'></img>
                                            </div>
                                            <div className='col-lg-9'>
                                                <h5 className='getStartPrimaryText'>Cody Fisher</h5>
                                                <h6 className='getSecondaryText'>New york City, Ny</h6>
                                            </div>
                                            <div className='col-lg-1'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down margin-top-30" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" fill='var(--text-primary)'/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='col-lg-12'>
                                            <img src={postImage}></img>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className='col-lg-12 completion-div-box removePadding'>
                                        <div className='d-flex completion-box-bg'>
                                            <img src={completion} className='completion-img'></img>
                                            <div className='col-lg-12 completion-text'>
                                                <div className='d-flex'>
                                                    <div className='col-lg-9 width-100'>
                                                        <h5>Profile Completion</h5>
                                                    </div>
                                                    <div className='col-lg-3'>
                                                        <h4 className='competion-text-percent'>80%</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <br></br>
                                        <div className='d-flex margin-top-10'>
                                            <div className='done-div'>
                                                <img src={DoneIcon}></img>
                                            </div>
                                            <h5 className='getStartPrimaryText margin-top-4'>Add Your Photo</h5>
                                        </div>
                                        <div className='d-flex margin-top-10'>
                                            <div className='done-div'>
                                                <img src={DoneIcon}></img>
                                            </div>
                                            <h5 className='getStartPrimaryText margin-top-4'>Add Your Name</h5>
                                        </div>
                                        <div className='d-flex margin-top-10'>
                                            <div className='done-div'>
                                                <img src={DoneIcon}></img>
                                            </div>
                                            <h5 className='getStartPrimaryText margin-top-4'>Add Your Workspace</h5>
                                        </div>
                                        <div className='d-flex margin-top-10'>
                                            <div className='undone-div'>
                                                <img className='undone-img' src={UndoneIcon}></img>
                                            </div>
                                            <h5 className='getStartPrimaryText margin-top-4'>Add Your Address</h5>
                                        </div>
                                    </div>
                                    <br />
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
                </div>
            </div>
        );
    }
}
