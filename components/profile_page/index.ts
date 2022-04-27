// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

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
import {GenericAction} from 'mattermost-redux/types/actions';
import {GlobalState} from 'types/store';

import ProfilPage from './profile_page'


type OwnProps = {
    userId: string;
}
function makeMapStateToProps() {
    const getCustomStatus = makeGetCustomStatus();

    return function mapStateToProps(state: GlobalState, ownprops: OwnProps) {
        console.log('OwnProps: ',ownprops.location.search);
        const userData = getCurrentUser(state);
        let currentUser;
        let userId;
        if(userData.id === ownprops.userId || ownprops.userId === '' || ownprops.userId === null || ownprops.userId === undefined){
            currentUser = userData
            userId = currentUser.id;
        }else{
            currentUser = getOhterUser(state,ownprops.userId);
            userId = currentUser.id;
        }

        console.log('State: ',state)
        console.log('Props: ', currentUser)
        const customStatus = getCustomStatus(state, userId);
        const isMilitaryTime = getBool(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.USE_MILITARY_TIME, false);
        const socialCount = Client4.getSocialCount(userId);
        const getPostList = Client4.getPosts('kqe4sihhdid47gprhk6dwbuc4o');
        //const getPostList = Client4.getPosts('dodurztr1fbupnpenjgxqjso3a');
        
        return {
            userId,
            userData,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            coverPhoto: Client4.getProfileCover(userId),
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

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            openModal,
            setStatus,
            unsetCustomStatus,
            setStatusDropdown,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ProfilPage);
