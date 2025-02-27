// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {setStatus, unsetCustomStatus} from 'mattermost-redux/actions/users';
import {Client4} from 'mattermost-redux/client';
import {Preferences} from 'mattermost-redux/constants';

import {get, getBool} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';
import {getCurrentChannel} from 'mattermost-redux/selectors/entities/channels';

import {openModal} from 'actions/views/modals';
import {setStatusDropdown} from 'actions/views/status_dropdown';
import {getMyChannelRoles} from 'mattermost-redux/selectors/entities/roles';
import {getRoles} from 'mattermost-redux/selectors/entities/roles_helpers';
import {makeGetCustomStatus, isCustomStatusEnabled, showStatusDropdownPulsatingDot, isCustomStatusExpired} from 'selectors/views/custom_status';
import {isStatusDropdownOpen} from 'selectors/views/status_dropdown';
import {GenericAction} from 'mattermost-redux/types/actions';
import {GlobalState} from 'types/store';
import {joinChannel,leaveChannelNew} from 'mattermost-redux/actions/channels';

import GroupsHeader from './group_header'

function makeMapStateToProps() {
    const getCustomStatus = makeGetCustomStatus();

    return function mapStateToProps(state: GlobalState) {
        const currentUser = getCurrentUser(state);
        const channelId = window.localStorage.getItem('channelId');

        const userId = currentUser?.id;

        let channelAdmin = false;
        const channelRole = Client4.getChannelMember(channelId,userId);

        return {
            channelId,
            userId,
            channelRole,
            channelAdmin,
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
            leaveChannelNew,
            unsetCustomStatus,
            setStatusDropdown,
        }, dispatch),
    };
}


export default connect(makeMapStateToProps, mapDispatchToProps)(GroupsHeader);
