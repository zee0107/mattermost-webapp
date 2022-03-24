// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import CreatePost from 'components/create_post/create_post';

import homeImage from 'images/homeFeed.png';
import profPic from 'images/profiles/user-profile-1.png';
import ImgIcon from 'images/profiles/image.svg';
import LayoutIcon from 'images/profiles/columns-gap.svg';
import MusicIcon from 'images/profiles/music-note-beamed.svg';
import VideoIcon from 'images/profiles/camera-video.svg';
import GeoIcon from 'images/profiles/geo-alt.svg';
import AttachIcon from 'images/profiles/paperclip.svg';
import SplitIcon from 'images/profiles/menu-icon.svg';
import postImage from 'images/post-1.png';
import postImage2 from 'images/post-image.png';
import trendImage from 'images/trending-up.svg';
import postPic from 'images/profiles/user-profile-2.png';
import postPic2 from 'images/profiles/user-profile-3.png';
import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';

type Props = {
    profilePicture: string;
    currentUser: UserProfile;
 }


type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
    middleView: string;
};

export default class RightSideView extends React.PureComponent<Props, State> {
    static defaultProps = {profilePicture: '', allCrypto: [],trendCrypto: [],newCrypto: [],gainerCrypto: []}

    channelViewRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light',img_path: homeImage,logo_url: [], data: []};

        this.channelViewRef = React.createRef();
    }
    
    getChannelView = () => {
        return this.channelViewRef.current;
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

    render= (): JSX.Element => {
        const {globalHeader, currentUser} = this.props;
        
        return (
            <div>
                <div className='col-md-12 chat-box removePadding mtop-10'>
                                        <div className='d-flex mtop-10'>
                                            <div className='col-md-3 profile-img-div-new'>
                                                {this.renderProfilePicture('xl')}
                                            </div>
                                        
                                            <div className='col-md-8 removePadding'>
                                                <label className='text-primary'>{`${currentUser.first_name} ${currentUser.last_name}`}</label>
                                                <p className='text-secondary small'>{'@' + currentUser.username}</p>
                                                <p className='text-secondary small'>{currentUser.position}</p>
                                            </div>
                                            <div className='col-lg-3'>
                                                <ToggleModalButtonRedux
                                                    id='accountSettings'
                                                    ariaLabel='Profile'
                                                    modalId={ModalIdentifiers.USER_SETTINGS}
                                                    dialogType={UserSettingsModal}
                                                    dialogProps={{isContentProductSettings: false}}
                                                    className={'btn btneditProfile'}
                                                    showUnread={false}
                                                >Edit</ToggleModalButtonRedux>
                                            </div>
                                        </div>
                                        <hr className='removeMarginHr'></hr>
                                        <div className='d-flex'>
                                            <div className='col-md-4'>
                                                <p className='text-secondary'>Post</p>
                                                <label className='text-primary'>2.0k</label>
                                            </div>
                                            <div className='col-md-4'>
                                                <p className='text-secondary'>Following</p>
                                                <label className='text-primary'>2.0k</label>
                                            </div>
                                            <div className='col-md-4'>
                                                <p className='text-secondary'>Followers</p>
                                                <label className='text-primary'>2.0k</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-12 chat-box removePadding mtop-10'>
                                        <div className='d-flex mtop-10'>
                                            <div className='col-md-8'>
                                                <label className='text-primary'>Trending Groups</label>
                                            </div>
                                            <div className='col-md-4 text-end'>
                                                <label className='text-secondary'>View All</label>
                                            </div>
                                        </div>
                                        <hr className='removeMarginHr'></hr>
                                        <div className='d-flex mtop-5'>
                                            <div className='col-md-2'>
                                                <img src={trendImage}></img>
                                            </div>
                                            <div className='col-md-10'>
                                                <label className='text-percent'>#Game</label>
                                                <p className='text-secondary'>289 Posts</p>
                                            </div>
                                        </div>
                                        <div className='d-flex mtop-5'>
                                            <div className='col-md-2'>
                                                <img src={trendImage}></img>
                                            </div>
                                            <div className='col-md-10'>
                                                <label className='text-percent'>#Handmade</label>
                                                <p className='text-secondary'>30 Posts</p>
                                            </div>
                                        </div>
                                        <div className='d-flex mtop-5'>
                                            <div className='col-md-2'>
                                                <img src={trendImage}></img>
                                            </div>
                                            <div className='col-md-10'>
                                                <label className='text-percent'>#WordPress</label>
                                                <p className='text-secondary'>80 Posts</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-12 chat-box removePadding mtop-10'>
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
        );
    }
}
