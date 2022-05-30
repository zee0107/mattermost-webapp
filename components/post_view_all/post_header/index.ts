// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getUser} from 'mattermost-redux/selectors/entities/users';

import {Client4} from 'mattermost-redux/client';

import {GlobalState} from 'types/store';
import {isGuest} from 'mattermost-redux/utils/user_utils';
import { getCurrentTeam } from 'mattermost-redux/selectors/entities/teams';

import PostHeader, {Props} from './post_header';
import { getCurrentChannel } from 'mattermost-redux/selectors/entities/channels';

function mapStateToProps(state: GlobalState, ownProps: Props) {
    const config = getConfig(state);
    const enablePostUsernameOverride = config.EnablePostUsernameOverride === 'true';
    const enablePostIconOverride = config.EnablePostIconOverride === 'true';

    const overrideIconUrl = enablePostIconOverride && ownProps.post?.props?.override_icon_url;
    let overwriteIcon;
    if (overrideIconUrl) {
        overwriteIcon = Client4.getAbsoluteUrl(overrideIconUrl);
    }
    const currentTeam = getCurrentTeam(state);
    const currentChannel = getCurrentChannel(state);
    
    const user = getUser(state, ownProps.post.user_id);
    const channelRole = Client4.getChannelMember(ownProps.post.channel_id,ownProps.post.user_id);
    const isBot = Boolean(user && user.is_bot);

    return {
        enablePostUsernameOverride,
        isBot,
        currentTeam,
        currentChannel,
        channelRole,
        overwriteIcon,
        isGuest: Boolean(user && isGuest(user.roles)),
    };
}

export default connect(mapStateToProps)(PostHeader);
