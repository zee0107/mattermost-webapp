// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {Client4} from 'mattermost-redux/client';

import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {GlobalState} from 'types/store';
import { getTeamByName } from 'mattermost-redux/selectors/entities/teams';

import MessageList from './message_list'

function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState) {
        console.log(state);
        if(!state.entities.teams.teams && !state.entities.teams.teams.length){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }
        const currentUser = getCurrentUser(state);
        const userId = currentUser?.id;
        
        const team = getTeamByName(state,'crypter');
        const categories = Client4.getChannelCategories('me',team?.id);
        return {
            categories,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
        };
    };
}


export default connect(makeMapStateToProps)(MessageList);
