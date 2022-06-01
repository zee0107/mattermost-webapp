// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import RightSideView from 'components/right_side_view';
import { UserProfile } from 'mattermost-redux/types/users';
import ForumMember from 'components/forum_member';
import ForumBrowse from 'components/forum_browse';
import ForumThread from 'components/forum_threads';
import { Thread } from 'mattermost-redux/types/crypto';

export type Props = {
    userId: string;
    profilePicture: string;
    currentUser: UserProfile;
}

type State = {
    isDark: string;
    selectedMenu: string;
    currentUser: UserProfile;
};

export default class ForumDiscussion extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
    }

    constructor(props: Props) {
        super(props);

        this.state = { isDark:'light',};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
                text={'forum'}
            />
        );
    }

    render= (): JSX.Element => {
        return (
            <>
                <section className='crypter-section-desktop'>
                    <div className='row'>
                        <div className='col-md-9'>
                            <div className='box-middle-panel-forums-menu'>
                                <div className=''>
                                    <a className='onForum float-start'><i className='bi-chat-left-text-fill'></i></a>
                                    <div className='row'>
                                        <div className='col-lg-6 mt-2 mb-0 p-0'>
                                            <h6 className='p-0 text-start ms-2 mt-1'>
                                            Topic title goes here
                                            </h6>
                                        </div>

                                        <div className='col-lg-6 mt-2 mb-0'>
                                            <div className='dropdown bg-transparent float-end'>
                                                <strong className='text-black-50'>
                                                    <small className='text-black-50'>Date Posts 05/30/2022</small> 
                                                    <i className='bi-dot'></i>
                                                    <i className='bi-eye'></i>
                                                    <small>0 views</small>
                                                    <i className='bi-dot'></i>
                                                    <i className='bi-hand-thumbs-up'></i>
                                                    <small>0</small>
                                                    <i className='bi-dot'></i>
                                                    <i className='bi-hand-thumbs-down'></i>
                                                    <small>0</small>
                                                    <i className='bi-dot'></i>
                                                    <i className='bi-chat-left'></i>
                                                    <small>0</small>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='content-forums-browse'>
                                <div className='row'>
                                    <div className='col-lg-8'>
                                        <div className='box-middle-panel mt-3'>
                                            {this.renderProfilePicture('fxl')}
                                            <strong className='mt-2 ms-2 float-start'>Name of user group</strong>
                                            <br/>
                                            <p className='mb-0 p-3 ms-2'>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                            </p>
                                            <p className='mb-0 p-3 ms-2'>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                            </p>
                                        </div>

                                        <div className='box-middle-panel mt-4'>
                                            {this.renderProfilePicture('fxl')}
                                            <strong className='mt-2 ms-2 float-start'>Group member comment</strong>
                                            <br/>
                                            <p className='mb-0 p-3 ms-2'>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                            </p>
                                        </div>

                                        <div className='box-middle-panel mt-4'>
                                            {this.renderProfilePicture('fxl')}
                                            <strong className='mt-2 ms-2 float-start'>Group member comment</strong>
                                            <br/>
                                            <p className='mb-0 p-3 ms-2'>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                            </p>
                                        </div>

                                        <div className='box-middle-panel mt-4'>
                                            {this.renderProfilePicture('fxl')}
                                            <strong className='mt-2 ms-2 float-start'>NGroup member comment</strong>
                                            <br/>
                                            <p className='mb-0 p-3 ms-2'>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                            </p>
                                        </div>

                                        <div className='box-middle-panel mt-4 p-4'>
                                            <strong>Comments</strong>
                                            <div className='form-floating mt-2 mb-2'>
                                                <textarea className='form-control' placeholder='Leave a comment here' id='floatingTextarea' style='height: 100px'></textarea>
                                                <label for='floatingTextarea'>Leave a comment here</label>
                                            </div>
                                            <div className='d-grid gap-2'>
                                                <button className='btn btn-creative btn-sm text-white' type='button'>SUBMIT</button>
                                            </div>
                                        </div>
                                    </div>
                                <div className='col-lg-4'>
                                    <div className='position-sticky float-right-panel'>
                                        <div className='box-middle-panel mt-3'>
                                            <div className='d-grid mt-2 mb-0 text-center'>
                                                <strong className='text-secondary'>
                                                    <small>
                                                    <i className='bi-people-fill'></i> 
                                                    People joined
                                                    <i className='bi-dot'></i> 
                                                    <a className='onShowmembers'>10.11K</a>
                                                    </small>
                                                </strong>
                                            </div>
                                            <div className='showmembers'>
                                                <div className='d-grid mt-0 mb-0'>
                                                    <hr/>
                                                    <p>
                                                        <strong className='mb-0 float-start mt-1'>
                                                        <i className='bi-people-fill'></i>  People <i className='bi-dot'></i> 10.11K
                                                        </strong>
                                                        
                                                        <a className='onClosememberslist'>
                                                        <i className='bi-x-circle bi-x-circle-fill-style float-end'></i>
                                                        </a>
                                                    </p>
                                                    <p className='mt-0'>
                                                        <small>
                                                        New people and Pages who join this group will appear here. <a className='text-success'><strong>Learn More</strong></a>
                                                        </small>
                                                    </p>

                                                    <p className='mt-0 mb-4'>
                                                        <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-2.png' />
                                                        <strong className='ms-2 text-end'>Topic name</strong>
                                                    </p>
                                                    <p className='mt-0 mb-4'>
                                                        <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-3.png' />
                                                        <strong className='ms-2 text-end'>Topic name</strong>
                                                    </p>
                                                    <p className='mt-0 mb-4'>
                                                        <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-4.png' />
                                                        <strong className='ms-2 text-end'>Topic name</strong>
                                                    </p>
                                                    <p className='mt-0 mb-0'>
                                                        <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-5.png' />
                                                        <strong className='ms-2 text-end'>Topic name</strong>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='d-grid mt-2'>
                                                <button type='button' className='btn btn-creative btn-sm text-white onJoinus'>
                                                    JOIN US
                                                </button>
                                                <button type='button' className='btn btn-creative btn-sm text-white onApproval' disabled>
                                                    JOINED
                                                </button>
                                            </div>
                                            <hr/>
                                            <strong>Related Topics</strong>
                                            <p className='mt-4 mb-4'>
                                            <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-2.png' />
                                            <strong className='ms-2 text-end'>Topic name</strong>
                                            <i className='bi-dot'></i>
                                            <small>5/31/2022</small>
                                            </p>
                                            <p className='mt-4 mb-4'>
                                            <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-3.png' />
                                            <strong className='ms-2 text-end'>Topic name</strong>
                                            <i className='bi-dot'></i>
                                            <small>5/29/2022</small>
                                            </p>
                                            <p className='mt-4 mb-4'>
                                            <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-4.png' />
                                            <strong className='ms-2 text-end'>Topic name</strong>
                                            <i className='bi-dot'></i>
                                            <small>5/29/2022</small>
                                            </p>
                                            <p className='mt-4 mb-4'>
                                            <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-5.png' />
                                            <strong className='ms-2 text-end'>Topic name</strong>
                                            <i className='bi-dot'></i>
                                            <small>5/29/2022</small>
                                            </p>
                                            <p className='mt-4 mb-4'>
                                            <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-6.png' />
                                            <strong className='ms-2 text-end'>Topic name</strong>
                                            <i className='bi-dot'></i>
                                            <small>5/29/2022</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3' id='rightSideView'>
                            <RightSideView/>
                        </div>
                    </div>
                </section>
                <section className='crypter-section-mobile'>
                    <div className='container-fluid'>
                        <div className='position-sticky float-middle-panel'>
                            <div className='box-middle-panel-marketplace-mobile bg-transparent mb-3'>
                                <div className='row'>
                                    <div className='col-6'>
                                        <a className='onForum float-start'><i className='bi-chat-left-text-fill'></i></a>
                                        <small className='ms-2 text-marketplace float-start mt-2'><strong>Forum</strong></small>
                                    </div>
                                    <div className='col-6 mt-1'>
                                        <a className='float-end'><i className='bi-arrow-left-circle'></i></a>

                                        <a className='float-end mt-0 me-2 bg-white p-2 rounded' data-bs-toggle='collapse' href='#collapseJumpto' role='button' aria-expanded='true' aria-controls='collapseJumpto'>
                                        <strong><label>Jump to <i className='bi-chevron-down'></i></label></strong>
                                        </a>
                                    </div>
                                </div>
                                <div className='collapse mt-1' id='collapseJumpto'>
                                    <ul className='list-group'>
                                        <li className={`list-group-item border-0 onBrowse ${selectedMenu === 'browse' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'browse'}); }}>Browse</li>
                                        <li className={`list-group-item border-0 onMemebers ${selectedMenu === 'members' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'members'}); }}>Members</li>
                                        <li className={`list-group-item border-0 onSearch ${selectedMenu === 'search' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''} `} onClick={() => { this.setState({selectedMenu: 'search'}); }}>Search</li>
                                        <li className={`list-group-item border-0 onMythreads ${selectedMenu === 'threads' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'threads'}); }}>My Threads</li>
                                        <li className={`list-group-item border-0 onMymessages ${selectedMenu === 'messages' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'messages'}); }}>My Messages</li>
                                        <li className={`list-group-item border-0 onMymessages`}><a href='/create-forum-thread'>Create a Topic</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='box-middle-panel-forums-mobile mb-3'>
                            <div id='carouselForumsmenumobileControls' className='carousel slide' data-bs-ride='carouselforums'>
                                <button className='carousel-control-prev' type='button' data-bs-target='#carouselForumsmenumobileControls' data-bs-slide='prev'>
                                </button>
                                <button className='carousel-control-next' type='button' data-bs-target='#carouselForumsmenumobileControls' data-bs-slide='next'>
                                </button>
                                <div className='carousel-inner'>
                                    <div className='carousel-item active'>
                                        <div className='row'>
                                            <div className='col-4 text-center'><a className={`onBrowse forum-menu-links ${selectedMenu === 'browse' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'browse'}); }}><strong>Browse</strong></a></div>
                                            <div className='col-4 text-center'><a className={`onMemebers forum-menu-links ${selectedMenu === 'members' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'members'}); }}><strong>Members</strong></a></div>
                                            <div className='col-4 text-center'><a className={`onSearch forum-menu-links ${selectedMenu === 'search' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'search'}); }}><strong>Search</strong></a></div>
                                        </div>
                                    </div>
                                    <div className='carousel-item'>
                                        <div className='row'>
                                            <div className='col-4 text-center'><a className={`onMythreads forum-menu-links ${selectedMenu === 'threads' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'threads'}); }}><strong>My Threads</strong></a></div>
                                            <div className='col-4 text-center'><a className={`onMymessages forum-menu-links ${selectedMenu === 'messages' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'messages'}); }}><strong>My Messages</strong></a></div>
                                            <div className='col-4 text-center'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='box-middle-panel-products-mobile'>
                                    {renderViewMobile}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
