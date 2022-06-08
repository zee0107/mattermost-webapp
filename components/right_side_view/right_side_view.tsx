// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import CreatePost from 'components/create_post/create_post';

import homeImage from 'images/homeFeed.png';
import profPic from 'images/profiles/user-profile-1.png';
import trendImage from 'images/trending-up.svg';
import postPic from 'images/profiles/user-profile-2.png';
import postPic2 from 'images/profiles/user-profile-3.png';
import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';
import { SocialCount } from 'mattermost-redux/types/crypto';
import { PostList } from 'mattermost-redux/types/posts';
import { ChannelCategory } from 'mattermost-redux/types/channel_categories';
import MessageDirect from 'components/right_side_view/messages_direct';
import MessageGroup from 'components/right_side_view/messages_group';
import MessageHeader from 'components/right_side_view/messages_header';
import CreatePostMessage from 'components/create_post_message';
import deferComponentRender from 'components/deferComponentRender';
import PostView from 'components/post_view';

type Props = {
    profilePicture: string;
    currentUser: UserProfile;
    socialCount: Promise<SocialCount>;
    getPostList: Promise<PostList>;
    categories: Promise<ChannelCategory>;
    focusedPostId: string;
 }


type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
    middleView: string;
    socialCount: SocialCount;
    postList: PostList;
    categories: ChannelCategory;
    messagesList: string[];
    selectedMessage: string;
    view: string;
    deferredPostView: any;
};

export default class RightSideView extends React.PureComponent<Props, State> {
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

    static defaultProps = {profilePicture: '',}

    channelViewRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light',img_path: homeImage,logo_url: [], data: [],messagesList: [], view: 'direct',deferredPostView: RightSideView.createDeferredPostView()};

