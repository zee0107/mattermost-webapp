// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import deferComponentRender from 'components/deferComponentRender';
import CreatePost from 'components/create_post';
import PostView from 'components/post_view';
import { ChannelCategory, OrderedChannelCategories } from 'mattermost-redux/types/channel_categories';

export type Props = {
    userId: string;
    profilePicture: string;
    currentUser: UserProfile;
    channelId: string;
    categories: Promise<OrderedChannelCategories>;
}

type State = {
    isDark: string;
    currentUser: UserProfile;
    channelId: string;
    deferredPostView: any;
    categories: ChannelCategory;
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

    constructor(props: Props) {
        super(props);

        this.state = { isDark:'light',deferredPostView: Messages.createDeferredPostView(), messagesList: []};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.categories){
            Promise.resolve(this.props.categories).then((value) => {this.setState({categories: value.categories});})
        }
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

    render= (): JSX.Element => {
        const DeferredPostView = this.state.deferredPostView;
        const {categories} = this.state;
        if(categories){
            console.log('base: ',categories);
            Object.keys(categories).map((item) => {
                if(categories[item].type === 'direct_messages'){
                    console.log(categories[item].channel_ids);
                }
            });
        }

        return (
            <>
                <section id="crypter-section" className='crypter-section-desktop'>
                    <div className='col-md-12'>
                        <div className='position-sticky float-right-panel'>
                            <div className='row'>
                                <div className='col-3 pt-2'><a className='onChatmessages p-4'><i className='bi-chat-left'></i> <small>Messages</small></a></div>
                                <div className='col-9'><a className='float-end onGobacklinks'><i className='bi-arrow-left'></i> <small>Go Back</small></a></div>
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
                                        <div className='right-chat-panel'>
                                            <div className='row'>
                                                <div className='col-4'>
                                                    <a className='position-relative float-start mt-3'>
                                                        {this.renderProfilePicture('xl')}
                                                        <span className='position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle'></span>
                                                    </a>
                                                    <p className='float-start text-wrap mt-3 name-of-user-position'>
                                                        <strong><label className='float-start ms-2 text-chat-title'>Oscar Holloway</label></strong>
                                                        <small className='ms-2'>UI/UX Designer</small>
                                                    </p>
                                                </div>
                                                <div className='col-8'>
                                                    <a className='float-end mt-3 ms-1 onVerticaldropdownmenu'><i className='bi-three-dots-vertical'></i></a>
                                                    <a className='float-end mt-3 ms-1 onVerticaldropdownmenu'><i className='bi-pin'></i></a>
                                                    <a className='float-end mt-3 ms-1 onSearchchatmessages'><i className='bi-search text-dark'></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='box-middle-panel-messages-content'>
                                <div className='row'>
                                    <div className='col-3 border-end'>
                                        <div className='left-chat-groups-message-panel'>
                                            <div className='groups-chat'>
                                                <a className='onGroupschats' data-bs-toggle='collapse' href='#collapseGroupschats' role='button' aria-expanded='false' aria-controls='collapseGroupschats'><i className='bi-chevron-down'></i> Groups</a>
                                                <a className='onGroupschatsup' data-bs-toggle='collapse' href='#collapseGroupschats' role='button' aria-expanded='true' aria-controls='collapseGroupschats'><i className='bi-chevron-up'></i> Groups</a>
                                            </div>
                                            <div className='collapse show' id='collapseGroupschats'>
                                                <a className='onChatus text-dark'>
                                                    <div className='row'>
                                                            <div className='col-2 text-center p-1 mt-1'>
                                                                {this.renderProfilePicture('lg')}
                                                            </div>
                                                            <div className='col-lg-8 mt-2'>
                                                            <strong><label>Group name</label></strong><br/><small className='text-muted'>2Caroline: Hi Guys! I've...</small>
                                                            </div>
                                                            <div className='col-2 text-start p-2'>
                                                            <small>12:04</small>
                                                            <span className='badge rounded-pill bg-danger'>
                                                                12+
                                                            </span>
                                                            </div>
                                                    </div>
                                                </a>
                                            </div> 
                                        </div>
                                        <div className='left-chat-groups-message-panel'>
                                            <div className='groups-chat'>
                                                <a className='onDirectmsg' data-bs-toggle='collapse' href='#collapseDirectmsg' role='button' aria-expanded='false' aria-controls='collapseGroupschats'><i className='bi-chevron-down'></i> Direct Message</a>
                                                <a className='onDirectmsgup' data-bs-toggle='collapse' href='#collapseDirectmsg' role='button' aria-expanded='true' aria-controls='collapseDirectmsg'><i className='bi-chevron-up'></i> Direct Message</a>
                                            </div>
                                            <div className='collapse' id='collapseDirectmsg'>
                                                <a className='onChatus text-dark'>
                                                    <div className='row'>
                                                        <div className='col-2 text-center p-1 mt-1'>
                                                            {this.renderProfilePicture('lg')}
                                                        </div>
                                                        <div className='col-lg-8 mt-2'><strong><label>Garrett Watson</label></strong><br/><small className='text-muted'>2Caroline: Hi Guys! I've...</small></div>
                                                        <div className='col-2 text-start p-2'>
                                                            <small>12:04</small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div> 
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='right-chat-panel'>
                                            {/*<DeferredPostView
                                                channelId={this.props.channelId}
                                                focusedPostId={''}
                                                filter={''}
                                            />*/}
                                            <div className='text-center'>
                                                <small className='date-chats'>Tuesday, March 22</small></div>
                                                <div className='row mt-3 mb-3'>
                                                    <div className='col-1 text-center'>
                                                    {this.renderProfilePicture('xl')}
                                                    </div>
                                                    <div className='col-11 mt-1'>
                                                    <p className='name-of-chat-title'><strong><label className='float-start'>Olive Dixon</label></strong>
                                                        <small className='float-end'>10:04AM</small></p>
                                                    <br/>
                                                    <p className='col-12 name-of-reply-title'><label>Hi Evan</label></p>
                                                    </div>
                                                </div>
                                                <div className='row mt-3 mb-3'>
                                                    <div className='col-1 text-center'>
                                                    {this.renderProfilePicture('xl')}
                                                    </div>
                                                    <div className='col-11 mt-1'>
                                                    <p className='name-of-chat-title'><strong><label className='float-start'>You</label></strong>
                                                        <small className='float-end'>10:04AM</small></p>
                                                    <br/>
                                                    <p className='col-12 name-of-reply-title'><label>Hi Oscar, Nice to meet you, <br/> we will work with new project together.</label></p>
                                                    </div>
                                                </div>
                                                <div className='row mt-3 mb-3'>
                                                    <div className='col-1 text-center'>
                                                    {this.renderProfilePicture('xl')}
                                                    </div>
                                                    <div className='col-11 mt-1'>
                                                    <p className='name-of-chat-title'><strong><label className='float-start'>Olive Dixon</label></strong>
                                                        <small className='float-end'>10:04AM</small></p>
                                                    <br/>
                                                    <p className='col-12 name-of-reply-title'><label>Hi! Please, change the status in this task </label></p>
                                                    <a className='onLinkchats float-start'><i className='bi-link-45deg'></i>
                                                        <label>UX Login + Registration</label>
                                                    </a>
                                                    </div>
                                                </div>
                                                <div className='row mt-3 mb-3'>
                                                    <div className='col-1 text-center'>
                                                    {this.renderProfilePicture('xl')}
                                                    </div>
                                                    <div className='col-11 mt-1'>
                                                    <p className='name-of-chat-title'><strong><label className='float-start'>You</label></strong>
                                                        <small className='float-end'>10:04AM</small></p>
                                                    <br/>
                                                    <p className='col-12 name-of-reply-title'><label>Hi Oscar, Nice to meet you, <br/> we will work with new project together.</label></p>
                                                    </div>
                                                </div>
                                                <div className='row mt-3 mb-3'>
                                                    <div className='col-1 text-center'>
                                                    {this.renderProfilePicture('xl')}
                                                    </div>
                                                    <div className='col-11 mt-1'>
                                                    <p className='name-of-reply-title'><strong><label className='float-start mt-3'>Olive Dixon</label></strong>
                                                        <small className='float-end'>10:04AM</small></p>
                                                    <br/>
                                                    <p className='col-12 name-of-reply-title mt-3'><label>Ok</label></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-12 mt-3 mb-3 removePadding'>
                                                <CreatePost />
                                            </div>
                                        {/*<div className='input-group mb-3'>
                                            
                                            <span className='input-group-text group-text-actions bg-transparent'>
                                            <img width='20' src='assets/images/icon-browse.png' alt=''/>
                                            <img width='20' src='assets/images/icon-url.png' alt=''/>
                                            <img width='20' src='assets/images/icon-at.png' alt=''/>
                                            </span>
                                            <input type='text' className='form-control write-message-inputs' aria-label='Type your message here' placeholder='Type your message here...'/>
                                            <span className='input-group-text group-text-actions bg-transparent'>
                                            <img width='20' src='assets/images/icon-emoji.png' alt=''/>
                                            <button className='btn ms-2 onSendmessagewrite'><img width='20' src='assets/images/icon-arrow-search.png'/></button>
                                            </span>
                                        </div>*/}
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
                                        <a className='float-end onMobilepeople'><i className='bi-people'></i></a>
                                        <a className='float-end onMobileperson'><i className='bi-person'></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='box-middle-panel mt-3 mobilechatconversationperson'>
                            <div className='row'>
                                <strong><label>Direct Message</label></strong>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='col-2 p-1'>
                                    {this.renderProfilePicture('xl')}
                                </div>
                                <div className='col-8 mt-2'>
                                    <strong><label>Garrett Watson</label></strong>
                                    <br />
                                    <small className='text-muted'>2Caroline: Hi Guys! I've...</small>
                                </div>      
                                <div className='col-2 text-end mt-4'>
                                    <small>12:04</small>
                                </div>
                            </div>
                        </div>
                        <div className='box-middle-panel mt-3 mobilechatconversationgroup'>
                            <div className='row'>
                                <strong><label>Groups</label></strong>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='col-2 text-center p-1 mt-1'>
                                    {this.renderProfilePicture('xl')}
                                </div>
                                <div className='col-8 mt-2'>
                                    <strong><label>Group name</label></strong>
                                    <br/>
                                    <small className='text-muted'>2Caroline: Hi Guys! I've...</small>
                                </div>
                                <div className='col-2 text-start p-2'>
                                    <small>12:04</small>
                                    <span className='badge rounded-pill bg-danger'>12+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='box-middle-panel mt-2 mobilechatconversation'>
                        <div className='row'>
                            <div className='col-8'>
                                <form>
                                    <div className='input-group'>
                                        <span className='input-group-text bg-transparent border-1'><a className='onClosesearchchatconversation'></a></span>
                                            <input type='text' className='form-control search-show-style' aria-label='Search' placeholder='Search...' />
                                            <span className='input-group-text bg-transparent'>
                                            <a><i className='bi-chat-square-text text-dark'></i></a>
                                        </span>
                                    </div>
                                </form>
                            </div>
                            <div className='col-2 text-center mt-1'>
                                <a className='onVerticaldropdownmenu'><i className='bi-pin'></i></a>
                            </div>
                            <div className='col-2 text-center'>
                                <div className='dropdown bg-transparent mt-1'>
                                    <a id='dropdownMenuChatAction' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-three-dots-vertical'></i></a>
                                    <ul className='dropdown-menu' aria-labelledby='dropdownMenuChatAction'>
                                        <li>
                                            <a className='dropdown-item onDeleteconversations'>Delete conversation</a>
                                        </li>
                                        <li>
                                            <a className='dropdown-item onChatsettings' aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelaccounts' aria-controls='offcanvasRightLabelaccounts'>Settings</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='box-middle-panel mt-2 mobilechatconversation'>
                            <div className='row'>
                                <div className='right-chat-panel'>
                                    <div className='text-center mb-4'>
                                        <small className='date-chats'>Tuesday, March 22</small>
                                    </div>
                                    <div className='row mt-3 mb-3'>
                                        <div className='col-3 text-center'>
                                            {this.renderProfilePicture('xl')}
                                        </div>
                                        <div className='col-9 mt-1'>
                                            <p className='name-of-chat-title-mobile'><strong><label className=''>Olive Dixon</label></strong>
                                                <small className='float-end'>10:04AM</small></p>
                                            <br />
                                            <p className='col-12 name-of-reply-title-mobile'><label>Hi Evan</label></p>
                                        </div>
                                    </div>
                                    <div className='row mt-4 mb-3'>
                                        <div className='col-3 text-center'>
                                            {this.renderProfilePicture('xl')}
                                        </div>
                                        <div className='col-9 mt-1'>
                                            <p className='name-of-chat-title-mobile'><strong><label className='float-start'>You</label></strong>
                                                <small className='float-end'>10:04AM</small></p>
                                            <br />
                                            <p className='col-12 name-of-reply-title-mobile'><label>Hi Oscar, Nice to meet you, <br /> we will work with new project together.</label></p>
                                        </div>
                                    </div>
                                    <div className='row mt-4 mb-3'>
                                        <div className='col-3 text-center'>
                                            {this.renderProfilePicture('xl')}
                                        </div>
                                        <div className='col-9 mt-1'>
                                            <p className='name-of-chat-title-mobile'><strong><label className='float-start'>Olive Dixon</label></strong>
                                                <small className='float-end'>10:04AM</small></p>
                                            <br />
                                            <p className='col-12 name-of-reply-title-mobile'><label>Hi! Please, change the status in this task </label></p>
                                            <a className='onLinkchats float-start'><i className='bi-link-45deg' style={{fontSize: '17px', color: '#40D782'}}></i>
                                                <label>UX Login + Registration</label>
                                            </a>
                                        </div>
                                    </div>

                                    <div className='row mt-3 mb-3'>
                                        <div className='col-3 text-center'>
                                            {this.renderProfilePicture('xl')}
                                        </div>

                                        <div className='col-9 mt-1'>
                                            <p className='name-of-chat-title-mobile'><strong><label className='float-start'>You</label></strong>
                                                <small className='float-end'>10:04AM</small></p>
                                            <br />
                                            <p className='col-12 name-of-reply-title-mobile'><label>Hi Oscar, Nice to meet you, <br /> we will work with new project together.</label></p>
                                        </div>
                                    </div>
                                    <div className='row mt-3 mb-3'>
                                        <div className='col-3 text-center'>
                                            {this.renderProfilePicture('xl')}
                                        </div>

                                        <div className='col-9 mt-1'>
                                            <p className='name-of-chat-title-mobile'><strong><label className='float-start mt-3'>Olive Dixon</label></strong>
                                                <small className='float-end mt-4'>10:04AM</small></p>
                                            <br />
                                            <p className='col-12 name-of-reply-title-mobile'><label>Ok</label></p>
                                        </div>
                                    </div>
                                    <div className='row mt-3 mb-3'>
                                        <div className='col-3 text-center'>
                                            {this.renderProfilePicture('xl')}
                                        </div>

                                        <div className='col-9 mt-1'>
                                            <p className='name-of-chat-title-mobile'><strong><label className='float-start'>You</label></strong>
                                                <small className='float-end'>10:04AM</small></p>
                                            <br />
                                            <p className='col-12 name-of-reply-title-mobile'><label>Good to chat you...</label></p>
                                        </div>
                                    </div>
                                    <div className='row mt-3 mb-3'>
                                        <div className='col-3 text-center'>
                                            {this.renderProfilePicture('xl')}
                                        </div>
                                        <div className='col-9 mt-1'>
                                            <p className='name-of-chat-title-mobile'><strong><label className='float-start mt-3'>Olive Dixon</label></strong>
                                                <small className='float-end mt-4'>10:04AM</small></p>
                                            <br />
                                            <p className='col-12 name-of-reply-title-mobile'><label>Yeah, well done  . ...</label></p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-12 mt-3 mb-3 removePadding'>
                                    <CreatePost />
                                    {/*<input type='text' className='form-control write-message-inputs-mobile' aria-label='Type your message here' placeholder='Type your message here...' />
                                    <span className='input-group-text group-text-actions bg-transparent'>
                                        <img width='20' src='assets/images/icon-browse.png' alt=''/>
                                        <img width='20' src='assets/images/icon-url.png' alt=''/>
                                        <img width='20' src='assets/images/icon-at.png' alt=''/>
                                        <img width='20' src='assets/images/icon-emoji.png' alt=''/>
                                        <button className='btn ms-2 onSendmessagewrite'><img width='20' src='assets/images/icon-arrow-search.png'/></button>
                                    </span>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
