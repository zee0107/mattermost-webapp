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
    let undreadPost;
    let teamMate;
    const getChannel = (result: ServerChannel) => {resultValue = result};
    const getTeamMate = (result: UserProfile) => {teamMate = result};

    return function mapStateToProps(state: GlobalState, ownProps: OwnProps) {
        if(!state.entities.teams.teams && !state.entities.teams.teams.length){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }  
        const currentUser = getCurrentUser(state);

        const channelVal = Client4.getChannel(ownProps.channelId);
        Promise.resolve(channelVal).then(data => { getChannel(data); });
        const channel = resultValue; 

        if(channel){
            const trimmedName = channel.name.replace(currentUser.id,'');
            const id = trimmedName.replace('__','');
            const teamValue = Client4.getUser(id);
            Promise.resolve(teamValue).then(data => { getTeamMate(data); });
        }
        const teammate = teamMate;

        const unreadCount = Client4.getPostsUnread(ownProps.channelId, currentUser.id);
        const currentTeam = getTeamByName(state, 'crypter');
        const posts = Client4.getPosts(ownProps.channelId);
        const memberIds = Client4.getChannelMembers(ownProps.channelId);

        return {
            channel,
            posts,
            teammate,
            unreadCount,
            memberIds,
            currentUser,
            currentTeam,
        };
    };
}

export default connect(makeMapStateToProps)(MessagesDirect);
