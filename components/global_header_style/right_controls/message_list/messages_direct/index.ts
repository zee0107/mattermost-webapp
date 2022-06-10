// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getUser, getUserIdsInChannels} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import MessagesDirect from './messages_direct'
import { getTeamByName } from 'mattermost-redux/selectors/entities/teams';
import { makeGetChannel, makeGetChannelUnreadCount } from 'mattermost-redux/selectors/entities/channels';
import { ServerChannel } from 'mattermost-redux/types/channels';
import { UserProfile } from 'mattermost-redux/types/users';

type OwnProps = {
    channelId: string;
    channel: ServerChannel;
    teammate: UserProfile;
}

function makeMapStateToProps() {
    const getUnreadCount = makeGetChannelUnreadCount();
    let resultValue;
    const getChannel = (result: ServerChannel) => {resultValue = result};
    return function mapStateToProps(state: GlobalState, ownProps: OwnProps) {
        if(!state.entities.teams.teams && !state.entities.teams.teams.length){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }  
        const currentUser = getCurrentUser(state);
        const channel = Client4.getChannel(ownProps.channelId);
        Promise.resolve(channel).then(data => { getChannel(data); });
        const channelVale = resultValue; 
        console.log(channelVale);

        const unreadCount = Client4.getPostsUnread(ownProps.channelId, currentUser.id);
        const currentTeam = getTeamByName(state, 'crypter');
        const posts = Client4.getPosts(ownProps.channelId);
        const memberIds = Client4.getChannelMembers(ownProps.channelId);

        return {
            channel,
            posts,
            unreadCount,
            memberIds,
            currentUser,
            currentTeam,
        };
    };
}

export default connect(makeMapStateToProps)(MessagesDirect);
