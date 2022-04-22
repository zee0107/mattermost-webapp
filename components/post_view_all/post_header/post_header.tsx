// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {EventHandler, MouseEvent} from 'react';
import {FormattedMessage} from 'react-intl';

import {Post, PostDetailed} from 'mattermost-redux/types/posts';

import Constants from 'utils/constants';
import * as PostUtils from 'utils/post_utils';
import PostInfo from 'components/post_view_all/post_info';
import UserProfile from 'components/user_profile';
import BotBadge from 'components/widgets/badges/bot_badge';
import Badge from 'components/widgets/badges/badge';

import PostHeaderCustomStatus from './post_header_custom_status';

import './post_header.scss';

export type Props = {

    /*
     * The post to render the header for
     */
    post: Post;
    postDetailed: PostDetailed;
    /*
     * Function called when the comment icon is clicked
     */
    handleCommentClick: EventHandler<MouseEvent>;

    /*
     * Function called when the card icon is clicked
     */
    handleCardClick: (post: Post) => void;

    /*
     * Function called when the post options dropdown is opened
     */
    handleDropdownOpened: (opened: boolean) => void;

    /*
     * Set to render compactly
     */
    compactDisplay?: boolean;

    /**
     * Set to indicate that this is previous post was not a reply to the same thread
     */
    isFirstReply?: boolean;

    /**
     * Set to mark post as being hovered over
     */
    hover: boolean;

    /*
     * Set to render the post time when not hovering
     */
    showTimeWithoutHover: boolean;

    /**
     * Whether or not the post username can be overridden.
     */
    enablePostUsernameOverride: boolean;

    /**
     * If the user that made the post is a bot.
     */
    isBot: boolean;

    /**
     * If the user that made the post is a guest.
     */
    isGuest: boolean;

    /**
     * To Check if the current post is last in the list
     */
    isLastPost?: boolean;

    /**
     * Source of image that should be override current user profile.
     */
    overwriteIcon?: string;
};

