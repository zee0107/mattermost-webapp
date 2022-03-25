// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getUser} from 'mattermost-redux/selectors/entities/users';

import {AnyAction, bindActionCreators, Dispatch} from 'redux';

import {DispatchFunc, GetStateFunc} from 'mattermost-redux/types/actions';
import {removePost, ExtendedPost} from 'mattermost-redux/actions/posts';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {makeGetCommentCountForPost} from 'mattermost-redux/selectors/entities/posts';
import {get, isCollapsedThreadsEnabled} from 'mattermost-redux/selectors/entities/preferences';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {Post} from 'mattermost-redux/types/posts';

import {GlobalState} from 'types/store';

import {closeRightHandSide} from 'actions/views/rhs';
import {emitShortcutReactToLastPostFrom} from 'actions/post_actions.jsx';
import {Preferences} from 'utils/constants';
import {shouldShowDotMenu} from 'utils/post_utils';
import {getSelectedPostCard} from 'selectors/rhs';
import {isThreadOpen} from 'selectors/views/threads';
import {getShortcutReactToLastPostEmittedFrom, getOneClickReactionEmojis} from 'selectors/emojis';

import PostBody from './post_body.jsx';

type ownProps = {
    post: Post;
}

function removePostAndCloseRHS(post: ExtendedPost) {
    return (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState() as GlobalState;
        if (isThreadOpen(state, post.id)) {
            dispatch(closeRightHandSide());
        }
        return dispatch(removePost(post));
    };
}

function mapStateToProps(state: GlobalState, ownProps : ownProps) {
    const getReplyCount = makeGetCommentCountForPost();
    const selectedCard = getSelectedPostCard(state);
    const config = getConfig(state);
    const channel = state.entities.channels.channels[ownProps.post.channel_id];
    const channelIsArchived = channel ? channel.delete_at !== 0 : null;
    const enableEmojiPicker = config.EnableEmojiPicker === 'true' && !channelIsArchived;
    const teamId = getCurrentTeamId(state);
    const shortcutReactToLastPostEmittedFrom = getShortcutReactToLastPostEmittedFrom(state);

    let emojis = [];
    const oneClickReactionsEnabled = get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.ONE_CLICK_REACTIONS_ENABLED, Preferences.ONE_CLICK_REACTIONS_ENABLED_DEFAULT) === 'true';
    if (oneClickReactionsEnabled) {
        emojis = getOneClickReactionEmojis(state);
    }

    let parentPost;
    let parentPostUser;
    if (ownProps.post.root_id) {
        parentPost = getPost(state, ownProps.post.root_id);
        parentPostUser = parentPost ? getUser(state, parentPost.user_id) : null;
    }

    return {
        parentPost,
        parentPostUser,
        pluginPostTypes: state.plugins.postTypes,
        teamId,
        isFlagged: get(state, Preferences.CATEGORY_FLAGGED_POST, ownProps.post.id, null) != null,
        isMobile: state.views.channel.mobileView,
        isCardOpen: selectedCard && selectedCard.id === ownProps.post.id,
        enableEmojiPicker,
        isReadOnly: channelIsArchived,
        shouldShowDotMenu: shouldShowDotMenu(state, ownProps.post, channel),
        shortcutReactToLastPostEmittedFrom,
        collapsedThreadsEnabled: isCollapsedThreadsEnabled(state),
        hasReplies: getReplyCount(state, ownProps.post) > 0,
        oneClickReactionsEnabled,
        recentEmojis: emojis,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
    return {
        actions: bindActionCreators({
            removePost: removePostAndCloseRHS,
            emitShortcutReactToLastPostFrom,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostBody);
