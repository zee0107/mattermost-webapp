// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Client4, DEFAULT_LIMIT_AFTER, DEFAULT_LIMIT_BEFORE} from 'mattermost-redux/client';
import {General, Preferences, Posts} from '../constants';
import {PostTypes, ChannelTypes, FileTypes, IntegrationTypes} from 'mattermost-redux/action_types';

import {getCurrentChannelId, getMyChannelMember as getMyChannelMemberSelector} from 'mattermost-redux/selectors/entities/channels';
import {getCustomEmojisByName as selectCustomEmojisByName} from 'mattermost-redux/selectors/entities/emojis';
import * as Selectors from 'mattermost-redux/selectors/entities/posts';
import {getCurrentUserId, getUsersByUsername} from 'mattermost-redux/selectors/entities/users';

import {isCombinedUserActivityPost} from 'mattermost-redux/utils/post_list';

import {Action, ActionResult, batchActions, DispatchFunc, GetStateFunc} from 'mattermost-redux/types/actions';
import {ChannelUnread} from 'mattermost-redux/types/channels';
import {GlobalState} from 'mattermost-redux/types/store';
import {Post, PostDetailed, PostList} from 'mattermost-redux/types/posts';
import {Reaction} from 'mattermost-redux/types/reactions';
import {UserProfile} from 'mattermost-redux/types/users';
import {isCollapsedThreadsEnabled} from 'mattermost-redux/selectors/entities/preferences';

import {getProfilesByIds, getProfilesByUsernames, getStatusesByIds} from './users';
import {
    deletePreferences,
    savePreferences,
} from './preferences';
import {bindClientFunc, forceLogoutIfNecessary} from './helpers';
import {logError} from './errors';
import {systemEmojis, getCustomEmojiByName, getCustomEmojisByName} from './emojis';
import {selectChannel} from './channels';
import {decrementThreadCounts} from './threads';

export function likeForum(forum_id: string, user_id: string){
    return async () => {
        const result = await Client4.likeForum(forum_id, user_id);
        return result;
    }
}

export function dislikeForum(forum_id: string, user_id: string){
    return async () => {
        const result = await Client4.dislikeForum(forum_id, user_id);
        return result;
    }
}
