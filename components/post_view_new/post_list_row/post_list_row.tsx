// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';

import * as PostListUtils from 'mattermost-redux/utils/post_list';

import {Channel} from 'mattermost-redux/types/channels';

import CombinedUserActivityPost from 'components/post_view_new/combined_user_activity_post';
import Post from 'components/post_view_new/post';
import DateSeparator from 'components/post_view_new/date_separator';
import NewMessageSeparator from 'components/post_view_new/new_message_separator/new_message_separator';
import ChannelIntroMessage from 'components/post_view_new/channel_intro_message/';
import {isIdNotPost} from 'utils/post_utils';
import {PostListRowListIds, Locations} from 'utils/constants';

export type PostListRowProps = {
    channel?: Channel;
    listId: string;
    previousListId?: string;
    fullWidth?: boolean;
    shouldHighlight?: boolean;
    loadOlderPosts: () => void;
    loadNewerPosts: () => void;
    togglePostMenu: () => void;

    /**
     * To Check if the current post is last in the list
     */
    isLastPost: boolean;

    /**
     * To check if the state of emoji for last message and from where it was emitted
     */
    shortcutReactToLastPostEmittedFrom: string;

    /**
     * is used for hiding animation of loader
     */
    loadingNewerPosts: boolean;
    loadingOlderPosts: boolean;

    actions: {

        /**
          * Function to set or unset emoji picker for last message
          */
        emitShortcutReactToLastPostFrom: (location: string) => void;
    };
}

export default class PostListRow extends React.PureComponent<PostListRowProps> {
    blockShortcutReactToLastPostForNonMessages(listId: string) {
        const {actions: {emitShortcutReactToLastPostFrom}} = this.props;

        if (isIdNotPost(listId)) {
            // This is a good escape hatch as any of the above conditions don't return <Post/> component, Emoji picker is only at Post component
            emitShortcutReactToLastPostFrom(Locations.NO_WHERE);
        }
    }

    componentDidUpdate(prevProps: PostListRowProps) {
        const {listId, isLastPost, shortcutReactToLastPostEmittedFrom} = this.props;

        const shortcutReactToLastPostEmittedFromCenter = prevProps.shortcutReactToLastPostEmittedFrom !== shortcutReactToLastPostEmittedFrom &&
            shortcutReactToLastPostEmittedFrom === Locations.CENTER;

        // If last post is not a message then we block the shortcut to react to last message, early on
        if (isLastPost && shortcutReactToLastPostEmittedFromCenter) {
            this.blockShortcutReactToLastPostForNonMessages(listId);
        }
    }

    render() {
        const {listId, previousListId, loadingOlderPosts, loadingNewerPosts} = this.props;
        const {
            OLDER_MESSAGES_LOADER,
            NEWER_MESSAGES_LOADER,
            CHANNEL_INTRO_MESSAGE,
            LOAD_OLDER_MESSAGES_TRIGGER,
            LOAD_NEWER_MESSAGES_TRIGGER,
        } = PostListRowListIds;

        if (PostListUtils.isDateLine(listId)) {
            const date = PostListUtils.getDateForDateLine(listId);

            return (
                <div>
                    {/* <DateSeparator
                    key={date}
                    date={date}
                    />*/}
                    <span></span>
                </div>
               
            );
        }

        if (PostListUtils.isStartOfNewMessages(listId)) {
            return (
                <div>
                    {/*<NewMessageSeparator separatorId={listId}/>*/}
                    <span></span>
                </div>
                
            );
        }

        if (listId === CHANNEL_INTRO_MESSAGE) {
            return (
                <div id='ChannelIntroHide'>
                    <ChannelIntroMessage/>
                </div>
            );
        }

        if (listId === LOAD_OLDER_MESSAGES_TRIGGER || listId === LOAD_NEWER_MESSAGES_TRIGGER) {
            return (
                <button
                    className='more-messages-text theme style--none color--link'
                    onClick={listId === LOAD_OLDER_MESSAGES_TRIGGER ? this.props.loadOlderPosts : this.props.loadNewerPosts}
                >
                    <FormattedMessage
                        id='posts_view.loadMore'
                        defaultMessage='Load More Messages'
                    />
                </button>
            );
        }

        const isOlderMessagesLoader = listId === OLDER_MESSAGES_LOADER;
        const isNewerMessagesLoader = listId === NEWER_MESSAGES_LOADER;
        if (isOlderMessagesLoader || isNewerMessagesLoader) {
            const shouldHideAnimation = !loadingOlderPosts && !loadingNewerPosts;

            return (
                <div
                    className='loading-screen'
                >
                    <div className={classNames('loading__content', {hideAnimation: shouldHideAnimation})}>
                        <div className='round round-1'/>
                        <div className='round round-2'/>
                        <div className='round round-3'/>
                    </div>
                </div>
            );
        }

        const postProps = {
            previousPostId: previousListId,
            shouldHighlight: this.props.shouldHighlight,
            togglePostMenu: this.props.togglePostMenu,
            isLastPost: this.props.isLastPost,
        };

        if (PostListUtils.isCombinedUserActivityPost(listId)) {
            return (
                <CombinedUserActivityPost
                    combinedId={listId}
                    {...postProps}
                />
            );
        }

        return (
            <Post
                postId={listId}
                {...postProps}
            />
        );
    }
}
