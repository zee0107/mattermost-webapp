// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, { useState,useEffect } from 'react';
import styled from 'styled-components';

import Pluggable from 'plugins/pluggable';
import {TutorialSteps} from '../../../utils/constants';
import StatusDropdown from '../../status_dropdown';
import {useShowTutorialStep} from '../hooks';

import AdImg from 'images/menu-icons/arrow-create-ad.png';
import BlogImg from 'images/menu-icons/icon-create-blog.png';
import EventImg from 'images/menu-icons/icon-create-event.png';
import GroupImg from 'images/menu-icons/icon-create-group.png';
import PageImg from 'images/menu-icons/icon-create-page.png';

import profPic1 from 'images/profiles/user-profile-1.png';
import profPic2 from 'images/profiles/user-profile-2.png';
import profPic3 from 'images/profiles/user-profile-3.png';
import profPic4 from 'images/profiles/user-profile-4.png';
import profPic5 from 'images/profiles/user-profile-5.png';
import profPic6 from 'images/profiles/user-profile-6.png';
import postImage from 'images/post-1.png';
import postImage2 from 'images/post-image.png';

import {UserProfile} from 'mattermost-redux/types/users';
import {Client4} from 'mattermost-redux/client';
import SettingsTip from './settings_tip';
import AtMentionsButton from './at_mentions_button/at_mentions_button';
import SavedPostsButton from './saved_posts_button/saved_posts_button';
import SettingsButton from './settings_button';
import RequestList from 'components/request_list';
import RequestListsNf from 'components/request_list_nf';
import * as GlobalActions from 'actions/global_actions';

const RightControlsContainer = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
    flex-shrink: 0;
    > * + * {
        margin-left: 8px;
    }
