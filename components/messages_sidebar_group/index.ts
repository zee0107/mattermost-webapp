// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getUser, getUserIdsInChannels} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import MessagesSidebarGroup from './messages_sidebar_group'
import { getTeamByName } from 'mattermost-redux/selectors/entities/teams';
import { makeGetChannel, makeGetChannelUnreadCount } from 'mattermost-redux/selectors/entities/channels';

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
        let membersCount = 0;
        let lastPostAt;
        if(channel && channel.id){
            unreadCount = getUnreadCount(state, channel.id)
            teammate = getUser(state, channel.teammate_id!)
            posts = Client4.getPosts(channel.id);
            lastPostAt = channel.last_post_at !== 0 ? channel.last_post_at : channel.create_at;
            const memberIds = getUserIdsInChannels(state);
            if (memberIds && memberIds[channel.id]) {
                const groupMemberIds: Set<string> = memberIds[channel.id] as unknown as Set<string>;
                membersCount = groupMemberIds.size;
                if (groupMemberIds.has(currentUser.id)) {
                    membersCount--;
                }
            }
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
            lastPostAt,
            posts,
            membersCount,
            currentUser,
            teammate,
            unreadMentions,
            unreadMessages,
            isUnread,
            currentTeam,
        };
    };
}

export default connect(makeMapStateToProps)(MessagesSidebarGroup);
