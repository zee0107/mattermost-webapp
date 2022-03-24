// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {Route} from 'react-router-dom';
import classNames from 'classnames';
import {UserProfile} from 'mattermost-redux/types/users';
import AnnouncementBarController from 'components/announcement_bar';

import profPic from 'images/profiles/user-profile-1.png';
import postImage from 'images/post-1.png';
import postImage2 from 'images/post-image.png';
import postPic from 'images/profiles/user-profile-2.png';
import postPic2 from 'images/profiles/user-profile-3.png';

import Pluggable from 'plugins/pluggable';
import SystemNotice from 'components/system_notice';
import EditPostModal from 'components/edit_post_modal';

import ResetStatusModal from 'components/reset_status_modal';
import SidebarRight from 'components/sidebar_right';
import SidebarRightMenu from 'components/sidebar_right_menu';
import AppBar from 'components/app_bar/app_bar';
import Sidebar from 'components/sidebar';
import * as UserAgent from 'utils/user_agent';
import CenterChannel from 'components/channel_layout/center_channel';
import LoadingScreen from 'components/loading_screen';
import FaviconTitleHandler from 'components/favicon_title_handler';
import ProductNoticesModal from 'components/product_notices_modal';

interface Props {
    shouldShowAppBar: boolean;
    fetchingChannels: boolean;
    profilePicture: string;
    currentUser: UserProfile;
}

export default class ChannelController extends React.PureComponent<Props> {
    constructor(props: Props){
        super(props);
    }

    componentDidMount() {
        const platform = window.navigator.platform;

        document.body.classList.add('app__body', 'channel-view');

        // IE Detection
        if (UserAgent.isInternetExplorer() || UserAgent.isEdge()) {
            document.body.classList.add('browser--ie');
        }

        // OS Detection
        if (platform === 'Win32' || platform === 'Win64') {
            document.body.classList.add('os--windows');
        } else if (platform === 'MacIntel' || platform === 'MacPPC') {
            document.body.classList.add('os--mac');
        }
    }

    componentWillUnmount() {
        document.body.classList.remove('app__body', 'channel-view');
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {return null;}
        return (<Avatar size={size} url={this.props.profilePicture} />);
    }

    render() {
        const shouldShowAppBar = this.props.shouldShowAppBar;

        return (
            <div
                id='channel_view'
                className='channel-view'
            >
                <AnnouncementBarController/>
                <SystemNotice/>
                <FaviconTitleHandler/>
                <ProductNoticesModal/>
                <div className={classNames('container-fluid channel-view-inner', {'app-bar-enabled': shouldShowAppBar})}>
                    <SidebarRight/>
                    <SidebarRightMenu/>
                    <div className='col-md-12 bgGrey removePadding'>
                        <div className='row'>
                            <div className='col-md-2'>
                                <Sidebar/>
                            </div>
                            <div className='col-md-7'>
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
                                                <small className="firstname-title-story mt-5">Ann Isable</small>
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
                                                <a className='onAllstory'><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#fff" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                            </svg></a>
                                        </div>
                                    </div>
                                {!this.props.fetchingChannels && <Route component={CenterChannel}/>}
                                {this.props.fetchingChannels && <LoadingScreen/>}
                                <Pluggable pluggableName='Root'/>
                                <EditPostModal/>
                                <ResetStatusModal/>
                            </div>
                            <div className='col-md-3'>

                            </div>
                        </div>
                    </div>
                </div>
                <AppBar/>
            </div>
        );
    }
}
