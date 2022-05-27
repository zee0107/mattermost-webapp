// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {Client4} from 'mattermost-redux/client';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import CreatePage from './create_page'

function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState) {
        if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }
        const currentUser = getCurrentUser(state);

        const userId = currentUser?.id;
        return {
            userId,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
        };
    };
}

export default connect(makeMapStateToProps)(CreatePage);
