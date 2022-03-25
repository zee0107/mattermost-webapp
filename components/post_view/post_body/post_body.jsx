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

        this.state = {sending: false,showEmojiPicker: false,showDotMenu: false, showOptionsMenuWithoutHover: false};
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
        this.props.handleDropdownOpened(open || this.state.showEmojiPicker);
    };

    getDotMenu = (): HTMLDivElement => {
        return this.dotMenuRef.current as HTMLDivElement;
    };

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
                {postFlagIcon}
                {commentIcon}
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

        let options = this.buildOptions(post, isSystemMessage, fromAutoResponder);
        /*if (isEphemeral) {
            options = (
                <div className='col col__remove'>
                    {this.createRemovePostButton()}
                </div>
            );
        } else if (!post.failed) {
            options = this.buildOptions(post, isSystemMessage, fromAutoResponder);
        }*/

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

        return (
            <div>
                {comment}
                <div
                    id={`${post.id}_message`}
                    className={`post__body ${mentionHighlightClass} ${ephemeralPostClass} ${postClass}`}
                >
                    {fileAttachmentHolder}
                    {messageWithAdditionalContent}
                    <ReactionList post={post}/>
                    <div className='col-lg-12 mtop-10 removePadding'>
                        {/*<div className='d-flex'>
                            <div className='col-md-8 removePadding'>
                                <a href='#' className='mright-5'><svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clip-rule="evenodd" d="M7.70555 2.62612L7.29875 2.15068C5.66176 0.513696 3.05118 0.625249 1.4142 2.26224C-0.222789 3.89922 0.0922534 7.06405 1.72924 8.70104C2.39362 9.36543 3.38858 10.2853 4.71411 11.4607L5.82926 12.4418L7.08177 13.529C7.42663 13.8266 7.93617 13.8312 8.28631 13.5398L9.30096 12.689C11.0778 11.1874 12.3964 10.0046 13.2566 9.14065L13.4799 8.91294L13.6804 8.70104C15.205 7.05699 15.5968 3.86115 13.9979 2.26224L13.882 2.15068C12.238 0.626134 9.75885 0.551766 8.15994 2.15068L7.70555 2.62612ZM2.07321 2.92082C3.36764 1.62639 5.3702 1.5657 6.61635 2.78546L7.66771 4.01421L8.83369 2.79419C10.0297 1.59855 11.9357 1.61584 13.249 2.83362L13.352 2.9331C14.4819 4.0632 14.2897 6.67436 12.9977 8.06757L12.8037 8.27258L12.5884 8.49209C11.8752 9.20779 10.8183 10.1667 9.42481 11.3608L8.70003 11.9775L7.69073 12.8237L6.44022 11.7382L5.54521 10.952C4.28408 9.83743 3.31119 8.9459 2.63001 8.28099L2.38825 8.04228C1.03972 6.69375 0.871053 4.12298 2.07321 2.92082Z" fill="var(--text-primary)"/>
                                </svg></a>
                                <a href='#' className='mright-5'><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clip-rule="evenodd" d="M14.4559 7.80832C14.4559 4.03565 11.3975 0.977295 7.62484 0.977295C3.85217 0.977295 0.793816 4.03565 0.793816 7.80832C0.793816 11.581 3.85217 14.6393 7.62484 14.6393C8.44827 14.6393 9.57942 14.339 11.0183 13.7382L13.3451 14.6458L13.414 14.6682C13.7148 14.7471 14.0335 14.5897 14.1493 14.293C14.1956 14.1743 14.2042 14.0443 14.1742 13.9206L13.5254 11.2524L13.6316 10.9982C14.1811 9.65971 14.4559 8.59642 14.4559 7.80832ZM12.7611 10.6652L12.547 11.1722L13.1279 13.5614L11.0062 12.7337L10.4268 12.974C9.20476 13.4671 8.26083 13.7079 7.6246 13.7079C4.36638 13.7079 1.72507 11.0666 1.72507 7.80834C1.72507 4.55012 4.36638 1.90882 7.6246 1.90882C10.8828 1.90882 13.5241 4.55012 13.5241 7.80834C13.5241 8.45761 13.2739 9.41999 12.7611 10.6652Z" fill="var(--text-primary)"/>
                                </svg></a>
                                <a href='#' className='mright-5'><svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clip-rule="evenodd" d="M14.3725 1.67834L7.73697 13.0138C7.52806 13.3707 6.99231 13.2986 6.88518 12.8992L5.1772 6.53044L5.16311 6.51054C5.15043 6.48856 5.13974 6.46599 5.13098 6.44301L0.461145 1.77238C0.167737 1.47898 0.37554 0.977295 0.790481 0.977295H13.9706C14.3303 0.977295 14.5543 1.36785 14.3725 1.67834ZM12.6955 2.69866L6.13054 6.48895L7.49599 11.5813L12.6955 2.69866ZM1.91545 1.90879L12.2025 1.90821L5.68053 5.67366L1.91545 1.90879Z" fill="var(--text-primary)"/>
                                </svg></a>
                            </div>
                            <div className='col-md-4 removePadding text-end'>
                                <a href='#'><svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clip-rule="evenodd" d="M0.0984802 0.533888V13.9801C0.0984802 14.1433 0.162713 14.2999 0.277288 14.4161C0.518092 14.6603 0.911279 14.6631 1.1555 14.4223L6.46421 9.18777L11.7729 14.4223C11.8891 14.5369 12.0458 14.6011 12.2089 14.6011C12.5519 14.6011 12.8299 14.3231 12.8299 13.9801V0.533888C12.8299 0.362403 12.6909 0.223389 12.5194 0.223389H0.408981C0.237496 0.223389 0.0984802 0.362403 0.0984802 0.533888ZM1.02973 13.2379V1.1549H11.8982V13.2379L6.89997 8.30952C6.65818 8.07111 6.26973 8.07111 6.02794 8.30952L1.02973 13.2379Z" fill="var(--text-primary)"/>
                                </svg></a>
                            </div>
                        </div>*/}
                        {options}
                    </div>
                </div>
            </div>
        );
    }
}
