// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getUser, getUserIdsInChannels} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import MessagesHeader from './messages_header'
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
        const teammate = getUser(state, channel.teammate_id!);
        const currentTeam = getTeamByName(state,'crypter');

        const memberIds = getUserIdsInChannels(state);

        let membersCount = 0;
        if (memberIds && memberIds[channel.id]) {
            const groupMemberIds: Set<string> = memberIds[channel.id] as unknown as Set<string>;
            membersCount = groupMemberIds.size;
            if (groupMemberIds.has(currentUser.id)) {
                membersCount--;
            }
        }

        return {
            channel,
            membersCount,
            currentUser,
            teammate,
            currentTeam,
        };
    };
}

export default connect(makeMapStateToProps)(MessagesHeader);
