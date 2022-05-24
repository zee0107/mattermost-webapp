// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getOhterUser} from 'mattermost-redux/selectors/entities/users';

import {GlobalState} from 'types/store';

import ArchiveStoryList from './archive_story_list'
import { unmutestory } from 'mattermost-redux/actions/posts';
import { ActionCreatorsMapObject, bindActionCreators, Dispatch } from 'redux';


type OwnProps = {
    userId: string;
}
function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState, ownprops: OwnProps) {
        if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }
        const userData = getCurrentUser(state);
        let currentUser;
        let userId;
        
        userId = ownprops.userId;

        if(userData.id === userId || userId === '' || userId === null || userId === undefined){
            currentUser = userData;
        }else{
            currentUser = getOhterUser(state,userId);
        }
        
        return {
            userId,
            userData,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
        };
    };
}

function unmuteUser(userId: string, friendId: string) {
    return (dispatch: Dispatch) => {
        dispatch(unmutestory(userId,friendId) as any);
    };
}

type Actions = {
    unmuteUser: (user_id: string, friend_id: string) => void;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<Actions>, Actions>({
            unmuteUser,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps,mapDispatchToProps)(ArchiveStoryList);
