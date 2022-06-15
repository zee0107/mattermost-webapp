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
    lastPostAt: number;
    currentUser: UserProfile;
    teammate?: UserProfile;
    unreadMentions: number;
    unreadMessages: number;
    isUnread: boolean;
    teammateUsername?: string;
    membersCount: number;
    onChangeSelected: any;
}

type State = {
    isDark: string;
    posts: PostList;
};

export default class MessagesGroup extends React.PureComponent<Props, State> {
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
        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
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
        let renderView;
        if(channel.type === Constants.GM_CHANNEL){
            renderView = (
                <div className='col-lg-12 removePadding' onClick={() => this.handleChangeSelected(channel.id)} aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#ChatDesktop' aria-controls='ChatDesktop'>
                    <div className='row chat-hover'>
                        <div className='col-2 text-center p-1 mt-1'>
                            {this.getIcon()}
                        </div>
                        <div className='col-8 mt-2'>
                            <strong><label>{displayName}</label></strong><br/>{lastMessage}
                        </div>
                        <div className='col-2 text-start p-2'>
                                <small>{timeLastPost}</small>
                                {unreadNotif}
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
