// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import MessagesDirect from './messages_direct'
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
        const unreadCount = getUnreadCount(state, channel.id);
        const teammate = getUser(state, channel.teammate_id!);
        const currentTeam = getTeamByName(state,'crypter');
        const posts = Client4.getPosts(channel.id);
        const lastPostAt = channel.last_post_at !== 0 ? channel.last_post_at : channel.create_at;

        return {
            channel,
            lastPostAt,
            posts,
            currentUser,
            teammate,
            unreadMentions: unreadCount.mentions,
            unreadMessages: unreadCount.messages,
            isUnread: unreadCount.showUnread,
            currentTeam,
        };
    };
}

export default connect(makeMapStateToProps)(MessagesDirect);
