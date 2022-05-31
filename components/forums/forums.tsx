// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import RightSideView from 'components/right_side_view';
import { UserProfile } from 'mattermost-redux/types/users';

export type Props = {
    userId: string;
    profilePicture: string;
    currentUser: UserProfile;
}

type State = {
    isDark: string;
    selectedMenu: string;
};

export default class MyPages extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
    }

    constructor(props: Props) {
        super(props);

        this.state = { isDark:'light', selectedMenu: 'browse', };
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
                text={'story'}
            />
        );
    }

    render= (): JSX.Element => {
        const {selectedMenu} = this.state;

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
                                    <a className='float-start ms-1'><strong>A</strong></a>
                                    <a className='float-start ms-1'><strong>B</strong></a>
                                    <a className='float-start ms-1'><strong>C</strong></a>
                                    <a className='float-start ms-1'><strong>D</strong></a>
                                    <a className='float-start ms-1'><strong>E</strong></a>
                                    <a className='float-start ms-1'><strong>F</strong></a>
                                    <a className='float-start ms-1'><strong>G</strong></a>
                                    <a className='float-start ms-1'><strong>H</strong></a>
                                    <a className='float-start ms-1'><strong>I</strong></a>
                                    <a className='float-start ms-1'><strong>J</strong></a>
                                    <a className='float-start ms-1'><strong>K</strong></a>
                                    <a className='float-start ms-1'><strong>L</strong></a>
                                    <a className='float-start ms-1'><strong>M</strong></a>
                                    <a className='float-start ms-1'><strong>N</strong></a>
                                    <a className='float-start ms-1'><strong>O</strong></a>
                                    <a className='float-start ms-1'><strong>P</strong></a>
                                    <a className='float-start ms-1'><strong>Q</strong></a>
                                    <a className='float-start ms-1'><strong>R</strong></a>
                                    <a className='float-start ms-1'><strong>S</strong></a>
                                    <a className='float-start ms-1'><strong>T</strong></a>
                                    <a className='float-start ms-1'><strong>U</strong></a>
                                    <a className='float-start ms-1'><strong>V</strong></a>
                                    <a className='float-start ms-1'><strong>W</strong></a>
                                    <a className='float-start ms-1'><strong>X</strong></a>
                                    <a className='float-start ms-1'><strong>Y</strong></a>
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
                    <div className='box-middle-panel-select-forum'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                                    <div className='col-4 mt-2 mb-2'>
                                    {this.renderProfilePicture('lg')}
                                    {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt='' />*/}
                                    <p><label><strong>Lorem Ipsum</strong></label><br/><small>Lorem Ipsum is simply dummy text of the printing</small></p>
                                    </div>
                                    <div className='col-2 mt-3 mb-2 text-center'>
                                    <strong>11M</strong>
                                    </div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong>12M</strong></div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong>55</strong></div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong>254</strong></div>
                            </div>
                        </div>
                    </div>
                </div>
            );

            renderViewMobile = (
                <div className='content-forums-members'>
                    <div className='box-middle-panel'>
                        <div className='col-12'>
                            <div className='row'>
                            <div className='col-12 mt-2'><strong><a>List of Users</a></strong></div>
                            <div className='col-12 mb-2'>
                                <a className='float-start'><strong>A</strong></a>
                                <a className='float-start ms-1'><strong>B</strong></a>
                                <a className='float-start ms-1'><strong>C</strong></a>
                                <a className='float-start ms-1'><strong>D</strong></a>
                                <a className='float-start ms-1'><strong>E</strong></a>
                                <a className='float-start ms-1'><strong>F</strong></a>
                                <a className='float-start ms-1'><strong>G</strong></a>
                                <a className='float-start ms-1'><strong>H</strong></a>
                                <a className='float-start ms-1'><strong>I</strong></a>
                                <a className='float-start ms-1'><strong>J</strong></a>
                                <a className='float-start ms-1'><strong>K</strong></a>
                                <a className='float-start ms-1'><strong>L</strong></a>
                                <a className='float-start ms-1'><strong>M</strong></a>
                                <a className='float-start ms-1'><strong>N</strong></a>
                                <a className='float-start ms-1'><strong>O</strong></a>
                                <a className='float-start ms-1'><strong>P</strong></a>
                                <a className='float-start ms-1'><strong>Q</strong></a>
                                <a className='float-start ms-1'><strong>R</strong></a>
                                <a className='float-start ms-1'><strong>S</strong></a>
                                <a className='float-start ms-1'><strong>T</strong></a>
                                <a className='float-start ms-1'><strong>U</strong></a>
                                <a className='float-start ms-1'><strong>V</strong></a>
                                <a className='float-start ms-1'><strong>W</strong></a>
                                <a className='float-start ms-1'><strong>X</strong></a>
                                <a className='float-start ms-1'><strong>Y</strong></a>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className='box-middle-panel-select-forum'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                                <div className='col-lg-12 mt-2 mb-2'>
                                {this.renderProfilePicture('lg')}
                                {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt=''/>*/}
                                <p><label><strong>Lorem Ipsum</strong></label><br/><small>Lorem Ipsum is simply dummy text of the printing</small></p>
                                </div>
                                <hr/>
                                <div className='col-3 text-center mt-0 mb-2'><strong>11M</strong><br/><small className='text-muted'>Joined</small></div>
                                <div className='col-3 text-center mt-0 mb-2'><strong>12M</strong><br/><small className='text-muted'>Last Visit</small></div>
                                <div className='col-3 text-center mt-0 mb-2'><strong>55</strong><br/><small className='text-muted'>Post Count</small></div>
                                <div className='col-3 text-center mt-0 mb-2'><strong>254</strong><br/><small className='text-muted'>Referrals</small></div>
                            </div>
                        </div>
                    </div>
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
                                    <textarea className='form-control select-search-forums' id='exampleFormControlTextarea1' rows='3'></textarea>
                                </div>
                                <div className='row mt-2 mb-2'>
                                    <div className='col-md-6'>
                                            <label htmlFor='inputState' className='form-label'><small>Search type</small></label>
                                            <select id='inputState' className='form-select select-search-forums'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                    <div className='col-md-6'>
                                            <label htmlFor='inputState' className='form-label'><small>Search in threads</small></label>
                                            <select id='inputState' className='form-select select-search-forums'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                </div>
                                <div className='row mt-2 mb-2'>
                                    <div className='col-md-6'>
                                            <label htmlFor='inputState' className='form-label'><small>Search section</small></label>
                                            <select id='inputState' className='form-select select-search-forums'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                    <div className='col-md-6'>
                                    </div>
                                </div>
                                <div className='row mt-4 mb-4'>
                                    <div className='col-12 text-center'>
                                    <a className='btn btn-sm onSearchforums text-white'>Search</a>
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
                                    <textarea className='form-control select-search-forums' id='exampleFormControlTextarea1' rows='3'></textarea>
                                </div>
                                <div className='row mt-2 mb-2'>
                                    <div className='col-md-6 mt-2 mb-2'>
                                            <label htmlFor='inputState' className='form-label'><small>Search type</small></label>
                                            <select id='inputState' className='form-select select-search-forums'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                    <div className='col-md-6 mt-2 mb-2'>
                                            <label htmlFor='inputState' className='form-label'><small>Search in threads</small></label>
                                            <select id='inputState' className='form-select select-search-forums'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                </div>
                                <div className='row mt-2 mb-2'>
                                    <div className='col-md-6 mt-2 mb-2'>
                                            <label htmlFor='inputState' className='form-label'><small>Search section</small></label>
                                            <select id='inputState' className='form-select select-search-forums'>
                                            <option selected>Choose...</option>
                                            <option>...</option>
                                            </select>
                                    </div>
                                    <div className='col-md-6'>

                                    </div>
                                </div>
                                <div className='row mt-4 mb-4'>
                                    <div className='col-12 text-center'>
                                    <a className='btn btn-sm onSearchforums text-white'>Search</a>
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
                    <div className='box-middle-panel-forums'>
                        <div className='box-middle-panel-select-forum'>
                            <div className='col-12 mx-auto'>
                                <div className='row'>
                                    <div className='col-4 mt-2 mb-2'>
                                    {this.renderProfilePicture('lg')}
                                    {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt=''/>*/}
                                    <p><label><strong>Lorem Ipsum</strong></label><br/><small>Lorem Ipsum is simply dummy text.</small></p>
                                    </div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong>8</strong></div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong>255</strong></div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong>64</strong></div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong>8</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

            renderViewMobile = (
                <div className='content-forums-my-threads'>
                    <div className='box-middle-panel-select-forum'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                                <div className='col-lg-12 mt-2 mb-2'>
                                    {this.renderProfilePicture('lg')}
                                    {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt=''/>*/}
                                    <p><label><strong>Lorem Ipsum</strong></label><br/><small>Lorem Ipsum is simply dummy text of the printing</small></p>
                                </div>
                                <hr/>
                                <div className='col-3 text-center mt-0 mb-2'><strong>8</strong><br/><small className='text-muted'>Posts</small></div>
                                <div className='col-3 text-center mt-0 mb-2'><strong>255</strong><br/><small className='text-muted'>Views</small></div>
                                <div className='col-3 text-center mt-0 mb-2'><strong>64</strong><br/><small className='text-muted'>Likes</small></div>
                                <div className='col-3 text-center mt-0 mb-2'><strong>8</strong><br/><small className='text-muted'>Comments</small></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else if(selectedMenu === 'messages'){
            renderViewDesktop = (
                <div className='content-forums-my-messages'>
                    <div className='box-middle-panel-forums'>
                        <div className='box-middle-panel-select-forum'>
                            <div className='col-12 mx-auto'>
                                <div className='row'>
                                    <div className='col-5 mt-2 mb-2'>
                                    {this.renderProfilePicture('lg')}
                                    {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt='' />*/}
                                    <p><label><strong>Lorem Ipsum</strong></label><br/><small>Lorem Ipsum is simply dummy text.</small></p>
                                    </div>
                                    <div className='col-3 text-left mt-3 mb-2'><small>2 Minutes ago</small></div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong><i className='bi-bookmark bi-bookmark-style'></i></strong></div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong><i className='bi-trash bi-trash-style'></i></strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

            renderViewMobile = (
                <div className='content-forums-my-messages'>
                    <form>
                        <div className='input-group mb-3'>
                        <span className='input-group-text bg-white border-0' id=''><i className='bi-search text-dark'></i></span>
                        <input type='text' className='form-control bg-white border-0 rounded' placeholder='Search products' aria-label='Search products' aria-describedby='Search products forums' />
                        </div>
                    </form>
                    <div className='box-middle-panel-forums'>
                        <div className='box-middle-panel-select-forum'>
                            <div className='col-12 mx-auto'>
                                <div className='row'>
                                    <div className='col-8 mt-2 mb-1'>
                                    <img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt=''/>
                                    <p><label><strong>Lorem Ipsum</strong></label><br/><small>Lorem Ipsum is simply dummy text.</small></p>
                                    </div>
                                    <div className='col-4 text-center mt-2 mb-1'>
                                    <i className='bi-bookmark bi-bookmark-style'></i>
                                    <i className='bi-trash bi-trash-style'></i>
                                    <br/>
                                    <small>2 Minutes ago</small></div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <div className='box-middle-panel-forums'>
                        <div className='box-middle-panel-select-forum'>
                            <div className='col-12 mx-auto'>
                                <div className='row'>
                                    <div className='col-4 mt-2 mb-2'>
                                        {this.renderProfilePicture('lg')}
                                        {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt=''/>*/}
                                        <p><label><strong>Lorem Ipsum</strong></label><br/><small>Lorem Ipsum is simply dummy text of the printing</small></p>
                                    </div>
                                    <div className='col-4 mt-2 mb-2'>
                                        {this.renderProfilePicture('lg')}
                                        {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-5.png' alt=''/>*/}
                                        <p><label><strong>Lorem Ipsum</strong></label><br/><small>By: <a className='text-success'>Pablo trucks</a></small>
                                        <small className='ms-1'>1 Day ago</small></p>
                                    </div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong>8</strong></div>
                                    <div className='col-2 text-center mt-3 mb-2'><strong>255</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

            renderViewMobile = (
                <div className='content-forums-browse'>
                    <div className='box-middle-panel-select-forum'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                            <div className='col-lg-12 mt-2 mb-0'>
                                {this.renderProfilePicture('lg')}
                                {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-2.png' alt='' />*/}
                                <p><label><strong>Lorem Ipsum</strong></label><br/><small>Lorem Ipsum is simply dummy text of the printing</small></p>
                            </div>
                            </div>
                            <hr/>
                            <div className='row'>
                            <div className='col-6'>
                                {this.renderProfilePicture('lg')}
                                {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-4.png' alt='' />*/}
                                <p><label><strong>Lorem Ipsum</strong></label><br/><small>By: <a className='text-success'>Pablo trucks</a></small>
                                <small className='ms-1'>1 Day ago</small></p>
                            </div>
                            <div className='col-2 text-center'>
                                <label>8 <br/><small className='text-muted'>Topic</small></label>
                            </div>
                            <div className='col-3 text-center'><label>255</label><br/><small className='text-muted'>Posts</small></div>
                            </div>
                        </div>
                    </div>
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
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className='onBrowse p-4' onClick={() => { this.setState({selectedMenu: 'browse'}); }}>Browse</a></div>
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className='onMemebers p-4' onClick={() => { this.setState({selectedMenu: 'members'}); }}>Members</a></div>
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className='onSearch p-4' onClick={() => { this.setState({selectedMenu: 'search'}); }}>Search</a></div>
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className='onMythreads p-4' onClick={() => { this.setState({selectedMenu: 'threads'}); }}>MyThreads</a></div>
                                        <div className='col-2 text-center mt-2 mb-2 p-0'><a className='onMymessages p-4' onClick={() => { this.setState({selectedMenu: 'messages'}); }}>MyMessages</a></div>
                                        <div className='col-2 text-center mt-2 mb-0'>
                                            <div className='dropdown float-end bg-transparent'>
                                                <button className='btn-secondary dropdown-toggle dropdown-toggle-forum' type='button' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='true'>
                                                <small>JumpTo</small>
                                                </button>
                                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                                    <li><a className='dropdown-item onBrowse' onClick={() => { this.setState({selectedMenu: 'browse'}); }}>Browse</a></li>
                                                    <li><a className='dropdown-item onMemebers' onClick={() => { this.setState({selectedMenu: 'members'}); }}>Members</a></li>
                                                    <li><a className='dropdown-item onSearch' onClick={() => { this.setState({selectedMenu: 'search'}); }}>Search</a></li>
                                                    <li><a className='dropdown-item onMythreads' onClick={() => { this.setState({selectedMenu: 'threads'}); }}>MyTreads</a></li>
                                                    <li><a className='dropdown-item onMymessages' onClick={() => { this.setState({selectedMenu: 'messages'}); }}>MyMessages</a></li>
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
                                    <li className='list-group-item border-0 onBrowse' onClick={() => { this.setState({selectedMenu: 'browse'}); }}>Browse</li>
                                    <li className='list-group-item border-0 onMemebers' onClick={() => { this.setState({selectedMenu: 'members'}); }}>Members</li>
                                    <li className='list-group-item border-0 onSearch' onClick={() => { this.setState({selectedMenu: 'search'}); }}>Search</li>
                                    <li className='list-group-item border-0 onMythreads' onClick={() => { this.setState({selectedMenu: 'threads'}); }}>MyThreads</li>
                                    <li className='list-group-item border-0 onMymessages' onClick={() => { this.setState({selectedMenu: 'messages'}); }}>MyMessages</li>
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
                                            <div className='col-4 text-center'><a className='onBrowse' onClick={() => { this.setState({selectedMenu: 'browse'}); }}><strong>Browse</strong></a></div>
                                            <div className='col-4 text-center'><a className='onMemebers' onClick={() => { this.setState({selectedMenu: 'members'}); }}><strong>Members</strong></a></div>
                                            <div className='col-4 text-center'><a className='onSearch' onClick={() => { this.setState({selectedMenu: 'search'}); }}><strong>Search</strong></a></div>
                                        </div>
                                    </div>
                                    <div className='carousel-item'>
                                        <div className='row'>
                                            <div className='col-4 text-center'><a className='onMythreads' onClick={() => { this.setState({selectedMenu: 'threads'}); }}><strong>MyThreads</strong></a></div>
                                            <div className='col-4 text-center'><a className='onMymessages' onClick={() => { this.setState({selectedMenu: 'messages'}); }}><strong>MyMessages</strong></a></div>
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
