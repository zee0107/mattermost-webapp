// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable react/no-string-refs */

import React from 'react';
import {FormattedMessage} from 'react-intl';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {Client4} from 'mattermost-redux/client';
import {UserProfile} from 'mattermost-redux/types/users';
import UserStory from 'components/user_story/user_story';
import RigthSideView from 'components/right_side_view';
import GroupLogo from 'images/groupcover.png';
import deferComponentRender from 'components/deferComponentRender';
import ChannelHeader from 'components/channel_header';
import CreatePost from 'components/create_post_all';
import CreatePostPage from 'components/create_post_page';
import FileUploadOverlay from 'components/file_upload_overlay';
import PostView from 'components/post_view_all';
import Post from 'components/post_view_all/post';
import PostListRow from 'components/post_view_all/post_list_row';
import LatestPostReader from 'components/post_view_all/post_list_virtualized/latest_post_reader';
import {clearMarks, mark, measure, trackEvent} from 'actions/telemetry_actions.jsx';
import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import StoryList from 'components/story_list';

import ImgIcon from 'images/profiles/image.svg';
import LayoutIcon from 'images/profiles/columns-gap.svg';
import MusicIcon from 'images/profiles/music-note-beamed.svg';
import VideoIcon from 'images/profiles/camera-video.svg';
import GeoIcon from 'images/profiles/geo-alt.svg';
import AttachIcon from 'images/profiles/paperclip.svg';
import SplitIcon from 'images/profiles/menu-icon.svg';
import ShareMobile from 'images/icon-share2.png';
import GlobeMobile from 'images/icon-globe2.png';
import VideoMobile from 'images/icon-cideo-camera.png';
import HolderImg from 'images/place-holder.jpg';
import xIcon from 'images/x.svg';


import profPic from 'images/profiles/user-profile-1.png';
import postImage from 'images/post-1.png';
import postImage2 from 'images/post-image.png';
import postPic from 'images/profiles/user-profile-2.png';
import postPic2 from 'images/profiles/user-profile-3.png';
import GroupHeader from 'components/group_header';
import PageHeader from 'components/page_header';

import {browserHistory} from 'utils/browser_history';
import { Channel, ChannelStats } from 'mattermost-redux/types/channels';
import GroupDetail from 'components/group_details';
import { result } from 'lodash';
import { PostList } from 'mattermost-redux/types/posts';
import { Story } from 'mattermost-redux/types/crypto';
import { Team } from 'mattermost-redux/types/teams';
import { getPreviousRhsState } from 'selectors/rhs';

type Props = {
    channelId: string;
    channelName: string;
    channelPurpose: string;
    channelDisplayName: string;
    deactivatedChannel: boolean;
    channelRolesLoading: boolean;
    profilePicture: string;
    showNextStepsEphemeral: boolean;
    enableOnboardingFlow: boolean;
    showNextSteps: boolean;
    currentUser: UserProfile;
    currentTeam: Team;
    storyList: Promise<Story[]>;
    channel: Channel;
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
    posts?: Promise<PostList>;
    actions: {
        goToLastViewedChannel: () => Promise<{data: boolean}>;
        setShowNextStepsView: (x: boolean) => void;
        leaveChannelNew: (channelId: string) => Promise<ActionResult>;
    };
};

