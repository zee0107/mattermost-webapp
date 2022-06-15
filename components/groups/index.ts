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
import { getCurrentTeam, getTeamByName } from 'mattermost-redux/selectors/entities/teams';
import {createChannel,joinChannel,leaveChannelNew,deleteChannel,updateChannel} from 'mattermost-redux/actions/channels';
import {switchToChannel} from 'actions/views/channel';

import MyGroups, {Props} from './groups'
import { getChannelByName } from 'mattermost-redux/selectors/entities/channels';

type ownProps = {
    goTo: string;
}
function makeMapStateToProps() {
    const getCustomStatus = makeGetCustomStatus();

    return function mapStateToProps(state: GlobalState, ownProps: ownProps) {
        const channel = getChannelByName(state,'town-square');
        const goToPage = ownProps.location.hash.replace('#','');
        const currentUser = getCurrentUser(state);
        const currentTeam = getCurrentTeam(state);
        const userId = currentUser?.id;
        const team = getTeamByName(state,'crypter');
        const teamId = team?.id;
        //const teamId = 'd7cxjgejnbdm78h4n91kqeq6ow';
        return {
            goToPage,
            userId,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
            teamId,
            currentTeamId: currentTeam?.id,
            mychannels: Client4.getMyChannels(teamId),
            suggestedChannels: Client4.getChannels(teamId),
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<Action>, Props['actions']>({
            createChannel,
            updateChannel,
            switchToChannel,
            openModal,
            setStatus,
            joinChannel,
            leaveChannelNew,
            deleteChannel,
            unsetCustomStatus,
            setStatusDropdown,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(MyGroups);
