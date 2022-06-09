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
    posts: Promise<PostList>;
    channel: Channel;
    currentTeam: Team;
    currentUser: UserProfile;
    teammate?: UserProfile;
    unreadMentions: number;
    unreadMessages: number;
    isUnread: boolean;
    teammateUsername?: string;
    onChangeSelected: any;
    membersCount: number;
}

type State = {
    isDark: string;
    posts: PostList;
};

export default class MessagesDirect extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { isDark:'light'};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.posts){
            Promise.resolve(this.props.posts).then((value) => {this.setState({posts: value});});
        }
    }

    handleChangeSelected = (id: string) => {
        this.props.onChangeSelected(id);
    }

    getIconGroup = () => {
        return (
            <div className='status status--group' style={{height: 36, width: 36, borderRadius: '50%', background: '#cccccc'}}><label className='pt-2'>{this.props.membersCount}</label></div>
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
                size={'lg'}
                status={teammate.is_bot ? '' : channel.status}
                wrapperClass='DirectChannel__profile-picture mb-2'
                newStatusIcon={true}
                statusClass={`DirectChannel__status-icon ${className} hide`}
            />
        );
    }

    render= (): JSX.Element => {
        const {channel,unreadMessages,isUnread,teammateUsername,teammate,currentUser, view} = this.props;
        const {posts} = this.state;
        let displayName = channel.display_name;
        if(teammate && currentUser){
                if (currentUser.id === teammate.id) {
                    displayName = `${displayName} (you)`;
                }
        }

        let unreadNotif;
        if(isUnread){
            if(unreadMessages > 20){
                unreadNotif = (
                    <span className='badge rounded-pill bg-danger small'>20+</span>
                );
            }else{
                unreadNotif = (
                    <span className='badge rounded-pill bg-danger small'>{unreadMessages}</span>
                );
            }
        }
        let lastMessage;
        if(posts){
            lastMessage = (
                <>
                    {Object.keys(posts.posts).slice(0,1).map((item) => {
                        let message;
                        if(posts.posts[item].message === ''){
                            message = 'Sent a file.';
                        }else{
                            message = posts.posts[item].message.substring(0,30).toString();
                        }
                        return (
                            <small className='text-muted' key={posts.posts[item].id}>{message}</small>
                        );
                    })}
                </>
            );
        }else{
            lastMessage = (
                <small className='text-muted'>Send a message.</small>
            );
        }
        let renderView;
        if(channel.type === Constants.DM_CHANNEL){
            renderView = (
                <>
                    <a className='list-group-item list-group-item-action border-0 message-content text-dark' onClick={() => this.handleChangeSelected(channel.id)} aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#ChatDesktop' aria-controls='ChatDesktop'>
                        <div className='d-flex w-100 justify-content-between'>
                            <label className='mb-1'>{this.getIcon()} <strong>{displayName}</strong></label>
                            <label className='mt-3'>3 days ago</label>
                        </div>
                        <label className='mt-0'>{lastMessage}</label>
                    </a>
                    <label className='label-chat-list-1 text-dark'>
                        <a href='#' data-bs-toggle='collapse' data-bs-target='#collapseActions' aria-expanded='false' aria-controls='collapseActions'>
                        <i className='bi-three-dots float-end me-3'></i>
                        </a>
                    </label>
                    <div className='collapse text-dark' id='collapseActions'>
                        <p className='ms-3 mt-2 mb-0'><strong><a className='action-remove-msg-text'><i className='bi-archive'></i> Archive</a></strong></p>
                        <p className='ms-3 mt-2 mb-0'><strong><a className='action-remove-msg-text'><i className='bi-x-circle'></i> Delete message</a></strong></p>
                        <p className='ms-3 mt-2 mb-2'><strong><a className='action-remove-msg-text'><i className='bi-dash-square'></i> Block</a></strong></p>
                    </div>
                </>
                );
        }else{
            renderView = (
                <>
                    <a className='list-group-item list-group-item-action border-0 message-content text-dark' onClick={() => this.handleChangeSelected(channel.id)} aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#ChatDesktop' aria-controls='ChatDesktop'>
                        <div className='d-flex w-100 justify-content-between'>
                            <label className='mb-1'>{this.getIconGroup()} <strong>{displayName}</strong></label>
                            <label className='mt-3'>3 days ago</label>
                        </div>
                        <label className='mt-0'>{lastMessage}</label>
                    </a>
                    <label className='label-chat-list-1 text-dark'>
                        <a href='#' data-bs-toggle='collapse' data-bs-target='#collapseActions' aria-expanded='false' aria-controls='collapseActions'>
                        <i className='bi-three-dots float-end me-3'></i>
                        </a>
                    </label>
                    <div className='collapse text-dark' id='collapseActions'>
                        <p className='ms-3 mt-2 mb-0'><strong><a className='action-remove-msg-text'><i className='bi-archive'></i> Archive</a></strong></p>
                        <p className='ms-3 mt-2 mb-0'><strong><a className='action-remove-msg-text'><i className='bi-x-circle'></i> Delete message</a></strong></p>
                        <p className='ms-3 mt-2 mb-2'><strong><a className='action-remove-msg-text'><i className='bi-dash-square'></i> Block</a></strong></p>
                    </div>
                </>
            );
        }
        return (
            <>
                {renderView}
            </>
        );
    }
}
