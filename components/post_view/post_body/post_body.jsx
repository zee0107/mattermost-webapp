// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import {Posts} from 'mattermost-redux/constants';

import * as PostUtils from 'utils/post_utils';
import * as Utils from 'utils/utils.jsx';
import DelayedAction from 'utils/delayed_action';
import Constants, {Locations} from 'utils/constants.jsx';

import CommentedOn from 'components/post_view/commented_on';
import FileAttachmentListContainer from 'components/file_attachment_list';
import FailedPostOptions from 'components/post_view/failed_post_options';
import PostBodyAdditionalContent from 'components/post_view/post_body_additional_content';
import PostMessageView from 'components/post_view/post_message_view';
import ReactionList from 'components/post_view/reaction_list';
import LoadingSpinner from 'components/widgets/loading/loading_spinner';

import {FormattedMessage} from 'react-intl';
import * as ReduxPostUtils from 'mattermost-redux/utils/post_utils';

import {Post} from 'mattermost-redux/types/posts';
import {ExtendedPost} from 'mattermost-redux/actions/posts';
import CommentIcon from 'components/post_view/comment_icon';
import DotMenu from 'components/dot_menu';
import OverlayTrigger from 'components/overlay_trigger';
import Tooltip from 'components/tooltip';
import PostFlagIcon from 'components/post_view/post_flag_icon';
import PostReaction from 'components/post_view/post_reaction';
import PostRecentReactions from 'components/post_view/post_recent_reactions';
import PostTime from 'components/post_view/post_time';
import InfoSmallIcon from 'components/widgets/icons/info_small_icon';
import {Emoji} from 'mattermost-redux/types/emojis';

const SENDING_ANIMATION_DELAY = 3000;

type Props = {
    post: Post;
    teamId?: string;
    handleCommentClick: React.EventHandler<React.MouseEvent>;

    handleCardClick: (post: Post) => void;

    handleDropdownOpened: (e: boolean) => void;

    isFlagged?: boolean;
    isCardOpen?: boolean;
    isFirstReply?: boolean;
    hasReplies?: boolean;
    isMobile?: boolean;
    compactDisplay?: boolean;
    hover: boolean;
    showTimeWithoutHover: boolean;
    enableEmojiPicker?: boolean;
    isReadOnly: boolean | null;
    shortcutReactToLastPostEmittedFrom?: string;
    isLastPost?: boolean;
    actions: {
        removePost: (post: ExtendedPost) => void;
        emitShortcutReactToLastPostFrom?: (emittedFrom: string) => void;
    };
    shouldShowDotMenu: boolean;
    collapsedThreadsEnabled: boolean;
    oneClickReactionsEnabled: boolean;
    recentEmojis: Emoji[];
};

type State = {
    showEmojiPicker: boolean;
    showDotMenu: boolean;
    showOptionsMenuWithoutHover: boolean;
};

export default class PostBody extends React.PureComponent<Props,State> {
    private postHeaderRef: React.RefObject<HTMLDivElement>;
    private dotMenuRef: React.RefObject<HTMLDivElement>;
    private chevronMenuRef: React.RefObject<HTMLDivElement>;

    static propTypes = {

        /**
         * The post to render the body of
         */
        post: PropTypes.object.isRequired,

        /**
         * The parent post of the thread this post is in
         */
        parentPost: PropTypes.object,

        /**
         * The poster of the parent post, if exists
         */
        parentPostUser: PropTypes.object,

        /**
         * Callback func for file menu open
         */
        handleFileDropdownOpened: PropTypes.func,

        /**
         * The function called when the comment icon is clicked
         */
        handleCommentClick: PropTypes.func.isRequired,

        /**
         * Set to render post body compactly
         */
        compactDisplay: PropTypes.bool,

        /**
         * Set to highlight comment as a mention
         */
        isCommentMention: PropTypes.bool,

        /**
         * Set to render a preview of the parent post above this reply
         */
        isFirstReply: PropTypes.bool,

        /*
         * Post type components from plugins
         */
        pluginPostTypes: PropTypes.object,

        /**
         * Flag passed down to PostBodyAdditionalContent for determining if post embed is visible
         */
        isEmbedVisible: PropTypes.bool,
    }

    constructor(props) {
        super(props);

        this.sendingAction = new DelayedAction(
            () => {
                const post = this.props.post;
                if (post && post.id === post.pending_post_id) {
                    this.setState({sending: true});
                }
            },
        );

        this.state = {sending: false,showEmojiPicker: false,showDotMenu: false, showOptionsMenuWithoutHover: true};

        this.dotMenuRef = React.createRef();
        this.chevMenuRef = React.createRef();
    }

    toggleEmojiPicker = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        if (e) {
            e.stopPropagation();
        }
        const showEmojiPicker = !this.state.showEmojiPicker;

