// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {Route} from 'react-router-dom';
import classNames from 'classnames';
import AnnouncementBarController from 'components/announcement_bar';

import Pluggable from 'plugins/pluggable';
import SystemNotice from 'components/system_notice';
import EditPostModal from 'components/edit_post_modal';
import UserStory from 'components/user_story/user_story';
import ImgIcon from 'images/profiles/image.svg';
import LayoutIcon from 'images/profiles/columns-gap.svg';
import MusicIcon from 'images/profiles/music-note-beamed.svg';
import VideoIcon from 'images/profiles/camera-video.svg';
import GeoIcon from 'images/profiles/geo-alt.svg';
import AttachIcon from 'images/profiles/paperclip.svg';
import SplitIcon from 'images/profiles/menu-icon.svg';

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
                            <div className='col-md-2 removePadding'>
                                <Sidebar/>
                            </div>
                            <div className='col-md-10 removePadding'>
                                <div className='col-md-12 removePadding'>
                                    {!this.props.fetchingChannels && <Route component={CenterChannel}/>}
                                    {this.props.fetchingChannels && <LoadingScreen/>}
                                    <Pluggable pluggableName='Root'/>
                                    <EditPostModal/>
                                    <ResetStatusModal/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AppBar/>
            </div>
        );
    }
}
