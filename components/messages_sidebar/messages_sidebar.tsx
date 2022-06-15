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
    lastPostAt: number;
    channel: Channel;
    currentTeam: Team;
    currentUser: UserProfile;
    teammate?: UserProfile;
    unreadMentions: number;
    unreadMessages: number;
    isUnread: boolean;
    teammateUsername?: string;
    view: string;
    onChangeSelected: any;
    onMobileView: any;
    extraClass: string;
}

type State = {
    isDark: string;
    posts: PostList;
};

export default class MessagesSidebar extends React.PureComponent<Props, State> {
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
        this.props.onMobileView('messages');
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
        const {channel,currentTeam,unreadMentions,unreadMessages,isUnread,teammateUsername,teammate,currentUser, view, lastPostAt} = this.props;
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
                    <span className='badge rounded-pill bg-danger'>20+</span>
                );
            }else{
                unreadNotif = (
                    <span className='badge rounded-pill bg-danger'>{unreadMessages}</span>
                );
            }
        }

        let timeLastPost;
        var date = new Date(lastPostAt * 1000);
        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        timeLastPost = hours.substring(-2) + ':' + minutes.substring(-2);
        let lastMessage;
        if(posts){
            lastMessage = (
                <>
                    {Object.keys(posts.posts).map((item) => {
                        let message;
                        if (lastPostAt === posts.posts[item].create_at) {
                            if(posts.posts[item].message !== ''){
                                message = posts.posts[item].message.substring(0,30).toString();
                            }else{
                                message = 'Sent a file.';
                            }
                            return (
                                <small className='text-muted' key={posts.posts[item].id}>{message}</small>
                            );
                        }
                    })}
                </>
            );
        }else{
            lastMessage = (
                <small className='text-muted'>Send a message.</small>
            );
        }
        let DirectMessageDesktop;
        let DirectMessageMobile;
        if(channel.type === Constants.DM_CHANNEL){
                DirectMessageDesktop = (
                    <a className='onChatus text-dark' onClick={() => this.handleChangeSelected(channel.id)}>
                        <div className={`row hoverRow ${this.props.extraClass}`}>
                            <div className='col-2 text-center p-1 mt-1'>
                                {this.getIcon()}
                            </div>
                            <div className='col-lg-8 mt-2'><strong><label>{displayName}</label></strong><br/>{lastMessage}</div>
                            <div className='col-2 text-start p-2'>
                                <small>12:04</small>
                                {unreadNotif}
                            </div>
                        </div>
                    </a>
                );

                DirectMessageMobile = (
                    <div className='row' onClick={() => this.handleChangeSelected(channel.id) }>
                        <div className='col-2 p-1'>
                            {this.getIcon()}
                        </div>
                        <div className='col-8 mt-2'>
                            <strong><label>{displayName}</label></strong>
                            <br />
                            {lastMessage}
                        </div>      
                        <div className='col-2 text-end mt-4'>
                            <small>{timeLastPost}</small>
                            {unreadNotif}
                        </div>
                    </div>
                );
        }

        let renderView;
        if(view === 'desktop'){
                renderView = DirectMessageDesktop;
        }else{
                renderView = DirectMessageMobile;
        }

        return (
            <>
                {renderView}
            </>
        );
    }
}
