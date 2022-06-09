// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {UserProfile} from 'mattermost-redux/types/users';

import homeImage from 'images/homeFeed.png';
import profPic from 'images/profiles/user-profile-1.png';
import trendImage from 'images/trending-up.svg';
import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import {ModalIdentifiers} from 'utils/constants';
import { SocialCount } from 'mattermost-redux/types/crypto';
import { PostList } from 'mattermost-redux/types/posts';
import { ChannelCategory } from 'mattermost-redux/types/channel_categories';
import MessageDirect from './messages_direct';
import MessageHeader from './messages_header';
import CreatePostMessage from 'components/create_post_message';
import deferComponentRender from 'components/deferComponentRender';
import PostView from 'components/post_view';
import Post from 'components/post_view/post';
import { Client4 } from 'mattermost-redux/client';

type Props = {
    profilePicture: string;
    currentUser: UserProfile;
    categories: Promise<ChannelCategory>;
 }

type State = {
    isDark: string;
    postList: PostList;
    messageBody: PostList;
    categories: ChannelCategory;
    messagesList: string[];
    selectedMessage: string;
    view: string;
    deferredPostView: any;
};

export default class MessageList extends React.PureComponent<Props, State> {
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
        this.state = { isDark:'light', messagesList: [], deferredPostView: MessageList.createDeferredPostView()};

        this.channelViewRef = React.createRef();
    }
    
    getChannelView = () => {
        return this.channelViewRef.current;
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.categories){
            Promise.resolve(this.props.categories).then((value) => {this.setState({categories: value.categories});})
        }

        this.setMessageList();
    }

    setDocumentTitle = (siteName: string) => {
        if (siteName) {
            document.title = 'Crypter';
        }
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
        const {currentUser} = this.props;
        const {categories, messagesList, selectedMessage} = this.state;
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
            chatList = (
                <>
                    {messagesList.map((item, index) => {
                        return (
                            <MessageDirect channelId={item} onChangeSelected={this.onChangeSelected} key={`${item}----${index}`} />
                        );
                    })}
                </>
            );
        }

        let offCanvasView;
        if(selectedMessage && selectedMessage.length){
            offCanvasView = (
                <>
                    <div className='offcanvas-header'>
                        <MessageHeader channelId={selectedMessage} onChangeSelected={this.onChangeSelected} />
                    </div>
                    <div className='offcanvas-body offcanvas-body-bg'>
                        <div className='mt-0 mb-0'>
                            <div className='chat-fields'>
                                <DeferredPostView
                                    channelId={selectedMessage}
                                    focusedPostId={this.props.focusedPostId}
                                />
                                {/*<div className='row' style={{height: '60vh', overflow: 'auto'}}>
                                    {messageBody && Object.keys(messageBody.posts).map((post,ind) => {
                                            return (<Post postId={post} post={messageBody.posts[post]} userId={currentUser.id} />);
                                    })}
                                </div>*/}
                            </div>
                        </div>
                        <div className='input-group mb-3 mt-2'>
                            <CreatePostMessage channelId={selectedMessage} />
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                {chatList}
                <div style={{zIndex: 999}} className='offcanvas offcanvas-end shadow-lg' data-bs-scroll='true' data-bs-backdrop='false' tabIndex='-1' id='ChatNavbar' aria-labelledby='ChatNavbar'>
                    {offCanvasView}
                </div>
            </>
        );
    }
}
