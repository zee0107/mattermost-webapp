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
    view: string;
    membersCount: number;
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

    getIconGroup = () => {
        return (
            <div className='status status--group' style={{height: 50, width: 50, borderRadius: '50%', background: '#cccccc'}}><label className='pt-2'>{this.props.membersCount}</label></div>
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
                size={'xl'}
                status={teammate.is_bot ? '' : channel.status}
                wrapperClass='DirectChannel__profile-picture mb-2'
                newStatusIcon={true}
                statusClass={`DirectChannel__status-icon ${className} hide`}
            />
        );
    }

    render= (): JSX.Element => {
        const {channel,currentTeam,unreadMentions,unreadMessages,isUnread,teammateUsername,teammate,currentUser, view} = this.props;
        const {posts} = this.state;
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
        if(view === 'desktop'){
            if(channel.type === Constants.DM_CHANNEL){
                profilePic = this.getIcon();
            }
            else{
                location = '';
                profilePic = this.getIconGroup();
            }

            renderView = (
                <div className='right-chat-panel'>
                    <div className='row'>
                        <div className='col-8'>
                            <a className='position-relative float-start mt-3'>
                                {profilePic}
                                <span className='position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle'></span>
                            </a>
                            <p className='float-start text-wrap mt-3 name-of-user-position'>
                                <strong><label className='float-start ms-2 text-chat-title'>{displayName}</label></strong>
                                <small className='ms-2'>{location}</small>
                            </p>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown bg-transparent mt-1'>
                                <a className='float-end mt-3 ms-1 onVerticaldropdownmenu' id='onVerticaldropdownmenu' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-three-dots-vertical'></i></a>
                                <ul className='dropdown-menu' aria-labelledby='onVerticaldropdownmenu'>
                                    <li key={'deleteConverstaion-1'}>
                                        <a className='dropdown-item onDeleteconversations'>Delete conversation</a>
                                    </li>
                                    <li key={'settingsChat-1'}>
                                        <a className='dropdown-item onChatsettings' aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelaccounts' aria-controls='offcanvasRightLabelaccounts'>Settings</a>
                                    </li>
                                </ul>
                            </div>
                            <a className='float-end mt-3 ms-1 onVerticaldropdownmenu'><i className='bi-pin'></i></a>
                            <a className='float-end mt-3 ms-1 onSearchchatmessages'><i className='bi-search text-dark'></i></a>
                        </div>
                    </div>
                </div>
            );
        }else{
            renderView = (
                <div className='row'>
                    <div className='col-8'>
                        <form>
                            <div className='input-group'>
                                <span className='input-group-text bg-transparent border-1'><a className='onClosesearchchatconversation'></a></span>
                                    <input type='text' className='form-control search-show-style' aria-label='Search' placeholder='Search...' />
                                    <span className='input-group-text bg-transparent'>
                                    <a><i className='bi-chat-square-text text-dark'></i></a>
                                </span>
                            </div>
                        </form>
                    </div>
                    <div className='col-2 text-center mt-1'>
                        <a className='onVerticaldropdownmenu'><i className='bi-pin'></i></a>
                    </div>
                    <div className='col-2 text-center'>
                        <div className='dropdown bg-transparent mt-1'>
                            <a id='dropdownMenuChatAction' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-three-dots-vertical'></i></a>
                            <ul className='dropdown-menu' aria-labelledby='dropdownMenuChatAction'>
                                <li key={'deleteConverstaion'}>
                                    <a className='dropdown-item onDeleteconversations'>Delete conversation</a>
                                </li>
                                <li key={'settingsChat5'}>
                                    <a className='dropdown-item onChatsettings' aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelaccounts' aria-controls='offcanvasRightLabelaccounts'>Settings</a>
                                </li>
                            </ul>
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