type State = {
    channelId: string;
    url: string;
    focusedPostId?: string;
    deferredPostView: any;
    result_leave: boolean;
    serverError: JSX.Element | string | null;
    uploading: boolean;
    userLocation: string;
    userActivity: string;
    shareInfo: string;
    feeling: boolean;
    postList: PostList;
    storyList: Story[];
    pageProfile: string;
    channelAdmin: boolean;
    filter: string;
    posts: PostList;
    channel: Channel;
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
                data-a11y-order-reversed={false}
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
            window.localStorage.setItem('channelId',props.channelId);
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
            result_leave: false,
            uploading: false, 
            feeling: true,
            userActivity: '',
            userLocation: '',
            shareInfo: 'everyone',
            channelAdmin: false,
            filter: 'all',
        };

        this.onChangeShareInfo = this.onChangeShareInfo.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onChangeActivity = this.onChangeActivity.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.channelViewRef = React.createRef();
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {return null;}
        
        return (<Avatar size={size} url={this.props.profilePicture} />);
    }

    onChangeRole = (value: boolean) => {
        this.setState({channelAdmin: value});
    }

    getProfileImage = async (channel: string) => {
        try{
            const response = await fetch(`https://crypterfighter.polywickstudio.ph/api/crypter/pageprofileimg?id=${channel}`);
            const imageBlob = await response.blob();
            const textBlob = await imageBlob.text();
            if (textBlob.toString() === '\"unavailable\"' || textBlob.toString() === 'unavailable')
            {
                this.setState({pageProfile: 'unavailable'});
            }
            else
            {
                const imageObjectURL = URL.createObjectURL(imageBlob);
                this.setState({pageProfile: imageObjectURL});
            }
        }
        catch(error){
            conosle.log(error);
        }
    }

    getChannelView = () => {
        return this.channelViewRef.current;
    }

    onChangeFilter = (value: string) => {
        this.setState({filter: value});
    }

    onClickCloseChannel = () => {
        this.props.actions.goToLastViewedChannel();
    }

    onChangeShareInfo = (event) => {
        this.setState({shareInfo: event.target.value});
    }

    onChangePageShareInfo = (value: string) => {
        this.setState({shareInfo: value});
    }

    onChangeLocation = (event) => {
        this.setState({userLocation: event.target.value});
    }

    onChangeActivity = (event) => {
        this.setState({userActivity: event.target.value});
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.channelId !== this.props.channelId || prevProps.channelIsArchived !== this.props.channelIsArchived) {
            window.localStorage.setItem('focusedPostId',this.state.focusedPostId);
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

            if(this.props.storyList !== prevProps.storyList){
                if(this.props.storyList !== undefined && this.props.storyList !== null){
                    Promise.resolve(this.props.storyList).then((value) => {this.setState({storyList: value});} );
                }
            }
                    
            if(this.props.posts){
                Promise.resolve(this.props.posts).then((value) => { this.setState({posts: value});});
            }
        }

        if(this.props.channel){
            if(this.props.channel !== prevProps.channel){
                this.setState({channel: this.props.channel});
            }
        }
    }

    render() {
        const {channelIsArchived, enableOnboardingFlow, showNextSteps, showNextStepsEphemeral, teamUrl, channelName,channelDisplayName,channelId, currentUser, currentTeam} = this.props;
        const { uploading, shareInfo, userLocation, feeling, storyList, channelAdmin, posts, channel } = this.state;
        if (enableOnboardingFlow && showNextSteps && !showNextStepsEphemeral) {
            this.props.actions.setShowNextStepsView(true);
            browserHistory.push(`${teamUrl}/tips`);
        }
        let postsView;
        if (posts) {
            if(channel){
                postsView = (
                    <>
                        <LatestPostReader postIds={posts.order}/>
                        {posts && Object.keys(posts.posts).map((post,ind) => {
                            return (<Post postId={post} post={posts.posts[post]} userId={currentUser.id} key={`${posts.posts[post].id}`}/>);
                        })}
                    </>
                );
            }
        }else{
            postsView = (
                <>
                    <h3 className='text-muted text-center'><i className='bi bi-file-earmark-x'></i> No Posts to show.</h3>
                </>
            );
        }

        let shareInfoBtn;
        let shareInfoDd;
        let location;
        let feelact;
        let feelactView;
        let userDisplayname;
        let userDisplayprofile;

        let textValue;
        let icon;
        if(this.state.userActivity !== null && this.state.userActivity !== ''){
            const activityValue = this.state.userActivity.split('&');
            textValue = activityValue[0];
            icon = String.fromCodePoint(activityValue[1].substring(1, activityValue[1].length - 1));
            feelact = (
                <a href='#' className='feelingspost text-dark'><small className='text-muted'>is feeling {textValue}</small> {icon}&nbsp;</a>
            );
        }

        if(feeling){
            feelactView = (
                <div className='feelingscontent'>
                    {/*<div className='input-group d-flex mb-0'>
                        <span className='input-group-text input-search-crypter-span p-2' id='basic-addon1'><i className='bi-search'></i></span>
                        <input id='searchFeelings' type='text' className='form-control form-control-dark input-search-crypter p-5' placeholder='Search' aria-label='Search'/>
                    </div>*/}
    
                    <div className='mt-3'>
                        {this.state.userActivity && <a className='feelingspost onClosefeelingsviews ml-4 p-2' style={{ border: '1px solid grey', borderRadius: 8}} onClick={() => {this.setState({userActivity: ''});}}><label className='text-dark'>{textValue} {icon}<i className='bi-x-lg'></i></label></a>}
                    </div>
    
                    <div id='searchfeelings'>
                        <div className='d-flex mt-3'>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1 onFeelingselect' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Grinning face &#128512;'}); }}>&#128512;</label> <br /> <small>Grinning face</small></p> 
                            </div>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Smiling eyes &#128513;'}); }}>&#128513;</label> <br /> <small>Smiling eyes</small></p>
                            </div>
                        </div>
                        <div className='d-flex'>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Tears of joy &#128514;'}); }}>&#128514;</label> <br /> <small>Tears of joy</small></p> 
                            </div>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Open mouth &#128515;'}); }}>&#128515;</label> <br /> <small>Open mouth</small></p> 
                            </div>
                        </div>
                        <div className='d-flex'>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Smilling eyes &#128516;'}); }}>&#128516;</label> <br /> <small>Smiling eyes</small></p> 
                            </div>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Cold sweat &#128517;'}); }}>&#128517;</label> <br /> <small>Cold sweat</small></p>
                            </div>
                        </div>
                        <div className='d-flex'>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Tightly closed eye &#128518;'}); }}>&#128518;</label> <br /> <small>Tightly closed eye</small></p>
                            </div>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Smiling with halo &#128519;'}); }}>&#128519;</label> <br /> <small>Smiling with halo</small></p>
                            </div>
                        </div>
                    </div>
    
                </div>
            );
        }
        else{
            feelactView = (
                <div className='activitiescontent'>
                    <div className='mt-3 mb-3'>
                        {this.state.userActivity && <a className='activitiespost onCloseactivitiessviews ml-4 p-2' style={{ border: '1px solid grey', borderRadius: 8}} onClick={() => {this.setState({userActivity: ''});}}><label className='text-dark'>{textValue} {icon}<i className='bi-x-lg'></i></label></a>}
                    </div>
                    <div id='searchactivities'>
                        <div className='d-flex mt-1'>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1 onActivitiesselect' style={{border: '1px solid grey', borderRadius: 8,}} onClick={() => { this.setState({userActivity: 'Loving &#128151;'}); }}><label style={{fontSize: 20}}>&#128151;</label> <br /> <small>Loving</small></p> 
                            </div>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Face screaming in fear &#128561;'}); }}>&#128561;</label> <br /> <small>Face screaming in fear</small></p> 
                            </div>
                        </div>
                        <div className='d-flex mt-1'>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1 onFeelingselect' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Astonished face &#128562;'}); }}>&#128562;</label> <br /> <small>Astonished face</small></p>
                            </div>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Sleeping face &#128564;'}); }}>&#128564;</label> <br /> <small>Sleeping face</small></p>
                            </div>
                        </div>
                        <div className='d-flex mt-1'>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1 onFeelingselect' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Dizzy face &#128565;'}); }}>&#128565;</label> <br /> <small>Dizzy face</small></p>
                            </div>
                            <div className='col-md-6 width-50 text-center'>
                                <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Face with medical mask &#128567;'}); }}>&#128567;</label> <br /> <small>Face with medical mask</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if(userLocation !== null && userLocation !== ''){
            location = (<a href='#' className='locationviewpost text-dark'><small className='text-muted'> is in</small> {userLocation}</a> );
        }

        if(shareInfo === 'private'){
            shareInfoBtn = (<button className='box-live-post btn-sm width-100 p-3' data-bs-toggle='modal' data-bs-target='#staticBackdropShare'><i className='bi bi-person-fill'></i> Private <i className='bi bi-chevron-down'></i></button>);
            shareInfoDd = (<a className='onSelectactiononlyme text-dark' data-bs-toggle='modal' data-bs-target='#staticBackdropShare' data-bs-dismiss='modal'><i className='bi-person-fill'></i> Private <i className='bi-chevron-down'></i></a>);
        }else if(shareInfo === 'friends'){
            shareInfoBtn = (<button className='box-live-post btn-sm width-100 p-3' data-bs-toggle='modal' data-bs-target='#staticBackdropShare'><i className='bi bi-people-fill'></i> Friends <i className='bi bi-chevron-down'></i></button>);
            shareInfoDd = (<a className='onSelectactionfriends text-dark' data-bs-toggle='modal' data-bs-target='#staticBackdropShare' data-bs-dismiss='modal'><i className='bi-people-fill'></i> Friends <i className='bi-chevron-down'></i></a>);
        }else if(shareInfo === 'everyone'){
            shareInfoBtn = (<button className='box-live-post btn-sm width-100 p-3' data-bs-toggle='modal' data-bs-target='#staticBackdropShare'><i className='bi bi-globe'></i> Everyone <i className='bi bi-chevron-down'></i></button>);
            shareInfoDd = (<a className='onSelectactionpublic text-dark' data-bs-toggle='modal' data-bs-target='#staticBackdropShare' data-bs-dismiss='modal'><i className='bi-globe'></i> Everyone <i className='bi-chevron-down'></i></a>);
        }else{
        }

        const DeferredPostView = this.state.deferredPostView;
        let viewDetail;
        let isMounted = false;
        let createPost;
        let userDisplayprofileXl;
        let postBoxDesktop;
        let postBoxMobile;
        if(currentTeam){
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
            }
            else if(currentTeam.name === 'page'){
                createPost = (
                    <>
                        <CreatePostPage
                            getChannelView={this.getChannelView}
                            uploading={this.state.uploading} userActivity={this.state.userActivity} userLocation={this.state.userLocation} shareInfo={this.state.shareInfo}
                        />
                    </>
                );
            }
             else if (!this.props.channelRolesLoading) {
                createPost = (
                    <>
                        <CreatePost
                            getChannelView={this.getChannelView}
                            uploading={this.state.uploading} userActivity={this.state.userActivity} userLocation={this.state.userLocation} shareInfo={this.state.shareInfo}
                        />
                    </>
                );
            }

            if(currentTeam.name === 'page'){
                this.onChangePageShareInfo('');
                viewDetail = (
                    <>
                        <PageHeader 
                            channelId={channelId}
                            channelDisplayName={channelDisplayName} 
                            onChangeRole={this.onChangeRole}
                            isMounted={true}/>
                    </>
                );
                userDisplayname = channelDisplayName;
                if(channelId){
                    this.getProfileImage(channelId);
                    userDisplayprofile = (
                        <>
                            <img className='Avatar Avatar-md user-photo vertical-align-middle' src={this.state.pageProfile} />
                        </>
                    );

                    userDisplayprofileXl = (
                        <>
                            <img className='Avatar Avatar-xl user-photo vertical-align-middle' src={this.state.pageProfile} />
                        </>
                    );
                }

                if(channelAdmin){
                    postBoxDesktop = (
                        <div className='box-middle-panel crypter-section-profile-desktop'>
                            <div className='row'>
                                <div className='col-md-8 text-center removePaddingRight'>
                                    <div className='d-flex float-start width-100'>
                                        <span className='input-search-crypter-whats-going-on' id='basic-addon22'>
                                            {userDisplayprofile}</span>
                                        <input type='text' className='form-control input-search-crypter-whats-going-on onCreatepost mt-1' placeholder={`What's going on, ${userDisplayname}`} aria-label={`What's going on, ${userDisplayname}`} aria-describedby='basic-addon55' data-bs-toggle='modal' data-bs-target='#staticBackdrop'/>
                                        <span className='input-search-crypter-whats-going-on onPhotoaddpost mt-1' onClick={() => {this.setState({uploading: true});}} id='basic-addon33' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>
                                            <a href='#'><svg width='21' height='21' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M13.7555 4.41165H11.7685L10.6215 3.15802H6.86061V4.41165H10.0699L11.217 5.66527H13.7555V13.187H3.72656V7.54571H2.47293V13.187C2.47293 13.8765 3.03706 14.4406 3.72656 14.4406H13.7555C14.445 14.4406 15.0092 13.8765 15.0092 13.187V5.66527C15.0092 4.97578 14.445 4.41165 13.7555 4.41165ZM5.60699 9.42614C5.60699 11.1561 7.01105 12.5602 8.74105 12.5602C10.4711 12.5602 11.8751 11.1561 11.8751 9.42614C11.8751 7.69614 10.4711 6.29208 8.74105 6.29208C7.01105 6.29208 5.60699 7.69614 5.60699 9.42614ZM8.74105 7.54571C9.77529 7.54571 10.6215 8.3919 10.6215 9.42614C10.6215 10.4604 9.77529 11.3066 8.74105 11.3066C7.70681 11.3066 6.86061 10.4604 6.86061 9.42614C6.86061 8.3919 7.70681 7.54571 8.74105 7.54571ZM3.72656 4.41165H5.60699V3.15802H3.72656V1.27759H2.47293V3.15802H0.592499V4.41165H2.47293V6.29208H3.72656V4.41165Z' fill='var(--text-primary)'/>
                                            </svg></a></span>
                                        <span className='input-search-crypter-whats-going-on onEmoji p-2 mt-1' id='basic-addon44' data-bs-toggle='modal' data-bs-target='#staticBackdropAct'>
                                            <a href='#'><svg width='18' height='18' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M8.75 7.875C8.75 8.10706 8.65781 8.32962 8.49372 8.49372C8.32962 8.65781 8.10706 8.75 7.875 8.75C7.64294 8.75 7.42038 8.65781 7.25628 8.49372C7.09219 8.32962 7 8.10706 7 7.875C7 7.64294 7.09219 7.42038 7.25628 7.25628C7.42038 7.09219 7.64294 7 7.875 7C8.10706 7 8.32962 7.09219 8.49372 7.25628C8.65781 7.42038 8.75 7.64294 8.75 7.875V7.875ZM13.125 8.75C13.3571 8.75 13.5796 8.65781 13.7437 8.49372C13.9078 8.32962 14 8.10706 14 7.875C14 7.64294 13.9078 7.42038 13.7437 7.25628C13.5796 7.09219 13.3571 7 13.125 7C12.8929 7 12.6704 7.09219 12.5063 7.25628C12.3422 7.42038 12.25 7.64294 12.25 7.875C12.25 8.10706 12.3422 8.32962 12.5063 8.49372C12.6704 8.65781 12.8929 8.75 13.125 8.75V8.75ZM1.75 5.25C1.75 4.32174 2.11875 3.4315 2.77513 2.77513C3.4315 2.11875 4.32174 1.75 5.25 1.75H15.75C16.6783 1.75 17.5685 2.11875 18.2249 2.77513C18.8812 3.4315 19.25 4.32174 19.25 5.25V13.125C19.2502 13.24 19.2277 13.3539 19.1839 13.4602C19.1401 13.5665 19.0757 13.6631 18.9945 13.7445L13.7445 18.9945C13.6631 19.0757 13.5665 19.1401 13.4602 19.1839C13.3539 19.2277 13.24 19.2502 13.125 19.25H5.25C4.32174 19.25 3.4315 18.8812 2.77513 18.2249C2.11875 17.5685 1.75 16.6783 1.75 15.75V5.25ZM5.25 3.5C4.78587 3.5 4.34075 3.68437 4.01256 4.01256C3.68437 4.34075 3.5 4.78587 3.5 5.25V15.75C3.5 16.2141 3.68437 16.6592 4.01256 16.9874C4.34075 17.3156 4.78587 17.5 5.25 17.5H10.5V14.0175H10.493C9.3065 14.0175 8.442 13.419 7.91175 12.8852C7.59864 12.5698 7.33015 12.213 7.11375 11.8247L7.09975 11.7985L7.09625 11.7897L7.0945 11.7862L7.09275 11.7845C6.99319 11.5745 6.98115 11.3335 7.05925 11.1146C7.13736 10.8957 7.29923 10.7168 7.50925 10.6172C7.71927 10.5177 7.96023 10.5056 8.17913 10.5838C8.39804 10.6619 8.57694 10.8237 8.6765 11.0337C8.80777 11.2579 8.9665 11.4649 9.149 11.6497C9.492 11.9927 9.9365 12.2675 10.493 12.2675C10.6679 12.2677 10.8417 12.2394 11.0075 12.1835C11.62 11.1737 12.7312 10.5 14 10.5H17.5V5.25C17.5 4.78587 17.3156 4.34075 16.9874 4.01256C16.6592 3.68437 16.2141 3.5 15.75 3.5H5.25ZM17.5 12.25H14C13.5359 12.25 13.0908 12.4344 12.7626 12.7626C12.4344 13.0908 12.25 13.5359 12.25 14V17.5H12.7627L17.5 12.7627V12.25Z' fill='var(--text-primary)'/>
                                            </svg></a>
                                        </span>
                                    </div>
                                </div>
                                {/*<div className='col-md-3'>
                                    <div className='d-grid'>
                                    {shareInfoBtn}</div>
                                </div>*/}
                                    <div className='col-md-2'><div className='d-grid'><button className='box-live-post btn-sm width-100 p-3' onClick={() => { this.setState({uploading: true});}} aria-describedby='basic-addon1010' data-bs-toggle='modal' data-bs-target='#staticBackdrop'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='var(--text-primary)' className='bi bi-camera-video side-menu-align' viewBox='0 0 16 16'>
                                            <path fillRule='evenodd' d='M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z' fill='var(--text-primary)'/>
                                            </svg> Live</button></div>
                                    </div>
                                    <div className='col-md-2'><div className='d-grid'><button className='box-button-share btn-sm text-white onCreatepost width-100' aria-describedby='basic-addon99' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>Share</button></div>
                                </div>
                            </div>
                        </div>
                    );
                    postBoxMobile = (
                        <div id='post-mobile'>
                            <div className='d-flex'>
                                <div className='whats-going-on-here-style float-start'>
                                    <div className='d-flex bg-inputs-whats'>
                                        <span className='input-search-crypter-whats-going-on' id='basic-addon22'>
                                        {userDisplayprofile}</span>
                                        <input type='text' className='form-control input-search-crypter-whats-going-on onCreatepost mt-1' placeholder={`What's going on, ${userDisplayname}`} aria-label={`What's going on, ${userDisplayname}`} aria-describedby='basic-addon55' data-bs-toggle='modal' data-bs-target='#staticBackdrop' />
                                        <span className='input-search-crypter-whats-going-on onPhotoaddpost mt-1' onClick={() => { this.setState({uploading: true});}} aria-describedby='basic-addon1011' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>
                                            <a href='#'><svg width='21' height='21' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M13.7555 4.41165H11.7685L10.6215 3.15802H6.86061V4.41165H10.0699L11.217 5.66527H13.7555V13.187H3.72656V7.54571H2.47293V13.187C2.47293 13.8765 3.03706 14.4406 3.72656 14.4406H13.7555C14.445 14.4406 15.0092 13.8765 15.0092 13.187V5.66527C15.0092 4.97578 14.445 4.41165 13.7555 4.41165ZM5.60699 9.42614C5.60699 11.1561 7.01105 12.5602 8.74105 12.5602C10.4711 12.5602 11.8751 11.1561 11.8751 9.42614C11.8751 7.69614 10.4711 6.29208 8.74105 6.29208C7.01105 6.29208 5.60699 7.69614 5.60699 9.42614ZM8.74105 7.54571C9.77529 7.54571 10.6215 8.3919 10.6215 9.42614C10.6215 10.4604 9.77529 11.3066 8.74105 11.3066C7.70681 11.3066 6.86061 10.4604 6.86061 9.42614C6.86061 8.3919 7.70681 7.54571 8.74105 7.54571ZM3.72656 4.41165H5.60699V3.15802H3.72656V1.27759H2.47293V3.15802H0.592499V4.41165H2.47293V6.29208H3.72656V4.41165Z' fill='var(--text-primary)'/>
                                            </svg></a></span>
                                        <span className='input-search-crypter-whats-going-on onEmoji p-2 mt-1' id='basic-addon45' data-bs-toggle='modal' data-bs-target='#staticBackdropAct'>
                                            <a href='#'><svg width='18' height='18' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M8.75 7.875C8.75 8.10706 8.65781 8.32962 8.49372 8.49372C8.32962 8.65781 8.10706 8.75 7.875 8.75C7.64294 8.75 7.42038 8.65781 7.25628 8.49372C7.09219 8.32962 7 8.10706 7 7.875C7 7.64294 7.09219 7.42038 7.25628 7.25628C7.42038 7.09219 7.64294 7 7.875 7C8.10706 7 8.32962 7.09219 8.49372 7.25628C8.65781 7.42038 8.75 7.64294 8.75 7.875V7.875ZM13.125 8.75C13.3571 8.75 13.5796 8.65781 13.7437 8.49372C13.9078 8.32962 14 8.10706 14 7.875C14 7.64294 13.9078 7.42038 13.7437 7.25628C13.5796 7.09219 13.3571 7 13.125 7C12.8929 7 12.6704 7.09219 12.5063 7.25628C12.3422 7.42038 12.25 7.64294 12.25 7.875C12.25 8.10706 12.3422 8.32962 12.5063 8.49372C12.6704 8.65781 12.8929 8.75 13.125 8.75V8.75ZM1.75 5.25C1.75 4.32174 2.11875 3.4315 2.77513 2.77513C3.4315 2.11875 4.32174 1.75 5.25 1.75H15.75C16.6783 1.75 17.5685 2.11875 18.2249 2.77513C18.8812 3.4315 19.25 4.32174 19.25 5.25V13.125C19.2502 13.24 19.2277 13.3539 19.1839 13.4602C19.1401 13.5665 19.0757 13.6631 18.9945 13.7445L13.7445 18.9945C13.6631 19.0757 13.5665 19.1401 13.4602 19.1839C13.3539 19.2277 13.24 19.2502 13.125 19.25H5.25C4.32174 19.25 3.4315 18.8812 2.77513 18.2249C2.11875 17.5685 1.75 16.6783 1.75 15.75V5.25ZM5.25 3.5C4.78587 3.5 4.34075 3.68437 4.01256 4.01256C3.68437 4.34075 3.5 4.78587 3.5 5.25V15.75C3.5 16.2141 3.68437 16.6592 4.01256 16.9874C4.34075 17.3156 4.78587 17.5 5.25 17.5H10.5V14.0175H10.493C9.3065 14.0175 8.442 13.419 7.91175 12.8852C7.59864 12.5698 7.33015 12.213 7.11375 11.8247L7.09975 11.7985L7.09625 11.7897L7.0945 11.7862L7.09275 11.7845C6.99319 11.5745 6.98115 11.3335 7.05925 11.1146C7.13736 10.8957 7.29923 10.7168 7.50925 10.6172C7.71927 10.5177 7.96023 10.5056 8.17913 10.5838C8.39804 10.6619 8.57694 10.8237 8.6765 11.0337C8.80777 11.2579 8.9665 11.4649 9.149 11.6497C9.492 11.9927 9.9365 12.2675 10.493 12.2675C10.6679 12.2677 10.8417 12.2394 11.0075 12.1835C11.62 11.1737 12.7312 10.5 14 10.5H17.5V5.25C17.5 4.78587 17.3156 4.34075 16.9874 4.01256C16.6592 3.68437 16.2141 3.5 15.75 3.5H5.25ZM17.5 12.25H14C13.5359 12.25 13.0908 12.4344 12.7626 12.7626C12.4344 13.0908 12.25 13.5359 12.25 14V17.5H12.7627L17.5 12.7627V12.25Z' fill='var(--text-primary)'/>
                                            </svg></a>
                                        </span>
                                    </div>
                                </div>
                                <div className='button-share-camera-globe'>
                                    <div className='d-flex'>
                                    <div className='col-md-4 text-center mt-3'>
                                        <a className='onPhotoaddpost' onClick={() => { this.setState({uploading: true});}} aria-describedby='basic-addon1011' data-bs-toggle='modal' data-bs-target='#staticBackdrop'><img width='24' className='mt-1' src={VideoMobile} /></a></div>
                                    <div className='col-md-4 text-center mt-3'>
                                        <a className='onCreatepost' data-bs-toggle='modal' data-bs-target='#staticBackdrop'><img width='24' className='mt-1' src={ShareMobile} /></a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            }else{
                userDisplayname = currentUser.first_name + ' ' + currentUser.last_name;
                userDisplayprofile = (
                    <>
                        {this.renderProfilePicture('md')}
                    </>
                );

                userDisplayprofileXl = (
                    <>
                        {this.renderProfilePicture('xl')}
                    </>
                );
                postBoxDesktop = (
                    <div className='box-middle-panel crypter-section-profile-desktop'>
                        <div className='row'>
                            <div className='col-md-5 text-center removePaddingRight'>
                                <div className='d-flex float-start width-100'>
                                    <span className='input-search-crypter-whats-going-on' id='basic-addon22'>
                                        {userDisplayprofile}</span>
                                    <input type='text' className='form-control input-search-crypter-whats-going-on onCreatepost mt-1' placeholder={`What's going on, ${userDisplayname}`} aria-label={`What's going on, ${userDisplayname}`} aria-describedby='basic-addon55' data-bs-toggle='modal' data-bs-target='#staticBackdrop'/>
                                    <span className='input-search-crypter-whats-going-on onPhotoaddpost mt-1' onClick={() => {this.setState({uploading: true});}} id='basic-addon33' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>
                                        <a href='#'><svg width='21' height='21' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M13.7555 4.41165H11.7685L10.6215 3.15802H6.86061V4.41165H10.0699L11.217 5.66527H13.7555V13.187H3.72656V7.54571H2.47293V13.187C2.47293 13.8765 3.03706 14.4406 3.72656 14.4406H13.7555C14.445 14.4406 15.0092 13.8765 15.0092 13.187V5.66527C15.0092 4.97578 14.445 4.41165 13.7555 4.41165ZM5.60699 9.42614C5.60699 11.1561 7.01105 12.5602 8.74105 12.5602C10.4711 12.5602 11.8751 11.1561 11.8751 9.42614C11.8751 7.69614 10.4711 6.29208 8.74105 6.29208C7.01105 6.29208 5.60699 7.69614 5.60699 9.42614ZM8.74105 7.54571C9.77529 7.54571 10.6215 8.3919 10.6215 9.42614C10.6215 10.4604 9.77529 11.3066 8.74105 11.3066C7.70681 11.3066 6.86061 10.4604 6.86061 9.42614C6.86061 8.3919 7.70681 7.54571 8.74105 7.54571ZM3.72656 4.41165H5.60699V3.15802H3.72656V1.27759H2.47293V3.15802H0.592499V4.41165H2.47293V6.29208H3.72656V4.41165Z' fill='var(--text-primary)'/>
                                        </svg></a></span>
                                    <span className='input-search-crypter-whats-going-on onEmoji p-2 mt-1' id='basic-addon44' data-bs-toggle='modal' data-bs-target='#staticBackdropAct'>
                                        <a href='#'><svg width='18' height='18' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M8.75 7.875C8.75 8.10706 8.65781 8.32962 8.49372 8.49372C8.32962 8.65781 8.10706 8.75 7.875 8.75C7.64294 8.75 7.42038 8.65781 7.25628 8.49372C7.09219 8.32962 7 8.10706 7 7.875C7 7.64294 7.09219 7.42038 7.25628 7.25628C7.42038 7.09219 7.64294 7 7.875 7C8.10706 7 8.32962 7.09219 8.49372 7.25628C8.65781 7.42038 8.75 7.64294 8.75 7.875V7.875ZM13.125 8.75C13.3571 8.75 13.5796 8.65781 13.7437 8.49372C13.9078 8.32962 14 8.10706 14 7.875C14 7.64294 13.9078 7.42038 13.7437 7.25628C13.5796 7.09219 13.3571 7 13.125 7C12.8929 7 12.6704 7.09219 12.5063 7.25628C12.3422 7.42038 12.25 7.64294 12.25 7.875C12.25 8.10706 12.3422 8.32962 12.5063 8.49372C12.6704 8.65781 12.8929 8.75 13.125 8.75V8.75ZM1.75 5.25C1.75 4.32174 2.11875 3.4315 2.77513 2.77513C3.4315 2.11875 4.32174 1.75 5.25 1.75H15.75C16.6783 1.75 17.5685 2.11875 18.2249 2.77513C18.8812 3.4315 19.25 4.32174 19.25 5.25V13.125C19.2502 13.24 19.2277 13.3539 19.1839 13.4602C19.1401 13.5665 19.0757 13.6631 18.9945 13.7445L13.7445 18.9945C13.6631 19.0757 13.5665 19.1401 13.4602 19.1839C13.3539 19.2277 13.24 19.2502 13.125 19.25H5.25C4.32174 19.25 3.4315 18.8812 2.77513 18.2249C2.11875 17.5685 1.75 16.6783 1.75 15.75V5.25ZM5.25 3.5C4.78587 3.5 4.34075 3.68437 4.01256 4.01256C3.68437 4.34075 3.5 4.78587 3.5 5.25V15.75C3.5 16.2141 3.68437 16.6592 4.01256 16.9874C4.34075 17.3156 4.78587 17.5 5.25 17.5H10.5V14.0175H10.493C9.3065 14.0175 8.442 13.419 7.91175 12.8852C7.59864 12.5698 7.33015 12.213 7.11375 11.8247L7.09975 11.7985L7.09625 11.7897L7.0945 11.7862L7.09275 11.7845C6.99319 11.5745 6.98115 11.3335 7.05925 11.1146C7.13736 10.8957 7.29923 10.7168 7.50925 10.6172C7.71927 10.5177 7.96023 10.5056 8.17913 10.5838C8.39804 10.6619 8.57694 10.8237 8.6765 11.0337C8.80777 11.2579 8.9665 11.4649 9.149 11.6497C9.492 11.9927 9.9365 12.2675 10.493 12.2675C10.6679 12.2677 10.8417 12.2394 11.0075 12.1835C11.62 11.1737 12.7312 10.5 14 10.5H17.5V5.25C17.5 4.78587 17.3156 4.34075 16.9874 4.01256C16.6592 3.68437 16.2141 3.5 15.75 3.5H5.25ZM17.5 12.25H14C13.5359 12.25 13.0908 12.4344 12.7626 12.7626C12.4344 13.0908 12.25 13.5359 12.25 14V17.5H12.7627L17.5 12.7627V12.25Z' fill='var(--text-primary)'/>
                                        </svg></a>
                                    </span>
                                </div>
                            </div>
                            <div className='col-md-3'><div className='d-grid'>
                                {shareInfoBtn}</div></div>
                                <div className='col-md-2'><div className='d-grid'><button className='box-live-post btn-sm width-100 p-3' onClick={() => { this.setState({uploading: true});}} aria-describedby='basic-addon1010' data-bs-toggle='modal' data-bs-target='#staticBackdrop'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='var(--text-primary)' className='bi bi-camera-video side-menu-align' viewBox='0 0 16 16'>
                                        <path fillRule='evenodd' d='M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z' fill='var(--text-primary)'/>
                                        </svg> Live</button></div>
                                </div>
                                <div className='col-md-2'><div className='d-grid'><button className='box-button-share btn-sm text-white onCreatepost width-100' aria-describedby='basic-addon99' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>Share</button></div>
                            </div>
                        </div>
                    </div>
                );
                postBoxMobile = (
                    <div id='post-mobile'>
                        <div className='d-flex'>
                            <div className='whats-going-on-here-style float-start'>
                                <div className='d-flex bg-inputs-whats'>
                                    <span className='input-search-crypter-whats-going-on' id='basic-addon22'>
                                    {userDisplayprofile}</span>
                                    <input type='text' className='form-control input-search-crypter-whats-going-on onCreatepost mt-1' placeholder={`What's going on, ${userDisplayname}`} aria-label={`What's going on, ${userDisplayname}`} aria-describedby='basic-addon55' data-bs-toggle='modal' data-bs-target='#staticBackdrop' />
                                    <span className='input-search-crypter-whats-going-on onPhotoaddpost mt-1' onClick={() => { this.setState({uploading: true});}} aria-describedby='basic-addon1011' data-bs-toggle='modal' data-bs-target='#staticBackdrop'>
                                        <a href='#'><svg width='21' height='21' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M13.7555 4.41165H11.7685L10.6215 3.15802H6.86061V4.41165H10.0699L11.217 5.66527H13.7555V13.187H3.72656V7.54571H2.47293V13.187C2.47293 13.8765 3.03706 14.4406 3.72656 14.4406H13.7555C14.445 14.4406 15.0092 13.8765 15.0092 13.187V5.66527C15.0092 4.97578 14.445 4.41165 13.7555 4.41165ZM5.60699 9.42614C5.60699 11.1561 7.01105 12.5602 8.74105 12.5602C10.4711 12.5602 11.8751 11.1561 11.8751 9.42614C11.8751 7.69614 10.4711 6.29208 8.74105 6.29208C7.01105 6.29208 5.60699 7.69614 5.60699 9.42614ZM8.74105 7.54571C9.77529 7.54571 10.6215 8.3919 10.6215 9.42614C10.6215 10.4604 9.77529 11.3066 8.74105 11.3066C7.70681 11.3066 6.86061 10.4604 6.86061 9.42614C6.86061 8.3919 7.70681 7.54571 8.74105 7.54571ZM3.72656 4.41165H5.60699V3.15802H3.72656V1.27759H2.47293V3.15802H0.592499V4.41165H2.47293V6.29208H3.72656V4.41165Z' fill='var(--text-primary)'/>
                                        </svg></a></span>
                                    <span className='input-search-crypter-whats-going-on onEmoji p-2 mt-1' id='basic-addon45' data-bs-toggle='modal' data-bs-target='#staticBackdropAct'>
                                        <a href='#'><svg width='18' height='18' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <path d='M8.75 7.875C8.75 8.10706 8.65781 8.32962 8.49372 8.49372C8.32962 8.65781 8.10706 8.75 7.875 8.75C7.64294 8.75 7.42038 8.65781 7.25628 8.49372C7.09219 8.32962 7 8.10706 7 7.875C7 7.64294 7.09219 7.42038 7.25628 7.25628C7.42038 7.09219 7.64294 7 7.875 7C8.10706 7 8.32962 7.09219 8.49372 7.25628C8.65781 7.42038 8.75 7.64294 8.75 7.875V7.875ZM13.125 8.75C13.3571 8.75 13.5796 8.65781 13.7437 8.49372C13.9078 8.32962 14 8.10706 14 7.875C14 7.64294 13.9078 7.42038 13.7437 7.25628C13.5796 7.09219 13.3571 7 13.125 7C12.8929 7 12.6704 7.09219 12.5063 7.25628C12.3422 7.42038 12.25 7.64294 12.25 7.875C12.25 8.10706 12.3422 8.32962 12.5063 8.49372C12.6704 8.65781 12.8929 8.75 13.125 8.75V8.75ZM1.75 5.25C1.75 4.32174 2.11875 3.4315 2.77513 2.77513C3.4315 2.11875 4.32174 1.75 5.25 1.75H15.75C16.6783 1.75 17.5685 2.11875 18.2249 2.77513C18.8812 3.4315 19.25 4.32174 19.25 5.25V13.125C19.2502 13.24 19.2277 13.3539 19.1839 13.4602C19.1401 13.5665 19.0757 13.6631 18.9945 13.7445L13.7445 18.9945C13.6631 19.0757 13.5665 19.1401 13.4602 19.1839C13.3539 19.2277 13.24 19.2502 13.125 19.25H5.25C4.32174 19.25 3.4315 18.8812 2.77513 18.2249C2.11875 17.5685 1.75 16.6783 1.75 15.75V5.25ZM5.25 3.5C4.78587 3.5 4.34075 3.68437 4.01256 4.01256C3.68437 4.34075 3.5 4.78587 3.5 5.25V15.75C3.5 16.2141 3.68437 16.6592 4.01256 16.9874C4.34075 17.3156 4.78587 17.5 5.25 17.5H10.5V14.0175H10.493C9.3065 14.0175 8.442 13.419 7.91175 12.8852C7.59864 12.5698 7.33015 12.213 7.11375 11.8247L7.09975 11.7985L7.09625 11.7897L7.0945 11.7862L7.09275 11.7845C6.99319 11.5745 6.98115 11.3335 7.05925 11.1146C7.13736 10.8957 7.29923 10.7168 7.50925 10.6172C7.71927 10.5177 7.96023 10.5056 8.17913 10.5838C8.39804 10.6619 8.57694 10.8237 8.6765 11.0337C8.80777 11.2579 8.9665 11.4649 9.149 11.6497C9.492 11.9927 9.9365 12.2675 10.493 12.2675C10.6679 12.2677 10.8417 12.2394 11.0075 12.1835C11.62 11.1737 12.7312 10.5 14 10.5H17.5V5.25C17.5 4.78587 17.3156 4.34075 16.9874 4.01256C16.6592 3.68437 16.2141 3.5 15.75 3.5H5.25ZM17.5 12.25H14C13.5359 12.25 13.0908 12.4344 12.7626 12.7626C12.4344 13.0908 12.25 13.5359 12.25 14V17.5H12.7627L17.5 12.7627V12.25Z' fill='var(--text-primary)'/>
                                        </svg></a>
                                    </span>
                                </div>
                            </div>
                            <div className='button-share-camera-globe'>
                                <div className='d-flex'>
                                <div className='col-md-4 text-center mt-3'>
                                    <a className='onSelectactionfriendsdesktop'><img width='24' className='mt-1' src={GlobeMobile} /></a></div>
                                <div className='col-md-4 text-center mt-3'>
                                    <a className='onPhotoaddpost' onClick={() => { this.setState({uploading: true});}} aria-describedby='basic-addon1011' data-bs-toggle='modal' data-bs-target='#staticBackdrop'><img width='24' className='mt-1' src={VideoMobile} /></a></div>
                                <div className='col-md-4 text-center mt-3'>
                                    <a className='onCreatepost' data-bs-toggle='modal' data-bs-target='#staticBackdrop'><img width='24' className='mt-1' src={ShareMobile} /></a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                if(channelName === 'town-square'){
                    let storyListDetails;
                    let emptyStories;
                    if(storyList !== undefined && storyList !== null){
                        storyListDetails = (
                            <>
                                {storyList.map((item,key) => {
                                    return (
                                        <StoryList userId={item} key={`${item}-story-${key}`} />
                                    );
                                })}
                            </>
                        );
        
                        if(storyList.length < 11){
                            let indents = [];
                            const lengthValue = 11 - storyList.length;
                            for(var i = 1; i <= lengthValue; i ++){
                                if(i <= 2 ){
                                    indents.push(
                                        <div className='col-md-1 mt-3'>
                                            <div className='position-absolute'>
                                                <a href="#" className='onClickstory'>
                                                    <img className="Avatar Avatar-xl border border-3 rounded-circle" src={HolderImg} alt="Username" title="Username"/>
                                                </a>
                                            </div>
                                            <div className="badges-offline-plus rounded-circle position-relative"></div>
                                            <small className="firstname-title-story mt-5 text-muted">......</small>
                                        </div>
                                    );
                                }
                                else{
                                    indents.push(
                                        <div id='rsvDesktop' className='col-md-1 mt-3'>
                                            <div className='position-absolute'>
                                                <a href="#" className='onClickstory'>
                                                    <img className="Avatar Avatar-xl border border-3 rounded-circle" src={HolderImg} alt="Username" title="Username"/>
                                                </a>
                                            </div>
                                            <div className="badges-offline-plus rounded-circle position-relative"></div>
                                            <small className="firstname-title-story mt-5 text-muted">......</small>
                                        </div>
                                    );
                                }
                            }
                            emptyStories = indents;
                        }
                    }
                    
                    viewDetail = ( 
                        <div className='mobile-margin-top'>
                            <div className='col-md-12 chat-box mtop-10'>
                                <div className='d-flex'>
                                    <div className='col-md-1 mt-3'>
                                        <div className='position-absolute'>
                                            <a href="/stories/create" className='onClickstory'>
                                                {this.renderProfilePicture('xl')}
                                            </a>
                                        </div>
                                        <div className='badges-online-plus rounded-circle onClickstory position-relative text-center'><i className='bi bi-plus'></i></div>
                                        <small className='firstname-title-story'>Your story</small>
                                    </div>
                                    {storyListDetails}
                                    {emptyStories}
                                    <div className="next-arrow-story">
                                        <a className="onAllstory" href='/stories/view'><i className='bi bi-chevron-right'></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-12 profile-menu-box-mobile width-100'>
                                <div className='d-flex'>
                                    <div onClick={() => this.onChangeFilter('all')} className={`col-lg-2 profile-menu-icon pointer-btn ${this.state.filter === 'all' ? 'active-profile-menu-icon' : ''}`}>
                                        <a href='#all' onClick={() => this.onChangeFilter('all')}><img src={LayoutIcon}></img></a>
                                    </div>
                                    <div onClick={() => this.onChangeFilter('image')} className={`col-lg-2 profile-menu-icon pointer-btn ${this.state.filter === 'image' ? 'active-profile-menu-icon' : ''}`}>
                                        <a href='#images' onClick={() => this.onChangeFilter('image')}><img src={ImgIcon}></img></a>
                                    </div>
                                    <div onClick={() => this.onChangeFilter('video')} className={`col-lg-2 profile-menu-icon pointer-btn ${this.state.filter === 'video' ? 'active-profile-menu-icon' : ''}`}>
                                        <a href='#videos' onClick={() => this.onChangeFilter('video')}><img src={VideoIcon}></img></a>
                                    </div>
                                    <div onClick={() => this.onChangeFilter('audio')} className={`col-lg-2 profile-menu-icon pointer-btn ${this.state.filter === 'audio' ? 'active-profile-menu-icon' : ''}`}>
                                        <a href='#music' onClick={() => this.onChangeFilter('audio')}><img src={MusicIcon}></img></a>
                                    </div>
                                    <div onClick={() => this.onChangeFilter('file')} className={`col-lg-2 profile-menu-icon pointer-btn ${this.state.filter === 'file' ? 'active-profile-menu-icon' : ''}`}>
                                        <a href='#file' onClick={() => this.onChangeFilter('file')}><img src={AttachIcon}></img></a>
                                    </div>
                                    <div onClick={() => this.onChangeFilter('location')} className={`col-lg-2 profile-menu-icon pointer-btn ${this.state.filter === 'location' ? 'active-profile-menu-icon' : ''}`}>
                                        <a href='#location' onClick={() => this.onChangeFilter('location')}><img src={GeoIcon}></img></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }else{
                    isMounted = true;
                    if(channelId){
                        viewDetail = (
                            <>{isMounted ? <GroupHeader
                                channelId={channelId}
                                channelDisplayName={channelDisplayName} 
                                isMounted={true}
                                /> : null}</>
                        );
                    }
                }
            }
        }
        
        return (
            <div>
                <div className='col-md-9'>
                    {viewDetail}
                    <div className='col-md-12 mtop-10 removePadding'>
                        <div
                            ref={this.channelViewRef}
                            id='app-content'
                            className='app__content pt-0'
                            >
                            {postBoxDesktop}
                            {postBoxMobile}

                            <div className='col-md-12 pbot-20 bgGrey'></div>
                            <div className='col-md-12 removePadding'>
                                <DeferredPostView
                                        channelId={this.props.channelId}
                                        focusedPostId={this.state.focusedPostId}
                                        filter={this.state.filter}
                                />
                                {/*postList && postList.order.map((item,index) => {
                                    Object.keys(postList.posts).map((item2,index2) => {return (<Post postId={item} post={postList.posts[item2]} />);});
                                })}

                                {/*postsView*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div id='rsvDesktop' className='col-md-3'>
                    <RigthSideView></RigthSideView>
                </div>
                <div className='modal postcontent' id='staticBackdrop' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='form'>
                                <div className='modal-header'>
                                    <h6 className='modal-title'>Create post</h6>
                                    <a className='btn-close-canvas shadow onClosecreatepost float-end' data-bs-dismiss='modal' aria-label='Close' onClick={() => {this.setState({uploading: false});}}><img src={xIcon}/></a>
                                </div>

                                <div className='modal-body'>
                                    <FileUploadOverlay overlayType='center'/>
                                    <div className='row'>
                                        <div className='col-md-2 text-center'>
                                            {userDisplayprofileXl}
                                        </div>
                                        <div className='col-md-10 text-left'>
                                            <strong>
                                                <a href='#' className='text-dark'>{userDisplayname}</a> 
                                                {feelact}
                                                {location}
                                                {/*<a href='#' className='tagviewpost text-dark'><small className='text-muted'>with</small> Friend name goes here</a> 
                                                <a href='#' className='activities text-dark'><small className='text-muted'>Activities</small> &#128151;</a>*/}
                                            </strong>
                                            <br />
                                            {shareInfoDd}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-12 mt-3'>
                                            {createPost}
                                        </div>
                                    </div>
                                    <div className='post-music-content'>
                                        <div className='container'>
                                            <div className='row'>
                                                <div className='col-md-2 text-left'><img width='50px' className='rounded' src='assets/images/Cover-album.jpg' alt='Cover album' /></div>
                                                <div className='col-md-8 mt-0'>
                                                <label className='ms-3'><strong>Lovely</strong></label>
                                                <p className='ms-3'><small>Eric Godlow</small></p>
                                                </div>
                                                <div className='col-md-2 mt-0'>
                                                <a className='onClosemusicpost float-end'><i className='bi-x'></i></a>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <label className='mb-2'><strong>Lyrics:</strong> <br /><br /> What a wonderful world is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. <br /><br /> when an unknown printer took a galley of type and scrambled it to make a type specimen book.</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='modal selectlocation' id='staticBackdropLoc' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>Search for location</h6>
                                <a className='onBacktolocation float-end' data-bs-toggle='modal' data-bs-target='#staticBackdrop' data-bs-dismiss='modal' aria-label='Close'><i className='bi-arrow-left-circle'></i></a>
                            </div>
                            <div className='modal-body'>
                                {/*<div className=''>
                                    <div className='input-group d-flex mb-0'></div>
                                    <span className='input-group-text input-search-crypter-span p-2' id='basic-addon1'><i className='bi-search'></i></span>
                                    <input id='searchLocations' type='text' className='form-control form-control-dark input-search-crypter p-5' placeholder='Where are you?' aria-label='Where are you?'/>
                                            </div>*/}
                
                                <div className='mt-3 mb-4'>
                                    {this.state.userLocation && <a className='locationviewpost onUnselectlocation ml-4 p-2' style={{ border: '1px solid grey', borderRadius: 8}} onClick={() => {this.setState({userLocation: ''});}}><label className='text-dark'>{this.state.userLocation} <i className='bi-x-lg'></i></label></a>}
                                </div>
                
                                <div id='searchforlocations'>
                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 '>
                                        <label className='onAddlocation'>Muntinlupa City</label>
                                        <p><small>Muntinlupa City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input onAddlocation' type='radio' name='locationRadios' value='Muntinlupa City' onChange={this.onChangeLocation} id='locationRadios4' />
                                                <label className='form-check-label' htmlFor='locationRadios4'></label>
                                            </div>
                                        </div>
                                    </div>
                
                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 '>
                                        <label>Makati City</label>
                                        <p><small>Makati City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input' type='radio' name='locationRadios' value='Makati City' onChange={this.onChangeLocation} id='locationRadios5' />
                                                <label className='form-check-label' htmlFor='locationRadios5'></label>
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 '>
                                        <label>Taguig City</label>
                                        <p><small>Taguig City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input' type='radio' name='locationRadios' value='Taguig City' onChange={this.onChangeLocation} id='locationRadios6' />
                                                <label className='form-check-label' htmlFor='locationRadios6'></label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 '>
                                        <label>Santa Rosa City</label>
                                        <p><small>Santa Rosa City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input' type='radio' name='locationRadios' value='Santa Rosa City' onChange={this.onChangeLocation} id='locationRadios7' />
                                                <label className='form-check-label' htmlFor='locationRadios6'></label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 '>
                                            <label>San Pedro City</label>
                                            <p><small>San Pedro City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input' type='radio' name='locationRadios' value='San Pedro City' onChange={this.onChangeLocation} id='locationRadios8' />
                                                <label className='form-check-label' htmlFor='locationRadios6'></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='modal selectemoticons' id='staticBackdropAct' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>How are you feeling?</h6>
                                <a className='onBacktoemoticons float-end' data-bs-toggle='modal' data-bs-target='#staticBackdrop' data-bs-dismiss='modal' aria-label='Close'><i className='bi-arrow-left-circle'></i></a>
                            </div>
                
                            <div className='modal-body'>
                                <div>
                                    <div className='d-flex mt-1 mb-4 gap-1'>
                                        <div className='col-md-3 text-center rounded p-1 mr-2' style={{border: '1px solid grey', borderRadius: 8}}>
                                        <a className='onFeelings text-dark' onClick={() => { this.setState({feeling: true});}}><small> Feelings</small></a></div>
                                        <div className='col-md-3 text-center rounded p-1' style={{border: '1px solid grey', borderRadius: 8}}>
                                        <a className='onActivities text-dark' onClick={() => { this.setState({feeling: false});}}><small> Activities</small></a></div>
                                    </div>
                                </div>
                                {feelactView}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='modal selectaudience' id='staticBackdropShare' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>Select audience</h6>
                                <a className='onBacktopost float-end' data-bs-toggle='modal' data-bs-target='#staticBackdrop' data-bs-dismiss='modal' aria-label='Close'><i className='bi-arrow-left-circle'></i></a>
                        </div>

                            <div className='modal-body'>
                                <div className='row'>
                                    <div className='col-md-10'>Everyone</div>
                                    <div className='col-md-2'>
                                        <div className='form-check float-end'>
                                            <input className='form-check-input onPublicselect' type='radio' name='flexRadioDefault' value='everyone' onChange={this.onChangeShareInfo} checked={this.state.shareInfo === 'everyone'} id='flexRadioPublicselect'/>
                                            <label className='form-check-label' htmlFor='flexRadioPublicselect'></label>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-md-10'>Friends</div>
                                    <div className='col-md-2'>
                                        <div className='form-check float-end'>
                                                <input className='form-check-input onFriendselect' type='radio' name='flexRadioDefault' value='friends' onChange={this.onChangeShareInfo} checked={this.state.shareInfo === 'friends'} id='flexRadioFriendselect'/>
                                                <label className='form-check-label' htmlFor='flexRadioFriendselect'></label>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-md-10'>Private</div>
                                    <div className='col-md-2'>
                                        <div className='form-check float-end'>
                                                <input className='form-check-input onOnlyme' type='radio' name='flexRadioDefault' value='private' onChange={this.onChangeShareInfo} checked={this.state.shareInfo === 'private'} id='flexRadioOnlyme'/>
                                                <label className='form-check-label' htmlFor='flexRadioOnlyme'></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
/* eslint-enable react/no-string-refs */