export default class PostHeader extends React.PureComponent<Props> {
    render(): JSX.Element {
        const {post, postDetailed} = this.props;
        const isSystemMessage = PostUtils.isSystemMessage(post);
        const fromAutoResponder = PostUtils.fromAutoResponder(post);
        const fromWebhook = post?.props?.from_webhook === 'true';

        let userProfile = (
            <UserProfile
                userId={post.user_id}
                hasMention={true}
                location={postDetailed.location}
                activity={postDetailed.actvity}
                shareInfo={postDetailed.share_info}
            />
        );
        let indicator;
        let colon;

        if (fromWebhook) {
            if (post.props.override_username && this.props.enablePostUsernameOverride) {
                userProfile = (
                    <UserProfile
                        userId={post.user_id}
                        hideStatus={true}
                        overwriteName={post.props.override_username}
                        overwriteIcon={this.props.overwriteIcon}
                        location={postDetailed.location}
                        activity={postDetailed.actvity}
                        shareInfo={postDetailed.share_info}
                    />
                );
            } else {
                userProfile = (
                    <UserProfile
                        userId={post.user_id}
                        hideStatus={true}
                        location={postDetailed.location}
                        activity={postDetailed.actvity}
                        shareInfo={postDetailed.share_info}
                    />
                );
            }

            if (!this.props.isBot) {
                indicator = (<BotBadge/>);
            }
        } else if (fromAutoResponder) {
            userProfile = (
                <UserProfile
                    userId={post.user_id}
                    hideStatus={true}
                    hasMention={true}
                    location={postDetailed.location}
                    activity={postDetailed.actvity}
                    shareInfo={postDetailed.share_info}
                />
            );

            indicator = (
                <Badge>
                    <FormattedMessage
                        id='post_info.auto_responder'
                        defaultMessage='AUTOMATIC REPLY'
                    />
                </Badge>
            );
        } else if (isSystemMessage && this.props.isBot) {
            userProfile = (
                <UserProfile
                    userId={post.user_id}
                    hideStatus={true}
                    location={postDetailed.location}
                    activity={postDetailed.actvity}
                    shareInfo={postDetailed.share_info}
                />
            );
        } else if (isSystemMessage) {
            userProfile = (
                <UserProfile
                    userId=''
                    overwriteName={
                        <FormattedMessage
                            id='post_info.system'
                            defaultMessage='System'
                        />
                    }
                    overwriteImage={Constants.SYSTEM_MESSAGE_PROFILE_IMAGE}
                    disablePopover={true}
                    location={postDetailed.location}
                    activity={postDetailed.actvity}
                    shareInfo={postDetailed.share_info}
                />
            );
        }

        if (this.props.compactDisplay) {
            colon = (<strong className='colon'>{':'}</strong>);
        }

        const customStatus = (
            <PostHeaderCustomStatus
                userId={this.props.post.user_id}
                isBot={this.props.isBot || fromWebhook}
                isSystemMessage={isSystemMessage}
            />
        );

        let shareInfoDetails;
        let shareInfoIcon;
        if(postDetailed.share_info !== null && postDetailed.share_info !== ''){
            if(postDetailed.share_info === 'private'){
                shareInfoIcon = (<i className='bi bi-person-fill' title='Private'></i>);
            }
            else if(postDetailed.share_info === 'friends'){
                shareInfoIcon = (<i className='bi bi-people-fill' title='Friends'></i>);
            }
            else{
                shareInfoIcon = (<i className='bi bi-globe' title='Everyone'></i>);
            }

            if(postDetailed.actvity !== null && postDetailed.actvity !== '' && postDetailed.actvity){
                const activityValue = postDetailed.actvity.toString().split('&');
                let textValue = activityValue[0];
                let icon = String.fromCodePoint(activityValue[1].substring(1, activityValue[1].length - 1));
                if(postDetailed.location !== null && postDetailed.location !== ''){
                    shareInfoDetails = (
                        <span className='small' style={{marginTop: 2}}><label className='small'>&nbsp;is feeling&nbsp;</label><label id='rsvDesktop'>{textValue}</label><label>&nbsp;{icon}</label><br/><label className='small'>&nbsp;in&nbsp;</label><label>{postDetailed.location}</label> {shareInfoIcon}</span>
                    );
                }
                else{
                    shareInfoDetails = (
                        <span className='small' style={{marginTop: 2}}><label className='small'>&nbsp;is feeling&nbsp;</label><label id='rsvDesktop'>{textValue}&nbsp;</label><label>{icon}</label> {shareInfoIcon}</span>
                    );
                }
            }
            else if(postDetailed.location !== null && postDetailed.location !== ''){
                shareInfoDetails = (
                    <span className='small' style={{marginTop: 2}}><label className='small'>&nbsp;is in&nbsp;</label><label>{postDetailed.location}</label> {shareInfoIcon}</span>
                );
            }
            else {
                shareInfoDetails = (
                    <span className='small' style={{marginTop: 2}}>&nbsp;{shareInfoIcon}</span>
                );
            }
        }

        return (
            <div className='post__header'>
                <div className='col col__name'>
                    {userProfile}
                    {colon}
                    {indicator}
                    {/*customStatus*/}
                    {/*shareInfoDetails*/}
                </div>
                <div className='col'>
                    <PostInfo
                        post={post}
                        handleCommentClick={this.props.handleCommentClick}
                        handleCardClick={this.props.handleCardClick}
                        handleDropdownOpened={this.props.handleDropdownOpened}
                        compactDisplay={this.props.compactDisplay}
                        isFirstReply={this.props.isFirstReply}
                        showTimeWithoutHover={this.props.showTimeWithoutHover}
                        hover={this.props.hover}
                        isLastPost={this.props.isLastPost}
                    />
                </div>
            </div>
        );
    }
}
