// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import RightSideView from 'components/right_side_view';
import { UserProfile } from 'mattermost-redux/types/users';
import ForumMember from 'components/forum_member';
import ForumBrowse from 'components/forum_browse';
import ForumThread from 'components/forum_threads';
import ForumMessage from 'components/forum_messages';
import { Thread } from 'mattermost-redux/types/crypto';

export type Props = {
    userId: string;
    profilePicture: string;
    currentUser: UserProfile;
    myThreads: Promise<string[]>;
    myMessages: Promise<string[]>;
    allThreads: Promise<Thread[]>;
    forumMembers: Promise<string[]>;
}

type State = {
    isDark: string;
    selectedMenu: string;
    currentUser: UserProfile;
    myThreads: string[];
    myMessages: string[];
    allThreads: Thread[];
    forumMembers: string[];
};

export default class MyPages extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
    }

    constructor(props: Props) {
        super(props);

        this.state = { isDark:'light', selectedMenu: 'browse', myThreads: [],myMessages: [],allThreads: [],forumMembers: [], };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.myThreads !== undefined && this.props.myThreads !== null){
            Promise.resolve(this.props.myThreads).then((value) => { this.setState({myThreads: value}); });
        }
        if(this.props.myMessages !== undefined && this.props.myMessages !== null){
            Promise.resolve(this.props.myMessages).then((value) => { this.setState({myMessages: value}); });
        }
        if(this.props.allThreads !== undefined && this.props.allThreads !== null){
            Promise.resolve(this.props.allThreads).then((value) => { this.setState({allThreads: value}); });
        }
        if(this.props.forumMembers !== undefined && this.props.forumMembers !== null){
            Promise.resolve(this.props.forumMembers).then((value) => { this.setState({forumMembers: value}); });
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
        const {selectedMenu, myThreads,myMessages,allThreads,forumMembers} = this.state;

        let memberDesktop,memberMobile;
        if(forumMembers !== undefined && forumMembers !== null){
            if(forumMembers.length){
                memberDesktop = (
                    <>
                        {forumMembers.map((item,index) => {
                            return (
                                <ForumMember userId={item} view={'desktop'} key={`${item}-${index}`} />
                            );
                        })}
                    </>
                );

                memberMobile = (
                    <>
                        {forumMembers.map((item,index) => {
                            return (
                                <ForumMember userId={item} view={'mobile'} key={`${item}--${index}`} />
                            );
                        })}
                    </>
                );
            }
            else{
                memberDesktop = (<><div className='col-12 mx-auto text-center mt-5'><h3 className='text-muted'><i className='bi-journal-x'></i> No members on the list</h3></div></>);
                memberMobile = (<><div className='col-12 mx-auto text-center mt-5'><h3 className='text-muted'><i className='bi-journal-x'></i> No members on the list</h3></div></>);
            }
        }

        let myThreadDesktop, myThreadMobile;
        if(myThreads && myThreads.length){
            myThreadDesktop = (
                <>
                    {myThreads.map((item,index) => {
                        return (
                            <ForumThread forumId={item} view={'desktop'} key={`${item}--${index}`} />
                        );
                    })}
                </>
                
            );
            myThreadMobile = (
                <>
                    {myThreads.map((item,index) => {
                        return (
                            <ForumThread forumId={item} view={'mobile'} key={`${item}--${index}`} />
                        );
                    })}
                </>
            );
        }
        else{
            myThreadDesktop = (<><div className='col-12 mx-auto text-center mt-5'><h3 className='text-muted'><i className='bi-journal-x'></i> No threads on the list</h3></div></>);
            myThreadMobile = (<><div className='col-12 mx-auto text-center mt-5'><h3 className='text-muted'><i className='bi-journal-x'></i> No threads on the list</h3></div></>);
        }

        let myMessageDesktop, myMessageMobile;
        if(myMessages && myMessages.length){
            myMessageDesktop = (
                <>
                    {myMessages.map((item,index) => {
                        return (
                            <ForumMessage commentId={item} view='desktop' />
                        );
                    })}
                </>
                
            );
            myMessageMobile = (
                <>
                    {myMessages.map((item,index) => {
                        return (
                            <ForumMessage commentId={item} view='mobile' />
                        );
                    })}
                </>
            );
        }
        else{
            myMessageDesktop = (<><div className='col-12 mx-auto text-center mt-5'><h3 className='text-muted'><i className='bi-journal-x'></i> No message on the list</h3></div></>);
            myMessageMobile = (<><div className='col-12 mx-auto text-center mt-5'><h3 className='text-muted'><i className='bi-journal-x'></i> No message on the list</h3></div></>);
        }

        let myBrowseDesktop, myBrowseMobile;
        if(allThreads && allThreads.length){
            myBrowseDesktop = (
                <>
                    {allThreads.map((item,index) => {
                        return (
                            <ForumBrowse userId={item.user_id} forumId={item.forum_id} view={'desktop'} key={`${item.forum_id}--${index}`} />
                        );
                    })}
                </>
                
            );
            myBrowseMobile = (
                <>
                    {allThreads.map((item,index) => {
                        return (
                            <ForumBrowse userId={item.user_id} forumId={item.forum_id} view={'mobile'} key={`${item.forum_id}--${index}`} />
                        );
                    })}
                </>
            );
        }
        else{
            myBrowseDesktop = (<><div className='col-12 mx-auto text-center mt-5'><h3 className='text-muted'><i className='bi-journal-x'></i> No threads on the list</h3></div></>);
            myBrowseMobile = (<><div className='col-12 mx-auto text-center mt-5'><h3 className='text-muted'><i className='bi-journal-x'></i> No threads on the list</h3></div></>);
        }

        let renderViewDesktop;
        let renderViewMobile;
        if(selectedMenu === 'members'){
            renderViewDesktop = (
                <div className='content-forums-members'>
                    <div className='box-middle-panel mt-3'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                                <div className='col-8 mt-2 mb-2'><strong><a className='ms-2'>List of Users</a></strong></div>
                                <div className='col-4 mt-2 mb-2'>
                                    <a className='float-end ms-1 forum-menu-links'><strong>Z</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>Y</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>X</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>W</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>V</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>U</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>T</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>S</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>R</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>Q</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>P</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>O</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>N</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>M</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>L</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>K</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>J</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>I</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>H</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>G</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>F</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>E</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>D</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>C</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>B</strong></a>
                                    <a className='float-end ms-1 forum-menu-links'><strong>A</strong></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='box-middle-panel mt-3'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                            <div className='col-4 mt-2 mb-2'>
                                <strong><a className='ms-2'>Name</a></strong></div>
                            <div className='col-2 text-center mt-2 mb-2'>
                                <a><strong>Joined</strong></a></div>
                            <div className='col-2 text-center mt-2 mb-2'>
                                <a><strong>Last Visit</strong></a></div>
                            <div className='col-2 text-center mt-2 mb-2'>
                                <a><strong>Post Count</strong></a></div>
                            <div className='col-2 text-center mt-2 mb-2'>
                                <a><strong>Referrals</strong></a></div>
                            </div>
                        </div>
                    </div>
                    {memberDesktop}
                </div>
            );

            renderViewMobile = (
                <div className='content-forums-members'>
                    <div className='box-middle-panel'>
                        <div className='col-12'>
                            <div className='row'>
                            <div className='col-12 mt-2'><strong><a>List of Users</a></strong></div>
                            <div className='col-12 mb-2'>
                                <a className='float-start ms-1 forum-menu-links'><strong>A</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>B</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>C</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>D</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>E</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>F</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>G</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>H</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>I</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>J</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>K</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>L</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>M</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>N</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>O</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>P</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>Q</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>R</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>S</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>T</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>U</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>V</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>W</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>X</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>Y</strong></a>
                                <a className='float-start ms-1 forum-menu-links'><strong>Z</strong></a>
                            </div>
                            </div>
                        </div>
                    </div>
                    {memberMobile}
                </div>
            );
        }else if(selectedMenu === 'search'){
            renderViewDesktop = (
                <div className='content-forums-search'>
                    <div className='box-middle-panel mt-3'>
                        <div className='row mt-3'>
                                <h6>Search</h6>
                        </div>
                        <hr/>
                        <div className='row'>
                            <form>
                                <div className='mb-3'>
                                    <label htmlFor='exampleFormControlTextarea1' className='form-label'>Search for term</label>
                                    <textarea className='form-control' id='exampleFormControlTextarea1' rows='3'></textarea>
                                </div>
                                <div className='row mt-2 mb-2'>
                                    <div className='col-md-6'>
                                            <label htmlFor='inputState' className='form-label'><small>Search type</small></label>
                                            <select id='inputState' className='form-control'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                    <div className='col-md-6'>
                                            <label htmlFor='inputState' className='form-label'><small>Search in threads</small></label>
                                            <select id='inputState' className='form-control'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                </div>
                                <div className='row mt-2 mb-2'>
                                    <div className='col-md-6'>
                                            <label htmlFor='inputState' className='form-label'><small>Search section</small></label>
                                            <select id='inputState' className='form-control'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                    <div className='col-md-6'>
                                    </div>
                                </div>
                                <div className='row mt-4 mb-4'>
                                    <div className='col-12 text-center'>
                                    <a className='onSearchforums text-white'>Search</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );

            renderViewMobile = (
                <div className='content-forums-search'>
                    <div className='box-middle-panel mt-3'>
                        <div className='row mt-3'>
                                <h6>Search</h6>
                        </div>
                        <hr/>
                        <div className='row'>
                            <form>
                                <div className='mb-2'>
                                    <label htmlFor='exampleFormControlTextarea1' className='form-label'>Search for term</label>
                                    <textarea className='form-control' id='exampleFormControlTextarea1' rows='3'></textarea>
                                </div>
                                <div className='row mt-2 mb-2'>
                                    <div className='col-md-6 mt-2 mb-2'>
                                            <label htmlFor='inputState' className='form-label'><small>Search type</small></label>
                                            <select id='inputState' className='form-control'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                    <div className='col-md-6 mt-2 mb-2'>
                                            <label htmlFor='inputState' className='form-label'><small>Search in threads</small></label>
                                            <select id='inputState' className='form-control'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                </div>
                                <div className='row mt-2 mb-2'>
                                    <div className='col-md-6 mt-2 mb-2'>
                                            <label htmlFor='inputState' className='form-label'><small>Search section</small></label>
                                            <select id='inputState' className='form-control'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                    <div className='col-md-6'>

                                    </div>
                                </div>
                                <div className='row mt-4 mb-4'>
                                    <div className='col-12 text-center'>
                                    <a className='onSearchforums text-white'>Search</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }else if(selectedMenu === 'threads'){
            renderViewDesktop = (
                <div className='content-forums-my-threads'>
                    <div className='box-middle-panel mt-3'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                            <div className='col-4 mt-2 mb-2'><strong><a className='ms-2'>Forums</a></strong></div>
                            <div className='col-2 text-center mt-2 mb-2'><a><strong>Posts</strong></a></div>
                            <div className='col-2 text-center mt-2 mb-2'><a><strong>Views</strong></a></div>
                            <div className='col-2 text-center mt-2 mb-2'><a><strong>Likes</strong></a></div>
                            <div className='col-2 text-center mt-2 mb-2'><a><strong>Comments</strong></a></div>
                            </div>
                        </div>
                    </div>
                    {myThreadDesktop}
                </div>
            );

            renderViewMobile = (
                <div className='content-forums-my-threads'>
                    {myThreadMobile}
                </div>
            );
        }else if(selectedMenu === 'messages'){
            renderViewDesktop = (
                <div className='content-forums-my-messages'>
                    {myMessageDesktop}
                </div>
            );

            renderViewMobile = (
                <div className='content-forums-my-messages'>
                    {myMessageMobile}
                </div>
            );
        }else{
            renderViewDesktop = (
                <div className='content-forums-browse'>
                    <div className='box-middle-panel mt-3'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                            <div className='col-8 mt-2 mb-2'><strong><a className='ms-2'>Forum</a></strong></div>
                            <div className='col-2 text-center mt-2 mb-2'><a><strong>Members</strong></a></div>
                            <div className='col-2 text-center mt-2 mb-2'><a><strong>Search</strong></a></div>
                            </div>
                        </div>
                    </div>
                    {myBrowseDesktop}
                </div>
            );

            renderViewMobile = (
                <div className='content-forums-browse'>
                    {myBrowseMobile}
                </div>
            );
        }

        return (
            <>
                <section className='crypter-section-desktop'>
                    <div className='row'>
                        <div className='col-md-9'>
                            <div className='box-middle-panel-forums-menu'>
                                <div className='col-12 mx-auto'>
                                    <a className='onForum float-start'><i className='bi-chat-left-text-fill'></i></a>
                                    <div className='row'>
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className={`onBrowse p-4 forum-menu-links ${selectedMenu === 'browse' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'browse'}); }}>Browse</a></div>
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className={`onMemebers p-4 forum-menu-links ${selectedMenu === 'members' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'members'}); }}>Members</a></div>
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className={`onSearch p-4 forum-menu-links ${selectedMenu === 'search' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'search'}); }}>Search</a></div>
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className={`onMythreads p-4 forum-menu-links ${selectedMenu === 'threads' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'threads'}); }}>MyThreads</a></div>
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className={`onMymessages p-4 forum-menu-links ${selectedMenu === 'messages' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'messages'}); }}>MyMessages</a></div>
                                        <div className='col-2 text-center mt-2 mb-0'>
                                            <div className='dropdown float-end bg-transparent'>
                                                <button className='btn-secondary dropdown-toggle dropdown-toggle-forum' type='button' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='true'>
                                                <small>JumpTo</small>
                                                </button>
                                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                                    <li><a className={`dropdown-item onBrowse ${selectedMenu === 'browse' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'browse'}); }}>Browse</a></li>
                                                    <li><a className={`dropdown-item onMemebers ${selectedMenu === 'members' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'members'}); }}>Members</a></li>
                                                    <li><a className={`dropdown-item onSearch ${selectedMenu === 'search' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'search'}); }}>Search</a></li>
                                                    <li><a className={`dropdown-item onMythreads ${selectedMenu === 'threads' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'threads'}); }}>My Threads</a></li>
                                                    <li><a className={`dropdown-item onMymessages ${selectedMenu === 'messages' ? 'border-bottom border-success border-3 fw-bold forums-text-menu-color':''}`} onClick={() => { this.setState({selectedMenu: 'messages'}); }}>My Messages</a></li>
                                                    <li><a className={`dropdown-item onMymessages`} href='/create-forum-thread'>Create a Topic</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {renderViewDesktop}
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
