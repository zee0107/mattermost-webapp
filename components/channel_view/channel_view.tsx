// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable react/no-string-refs */

import React from 'react';
import {FormattedMessage} from 'react-intl';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {UserProfile} from 'mattermost-redux/types/users';

import deferComponentRender from 'components/deferComponentRender';
import ChannelHeader from 'components/channel_header';
import CreatePost from 'components/create_post';
import FileUploadOverlay from 'components/file_upload_overlay';
import PostView from 'components/post_view';
import {clearMarks, mark, measure, trackEvent} from 'actions/telemetry_actions.jsx';
import FormattedMarkdownMessage from 'components/formatted_markdown_message';

import profPic from 'images/profiles/user-profile-1.png';
import postPic from 'images/profiles/user-profile-2.png';
import postPic2 from 'images/profiles/user-profile-3.png';
import postImage from 'images/post-1.png';
import postImage2 from 'images/post-image.png';

import {browserHistory} from 'utils/browser_history';

type Props = {
    channelId: string;
    deactivatedChannel: boolean;
    channelRolesLoading: boolean;
    profilePicture: string;
    showNextStepsEphemeral: boolean;
    enableOnboardingFlow: boolean;
    showNextSteps: boolean;
    currentUser: UserProfile;
    teamUrl: string;
    match: {
        url: string;
        params: {
            postid?: string;
        };
    };
    channelIsArchived: boolean;
    viewArchivedChannels: boolean;
    isCloud: boolean;
    actions: {
        goToLastViewedChannel: () => Promise<{data: boolean}>;
        setShowNextStepsView: (x: boolean) => void;
    };
};

type State = {
    channelId: string;
    url: string;
    focusedPostId?: string;
    deferredPostView: any;
};

export default class ChannelView extends React.PureComponent<Props, State> {
    public static createDeferredPostView = () => {
        return deferComponentRender(
            PostView,
            <div
                id='post-list'
                className='a11y__region'
                data-a11y-sort-order='1'
                data-a11y-focus-child={true}
                data-a11y-order-reversed={true}
            />,
        );
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        let updatedState = {};
        const focusedPostId = props.match.params.postid;

        if (props.match.url !== state.url && props.channelId !== state.channelId) {
            updatedState = {deferredPostView: ChannelView.createDeferredPostView(), url: props.match.url, focusedPostId};
        }

        if (props.channelId !== state.channelId) {
            updatedState = {...updatedState, channelId: props.channelId, focusedPostId};
        }

        if (focusedPostId && focusedPostId !== state.focusedPostId) {
            updatedState = {...updatedState, focusedPostId};
        }

        if (Object.keys(updatedState).length) {
            return updatedState;
        }

        return null;
    }
    channelViewRef: React.RefObject<HTMLDivElement>;
    constructor(props: Props) {
        super(props);

        this.state = {
            url: props.match.url,
            channelId: props.channelId,
            focusedPostId: props.match.params.postid,
            deferredPostView: ChannelView.createDeferredPostView(),
        };

        this.channelViewRef = React.createRef();
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {return null;}
        return (<Avatar size={size} url={this.props.profilePicture} />);
    }

    getChannelView = () => {
        return this.channelViewRef.current;
    }

    onClickCloseChannel = () => {
        this.props.actions.goToLastViewedChannel();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.channelId !== this.props.channelId || prevProps.channelIsArchived !== this.props.channelIsArchived) {
            mark('ChannelView#componentDidUpdate');

            const [dur1] = measure('SidebarChannelLink#click', 'ChannelView#componentDidUpdate');
            const [dur2] = measure('TeamLink#click', 'ChannelView#componentDidUpdate');

            clearMarks([
                'SidebarChannelLink#click',
                'ChannelView#componentDidUpdate',
                'TeamLink#click',
            ]);

            if (dur1 !== -1) {
                trackEvent('performance', 'channel_switch', {duration: Math.round(dur1)});
            }
            if (dur2 !== -1) {
                trackEvent('performance', 'team_switch', {duration: Math.round(dur2)});
            }
            if (this.props.channelIsArchived && !this.props.viewArchivedChannels) {
                this.props.actions.goToLastViewedChannel();
            }
        }
    }

    render() {
        const {channelIsArchived, enableOnboardingFlow, showNextSteps, showNextStepsEphemeral, teamUrl} = this.props;
        if (enableOnboardingFlow && showNextSteps && !showNextStepsEphemeral) {
            this.props.actions.setShowNextStepsView(true);
            browserHistory.push(`${teamUrl}/tips`);
        }

        let createPost;
        if (this.props.deactivatedChannel) {
            createPost = (
                <div
                    className='post-create__container'
                    id='post-create'
                >
                    <div
                        className='channel-archived__message'
                    >
                        <FormattedMarkdownMessage
                            id='create_post.deactivated'
                            defaultMessage='You are viewing an archived channel with a **deactivated user**. New messages cannot be posted.'
                        />
                        <button
                            className='btn btn-primary channel-archived__close-btn'
                            onClick={this.onClickCloseChannel}
                        >
                            <FormattedMessage
                                id='center_panel.archived.closeChannel'
                                defaultMessage='Close Channel'
                            />
                        </button>
                    </div>
                </div>
            );
        } else if (channelIsArchived) {
            createPost = (
                <div
                    className='post-create__container'
                    id='post-create'
                >
                    <div
                        id='channelArchivedMessage'
                        className='channel-archived__message'
                    >
                        <FormattedMarkdownMessage
                            id='archivedChannelMessage'
                            defaultMessage='You are viewing an **archived channel**. New messages cannot be posted.'
                        />
                        <button
                            className='btn btn-primary channel-archived__close-btn'
                            onClick={this.onClickCloseChannel}
                        >
                            <FormattedMessage
                                id='center_panel.archived.closeChannel'
                                defaultMessage='Close Channel'
                            />
                        </button>
                    </div>
                </div>
            );
        } else if (!this.props.channelRolesLoading) {
            createPost = (
                <div
                    className='post-create__container'
                    id='post-create'
                >
                    <CreatePost
                        getChannelView={this.getChannelView}
                    />
                </div>
            );
        }

        const DeferredPostView = this.state.deferredPostView;

        return (
            <div
                    ref={this.channelViewRef}
                    id='app-content'
                    className='app__content'
                >
                    <div className='col-md-12 chat-box'>
                        <FileUploadOverlay overlayType='center'/>
                        {/*<ChannelHeader
                        {...this.props}
                        />*/}
                        <div className='mtop-5'>
                            {createPost}
                        </div>
                    </div>
                    <div className='col-md-12 chat-box'>
                        <DeferredPostView
                            channelId={this.props.channelId}
                            focusedPostId={this.state.focusedPostId}
                        />
                    </div>

                    
                    
                    
            </div>
            
        );
    }
}
/* eslint-enable react/no-string-refs */
