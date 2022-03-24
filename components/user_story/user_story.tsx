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

export default class UserStory extends React.PureComponent<Props, State> {
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
            <div className='col-md-12 chat-box mtop-10'>
                <div className='d-flex'>
                    <div className='col-md-2 mtop-10'>
                        <div className='position-absolute'>
                            <a href="#" className='onClickstory'>
                                {this.renderProfilePicture('xl')}
                            </a>
                        </div>
                        <div className='badges-online-plus rounded-circle onClickstory position-relative'><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#fff" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                        </svg></div>
                        <small className='firstname-title-story'>Your story</small>
                    </div>
                    <div className='col-md-2 mtop-10'>
                        <div className='position-absolute'>
                            <a href="#" className='onClickstory'>
                                <img className="Avatar Avatar-xl" src={profPic} alt="Username" title="Username"/>
                            </a>
                        </div>
                        <div className="badges-offline-plus rounded-circle position-relative"></div>
                        <small className="firstname-title-story mt-5">John Lloyd</small>
                    </div>
                    <div className='col-md-2 mtop-10'>
                        <div className='position-absolute'>
                            <a href="#" className='onClickstory'>
                            <img className="Avatar Avatar-xl" src={postPic} alt="Username" title="Username"/>
                            </a>
                        </div>
                        <div className="badges-offline-plus rounded-circle position-relative"></div>
                        <small className="firstname-title-story mt-5">Cody Fisher</small>
                    </div>
                    <div className='col-md-2 mtop-10'>
                        <div className='position-absolute'>
                            <a href="#" className='onClickstory'>
                                <img className="Avatar Avatar-xl" src={postPic2} alt="Username" title="Username"/>
                            </a>
                        </div>
                        <div className="badges-offline-plus rounded-circle position-relative"></div>
                        <small class="firstname-title-story mt-5">Ann Isable</small>
                    </div>
                    <div className='col-md-2 mtop-10'>
                        <div className='position-absolute'>
                            <a href="#" className='onClickstory'>
                                <img className="Avatar Avatar-xl" src={postImage} alt="Username" title="Username"/>
                            </a>
                        </div>
                        <div className="badges-offline-plus rounded-circle position-relative"></div>
                        <small className="firstname-title-story mt-5">Jade sue</small>
                    </div>
                    <div className='col-md-2 mtop-10'>
                        <div className='position-absolute'>
                            <a href="#" className='onClickstory'>
                                <img className="Avatar Avatar-xl" src={postImage2} alt="Username" title="Username"/>
                            </a>
                        </div>
                        <div className="badges-offline-plus rounded-circle position-relative"></div>
                        <small className="firstname-title-story mt-5">Mig Yu</small>
                    </div>
                    <div className="next-arrow-story">
                        <a className="onAllstory"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#fff" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg></a>
                    </div>
                </div>
            </div>
        );
    }
}
