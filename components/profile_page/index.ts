// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {setStatus, unsetCustomStatus} from 'mattermost-redux/actions/users';
import {Client4} from 'mattermost-redux/client';
import {Preferences} from 'mattermost-redux/constants';

import {get, getBool} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';

import {getCurrentChannel, getDirectTeammate} from 'mattermost-redux/selectors/entities/channels';
import {getMyChannelRoles} from 'mattermost-redux/selectors/entities/roles';
import {getRoles} from 'mattermost-redux/selectors/entities/roles_helpers';
import {getConfig, getLicense} from 'mattermost-redux/selectors/entities/general';
import {showNextSteps} from 'components/next_steps_view/steps';

import {setShowNextStepsView} from 'actions/views/next_steps';
import {getCurrentRelativeTeamUrl} from 'mattermost-redux/selectors/entities/teams';

import {goToLastViewedChannel} from 'actions/views/channel';

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

type Actions = {
    goToLastViewedChannel: () => Promise<{data: boolean}>;
    setShowNextStepsView: (x: boolean) => void;
}

function makeMapStateToProps() {
    const getCustomStatus = makeGetCustomStatus();

    return function mapStateToProps(state: GlobalState) {
        const currentUser = getCurrentUser(state);

        const userId = currentUser?.id;
        const customStatus = getCustomStatus(state, userId);
        const isMilitaryTime = getBool(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.USE_MILITARY_TIME, false);

        const channel = Client4.getChannel('kqe4sihhdid47gprhk6dwbuc4o');
        const currentChannelId = channel?.id;

        const config = getConfig(state);

        const viewArchivedChannels = config.ExperimentalViewArchivedChannels === 'true';
        const enableOnboardingFlow = config.EnableOnboardingFlow === 'true';

        let channelRolesLoading = true;
        if (channel && channel.id) {
            const roles = getRoles(state);
            const myChannelRoles = getMyChannelRoles(state);
            if (myChannelRoles[channel.id]) {
                const channelRoles = myChannelRoles[channel.id].values();
                for (const roleName of channelRoles) {
                    if (roles[roleName]) {
                        channelRolesLoading = false;
                    }
                    break;
                }
            }
        }

        
        return {
            userId,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            coverPhoto: Client4.getProfileCover(userId),
            autoResetPref: get(state, Preferences.CATEGORY_AUTO_RESET_MANUAL_STATUS, userId, ''),
            status: getStatusForUserId(state, userId),
            customStatus,
            currentUser,
            isCustomStatusEnabled: isCustomStatusEnabled(state),
            isCustomStatusExpired: isCustomStatusExpired(state, customStatus),
            isMilitaryTime,
            isStatusDropdownOpen: isStatusDropdownOpen(state),
            showCustomStatusPulsatingDot: showStatusDropdownPulsatingDot(state),
            timezone: getCurrentUserTimezone(state),
            lhsOpen: getIsLhsOpen(state),
            rhsOpen: getIsRhsOpen(state),
            rhsMenuOpen: getIsRhsMenuOpen(state),

            channelId: currentChannelId,
            channelName: channel ? channel.name : '',
            channelDisplayName: channel ? channel.display_name : '',
            channelPurpose: channel ? channel.purpose : '',
            channelRolesLoading,
            focusedPostId: state.views.channel.focusedPostId,
            showNextStepsEphemeral: state.views.nextSteps.show,
            enableOnboardingFlow,
            channelIsArchived: channel ? channel.delete_at !== 0 : false,
            viewArchivedChannels,
            isCloud: getLicense(state).Cloud === 'true',
            teamUrl: getCurrentRelativeTeamUrl(state),
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
