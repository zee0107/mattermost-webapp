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
import FileUploadOverlay from 'components/file_upload_overlay';

import homeImage from 'images/homeFeed.png';
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
import { RequestList, SocialCount } from 'mattermost-redux/types/crypto';
import { PostList } from 'mattermost-redux/types/posts';
import { post } from 'jquery';
import { profile } from 'console';
import { unreadFilterEnabled } from 'reducers/views/channel_sidebar';

type Props = {
    userId: string;
    profilePicture: string;
    userData: UserProfile;
    currentUser: UserProfile;
    view: string;
}

type State = {
    isDark: string;
};

export default class ProfilPage extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light'};
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
                text={'story'}
            />
        );
    }


    render= (): JSX.Element => {
        const {currentUser, profilePicture, userData, view} = this.props;
        let name;
        if(currentUser){
            if(currentUser.first_name !== ''){
                name = currentUser.first_name + ' ' + currentUser.last_name;
            }
            else{
                name = currentUser.username;
            }
        }

        let renderView;
        if(view === 'desktop'){
            renderView = (
                <div className='box-middle-panel mt-3'>
                    <div className='col-12 mx-auto'>
                        <div className='row'>
                            <div className='col-4 mt-2 mb-2'>
                                {this.renderProfilePicture('lg')}
                                {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt='' />*/}
                                <p><label><strong>{name}</strong></label><br/><small>{currentUser.position}</small></p>
                            </div>
                            <div className='col-2 mt-3 mb-2 text-center'><strong>0</strong></div>
                            <div className='col-2 text-center mt-3 mb-2'><strong>0</strong></div>
                            <div className='col-2 text-center mt-3 mb-2'><strong>0</strong></div>
                            <div className='col-2 text-center mt-3 mb-2'><strong>0</strong></div>
                        </div>
                    </div>
                </div>
            );
        }else{
            renderView = (
                <div className='box-middle-panel-select-forum'>
                    <div className='col-12 mx-auto'>
                        <div className='row'>
                            <div className='col-lg-12 mt-2 mb-2'>
                            {this.renderProfilePicture('lg')}
                            {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt=''/>*/}
                                <p><label><strong>{name}</strong></label><br/><small>{currentUser.position}</small></p>
                            </div>
                            <hr/>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Joined</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Last Visit</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Post Count</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Referrals</small></div>
                        </div>
                    </div> 
                </div>
            );
        }

        return (
            <>
                {renderView}
            </>
        );
    }
}
