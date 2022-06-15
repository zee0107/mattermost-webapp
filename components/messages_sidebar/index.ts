// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import MessagesSidebar from './messages_sidebar'
import { getTeamByName } from 'mattermost-redux/selectors/entities/teams';
import { getChannelByName, makeGetChannel, makeGetChannelUnreadCount } from 'mattermost-redux/selectors/entities/channels';

type OwnProps = {
    channelId: string;
}

function makeMapStateToProps() {
    const getChannel = makeGetChannel();
    const getUnreadCount = makeGetChannelUnreadCount();

    return function mapStateToProps(state: GlobalState, ownProps: OwnProps) {
        if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }  
        
        const currentUser = getCurrentUser(state);
        const channel = getChannel(state,{id: ownProps.channelId});
        const currentTeam = getTeamByName(state,'crypter');
        console.log(channel);
        
        let unreadCount;
        let teammate;
        let posts;

        if(channel && channel.id){
            unreadCount = getUnreadCount(state, channel.id)
            teammate = getUser(state, channel.teammate_id!)
            posts = Client4.getPosts(channel.id);
        }

        let unreadMentions;
        let unreadMessages;
        let isUnread;
        if(unreadCount){
            unreadMentions= unreadCount.mentions;
            unreadMessages= unreadCount.messages;
            isUnread= unreadCount.showUnread;
        }else{
            unreadMentions= 0;
            unreadMessages= 0;
            isUnread= false;
        }
        
        return {
            channel,
            posts,
            currentUser,
            teammate,
            unreadMentions,
            unreadMessages,
            isUnread,
            currentTeam,
        };
    };
}

export default connect(makeMapStateToProps)(MessagesSidebar);
