// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getOhterUser} from 'mattermost-redux/selectors/entities/users';

import {GlobalState} from 'types/store';

import StoryView from './story_view'
import { mutestory } from 'mattermost-redux/actions/posts';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';


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
        
        const stories = Client4.viewSotries(userId);
        return {
            userId,
            userData,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
            stories,
        };
    };
}


function muteUser(userId: string, friendId: string) {
    return (dispatch: Dispatch) => {
        dispatch(mutestory(userId,friendId) as any);
    };
}

type Actions = {
    muteUser: (user_id: string, friend_id: string) => void;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<Actions>, Actions>({
            muteUser,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps,mapDispatchToProps)(StoryView);
