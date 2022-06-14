// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import deferComponentRender from 'components/deferComponentRender';
import CreatePost from 'components/create_post_message';
import MoreDirectChannels from 'components/more_direct_channels';
import PostView from 'components/post_view';
import { ChannelCategory, OrderedChannelCategories } from 'mattermost-redux/types/channel_categories';
import MessageSidebar from 'components/messages_sidebar';
import MessageSidebarGroup from 'components/messages_sidebar_group';
import MessageHeader from 'components/messages_header';
import { trackEvent } from 'actions/telemetry_actions';
import { BooleanLiteral } from 'typescript';

export type Props = {
    userId: string;
    profilePicture: string;
    currentUser: UserProfile;
    categories: Promise<OrderedChannelCategories>;
    focusedPostId: string;
}

type State = {
    isDark: string;
    currentUser: UserProfile;
    channelId: string;
    deferredPostView: any;
    categories: ChannelCategory;
    messagesList: string[];
    selectedMessage: string;
    mobileView: string;
    showDirectChannelsModal: boolean;
    showGm: boolean;
    showDm: boolean;
};

export default class Messages extends React.PureComponent<Props, State> {
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

    static defaultProps = {
        userId: '',
        profilePicture: '',
    }

    messageViewRef: React.RefObject<HTMLDivElement>;
    messageViewMobileRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.state = { isDark:'light',deferredPostView: Messages.createDeferredPostView(), messagesList: [], selectedMessage: '', mobileView: 'messages', showDirectChannelsModal: false, showGm: false, showDm: false};

