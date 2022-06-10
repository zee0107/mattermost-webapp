// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import CreatePost from 'components/create_post';
import { Team } from 'mattermost-redux/types/teams';
import { Channel, ChannelMembership, ServerChannel } from 'mattermost-redux/types/channels';
import Constants from 'utils/constants';
import { UserProfile } from 'mattermost-redux/types/users';
import {Client4} from 'mattermost-redux/client';
import ProfilePicture from 'components/profile_picture';
import { PostList } from 'mattermost-redux/types/posts';
import { object } from 'prop-types';
import { post } from 'jquery';

export type Props = {
    posts: Promise<PostList>;
    unreadCount: Promise<PostList>;
    channel: ServerChannel;
    teammate?: UserProfile;
    memberIds: Promise<ChannelMembership[]>;
    currentTeam: Team;
    currentUser: UserProfile;
    onChangeSelected: any;
}

type State = {
    isDark: string;
    posts: PostList;
    teammate: UserProfile;
    channel: ServerChannel;
    unreadCount: PostList;
    memberIds: ChannelMembership[];
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

        /*if(this.props.channel){
            Promise.resolve(this.props.channel).then((value) => {this.setState({channel: value});});
        }*/

        if(this.props.unreadCount){
            Promise.resolve(this.props.unreadCount).then((value) => {this.setState({unreadCount: value});});
        }

        if(this.props.memberIds){
            Promise.resolve(this.props.memberIds).then((value) => {this.setState({memberIds: value});});
        }
    }

    handleChangeSelected = (id: string) => {
        this.props.onChangeSelected(id);
    }

    getIconGroup = () => {
        const {memberIds} = this.state;
        let count;
        if(memberIds && memberIds.length){
            count = memberIds.length;
        }else{
            count = 0;
        }

        return (
            <div className='status status--group' style={{height: 36, width: 36, borderRadius: '50%', background: '#cccccc'}}><label className='pt-2'>{count}</label></div>
        );
    }

    getIcon = () => {
        const {channel,teammate} = this.props;

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
        const {currentUser,teammate,channel} = this.props;
        const {posts, unreadCount} = this.state;
        let displayName;

        if(channel){
            displayName = channel.display_name;
        }
        
        if(teammate && currentUser){
            if (currentUser.id === teammate.id) {
                displayName = `${displayName} (you)`;
            }
        }

        if(unreadCount){
            let unreadNotif;
            if(unreadCount.order.length > 20){
                unreadNotif = (
                    <span className='badge rounded-pill bg-danger small'>20+</span>
                );
            }else{
                unreadNotif = (
                    <span className='badge rounded-pill bg-danger small'>{unreadCount.order.length}</span>
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
        if(channel){
            if(channel.type === Constants.DM_CHANNEL){
                //const trimmedName = channel.name.replace(currentUser.id,'');
                //const id = trimmedName.replace('__','');
                //this.handleGetTeammate(id);
                if(teammate){
                    if(!displayName){
                        if(teammate.first_name){
                            displayName = teammate.first_name + ' ' + teammate.last_name;
                        }
                        else{
                            displayName = teammate.username;
                        }
                    }
                }
                renderView = (
                    <>
                        <a className='list-group-item list-group-item-action border-0 message-content text-dark' onClick={() => this.handleChangeSelected(channel.id)} aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#ChatNavbar' aria-controls='ChatNavbar'>
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
                        <a className='list-group-item list-group-item-action border-0 message-content text-dark' onClick={() => this.handleChangeSelected(channel.id)} aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#ChatNavbar' aria-controls='ChatNavbar'>
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
        }
        
        return (
            <>
                {renderView}
            </>
        );
    }
}
