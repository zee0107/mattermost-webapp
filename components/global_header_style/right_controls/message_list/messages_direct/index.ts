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

/*function channelValue(channelId){
    return new Promise((resolve,reject) => {
        const value = Client4.getChannel(channelId);
        value.then(data => {
            resolve(data);
        }).catch(reject)
    });
}*/

async function channelValue(channelId) : ServerChannel{
    const value = await Client4.getChannel(channelId);
    return value;
}

async function getTeammate(teammateid) : UserProfile{
    const value = await Client4.getUser(channelId);
    return value;
}
function makeMapStateToProps() {
    const getChannel = channelValue();
    const getMate = getTeammate();
    const getUnreadCount = makeGetChannelUnreadCount();


    return function mapStateToProps(state: GlobalState, ownProps: OwnProps) {
        if(!state.entities.teams.teams && !state.entities.teams.teams.length){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }  
        const currentUser = getCurrentUser(state);
        const channel = getChannel(ownProps.channelId);
        const teammate = getMate(channel.teammate_id);
        //const unreadCount = Client4.getPostsUnread(ownProps.channelId, currentUser.id);
        const currentTeam = getTeamByName(state, 'crypter');
        const posts = Client4.getPosts(ownProps.channelId);

        const memberIds = Client4.getChannelMembers(ownProps.channelId);

        let membersCount = 0;

        if (memberIds) {
            Promise.resolve(memberIds).then((data) => {
                const groupMemberIds: Set<string> = data[channel.id] as unknown as Set<string>;
                membersCount = groupMemberIds.size;
                if (groupMemberIds.has(currentUser.id)) {
                    membersCount--;
                }
            });
        }

        return {
            channel,
            posts,
            membersCount,
            currentUser,
            teammate,
            unreadMentions: 0,
            unreadMessages: 0,
            isUnread: false,
            currentTeam,
        };
    };
}

export default connect(makeMapStateToProps)(MessagesDirect);
