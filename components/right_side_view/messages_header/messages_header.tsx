// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import CreatePost from 'components/create_post';
import { Team } from 'mattermost-redux/types/teams';
import { Channel } from 'mattermost-redux/types/channels';
import Constants from 'utils/constants';
import UserProfile from 'components/user_profile/user_profile';
import {Client4} from 'mattermost-redux/client';
import ProfilePicture from 'components/profile_picture';
import { PostList } from 'mattermost-redux/types/posts';
import { object } from 'prop-types';

export type Props = {
    channel: Channel;
    currentTeam: Team;
    currentUser: UserProfile;
    teammate?: UserProfile;
    teammateUsername?: string;
    membersCount: number;
    onChangeSelected: any;
}

type State = {
    isDark: string;
    posts: PostList;
};

export default class MessagesHeader extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { isDark:'light'};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
    }

    handleChangeSelected = (id: string) => {
        this.props.onChangeSelected(id);
    }
    getIconGroup = () => {
        return (
            <div className='status status--group' style={{height: 25, width: 25, borderRadius: '50%', background: '#cccccc'}}><label className='pt-2'>{this.props.membersCount}</label></div>
        );
    }

    getIcon = () => {
        const {channel, teammate} = this.props;

        if (!teammate) {
            return null;
        }

        if (teammate.id && teammate.delete_at) {
            return (
                <i className='icon icon-archive-outline'/>
            );
        }

        let className = '';
        if (channel.status === 'online') {
            className = 'status-online';
        } else if (channel.status === 'away') {
            className = 'status-away';
        } else if (channel.status === 'dnd') {
            className = 'status-dnd';
        }else{
            className = 'status-away';
        }

        return (
            <ProfilePicture
                src={Client4.getProfilePictureUrl(teammate.id, teammate.last_picture_update)}
                size={'sm'}
                status={teammate.is_bot ? '' : channel.status}
                wrapperClass='DirectChannel__profile-picture mb-2'
                newStatusIcon={true}
                statusClass={`DirectChannel__status-icon ${className} hide`}
            />
        );
    }

    render= (): JSX.Element => {
        const {channel,teammate,currentUser, view} = this.props;
        let displayName = channel.display_name;
        let location;
        if(teammate && currentUser){
            if (currentUser.id === teammate.id) {
                displayName = `${displayName} (you)`;
                location = currentUser.position;
            }
            else{
                location = teammate.position;
            }
        }

        let renderView;
        let profilePic;

        if(channel.type === Constants.DM_CHANNEL){
            profilePic = this.getIcon();
        }
        else{
            location = '';
            profilePic = this.getIconGroup();
        }
        
        renderView = (
            <>
                <h6 className='offcanvas-title' id='offcanvasBottomreadychatdesktop'>{profilePic} {displayName}</h6>
                <a onClick={() => this.handleChangeSelected('')} className='text-reset' aria-label='Close' data-bs-dismiss='offcanvas'><i className='bi-list-nested'></i></a>
            </>
        );

        return (
            <>
                {renderView}
            </>
        );
    }
}
