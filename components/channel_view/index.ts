// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';

import {withRouter} from 'react-router-dom';

import {Client4} from 'mattermost-redux/client';

import {getChannelByName, getCurrentChannel, getDirectTeammate} from 'mattermost-redux/selectors/entities/channels';
import {getMyChannelRoles} from 'mattermost-redux/selectors/entities/roles';
import {getRoles} from 'mattermost-redux/selectors/entities/roles_helpers';
import {getConfig, getLicense} from 'mattermost-redux/selectors/entities/general';
import {showNextSteps} from 'components/next_steps_view/steps';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {ActionFunc, GenericAction} from 'mattermost-redux/types/actions';
import {setShowNextStepsView} from 'actions/views/next_steps';
import {getCurrentRelativeTeamUrl, getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';

import {goToLastViewedChannel} from 'actions/views/channel';
import {joinChannel,leaveChannelNew} from 'mattermost-redux/actions/channels';

import {GlobalState} from 'types/store';

import ChannelView from './channel_view';

type Actions = {
    goToLastViewedChannel: () => Promise<{data: boolean}>;
    setShowNextStepsView: (x: boolean) => void;
}

function isDeactivatedChannel(state: GlobalState, channelId: string) {
    const teammate = getDirectTeammate(state, channelId);

    return Boolean(teammate && teammate.delete_at);
}

function mapStateToProps(state: GlobalState) {
    const channel = getCurrentChannel(state);
    const currentChannelId = channel?.id;
    const currentUser = getCurrentUser(state);
    const currentTeam = getCurrentTeam(state);
    const userId = currentUser?.id;
    const storyList = Client4.listSotries(userId);
    const config = getConfig(state);

    const viewArchivedChannels = config.ExperimentalViewArchivedChannels === 'true';
    const enableOnboardingFlow = config.EnableOnboardingFlow === 'true';

    let channelRolesLoading = true;
    let posts;
    if (channel && channel.id) {
        const roles = getRoles(state);
        posts = Client4.getPosts(channel.id);
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
        channelId: channel ? channel.id : '',
        channelName: channel ? channel.name : '',
        channelDisplayName: channel ? channel.display_name : '',
        channelPurpose: channel ? channel.purpose : '',
        channel,
        currentTeam,
        posts,
        channelRolesLoading,
        storyList,
        deactivatedChannel: channel ? isDeactivatedChannel(state, channel.id) : false,
        focusedPostId: state.views.channel.focusedPostId,
        showNextStepsEphemeral: state.views.nextSteps.show,
        enableOnboardingFlow,
        showNextSteps: showNextSteps(state),
        channelIsArchived: channel ? channel.delete_at !== 0 : false,
        viewArchivedChannels,
        isCloud: getLicense(state).Cloud === 'true',
        teamUrl: getCurrentRelativeTeamUrl(state),
        profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
        currentUser,
    };
}


function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc|GenericAction>, Actions>({
            goToLastViewedChannel,
            leaveChannelNew,
            setShowNextStepsView,
        }, dispatch),
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChannelView));
