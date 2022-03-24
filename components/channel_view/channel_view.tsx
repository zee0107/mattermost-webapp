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
                    <div className='col-md-12 share-div'>
                        <FileUploadOverlay overlayType='center'/>
                        {/*<ChannelHeader
                        {...this.props}
                        />*/}
                        <div className='d-flex'>
                                            <div className='col-md-6 share-div-input removePaddingRight'>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        {this.renderProfilePicture('md')}
                                                    </div>
                                                    <div className='col-sm-10 removePadding'>
                                                        {createPost}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-3 removePaddingRight margin-top-share'>
                                                <select id='selectDesktop' className='share-select small'>
                                                    <option value='Everyone'>&#127760; Everyone</option>
                                                    <option value='Friends'>&#128101; Friends Only</option>
                                                    <option value='Private'>&#128100; Private</option>
                                                </select>
                                                <select id='selectMobile' className='share-select'>
                                                    <option value='Everyone'>&#127760;</option>
                                                    <option value='Friends'>&#128101;</option>
                                                    <option value='Private'>&#128100;</option>
                                                </select>
                                            </div>
                                            <div className='col-md-3 removePaddingRight margin-top-share'>
                                                <div id='buttonsDesktop'>
                                                    <a href='#' className='btn buttonBgWhite btn-margin-right btn-sm'><svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" fill="#44cc4b" className="bi bi-camera-video" viewBox="0 -2 16 16">
                                                        <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z" fill="#44cc4b"/>
                                                    </svg> Live</a>
                                                    <a href='#' className='btn buttonBgGreen btn-padding btn-sm'>Share</a>
                                                </div>
                                                <div id='buttonsMobile'>
                                                    <a href='#' className='btn-margin-right'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#44cc4b" className="bi bi-camera-video" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z" fill="var(--text-primary)"/>
                                                    </svg></a>
                                                    <a href='#' className='btn-padding'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" fill="var(--text-primary)"/>
                                                            <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" fill="var(--text-primary)"/>
                                                    </svg></a>
                                                </div>
                                            </div>
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
