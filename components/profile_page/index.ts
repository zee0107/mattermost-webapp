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

import ProfilPage from './profile_page'
import { ModalData } from 'types/actions';
import { UserStatus } from 'mattermost-redux/types/users';
import { getChannelByName } from '../../packages/mattermost-redux/src/selectors/entities/channels';
import { getTeamByName } from 'mattermost-redux/selectors/entities/teams';


type OwnProps = {
    userId: string;
}
function makeMapStateToProps() {
    const getCustomStatus = makeGetCustomStatus();

    return function mapStateToProps(state: GlobalState, ownprops: OwnProps) {
        if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }
        const channel = getChannelByName(state,'town-square');
        const searchParam = ownprops.location.search.replace('?u=','');
        const userData = getCurrentUser(state);
        let currentUser;
        let userId;
        let followData;
        if(userData.id === searchParam || searchParam === '' || searchParam === null || searchParam === undefined){
            currentUser = userData
            userId = currentUser.id;
            followData = null;
        }else{
            currentUser = getOhterUser(state,searchParam);
            userId = searchParam;
            followData  = Client4.getFollowDetail(userData.id,userId);
        }

        
        const customStatus = getCustomStatus(state, userId);
        const isMilitaryTime = getBool(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.USE_MILITARY_TIME, false);
        const socialCount = Client4.getSocialCount(userId);
        const getPostList = Client4.getPosts(channel?.id);

        const team = getTeamByName(state,'crypter');
        const categories = Client4.getChannelCategories('me',team?.id);
        
        return {
            userId,
            categories,
            userData,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            profilePictureLoggedin: Client4.getProfilePictureUrl(userData.id, userData?.last_picture_update),
            coverPhoto: Client4.getProfileCover(userId),
            followData,
            autoResetPref: get(state, Preferences.CATEGORY_AUTO_RESET_MANUAL_STATUS, userId, ''),
            status: getStatusForUserId(state, userId),
            customStatus,
            currentUser,
            socialCount,
            getPostList,
            isCustomStatusEnabled: isCustomStatusEnabled(state),
            isCustomStatusExpired: isCustomStatusExpired(state, customStatus),
            isMilitaryTime,
            isStatusDropdownOpen: isStatusDropdownOpen(state),
            showCustomStatusPulsatingDot: showStatusDropdownPulsatingDot(state),
            timezone: getCurrentUserTimezone(state),
            lhsOpen: getIsLhsOpen(state),
            rhsOpen: getIsRhsOpen(state),
            rhsMenuOpen: getIsRhsMenuOpen(state),
        };
    };
}

function onFollowRequest(user_id: string, friend_id: string) {
    return (dispatch: Dispatch) => {
        dispatch(followRequest(user_id, friend_id) as any);
    };
}

function onAcceptRequest(request_id: string) {
    return (dispatch: Dispatch) => {
        dispatch(acceptRequest(request_id) as any);
    };
}

function onCancelRequest(request_id: string) {
    return (dispatch: Dispatch) => {
        dispatch(cancelRequest(request_id) as any);
    };
}

function onUnfollowUser(user_id: string, friend_id: string) {
    return (dispatch: Dispatch) => {
        dispatch(unfollow(user_id, friend_id) as any);
    };
}

type Actions = {
    openModal: <P>(modalData: ModalData<P>) => void;
    setStatus: (status: UserStatus) => ActionFunc;
    onFollowRequest: (user_id: string, friend_id: string) => void;
    onAcceptRequest: (request_id: string) => void;
    onUnfollowUser: (user_id: string, friend_id: string) => void;
    onCancelRequest: (request_id: string) => void;
    unsetCustomStatus: () => ActionFunc;
    setStatusDropdown: (open: boolean) => void;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<Actions>, Actions>({
            openModal,
            setStatus,
            onFollowRequest,
            onAcceptRequest,
            onUnfollowUser,
            onCancelRequest,
            unsetCustomStatus,
            setStatusDropdown,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ProfilPage);
