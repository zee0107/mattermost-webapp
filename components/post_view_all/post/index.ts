// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {getChannel, getMyChannelMembership} from 'mattermost-redux/selectors/entities/channels';
import {getPost, makeIsPostCommentMention, makeGetCommentCountForPost} from 'mattermost-redux/selectors/entities/posts';
import {get, isCollapsedThreadsEnabled} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {ActionFunc, GenericAction} from 'mattermost-redux/types/actions';
import {Post} from 'mattermost-redux/types/posts';

import {markPostAsUnread} from 'actions/post_actions';
import {selectPost, selectPostCard} from 'actions/views/rhs';

import {GlobalState} from 'types/store';

import {isArchivedChannel} from 'utils/channel_utils';
import {Preferences} from 'utils/constants';
import {areConsecutivePostsBySameUser} from 'utils/post_utils';
import { Client4 } from 'mattermost-redux/client';
import { getCurrentTeam } from 'mattermost-redux/selectors/entities/teams';

import PostComponent from './post';
import { makeGetFilesForPost } from 'mattermost-redux/selectors/entities/files';


interface OwnProps {
    post?: Post;
    postId: string;
    previousPostId?: string;
}

// isFirstReply returns true when the given post a comment that isn't part of the same thread as the previous post.
export function isFirstReply(post: Post, previousPost: Post): boolean {
    if (post.root_id) {
        if (previousPost) {
            // Returns true as long as the previous post is part of a different thread
            return post.root_id !== previousPost.id && post.root_id !== previousPost.root_id;
        }

        // The previous post is not a real post
        return true;
    }

    // This post is not a reply
    return false;
}

function mapStateToProps() {
    const getReplyCount = makeGetCommentCountForPost();
    const isPostCommentMention = makeIsPostCommentMention();
    const selectFilesForPost = makeGetFilesForPost();

    return (state: GlobalState, ownProps: OwnProps) => {
        const post = ownProps.post || getPost(state, ownProps.postId);
        const postDetailed = Client4.getPostDetailed(ownProps.postId);
        const channel = getChannel(state, post.channel_id);
        if(channel.name === 'town-square'){
            window.localStorage.setItem('GlobalState', JSON.stringify(state));
        }
        const team = getCurrentTeam(state);
        const channelRole = Client4.getChannelMember(channel.id,post.user_id);
        const fileInfos = selectFilesForPost(state, post.id);
        let previousPost = null;
        if (ownProps.previousPostId) {
            previousPost = getPost(state, ownProps.previousPostId);
        }

        if(post.file_ids?.length){

        }

        let consecutivePostByUser = false;
        let previousPostIsComment = false;

        if (previousPost) {
            consecutivePostByUser = areConsecutivePostsBySameUser(post, previousPost);
            previousPostIsComment = Boolean(previousPost.root_id);
        }

        return {
            post,
            fileInfos,
            team,
            channelRole,
            postDetailed,
            currentUserId: getCurrentUserId(state),
            isFirstReply: previousPost ? isFirstReply(post, previousPost) : false,
            consecutivePostByUser,
            previousPostIsComment,
            hasReplies: getReplyCount(state, post) > 0,
            isCommentMention: isPostCommentMention(state, post.id),
            center: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.CHANNEL_DISPLAY_MODE, Preferences.CHANNEL_DISPLAY_MODE_DEFAULT) === Preferences.CHANNEL_DISPLAY_MODE_CENTERED,
            compactDisplay: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.MESSAGE_DISPLAY, Preferences.MESSAGE_DISPLAY_DEFAULT) === Preferences.MESSAGE_DISPLAY_COMPACT,
            channelIsArchived: isArchivedChannel(channel),
            isFlagged: get(state, Preferences.CATEGORY_FLAGGED_POST, post.id, null) != null,
            isCollapsedThreadsEnabled: isCollapsedThreadsEnabled(state),
            clickToReply: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.CLICK_TO_REPLY, Preferences.CLICK_TO_REPLY_DEFAULT) === 'true',
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators({
            selectPost,
            selectPostCard,
            markPostAsUnread,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostComponent);
