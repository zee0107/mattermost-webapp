// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getOhterUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';
import { acceptRequest, cancelRequest, followRequest, unfollow } from 'mattermost-redux/actions/posts';

import ForumBrowse from './forum_browse'
import { ModalData } from 'types/actions';
import { UserStatus } from 'mattermost-redux/types/users';
import { getChannelByName } from '../../packages/mattermost-redux/src/selectors/entities/channels';


type OwnProps = {
    userId: string;
    forumId: string;
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
        if(userData.id === ownprops.userId || ownprops.userId === '' || ownprops.userId === null || ownprops.userId === undefined){
            currentUser = userData
            userId = currentUser.id;
        }else{
            currentUser = getOhterUser(state,ownprops.userId);
            userId = ownprops.userId;
        }
        const post = Client4.getThread(ownprops.forumId);
        return {
            userId,
            userData,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
            post,
        };
    };
}
export default connect(makeMapStateToProps)(ForumBrowse);
