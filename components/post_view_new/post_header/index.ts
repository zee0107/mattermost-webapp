// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getUser} from 'mattermost-redux/selectors/entities/users';

import {Client4} from 'mattermost-redux/client';

import {GlobalState} from 'types/store';
import {isGuest} from 'mattermost-redux/utils/user_utils';

import PostHeader, {Props} from './post_header';
import { getChannelMember } from 'mattermost-redux/actions/channels';

function mapStateToProps(state: GlobalState, ownProps: Props) {
    if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
        const stateValue = window.localStorage.getItem('GlobalState');
        state = JSON.parse(stateValue);
    }
    const config = getConfig(state);
    const enablePostUsernameOverride = config.EnablePostUsernameOverride === 'true';
    const enablePostIconOverride = config.EnablePostIconOverride === 'true';
    const overrideIconUrl = enablePostIconOverride && ownProps.post?.props?.override_icon_url;
    let overwriteIcon;
    if (overrideIconUrl) {
        overwriteIcon = Client4.getAbsoluteUrl(overrideIconUrl);
    }

    const user = getUser(state, ownProps.post.user_id);
    const isBot = Boolean(user && user.is_bot);

    return {
        enablePostUsernameOverride,
        isBot,
        overwriteIcon,
        isGuest: Boolean(user && isGuest(user.roles)),
    };
}

export default connect(mapStateToProps)(PostHeader);
