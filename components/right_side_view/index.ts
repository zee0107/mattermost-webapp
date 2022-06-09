// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {Client4} from 'mattermost-redux/client';

import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {GlobalState} from 'types/store';
import { getTeamByName } from 'mattermost-redux/selectors/entities/teams';

import RightSideView from './right_side_view'
import { getChannelByName } from 'mattermost-redux/selectors/entities/channels';

function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState) {
        if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }

        const currentUser = getCurrentUser(state);
        const socialCount = Client4.getSocialCount(currentUser.id);
        const channel = getChannelByName(state,'town-square');
        const getPostList = Client4.getPosts(channel?.id);
        //Local Server
        //const getPostList = Client4.getPosts('kqe4sihhdid47gprhk6dwbuc4o');

        //Live Server
        //const getPostList = Client4.getPosts('dodurztr1fbupnpenjgxqjso3a');
        const userId = currentUser?.id;
        
        const team = getTeamByName(state,'crypter');
        const categories = Client4.getChannelCategories('me',team?.id);
        return {
            categories,
            focusedPostId: state.views.channel.focusedPostId,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            socialCount,
            getPostList,
            currentUser,
        };
    };
}


export default connect(makeMapStateToProps)(RightSideView);