        this.onChangeSelected = this.onChangeSelected.bind(this);
        this.onMobileView = this.onMobileView.bind(this);
        this.messageViewRef = React.createRef();
        this.messageViewMobileRef = React.createRef();
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.categories){
            Promise.resolve(this.props.categories).then((value) => {this.setState({categories: value.categories});})
        }
    }

    componentDidUpdate(_,prevState){
        if(this.state.categories !== prevState.categories){
            if(this.props.categories){
                Promise.resolve(this.props.categories).then((value) => {this.setState({categories: value.categories});})
            }
        }
    }

    showDirect = () => {
        this.setState({showDm: true});
    }

    hideDirect = () => {
        this.setState({showDm: false});
    }

    showGroup = () => {
        this.setState({showGm: true});
    }

    hideGroup = () => {
        this.setState({showGm: false});
    }
    showMoreDirectChannelsModal = () => {
        this.setState({showDirectChannelsModal: true});
        trackEvent('ui', 'ui_channels_more_direct_v2');
    }

    hideMoreDirectChannelsModal = () => {
        this.setState({showDirectChannelsModal: false});
    }

    getMessageView = () => {
        return this.messageViewRef.current;
    }

    getMessageViewMobile = () => {
        return this.messageViewMobileRef.current;
    }

    onMobileView = (value: string) =>{
        this.setState({mobileView: value});
    }
    onChangeSelected = (id: string) => {
        this.setState({selectedMessage: id});
    }

    setMessageList = (list: string[]) => {
        this.setState({messagesList: list});
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
                text={'story'}
            />
        );
    }

    handleOpenMoreDirectChannelsModal = (e: Event) => {
        e.preventDefault();
        if (this.state.showDirectChannelsModal) {
            this.hideMoreDirectChannelsModal();
        } else {
            this.showMoreDirectChannelsModal();
        }
    }

    handleCollapseDm = (e: Event) => {
        e.preventDefault();
        if(this.state.showDm){
            this.hideDirect();
        }else{
            this.showDirect();
        }
    }

    handleCollapseGm = (e: Event) => {
        e.preventDefault();
        if(this.state.showGm){
            this.hideGroup();
        }else{
            this.showGroup();
        }
    }

    renderModals = () => {
        let moreDirectChannelsModal;
        if (this.state.showDirectChannelsModal) {
            moreDirectChannelsModal = (
                <MoreDirectChannels
                    onChangeSelected={this.onChangeSelected}
                    onModalDismissed={this.hideMoreDirectChannelsModal}
                    isExistingChannel={false}
                />
            );
        }

        return (
            <React.Fragment>
                {moreDirectChannelsModal}
            </React.Fragment>
        );
    }

    render= (): JSX.Element => {
        const DeferredPostView = this.state.deferredPostView;
        const {categories, messagesList, selectedMessage, showDm, showGm} = this.state;
        if (categories) {
            Object.keys(categories).map((item) => {
                if(categories[item].type === 'direct_messages'){
                    this.setMessageList(categories[item].channel_ids);
                }
            });
        }

        let messageHeaderDesktop;
        let messageHeaderMobile;
        let messageBodyDesktop;
        let messageBodyMobile;
        if(!selectedMessage){
           messageBodyDesktop = (
            <div className='right-chat-panel text-center text-muted mt-5'>
                <h3><i className='bi-chat-left'></i><br></br>Select Message.</h3>
            </div>
           );

           messageHeaderDesktop = (
                <div className='right-chat-panel'>
                    <div className='row'>
                        <div className='col-4'></div>
                        <div className='col-8'>
                            <a className='float-end mt-3 ms-1 onVerticaldropdownmenu'><i className='bi-three-dots-vertical'></i></a>
                            <a className='float-end mt-3 ms-1 onCreateMessage' onClick={this.handleOpenMoreDirectChannelsModal}><i className='bi-pencil-square'></i></a>
                        </div>
                    </div>
                </div>
            );
            
           messageBodyMobile = (
                <div className='row'>
                    <div className='right-chat-panel text-center text-muted mt-5'>
                        <h3><i className='bi-chat-left'></i><br></br>Select Message.</h3>
                    </div>
                </div>
           );
        }
        else{
            messageHeaderDesktop = (
                <MessageHeader channelId={selectedMessage} view='desktop' />
            );

            messageBodyDesktop = (
                <>
                    <div className='right-chat-panel' ref={this.messageViewRef}>
                        <DeferredPostView
                            channelId={selectedMessage}
                            focusedPostId={this.props.focusedPostId}
                        />
                        <div className='col-12 input-group mt-3 mb-3 removePadding'>
                            <CreatePost channelId={selectedMessage}/>
                        </div>
                    </div>
                </>  
            );

            messageHeaderMobile = (
                <MessageHeader channelId={selectedMessage}  view='mobile' />
            );

            messageBodyMobile = (
                <div className='row'>
                    <div className='right-chat-panel' ref={this.messageViewMobileRef}>
                        <DeferredPostView
                            channelId={selectedMessage}
                            focusedPostId={this.props.focusedPostId}
                        />
                        <div className='col-12 input-group mt-3 mb-3 removePadding'>
                            <CreatePost channelId={selectedMessage}/>
                        </div>
                    </div>
                </div>
           );
        }

        let dmDesktop;
        let dmMobile;
        if (messagesList && messagesList.length) {
            dmDesktop = (
                <>
                    {messagesList.map((item,index) => {
                        return (
                            <MessageSidebar channelId={item} view='desktop' onChangeSelected={this.onChangeSelected} onMobileView={this.onMobileView} key={`${item}-${index}`} />
                        );
                    })}
                </>
            );

            dmMobile = (
                <>
                    {messagesList.map((item,index) => {
                        return (
                            <MessageSidebar channelId={item} view='mobile' onChangeSelected={this.onChangeSelected} onMobileView={this.onMobileView} key={`${item}--${index}`} />
                        );
                    })}
                </>
            );
        }

        let gmDesktop;
        let gmMobile;
        if (messagesList && messagesList.length) {
            gmDesktop = (
                <>
                    {messagesList.map((item,index) => {
                        return (
                            <MessageSidebarGroup channelId={item} view='desktop' onChangeSelected={this.onChangeSelected} onMobileView={this.onMobileView} key={`${item}---${index}`} />
                        );
                    })}
                </>
            );

            gmMobile = (
                <>
                    {messagesList.map((item,index) => {
                        return (
                            <MessageSidebarGroup channelId={item} view='mobile' onChangeSelected={this.onChangeSelected} onMobileView={this.onMobileView} key={`${item}---${index}`} />
                        );
                    })}
                </>
            );
        }

        let sidebarDmHeight, sidebarGmHeight, chevronIconDm, chevronIconGm;
        if(showDm && showGm){
            sidebarDmHeight = '35%';
            sidebarGmHeight = '35%';
            chevronIconDm = (
                <i className='bi-chevron-up'></i>
            );
            chevronIconGm = (
                <i className='bi-chevron-up'></i>
            );
        }else if(showDm && !showGm){
            sidebarDmHeight = '90%';
            sidebarGmHeight = 'auto';
            chevronIconDm = (
                <i className='bi-chevron-up'></i>
            );
            chevronIconGm = (
                <i className='bi-chevron-down'></i>
            );
        }else if(!showDm && showGm){
            sidebarDmHeight = 'auto';
            sidebarGmHeight = '90%';
            chevronIconDm = (
                <i className='bi-chevron-down'></i>
            );
            chevronIconGm = (
                <i className='bi-chevron-up'></i>
            );
        }else{
            sidebarDmHeight = 'auto';
            sidebarGmHeight = 'auto';
            chevronIconDm = (
                <i className='bi-chevron-down'></i>
            );
            chevronIconGm = (
                <i className='bi-chevron-down'></i>
            );
        }

        return (
            <>
                <section id="crypter-section" className='crypter-section-desktop'>
                    <div className='col-md-12'>
                        <div className='position-sticky float-right-panel'>
                            <div className='row'>
                                <div className='col-3 pt-2'><a className='onChatmessages p-4'><i className='bi-chat-left'></i> <small>Messages</small></a></div>
                                <div className='col-9'><a className='float-end onGobacklinks' onClick={() => this.onChangeSelected('')}><i className='bi-arrow-left'></i> <small>Go Back</small></a></div>
                            </div>
                            <div className='col-12 text-center reload-loading'>
                                <div className='spinner-border' role='status'>
                                    <span className='visually-hidden'>Loading...</span>
                                </div>
                            </div>
                            <div className='box-middle-panel-messages'>
                                <div className='row'>
                                    <div className='col-3 border-end'>
                                        <div className='left-chat-panel'>
                                            <div className='row'>
                                                <div className='col-8 mb-4 mt-4 text-start search-conversations-text'>
                                                    <strong className=''><label>Conversations</label></strong>
                                                </div>
                                                <div className='col-4 mb-4 mt-4 text-end search-conversations-icons'>
                                                    <a className='onSearchconversations'><i className='bi-search text-dark'></i></a>
                                                </div>
                                                <div className='col-12 mb-3 mt-3 text-end search-conversations'>
                                                    <div className='input-group'>
                                                        <span className='input-group-text bg-transparent border-1'><a className='onClosesearchconversation'><i className='bi-x-circle text-dark'></i></a></span>
                                                        <input type='text' className='form-control search-show-style' aria-label='Search' placeholder='Search...'/>
                                                        <span className='input-group-text bg-transparent'><a className=''><i className='bi-search text-dark'></i></a></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        {messageHeaderDesktop}
                                    </div>
                                </div>
                            </div>
                            <div className='box-middle-panel-messages-content'>
                                <div className='row'>
                                    <div className='col-3 border-end'>
                                        <div className='left-chat-groups-message-panel' style={{height: `${sidebarGmHeight}`, overflow:'auto'}}>
                                            <div className='groups-chat'>
                                                <a className='onGroupschats' onClick={this.handleCollapseGm} data-bs-toggle='collapse' href='#collapseGroupschats' role='button' aria-expanded='false' aria-controls='collapseGroupschats'>{chevronIconGm} Groups</a>
                                                <a className='onGroupschatsup' onClick={this.handleCollapseGm} data-bs-toggle='collapse' href='#collapseGroupschats' role='button' aria-expanded='true' aria-controls='collapseGroupschats'>{chevronIconGm} Groups</a>
                                            </div>
                                            <div className='collapse' id='collapseGroupschats'>
                                               {gmDesktop}
                                            </div> 
                                        </div>
                                        <div className='left-chat-groups-message-panel' style={{height: `${sidebarDmHeight}`, overflow:'auto'}}>
                                            <div className='groups-chat'>
                                                <a className='onDirectmsg' onClick={this.handleCollapseDm} data-bs-toggle='collapse' href='#collapseDirectmsg' role='button' aria-expanded='false' aria-controls='collapseGroupschats'>{chevronIconDm} Direct Message</a>
                                                <a className='onDirectmsgup' onClick={this.handleCollapseDm} data-bs-toggle='collapse' href='#collapseDirectmsg' role='button' aria-expanded='true' aria-controls='collapseDirectmsg'>{chevronIconDm} Direct Message</a>
                                            </div>
                                            <div className='collapse' id='collapseDirectmsg'>
                                                {dmDesktop}
                                            </div> 
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        {messageBodyDesktop}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="crypter-section-mobile" className='crypter-section-mobile'>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='row'>
                                    <div className='col-6'>
                                        <a className='btn onChatmessagesmobile'><i className='bi-chat-left'></i></a>
                                        <strong><small className='ms-1 text-success'>Messages</small></strong>
                                    </div>
                                    <div className='col-6 mt-2'>
                                        <a className='float-end onMobilepeople' onClick={() => this.onMobileView('chats')}><i className='bi-people'></i></a>
                                        <a className='float-end onMobileperson'  onClick={() => this.onMobileView('groups')}><i className='bi-person'></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`box-middle-panel mt-3 mobilechatconversationperson ${this.state.mobileView === 'chats' ? '' : 'hide'}`} style={{height: '100vh'}}>
                            <div className='row'>
                                <strong><label>Direct Message</label></strong>
                            </div>
                            <hr />
                            {dmMobile}
                        </div>
                        <div className={`box-middle-panel mt-3 mobilechatconversationgroup ${this.state.mobileView === 'groups' ? '' : 'hide'}`} style={{height: '100vh'}}>
                            <div className='row'>
                                <strong><label>Groups</label></strong>
                            </div>
                            <hr />
                            {gmMobile}
                        </div>
                    </div>
                    <div className={`box-middle-panel mt-2 mobilechatconversation ${this.state.mobileView === 'messages' ? '' : 'hide'}`}>
                        {messageHeaderMobile}
                        <div className='box-middle-panel mt-2 mobilechatconversation'>
                            {messageBodyMobile}
                        </div>
                    </div>
                </section>
                {this.renderModals()}
            </>
        );
    }
}