        this.channelViewRef = React.createRef();
    }
    
    getChannelView = () => {
        return this.channelViewRef.current;
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.socialCount !== null){
            Promise.resolve(this.props.socialCount).then(value => { this.setState({socialCount: value});});
        }

        if(this.props.getPostList !== null){
            Promise.resolve(this.props.getPostList).then(value => {this.setState({postList: value});});
        }

        if(this.props.categories){
            Promise.resolve(this.props.categories).then((value) => {this.setState({categories: value.categories});})
        }
    }

    setDocumentTitle = (siteName: string) => {
        if (siteName) {
            document.title = 'Crypter';
        }
    }

    handleChangeView = (value: string) => { 
        this.setState({view: value});
    }

    onChangeSelected = (id: string) => {
        this.setState({selectedMessage: id});
    }

    setMessageList = (list: string[]) => {
        this.setState({messagesList: list});
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {return null;}
        return (<Avatar size={size} url={this.props.profilePicture} />);
    }

    render= (): JSX.Element => {
        const {globalHeader, currentUser} = this.props;
        const {socialCount, postList, categories, messagesList, selectedMessage, view} = this.state;
        const DeferredPostView = this.state.deferredPostView;

        if (categories) {
            Object.keys(categories).map((item) => {
                if(categories[item].type === 'direct_messages'){
                    this.setMessageList(categories[item].channel_ids);
                }
            });
        }

        let chatList;
        if (messagesList && messagesList.length){
            if(view === 'direct'){
                chatList = (
                    <>
                        {messagesList.map((item, index) => {
                            return (
                                <MessageDirect channelId={item} onChangeSelected={this.onChangeSelected} key={`${item}-${index}`} />
                            );
                        })}
                    </>
                );
            }else{
                chatList = (
                    <>
                        {messagesList.map((item, index) => {
                            return (
                                <MessageGroup channelId={item} onChangeSelected={this.onChangeSelected} key={`${item}-${index}`} />
                            );
                        })}
                    </>
                );
            }
        }

        let offCanvasView;
        if(selectedMessage){
            offCanvasView = (
                <>
                    <div className='offcanvas-header'>
                        <MessageHeader channelId={selectedMessage} onChangeSelected={this.onChangeSelected} />
                    </div>
                    <div className='offcanvas-body offcanvas-body-bg'>
                        <form className='mt-0'>
                            <div className='mb-0'>
                                <div className='chat-fields'>
                                    <DeferredPostView
                                        channelId={selectedMessage}
                                        focusedPostId={this.props.focusedPostId}
                                    />
                                    {/*<div className='row'>
                                        <div className='col-lg-12'>
                                            <a>
                                            <p className='float-start receiver-msg shadow-sm'><img width='25' className='img-fluid user-photo' src={profPic1} alt='Username' title='Username'/>Hello how are you, message. I know your brain is well and cute.</p>
                                            </a>
                                        </div>
                                        <div className='col-lg-12'>
                                            <a>
                                            <p className='float-end receiver-msg-user shadow-sm'><i className='bi-hand-thumbs-up-fill'></i> I'm fine<img width='25' className='img-fluid user-photo ms-1' src={profPic2} alt='Username' title='Username'/></p>
                                            </a>
                                        </div>
                                        <div className='col-lg-12'>
                                            <a>
                                            <p className='float-start receiver-msg shadow-sm'><img width='25' className='img-fluid user-photo' src={profPic1} alt='Username' title='Username'/>Well done... <i className='bi-hand-thumbs-up-fill'></i></p>
                                            </a>
                                        </div>
                                        <div className='col-lg-12'>
                                            <a>
                                            <p className='float-end receiver-msg-user shadow-sm'><i className='bi-hand-thumbs-up-fill'></i> Do not mess up my updates everytime.<img width='25' className='img-fluid user-photo ms-1' src={profPic2} alt='Username' title='Username'/></p>
                                            </a>
                                        </div>
                                        <div className='col-lg-12'>
                                            <div className='action-icons float-end mt-0 mb-0'>
                                                <div className='row'>
                                                    <div className='btn-group gap-2' role='group' aria-label='Reactions icon'>
                                                    <a className='onClickthumbsup'><i className='bi-hand-thumbs-up text-white'></i></a>
                                                    <a className='onClickthumbsdown'><i className='bi-heart text-white'></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-12'>
                                            <div className='row float-end'>
                                                <a className='hidden-hide text-white'>Reactions</a>
                                            </div>
                                        </div>
                                        <div className='col-lg-12'>
                                            <a>
                                            <p className='float-end receiver-msg-user shadow-sm'>Well done.<img width='25' className='img-fluid user-photo ms-1' src={profPic2} alt='Username' title='Username'/>
                                            <label className='reactions-show float-start'><i className='bi-hand-thumbs-up text-white'></i></label>
                                            <label className='reactions-show-down float-start'><i className='bi-heart text-white'></i></label>
                                            </p>
                                            </a>
                                        </div>
                                    </div>*/}
                                </div>
                            </div>
                            <div className='input-group mb-3 mt-2'>
                                <CreatePostMessage channelId={selectedMessage} />
                            </div>
                        </form>
                    </div>
                </>
            );
        }

        let followerView;
        let followingView;
        let postCount = 0 as number;
        if(postList !== undefined && postList !== null){
            const postVal = postList.posts;
            Object.keys(postVal).map((key,index) => {
                const fixVal = postVal[key];
                if(fixVal.user_id === currentUser.id){
                    postCount++;
                }
            });
        }
        if(socialCount !== undefined  && socialCount !== null){
            followerView = (<h4 className='fw-bold'>{socialCount.followersCount}</h4>);
            followingView = (<h4 className='fw-bold'>{socialCount.followingCount}</h4>);
        }else{
            followerView = (<h4 className='fw-bold'>0</h4>);
            followingView = (<h4 className='fw-bold'>0</h4>);
        }

        return (
            <>
                <div className='col-md-12 chat-box p-2 mtop-10'>
                    <div className='d-flex mtop-10'>
                        <div className='col-md-3 profile-img-div-new'>
                            {this.renderProfilePicture('xl')}
                        </div>
                    
                        <div className='col-md-6 removePadding'>
                            <h4 className='fw-bold'>{`${currentUser.first_name} ${currentUser.last_name}`}</h4>
                            <h5 className='text-secondary small'>{'@' + currentUser.username}</h5>
                            <h5 className='text-secondary small'>{currentUser.position}</h5>
                        </div>
                        <div className='col-md-3'>
                            <ToggleModalButtonRedux
                                id='accountSettings'
                                ariaLabel='Profile'
                                modalId={ModalIdentifiers.USER_SETTINGS}
                                dialogType={UserSettingsModal}
                                dialogProps={{isContentProductSettings: false}}
                                className={'onEditclicks'}
                                showUnread={false}
                            >Edit</ToggleModalButtonRedux>
                        </div>
                    </div>
                    <hr className='removeMarginHr'></hr>
                    <div className='d-flex'>
                        <div className='col-md-4'>
                            <p className='text-secondary'>Post</p>
                            <h4 className='fw-bold'>{postCount}</h4>
                        </div>
                        <div className='col-md-4'>
                            <p className='text-secondary'>Following</p>
                            {followingView}
                        </div>
                        <div className='col-md-4'>
                            <p className='text-secondary'>Followers</p>
                            {followerView}
                        </div>
                    </div>
                </div>
                <div className='col-md-12 chat-box p-2 mtop-10'>
                    <div className='d-flex mtop-10'>
                        <div className='col-md-8'>
                            <label className='text-primary'>Trending Groups</label>
                        </div>
                        <div className='col-md-4 text-end'>
                            <a href='/mygroups#suggested' className='text-secondary' style={{textDecoration: 'none',cursor:'pointer'}}><label className='text-secondary'>View All</label></a>
                        </div>
                    </div>
                    <hr className='removeMarginHr'></hr>
                    <div className='d-flex mtop-5'>
                        <div className='col-md-2'>
                            <img src={trendImage}></img>
                        </div>
                        <div className='col-md-10'>
                            <label className='text-percent'>#Game</label>
                            <p className='text-secondary'>289 Posts</p>
                        </div>
                    </div>
                    <div className='d-flex mtop-5'>
                        <div className='col-md-2'>
                            <img src={trendImage}></img>
                        </div>
                        <div className='col-md-10'>
                            <label className='text-percent'>#Handmade</label>
                            <p className='text-secondary'>30 Posts</p>
                        </div>
                    </div>
                    <div className='d-flex mtop-5'>
                        <div className='col-md-2'>
                            <img src={trendImage}></img>
                        </div>
                        <div className='col-md-10'>
                            <label className='text-percent'>#WordPress</label>
                            <p className='text-secondary'>80 Posts</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-12 chat-box p-2 mtop-10'>
                    <div className='d-flex'>
                        <div className='col-lg-4 '>
                            <div className='d-flex'>
                                <div className='col-sm-3'>
                                    <h4>
                                        <a onClick={() => this.handleChangeView('direct')} title='Personal Chat'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-person" viewBox="0 0 16 16">
                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                        </svg></a>
                                    </h4>
                                </div>
                                <div className='col-sm-3'>
                                    <h4>
                                        <a onClick={() => this.handleChangeView('group')} title='Group Chat'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-people" viewBox="0 0 16 16">
                                            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                                        </svg></a>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4 text-center'>
                            <h4 className='getStartPrimaryText'>Chat</h4>
                        </div>
                        <div className='col-lg-4 chat-setting'>
                            <h4><a href='#' title='Settings'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-gear" viewBox="0 0 16 16">
                                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                            </svg></a>
                            </h4>
                        </div>
                    </div>
                    <br />
                    {chatList}
                </div>

                <div style={{zIndex: 999}} className='offcanvas offcanvas-end shadow-lg' data-bs-scroll='true' data-bs-backdrop='false' tabIndex='-1' id='ChatDesktop' aria-labelledby='ChatDesktop'>
                    {offCanvasView}
                </div>
            </>
        );
    }
}
