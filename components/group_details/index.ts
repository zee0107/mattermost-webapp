// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

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
import { getCurrentChannel } from 'mattermost-redux/selectors/entities/channels';

import GroupsDetails from './group_details'


function makeMapStateToProps() {
    const getCustomStatus = makeGetCustomStatus();

    return function mapStateToProps(state: GlobalState) {
        const currentUser = getCurrentUser(state);
        const channel = getCurrentChannel(state);
        const userId = currentUser?.id;
        const channelStats = Client4.getChannelStats(channel.id);
        return {
            userId,
            channelStats,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
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


export default connect(makeMapStateToProps, mapDispatchToProps)(GroupsDetails);
