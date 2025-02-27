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
import MessageList from './message_list';
import * as GlobalActions from 'actions/global_actions';

import MessagesDirect from './message_list/messages_direct/messages_direct';

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
    channelId?: string | null;
}

function handleEmitUserLoggedOutEvent(){
    GlobalActions.emitUserLoggedOutEvent();
  }

const RightControlsStyle = (props: Props): JSX.Element => {
    const [profiles, setProfiles] = useState([]);
    const [request, setRequest] = useState([]);

    useEffect (() => {
        async function getData(){
            const teamInfo = await Client4.getTeamByName('crypter');
            const channelInfo = await Client4.getChannelByName(teamInfo.id,'town-square');
            const data = await Client4.getChannelMembers(channelInfo.id);
            //Local Server
            //const data = await Client4.getChannelMembers('kqe4sihhdid47gprhk6dwbuc4o');

            //Live Server
            //const data = await Client4.getChannelMembers('dodurztr1fbupnpenjgxqjso3a');
            return data;
        }

        async function getRequest(){
            const data = await Client4.getRequestList(props.currentUser.id);
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
                        <li key='create-group'><a className='dropdown-item' href='/mygroups#creategroup'><img width='19' className='img-fluid mr-2' src={GroupImg}/> Create Group</a></li>
                        <li key='create-page'><a className='dropdown-item' href='/mypages#createpage'><img width='19' className='img-fluid mr-2' src={PageImg}/> Create Page</a></li>
                    </ul>
                </div>
                <a className='position-relative onDekstopaddfriends' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelfriendsdesktop' aria-controls='offcanvasRightLabelfriendsdesktop'>
                    <svg data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelfriendsdesktop' xmlns='http://www.w3.org/2000/svg' fill='var(--text-primary)' className='bi bi-person-plus menu-align bi-person-plus-style' viewBox='0 0 16 16'><path d='M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z'></path><path fillRule='evenodd' d='M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z'></path></svg>
                    {request.length ? (<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-style'>{request.length}</span>): ''/*<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-style'>3</span>*/}
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
                            {request.length ? request.map((item,index) => {
                                    return (<RequestList userId={item.user_id} key={`request--${item.user_id}-${index}`} />);
                            }) : (<h4 className='mt-2 mb-2 text-center text-muted'>No pending request.</h4>)}
                        </div>
                        <div className='list-group mt-3 mb-3'>
                            <strong>People You May Know</strong>
                            {profiles.sort(() => Math.random() - 0.5).slice(0, 5).map((item,index) => {
                                    return (<RequestListsNf userId={item.user_id} key={`requestnf--${item.user_id}-${index}`} />);
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {/*Chat List*/}
            <MessageList />

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