`;

export type Props = {
    productId?: string | null;
    currentUser: UserProfile;
}

function handleEmitUserLoggedOutEvent(){
    GlobalActions.emitUserLoggedOutEvent();
  }


/*async function getUserList(){
    
    return await Promise.resolve(data);
}

function renderList(){
    return null;
}

const readData = async () => {
    let profiles = [];
    let data = getUserList();
    data.then((value)=> {
        for(let i = 0; i < value.length; i++ ){
            profiles.push(value[i].user_id.toString());
        }
    });
    return profiles;
}*/

const RightControlsStyle = (props: Props): JSX.Element => {
    const [profiles, setProfiles] = useState([]);
    const [request, setRequest] = useState([]);

    const noRequest = () => {
        return (
            <label className='mt-2 mb-2'>No friend request</label>
        );
    }
    useEffect (() => {
        async function getData(){
            const data = await Client4.getChannelMembers('kqe4sihhdid47gprhk6dwbuc4o');
            //const data = await Client4.getChannelMembers('dodurztr1fbupnpenjgxqjso3a');
            return data;
        }

        async function getRequest(){
            console.log('User: ', props.currentUser)
            const data = await Client4.getRequestList(props.currentUser.id);
            console.log('GetRequest: ', data)
            return data;
        }
        
       getData().then((value) => { setProfiles(value) });
       getRequest().then((value) => { setRequest(value) });
    }, []);

    const showSettingsTip = useShowTutorialStep(TutorialSteps.SETTINGS);

    return (
        <RightControlsContainer>
                {/*productId === null ? (
                    <>
                        <AtMentionsButton/>
                        <SavedPostsButton/>
                        <SettingsButton/>
                        {showSettingsTip && <SettingsTip/>}
                    </>
                ) : (
                    <Pluggable
                        pluggableName={'Product'}
                        subComponentName={'headerRightComponent'}
                        pluggableId={productId}
                    />
                )*/}
                <div className='dropdown float-start'>
                    <a className='btn-add-post text-white' id='dropdownCreateposts' data-bs-toggle='dropdown' aria-expanded='true'>
                    <label className='plus-text-sizes'>+</label></a>

                    <ul className='dropdown-menu' aria-labelledby='dropdownCreateposts'>
                        <li key='create-ad'><a className='dropdown-item' href='#'><img width='19' className='img-fluid mr-2' src={AdImg}/> Create Ad</a></li>
                        <li key='create-blog'><a className='dropdown-item' href='#'><img width='19' className='img-fluid mr-2' src={BlogImg}/> Create Blog</a></li>
                        <li key='create-event'><a className='dropdown-item' href='#'><img width='19' className='img-fluid mr-2' src={EventImg}/> Create Event</a></li>
                        <li key='create-group'><a className='dropdown-item' href='/mygroups'><img width='19' className='img-fluid mr-2' src={GroupImg}/> Create Group</a></li>
                        <li key='create-page'><a className='dropdown-item' href='#'><img width='19' className='img-fluid mr-2' src={PageImg}/> Create Page</a></li>
                    </ul>
                </div>
                <a className='position-relative onDekstopaddfriends' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelfriendsdesktop' aria-controls='offcanvasRightLabelfriendsdesktop'>
                    <svg data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelfriendsdesktop' xmlns='http://www.w3.org/2000/svg' fill='var(--text-primary)' className='bi bi-person-plus menu-align bi-person-plus-style' viewBox='0 0 16 16'><path d='M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z'></path><path fillRule='evenodd' d='M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z'></path></svg>
                    {/*<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-style'>3</span>*/}
                </a>
                <a className='position-relative onDekstopaddmessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'>
                    <svg xmlns='http://www.w3.org/2000/svg' fill='var(--text-primary)' className='bi bi-chat-right-text menu-align bi-chat-right-text-style' viewBox='0 0 16 16'><path d='M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z'></path><path d='M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z'></path></svg>
                    {/*<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-style'>10</span>*/}
                </a>
                <a className='position-relative onDekstopaddnotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'>
                    <svg xmlns='http://www.w3.org/2000/svg' fill='var(--text-primary)' className='bi bi-bell menu-align bi-bell-styles' viewBox='0 0 16 16'><path d='M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z'></path></svg>
                    {/*<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-style'>5</span>*/}
                </a>
                {/*<>
                    <SettingsButton/>
                </>*/}
                <StatusDropdown globalHeader={true}/>
                <button onClick={handleEmitUserLoggedOutEvent} className='btn-logout'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-in-right logout-icon" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" fill='var(--text-primary)'/>
                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" fill='var(--text-primary)'/>
                </svg> Logout</button>

                <div style={{zIndex: 8}} className='offcanvas offcanvas-end shadow-lg' data-bs-scroll='true' data-bs-backdrop='false' tabIndex='-2' id='offcanvasRightLabelfriendsdesktop' aria-labelledby='offcanvasRightLabelfriendsdesktop'>
                <div className='chat-list-indexes'>
                    <div className='offcanvas-header'>
                        <h6 id='offcanvasRightLabelfriendsdesktop'>
                            <i className='bi-person-plus-fill'></i> Friends</h6>
                            <a className='btn-close-canvas shadow' data-bs-dismiss='offcanvas' aria-label='Close'><i className='bi-x'></i></a>
                    </div>
                    <div className='offcanvas-body'>
                        <div className='list-group mt-3 mb-3'>
                            <strong>Friend request</strong>
                            {request !== [] ? request.map((item,index) => {
                                    return (<RequestList userId={item.user_id} key={`request-${item.user_id}`} />);
                            }) : noRequest}
                        </div>
                        <div className='list-group mt-3 mb-3'>
                            <strong>People You May Know</strong>
                            {profiles.sort(() => Math.random() - 0.5).slice(0, 5).map((item,index) => {
                                    return (<RequestListsNf userId={item.user_id} key={`requestnf-${item.user_id}`} />);
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {/*Chat List*/}
            <div style={{zIndex: 999}} className='offcanvas offcanvas-end shadow-lg' data-bs-scroll='true' data-bs-backdrop='false' tabIndex='-1' id='offcanvasRightLabelchatdesktop' aria-labelledby='offcanvasRightLabelchatdesktop'>
                <div className='chat-list-indexes'>
                    <div className='offcanvas-header'>
                        <h6 id='offcanvasRightLabelchatdesktop'>
                            <i className='bi-chat-left-text-fill'></i> Messages</h6>
                            <a className='btn-close-canvas shadow' data-bs-dismiss='offcanvas' aria-label='Close'><i className='bi-x'></i></a>
                    </div>
                    <div className='offcanvas-body'>
                        <div className='position-absolute bottom-0 start-0 p-2'>
                            <a className='chat-mobile-settings' aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelaccounts' aria-controls='offcanvasRightLabelaccounts'><i className='bi-gear-fill float-end'></i></a>
                        </div>
                        {/*<div className='container'>
                            <div className='row'>
                                    <div className='input-group mb-1'>
                                        <span className='input-group-text input-search-crypter-span' id='basic-addon1'><i className='bi-search'></i></span>
                                        <input id='' type='text' className='form-control form-control-dark input-search-crypter' placeholder='Search' aria-label='Search'/>
                                    </div>
                            </div>
            </div>*/}
                        <div id=''>
                            <div className='list-group'>
                                <a className='list-group-item list-group-item-action border-0 message-content' aria-current='true' data-bs-toggle='offcanvas' data-bs-target='#offcanvasBottomreadychatdesktop' aria-controls='offcanvasBottomreadychatdesktop'>
                                    <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic1} alt='User name' title='Username'/> <strong>John Lloyd</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                    </div>
                                    <label className='mt-0'>Hello how are you, message.</label>
                                </a>
                    
                                <label className='label-chat-list-1'>
                                    <a href='#' data-bs-toggle='collapse' data-bs-target='#collapseActions' aria-expanded='false' aria-controls='collapseActions'>
                                    <i className='bi-three-dots float-end me-3'></i>
                                    </a>
                                </label>
                    
                                <div className='collapse' id='collapseActions'>
                                    <p className='ms-3 mt-2 mb-0'><strong><a className='action-remove-msg-text'><i className='bi-archive'></i> Archive</a></strong></p>
                                    <p className='ms-3 mt-2 mb-0'><strong><a className='action-remove-msg-text'><i className='bi-x-circle'></i> Delete message</a></strong></p>
                                    <p className='ms-3 mt-2 mb-2'><strong><a className='action-remove-msg-text'><i className='bi-dash-square'></i> Block</a></strong></p>
                                </div>
                    
                                <a className='list-group-item list-group-item-action border-0'>
                                    <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic2} alt='User name' title='Username'/> <strong>Group name</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                    </div>
                                    <label>Hello how are you, message.</label>
                                </a>
                                <label className='label-chat-list-2'>
                                    <a href='#' data-bs-toggle='collapse' data-bs-target='#collapseActions02' aria-expanded='false' aria-controls='collapseActions02'>
                                    <i className='bi-three-dots float-end me-3'></i>
                                    </a>
                                </label>
                                <div className='collapse' id='collapseActions02'>
                                    <p className='ms-3 mt-2 mb-0'><strong><a className='action-remove-msg-text'><i className='bi-archive'></i> Archive</a></strong></p>
                                    <p className='ms-3 mt-2 mb-0'><strong><a className='action-remove-msg-text'><i className='bi-x-circle'></i> Delete message</a></strong></p>
                                    <p className='ms-3 mt-2 mb-2'><strong><a className='action-remove-msg-text'><i className='bi-dash-square'></i> Block</a></strong></p>
                                </div>
                                <a className='list-group-item list-group-item-action border-0'>
                                    <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic3} alt='User name' title='Username'/> <strong>Group name</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                    </div>
                                    <label>Hello how are you, message.</label>
                                </a>
                                <label className='label-chat-list-2'><i className='bi-three-dots float-end me-3'></i></label>
                                <a className='list-group-item list-group-item-action border-0'>
                                    <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic4} alt='User name' title='Username'/> <strong>Firstname</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                    </div>
                                    <label>Hello how are you, message.</label>
                                </a>
                                <label className='label-chat-list-2'><i className='bi-three-dots float-end me-3'></i></label>
                                <a className='list-group-item list-group-item-action border-0'>
                                        <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic5} alt='User name' title='Username'/> <strong>Firstname</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                        </div>
                                        <label>Hello how are you, message.</label>
                                </a>
                                <label className='label-chat-list-2'><i className='bi-three-dots float-end me-3'></i></label>
                                <a className='list-group-item list-group-item-action border-0'>
                                        <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic6} alt='User name' title='Username'/> <strong>Firstname</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                        </div>
                                        <label>Hello how are you, message.</label>
                                </a>
                                <label className='label-chat-list-2'><i className='bi-three-dots float-end me-3'></i></label>
                                <a className='list-group-item list-group-item-action border-0'>
                                        <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic1} alt='User name' title='Username'/> <strong>Group name</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                        </div>
                                        <label>Hello how are you, message.</label>
                                </a>
                                <label className='label-chat-list-2'><i className='bi-three-dots float-end me-3'></i></label>
                                <a className='list-group-item list-group-item-action border-0'>
                                        <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic2} alt='User name' title='Username'/> <strong>Group name</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                        </div>
                                        <label>Hello how are you, message.</label>
                                </a>
                                <label className='label-chat-list-2'><i className='bi-three-dots float-end me-3'></i></label>
                                <a className='list-group-item list-group-item-action border-0'>
                                        <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic3} alt='User name' title='Username'/> <strong>Firstname</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                        </div>
                                        <label>Hello how are you, message.</label>
                                </a>
                                <label className='label-chat-list-2'><i className='bi-three-dots float-end me-3'></i></label>
                                <a className='list-group-item list-group-item-action border-0'>
                                        <div className='d-flex w-100 justify-content-between'>
                                        <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic4} alt='User name' title='Username'/> <strong>Firstname</strong></label>
                                        <label className='mt-3'>3 days ago</label>
                                        </div>
                                        <label>Hello how are you, message.</label>
                                </a>
                                <label className='label-chat-list-2'><i className='bi-three-dots float-end me-3'></i></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Chat Field*/}
            <div style={{zIndex: 999}} className='offcanvas offcanvas-end shadow-lg' data-bs-scroll='true' data-bs-backdrop='false' tabIndex='-1' id='offcanvasBottomreadychatdesktop' aria-labelledby='offcanvasBottomreadychatdesktop'>
                <div className='offcanvas-header'>
                    <h6 className='offcanvas-title' id='offcanvasBottomreadychatdesktop'><img width='25' className='img-fluid user-photo' src={profPic1} alt='Username' title='Username'/> John Lloyd</h6>
                    <a href='#' className='text-reset' aria-label='Close' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-list-nested'></i></a>
                </div>
                <div className='offcanvas-body offcanvas-body-bg'>
                    <form className='mt-0'>
                        <div className='mb-0'>
                            <div className='chat-fields'>
                                <div className='row'>
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
                                </div>
                            </div>
                        </div>
                        <div className='input-group mb-3 mt-2'>
                            <input style={{padding: 18}} type='text' className='form-control write-msg-style' placeholder='Type a message' aria-label='Type a message' aria-describedby='basic-addon1'/>
                            <span className='input-group-text write-msg-style' id='basic-addon1-bg'>
                            <a href='#'><i className='bi-emoji-smile'></i></a>
                            </span>
                            <span className='input-group-text write-msg-style' id='basic-addon2-bg'>
                            <a href='#'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='currentColor' className='bi bi-send' viewBox='0 0 16 16'><path d='M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z'/></svg>
                            </a>
                            </span>
                        </div>
                    </form>
                </div>
            </div>

            {/*Notification List*/}
            <div style={{zIndex: 180}} className='offcanvas offcanvas-end' data-bs-scroll='true' data-bs-backdrop='false' tabIndex='-1' id='offcanvasRightnotificationdesktop' aria-labelledby='offcanvasRightnotificationdesktop'>
                <div className='offcanvas-header'>
                    <h6 id='offcanvasRightnotificationdesktop'>
                        <i className='bi-bell-fill'></i> Notification</h6>
                    <a className='btn-close-canvas shadow' data-bs-dismiss='offcanvas' aria-label='Close'><i className='bi-x'></i></a>
                </div>
                <div className='offcanvas-body shadow-lg'>
                    <div className='list-group'>
                        <div className='list-group-item list-group-item-action border-0 remove-content-notification'>
                            <div className='d-flex w-100 justify-content-between'>
                            <label className='mb-1'><img width='40' className='img-fluid user-photo' src={postImage} alt='User name' title='Username'/> Reyes Softawre Solutions</label>
                            <label className='mt-3'>3 days ago <a data-bs-toggle='collapse' href='#collapseNotificationdesktop' role='button' aria-expanded='false' aria-controls='collapseNotificationdesktop'><i className='bi-three-dots ms-3'></i></a></label>
                            </div>
                            <label>Podcast live is now live.</label>
                        </div>
                        <div className='collapse' id='collapseNotificationdesktop'>
                            <p className='mt-3 mb-3 ms-3'><a><strong><i className='bi-x-circle'></i> Remove this notification</strong></a></p>
                            <p className='mt-3 mb-3 ms-3'><a><strong><i className='bi-exclamation-diamond'></i> Report issue to Notification Team</strong></a></p>
                        </div>
                        <div className='list-group-item list-group-item-action border-0 remove-content-notification'>
                            <div className='d-flex w-100 justify-content-between'>
                            <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic2} alt='User name' title='Username'/> Cody &#38; You</label>
                            <label className='mt-3'>3 days ago <i className='bi-three-dots ms-3'></i></label>
                            </div>
                            <label>Your Friend Request Now Confirm</label>
                        </div>
                        <div className='list-group-item list-group-item-action border-0 remove-content-notification'>
                            <div className='d-flex w-100 justify-content-between'>
                            <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic3} alt='User name' title='Username'/> Jannela</label>
                            <label className='mt-3'>3 days ago <i className='bi-three-dots ms-3'></i></label>
                            </div>
                            <label>Friend name love your story, See it and view more...</label>
                        </div>
                        <div className='list-group-item list-group-item-action border-0 remove-content-notification'>
                            <div className='d-flex w-100 justify-content-between'>
                            <label className='mb-1'><img width='40' className='img-fluid user-photo' src={profPic4} alt='User name' title='Username'/> Lanaya</label>
                            <label className='mt-3'>3 days ago <i className='bi-three-dots ms-3'></i></label> 
                            </div>
                            <label>Friend name love your story, See it and view more...</label>
                        </div>
                        <div className='list-group-item list-group-item-action border-0 remove-content-notification'>
                            <div className='d-flex w-100 justify-content-between'>
                            <label className='mb-1'><img width='40' className='img-fluid user-photo' src={postImage2} alt='User name' title='Username'/> Crypto Miners</label>
                            <label className='mt-3'>3 days ago <i className='bi-three-dots ms-3'></i></label>
                            </div>
                            <label>Post from friends, new coins</label>
                        </div>
                    </div>
                </div>
            </div>
        </RightControlsContainer>
    );
};

export default RightControlsStyle;
