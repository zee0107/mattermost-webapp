// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {getChannel} from 'mattermost-redux/selectors/entities/channels';
import {getUser} from 'mattermost-redux/selectors/entities/users';
import {getTeamByName, getTeamMemberships} from 'mattermost-redux/selectors/entities/teams';

import {Constants} from 'utils/constants';

import PostView from './post_view.jsx';

export const isChannelLoading = (params, channel, team, teammate, teamMemberships) => {
    console.log(params);
    if (params.postid) {
        return false;
    }

    if (channel && team) {
        if (channel.type !== Constants.DM_CHANNEL && channel.name !== params.identifier) {
            return true;
        } else if (channel.type === Constants.DM_CHANNEL && teammate && params.identifier !== `@${teammate.username}`) {
            return true;
        }

        const teamId = team.id;
        if ((channel.team_id && channel.team_id !== teamId) || (teamMemberships && !teamMemberships[teamId])) {
            return true;
        }

        return false;
    }

    return true;
};

function makeMapStateToProps() {
    return function mapStateToProps(state, ownProps) {
        if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }
        console.log(state);
        ownProps.match.params.team = 'crypter';
        ownProps.match.params.path = 'messages';
        
        const team = getTeamByName(state, ownProps.match.params.team);
        let teammate;
        const channel = getChannel(state, ownProps.channelId);
        let lastViewedAt = state.views.channel.lastChannelViewTime[ownProps.channelId];
        if (channel) {
            if (channel.type === Constants.DM_CHANNEL && channel.teammate_id) {
                teammate = getUser(state, channel.teammate_id);
                console.log(true);
            }
            ownProps.match.params.identifier = channel.name;
            lastViewedAt = channel.last_post_at ? lastViewedAt : channel.last_post_at;
        }

        const teamMemberships = getTeamMemberships(state);
        const channelLoading = isChannelLoading(ownProps.match.params, channel, team, teammate, teamMemberships);
        return {
            lastViewedAt,
            channelLoading,
        };
    };
}

export default withRouter(connect(makeMapStateToProps)(PostView));
