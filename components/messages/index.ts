// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import Messages from './messages'
import { getTeamByName } from 'mattermost-redux/selectors/entities/teams';


function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState) {
        if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }

        const currentUser = getCurrentUser(state);
        const userId = currentUser?.id
        const team = getTeamByName(state,'crypter');
        const categories = Client4.getChannelCategories('me',team?.id);
        return {
            categories,
            userId,
            focusedPostId: state.views.channel.focusedPostId,
            currentUser,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
        };
    };
}

export default connect(makeMapStateToProps)(Messages);
