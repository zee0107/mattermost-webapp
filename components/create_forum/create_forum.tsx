// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';

import logoDark from 'images/logoBlack.png';
import { StripeAuBankAccountElementChangeEvent } from '@stripe/stripe-js';

type Props = {
    userId: string;
    profilePicture: string;
    currentUser: UserProfile;
}

type State = {
    isDark: string;
    forumTitle: string;
    forumDetails: string;
    topicError: string;
    textError: string;
};

export default class CreateForum extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = { isDark:'light', forumTitle: '', forumDetails: ''};

        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeDetails = this.handleChangeDetails.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    handleChangeTitle = (e) => {
        this.setState({forumTitle: e.target.value});
    }

    handleChangeDetails = (e) => {
        this.setState({forumDetails: e.target.value});
    }

    handleSubmit = () => {
        const uri = new URL('https://localhost:44312/api/crypter/createthread');
        const params = {user_id: this.props.userId, topic: this.state.forumTitle, description: this.state.forumDetails};
        uri.search = new URLSearchParams(params);

        fetch(uri, {
            method: 'POST',
            body: data,
        }).then((response) => response.json()).then((data)=>{
            if (data === 'Posted'){
                window.location.href = '/forums';
            }

            if(data === 'InvalidId'){
                this.setState({topicError: 'Please sign in.'});
            }

            if (data === 'EmptyTopic'){
                this.setState({textError: 'Please add a Topic.'});
            }

            if (data === 'EmptyDesc'){
                this.setState({textError: 'Please add details of the topic.'});
            }

            if (data === 'Failed'){
                this.setState({textError: 'Please try again.'});
            }
        }).catch(error => this.setState({textError: error}));
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
        const {currentUser} = this.props;
        const {forumTitle, forumDetails, textError, topicError} = this.state;

        let name, desc, category, view;
        if(forumTitle){
            name = forumTitle;
        }else{
            name = 'Forum Title';
        }

        if(forumDetails){
            desc = forumDetails;
        }else{
            desc = 'Forum Details';
        }

        let userName;
        if(currentUser){
            userName = currentUser.username;
        }
        return (
            <>
                <div style={{zIndex: 180,backgroundColor: '#F2F5F9',height: '100vh'}} className='createmypage' id='staticBackdrop'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-3 border-end p-4'>
                                <div className='mt-4'><img className='img-fluid mt-2' src={logoDark} alt='logo' title='logo'/>
                                    <a className='float-end mt-1 onClickclosecreatemypage yourphotosandalbums-desktop' href='\forums'><i className='bi-x-circle-fill'></i></a>
                                    <a className='float-end mt-1 onClickclosecreatemypagemobile yourphotosandalbums-mobile' href='\forums'><i className='bi-x-circle-fill'></i></a>
                                </div>
                                <div className='row mt-4'>
                                    <div className='col-10'><h6 className='mt-2'>Create Forum Thread</h6></div>
                                    <div className='col-1 float-end'></div>
                                </div>
                                <form>
                                    <p className='mt-1'><label>Forum information</label></p>
                                    <div>
                                        <div className='row g-1'>
                                            <div className='col-12'>
                                                <input type='text' className='form-control' placeholder='Thread name (Required)' onChange={this.handleChangeTitle} value={forumTitle} aria-label='Thread name (Required)'/>
                                                <span className='text-danger small'>{topicError}</span>
                                            </div>
                                        </div>

                                        <div className='row g-1 mt-3'>
                                            <div className='col-12'>
                                                <div className='form-floating'>
                                                    <textarea style={{height: 135, border: '1px solid #ccc'}} onChange={this.handleChangeDetails} value={forumDetails} className='form-control' placeholder='Forum Details'></textarea>
                                                    <label htmlFor='floatingTextarea'>Details</label>
                                                </div>
                                                <span className='text-danger small'>{textError}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='col-12 mt-5'>
                                            <div className='d-grid gap-2'>
                                                <button type='button' className='btn-primary p-2' onClick={() => this.handleSubmit()}>Create Topic</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className='col-lg-8 right-nav-story'>
                                <div className='col-12 mx-auto mt-4'>
                                    <div className='box-middle-panel-forums-menu'>
                                        <div className=''>
                                            <a className='onForum float-start'><i className='bi-chat-left-text-fill'></i></a>
                                            <div className='row'>
                                            <div className='col-lg-6 mt-2 mb-0 p-0'>
                                                <h3 className='p-0 text-start ms-2 mt-1'>
                                                    {name}
                                                </h3>
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
                                    <div className='box-middle-panel mt-10'>
                                        {this.renderProfilePicture('fxl')}
                                        <strong className='mt-2 ms-2 float-start'>@{userName}</strong>
                                        <br/>
                                        <p className='mb-0 p-3 ms-2'>
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                                <div className='photo-and-albums-menu-mobile'>
                                    {/*<div className='position-absolute top-0 start-50 translate-middle-x mt-3'>
                                        <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                    </div>
                                    <div className='position-absolute top-0 start-50 translate-middle-x mt-3' style={{margin:'0px 0px 0px 61px'}}>
                                        <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                        <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                    </div>*/}
                                    <div className='position-absolute top-0 start-50 translate-middle-x mt-1' style={{margin:'0px 0px 0px -61px'}}>
                                        <div className='d-flex'>
                                            <a className='onStoryprofilesettings' id='defaultDropdown' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                                            <ul className='dropdown-menu' aria-labelledby='dropdownMenuOffset'>
                                            <li><a className='dropdown-item' href='profile.html'><i className='bi-person'></i> Profile</a></li>
                                            <li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                            <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>
                                            <li><a className='dropdown-item onSettingsandprivacy'><i className='bi-gear-wide'></i> Settings & Privacy</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-1'>
                                <div className='photo-and-albums-menu-desktop'>
                                    <div className='position-absolute top-0 end-0 mt-4 me-4'>
                                        {/*<a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                        <br/>
                                        <br/>
                                        <div className='mb-2'></div>
                                        
                                        <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                        <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                        <div className='mb-4'></div>*/}
        
                                        <div className='d-flex'>
                                            <a className='onStoryprofilesettings' id='defaultDropdown' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                                            <ul className='dropdown-menu' aria-labelledby='dropdownMenuOffset'>
                                            <li><a className='dropdown-item' href='profile.html'><i className='bi-person'></i> Profile</a></li>
                                            <li><a className='dropdown-item onSettingsandprivacy'><i className='bi-gear-wide'></i> Sign out</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
