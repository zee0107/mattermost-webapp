// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';

import {setStatus, unsetCustomStatus} from 'mattermost-redux/actions/users';
import {Client4} from 'mattermost-redux/client';
import {Preferences} from 'mattermost-redux/constants';

import {get, getBool} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser, getStatusForUserId, getOhterUser} from 'mattermost-redux/selectors/entities/users';

import {openModal} from 'actions/views/modals';
import {setStatusDropdown} from 'actions/views/status_dropdown';
import {getIsRhsOpen, getIsRhsMenuOpen} from 'selectors/rhs';
import {getIsLhsOpen} from 'selectors/lhs';
import {getCurrentUserTimezone} from 'selectors/general';
import {makeGetCustomStatus, isCustomStatusEnabled, showStatusDropdownPulsatingDot, isCustomStatusExpired} from 'selectors/views/custom_status';
import {isStatusDropdownOpen} from 'selectors/views/status_dropdown';
import {ActionFunc, GenericAction} from 'mattermost-redux/types/actions';
import {GlobalState} from 'types/store';
import { acceptRequest, cancelRequest, followRequest, unfollow } from 'mattermost-redux/actions/posts';

import ForumMember from './forum_member'
import { ModalData } from 'types/actions';
import { UserStatus } from 'mattermost-redux/types/users';
import { getChannelByName } from '../../packages/mattermost-redux/src/selectors/entities/channels';


type OwnProps = {
    userId: string;
}
function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState, ownprops: OwnProps) {
        if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }
        const channel = getChannelByName(state,'town-square');
        const userData = getCurrentUser(state);
        let currentUser;
        let userId;
        let followData;
        if(userData.id === ownprops.userId || ownprops.userId === '' || ownprops.userId === null || ownprops.userId === undefined){
            currentUser = userData
            userId = currentUser.id;
        }else{
            currentUser = getOhterUser(state,ownprops.userId);
            userId = ownprops.userId;
        }
        
        return {
            userId,
            userData,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
        };
    };
}
export default connect(makeMapStateToProps)(ForumMember);
