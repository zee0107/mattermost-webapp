// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';

import {setStatus, unsetCustomStatus} from 'mattermost-redux/actions/users';
import {Client4} from 'mattermost-redux/client';
import {Preferences} from 'mattermost-redux/constants';

import {get, getBool} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';

import {openModal} from 'actions/views/modals';
import {setStatusDropdown} from 'actions/views/status_dropdown';
import {getIsRhsOpen, getIsRhsMenuOpen} from 'selectors/rhs';
import {getIsLhsOpen} from 'selectors/lhs';
import {getCurrentUserTimezone} from 'selectors/general';
import {makeGetCustomStatus, isCustomStatusEnabled, showStatusDropdownPulsatingDot, isCustomStatusExpired} from 'selectors/views/custom_status';
import {isStatusDropdownOpen} from 'selectors/views/status_dropdown';
import {GenericAction} from 'mattermost-redux/types/actions';
import {GlobalState} from 'types/store';

import ViewStory from './view_story'
import { updateSetting } from 'mattermost-redux/actions/posts';

type ownProps = {
    userId: string;
}
function makeMapStateToProps() {
    const getCustomStatus = makeGetCustomStatus();

    return function mapStateToProps(state: GlobalState, ownprops: ownProps) {
        const currentUser = getCurrentUser(state);
        const searchParam = ownprops.location.search.replace('?i=','');
        const selected = searchParam;
        const userId = currentUser?.id;
        const storyList = Client4.listSotries(userId);
        const customStatus = getCustomStatus(state, userId);
        const isMilitaryTime = getBool(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.USE_MILITARY_TIME, false);
        const userSettings = Client4.userSettings(userId);
        const mutedStories = Client4.mutedStories(userId);
        
        return {
            userId,
            selected,
            autoResetPref: get(state, Preferences.CATEGORY_AUTO_RESET_MANUAL_STATUS, userId, ''),
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            status: getStatusForUserId(state, userId),
            mutedStories,
            storyList,
            customStatus,
            userSettings,
            currentUser,
            isCustomStatusEnabled: isCustomStatusEnabled(state),
            isCustomStatusExpired: isCustomStatusExpired(state, customStatus),
            isMilitaryTime,
            isStatusDropdownOpen: isStatusDropdownOpen(state),
            showCustomStatusPulsatingDot: showStatusDropdownPulsatingDot(state),
            timezone: getCurrentUserTimezone(state),
        };
    };
}

function updateSettings(userId: string, privacy:string,archive: boolean,mode:boolean) {
    return (dispatch: Dispatch) => {
        dispatch(updateSetting(userId,privacy,archive,mode) as any);
    };
}

type Actions = {
    updateSettings: (userId: string, privacy:string,archive: boolean,mode:boolean) => void;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<Actions>, Actions>({
            updateSettings,
        }, dispatch),
    };
}


export default connect(makeMapStateToProps, mapDispatchToProps)(ViewStory);