        this.setState({
            showEmojiPicker,
            showOptionsMenuWithoutHover: true,
        });
        this.props.handleDropdownOpened(showEmojiPicker || this.state.showDotMenu);
    };

    removePost = () => {
        this.props.actions.removePost(this.props.post);
    };

    createRemovePostButton = () => {
        return (
            <button
                className='post__remove theme color--link style--none'
                type='button'
                onClick={this.removePost}
            >
                {'×'}
            </button>
        );
    };

    handleDotMenuOpened = (open: boolean) => {
        this.setState({showDotMenu: open});
        //this.props.handleDropdownOpened(open || this.state.showEmojiPicker);
    };

    getDotMenu = (): HTMLDivElement => {
        return this.dotMenuRef.current as HTMLDivElement;
    };

    getChevronMenu = (): HTMLDivElement => {
        return this.chevMenuRef.current as HTMLDivElement;
    };

    buildOptionChevron = (post: Post, isSystemMessage: boolean, fromAutoResponder: boolean) => {
        if (!this.props.shouldShowDotMenu) {
            return null;
        }

        const {isMobile, isReadOnly, collapsedThreadsEnabled} = this.props;
        const hover = this.props.hover || this.state.showEmojiPicker || this.state.showDotMenu || this.state.showOptionsMenuWithoutHover;

        const showRecentlyUsedReactions = !isMobile && !isSystemMessage && hover && !isReadOnly && this.props.oneClickReactionsEnabled && this.props.enableEmojiPicker;
        let showRecentReacions;
        if (showRecentlyUsedReactions) {
            showRecentReacions = (
                <PostRecentReactions
                    channelId={post.channel_id}
                    postId={post.id}
                    emojis={this.props.recentEmojis}
                    teamId={this.props.teamId}
                    getDotMenuRef={this.getDotMenu}
                />
            );
        }

        const showDotMenuIcon = isMobile || hover;
        let dotMenu;
        if (showDotMenuIcon) {
            dotMenu = (
                <DotMenu
                    post={post}
                    isFlagged={this.props.isFlagged}
                    handleCommentClick={this.props.handleCommentClick}
                    handleDropdownOpened={this.handleDotMenuOpened}
                    handleAddReactionClick={this.toggleEmojiPicker}
                    isMenuOpen={this.state.showDotMenu}
                    isReadOnly={isReadOnly}
                    enableEmojiPicker={this.props.enableEmojiPicker}
                />
            );
        }

        return (
            <div
                ref={this.chevMenuRef}
                data-testid={`post-menu-${post.id}`}
                className={'float-end'}
                style={{marginTop: -40}}
            >
                {!collapsedThreadsEnabled && !showRecentlyUsedReactions && dotMenu}
                {(collapsedThreadsEnabled || showRecentlyUsedReactions) && dotMenu}
            </div>
        );

    }

    buildOptions = (post: Post, isSystemMessage: boolean, fromAutoResponder: boolean) => {
        if (!this.props.shouldShowDotMenu) {
            return null;
        }

        const {isMobile, isReadOnly, collapsedThreadsEnabled} = this.props;
        const hover = this.props.hover || this.state.showEmojiPicker || this.state.showDotMenu || this.state.showOptionsMenuWithoutHover;

        const showCommentIcon = fromAutoResponder ||
        (!isSystemMessage && (isMobile || hover || (!post.root_id && Boolean(this.props.hasReplies)) || this.props.isFirstReply));
        const commentIconExtraClass = isMobile ? '' : '';
        let commentIcon;
        if (showCommentIcon) {
            commentIcon = (
                <CommentIcon
                    handleCommentClick={this.props.handleCommentClick}
                    postId={post.id}
                    extraClass={commentIconExtraClass}
                />
            );
        }

        const showRecentlyUsedReactions = !isMobile && !isSystemMessage && hover && !isReadOnly && this.props.oneClickReactionsEnabled && this.props.enableEmojiPicker;
        let showRecentReacions;
        if (showRecentlyUsedReactions) {
            showRecentReacions = (
                <PostRecentReactions
                    channelId={post.channel_id}
                    postId={post.id}
                    emojis={this.props.recentEmojis}
                    teamId={this.props.teamId}
                    getDotMenuRef={this.getDotMenu}
                />
            );
        }

        const showReactionIcon = !isSystemMessage && hover && !isReadOnly && this.props.enableEmojiPicker;
        let postReaction;
        if (showReactionIcon) {
            postReaction = (
                <PostReaction
                    channelId={post.channel_id}
                    postId={post.id}
                    teamId={this.props.teamId}
                    getDotMenuRef={this.getDotMenu}
                    showEmojiPicker={this.state.showEmojiPicker}
                    toggleEmojiPicker={this.toggleEmojiPicker}
                />
            );
        }

        const showDotMenuIcon = isMobile || hover;
        let dotMenu;
        if (showDotMenuIcon) {
            dotMenu = (
                <DotMenu
                    post={post}
                    isFlagged={this.props.isFlagged}
                    handleCommentClick={this.props.handleCommentClick}
                    handleDropdownOpened={this.handleDotMenuOpened}
                    handleAddReactionClick={this.toggleEmojiPicker}
                    isMenuOpen={this.state.showDotMenu}
                    isReadOnly={isReadOnly}
                    enableEmojiPicker={this.props.enableEmojiPicker}
                />
            );
        }

        const showFlagIcon = !isSystemMessage && !isMobile && (hover || this.props.isFlagged);
        let postFlagIcon;
        if (showFlagIcon) {
            postFlagIcon = (
                <PostFlagIcon
                    postId={post.id}
                    isFlagged={this.props.isFlagged}
                    extraClass={'pull-right'}
                />
            );
        }

        return (
            <div
                ref={this.dotMenuRef}
                data-testid={`post-menu-${post.id}`}
                className={'col-md-12 removePadding'}
            >
                {!collapsedThreadsEnabled && !showRecentlyUsedReactions && dotMenu}
                {showRecentReacions}
                {postReaction}
                {commentIcon}
                {postFlagIcon}
                {(collapsedThreadsEnabled || showRecentlyUsedReactions) && dotMenu}
            </div>
        );
    };

    static getDerivedStateFromProps(props, state) {
        if (state.sending && props.post && (props.post.id !== props.post.pending_post_id)) {
            return {
                sending: false,
            };
        }

        return null;
    }

    componentDidUpdate() {
        if (this.state.sending === false) {
            this.sendingAction.cancel();
        }
    }

    componentDidMount() {
        const post = this.props.post;
        if (post && post.id === post.pending_post_id) {
            this.sendingAction.fireAfter(SENDING_ANIMATION_DELAY);
        }
    }

    componentWillUnmount() {
        this.sendingAction.cancel();
    }

    render() {
        const post = this.props.post;
        const parentPost = this.props.parentPost;
        const parentPostUser = this.props.parentPostUser;

        const isEphemeral = Utils.isPostEphemeral(post);
        const isSystemMessage = PostUtils.isSystemMessage(post);
        const fromAutoResponder = PostUtils.fromAutoResponder(post);

        let options;
        if (isEphemeral) {
            options = (
                <div className='col col__remove'>
                    {this.createRemovePostButton()}
                </div>
            );
        } else if (!post.failed) {
            options = this.buildOptions(post, isSystemMessage, fromAutoResponder);
        }

        let comment;
        let postClass = '';
        
        //We want to show the commented on component even if the post was deleted
        if (this.props.isFirstReply && parentPost && post.type !== Constants.PostTypes.EPHEMERAL) {
            comment = (
                <CommentedOn
                    post={parentPost}
                    parentPostUser={parentPostUser}
                    onCommentClick={this.props.handleCommentClick}
                />
            );
        }

        let failedOptions;
        if (this.props.post.failed) {
            postClass += ' post--fail';
            failedOptions = <FailedPostOptions post={this.props.post}/>;
        }

        if (PostUtils.isEdited(this.props.post)) {
            postClass += ' post--edited';
        }

        let fileAttachmentHolder = null;
        if (((post.file_ids && post.file_ids.length > 0) || (post.filenames && post.filenames.length > 0)) && this.props.post.state !== Posts.POST_DELETED) {
            fileAttachmentHolder = (
                <FileAttachmentListContainer
                    post={post}
                    compactDisplay={this.props.compactDisplay}
                    handleFileDropdownOpened={this.props.handleFileDropdownOpened}
                />
            );
        }

        if (this.state.sending) {
            postClass += ' post-waiting';
        }

        const messageWrapper = (
            <React.Fragment>
                {failedOptions}
                {this.state.sending && <LoadingSpinner/>}
                <PostMessageView
                    post={this.props.post}
                    compactDisplay={this.props.compactDisplay}
                    hasMention={true}
                />
            </React.Fragment>
        );

        const hasPlugin = (post.type && this.props.pluginPostTypes.hasOwnProperty(post.type)) ||
            (post.props && post.props.type && this.props.pluginPostTypes.hasOwnProperty(post.props.type));

        let messageWithAdditionalContent;
        if (this.props.post.state === Posts.POST_DELETED || hasPlugin) {
            messageWithAdditionalContent = messageWrapper;
        } else {
            messageWithAdditionalContent = (
                <PostBodyAdditionalContent
                    post={this.props.post}
                    isEmbedVisible={this.props.isEmbedVisible}
                >
                    {messageWrapper}
                </PostBodyAdditionalContent>
            );
        }

        let mentionHighlightClass = '';
        if (this.props.isCommentMention) {
            mentionHighlightClass = 'mention-comment';
        }

        let ephemeralPostClass = '';
        if (isEphemeral) {
            ephemeralPostClass = 'post--ephemeral';
        }

        let chevronMenu = this.buildOptionChevron(post, isSystemMessage, fromAutoResponder);


        return (
            <div>
                {comment}
                <div
                    id={`${post.id}_message`}
                    className={`post__body ${mentionHighlightClass} ${ephemeralPostClass} ${postClass}`}
                >
                    {messageWithAdditionalContent}
                    {fileAttachmentHolder}
                    <ReactionList post={post}/>
                </div>
            </div>
        );
    }
}
