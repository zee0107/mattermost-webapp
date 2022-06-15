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
    membersCount: number;
    view: string;
    onChangeSelected: any;
    onMobileView: any;
    extraClass: string;
    lastPostAt: number;
}

type State = {
    isDark: string;
    posts: PostList;
};

export default class MessagesSidebarGroup extends React.PureComponent<Props, State> {
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
        return (
            <div className='status status--group' style={{height: 36, width: 36, borderRadius: '50%', background: '#cccccc'}}><label className='pt-2'>{this.props.membersCount}</label></div>
        );
    }

    render= (): JSX.Element => {
        const {channel,currentTeam,unreadMentions,unreadMessages,isUnread,teammateUsername,teammate,currentUser, view, lastPostAt} = this.props;
        const {posts} = this.state;
        let displayName = channel.display_name;

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
        var hours = '0' + date.getHours();
        var minutes = '0' + date.getMinutes();
        timeLastPost = hours.slice(-2) + ':' + minutes.slice(-2);

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
        let GroupMessageDesktop;
        let GroupMessageMobile;
        if(channel.type === Constants.GM_CHANNEL){
            GroupMessageDesktop = (
                <a className='onChatus text-dark' onClick={() => this.handleChangeSelected(channel.id)}>
                    <div className={`row hoverRow ${this.props.extraClass}`}>
                        <div className='col-2 text-center p-1 mt-1'>
                            {this.getIcon()}
                        </div>
                        <div className='col-lg-8 mt-2'>
                            <strong><label>{displayName}</label></strong><br/><small className='text-muted'>{lastMessage}</small>
                            </div>
                            <div className='col-2 text-start p-2'>
                            <small>{timeLastPost}</small>
                            {unreadNotif}
                        </div>
                    </div>
                </a>
            );

            GroupMessageMobile = (
                <div className='row' onClick={() => this.handleChangeSelected(channel.id)}>
                    <div className='col-2 text-center p-1 mt-1'>
                        {this.getIcon()}
                    </div>
                    <div className='col-8 mt-2'>
                        <strong><label>{displayName}</label></strong>
                        <br/>
                        <small className='text-muted'>{lastMessage}</small>
                    </div>
                    <div className='col-2 text-start p-2'>
                        <small>{timeLastPost}</small>
                        {unreadNotif}
                    </div>
                </div>
            );
        }

        let renderView;
        if(view === 'desktop'){
                renderView = GroupMessageDesktop;
        }else{
                renderView = GroupMessageMobile;
        }

        return (
            <>
                {renderView}
            </>
        );
    }
}
