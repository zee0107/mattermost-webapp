// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {Client4} from 'mattermost-redux/client';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import StoryListView from 'components/story_list_view';
import StoryView from 'components/story_view';
import MutedStoryList from 'components/muted_story_list';
import logoDark from 'images/logoBlack.png';
import { MutedList, Story, UserSettings } from 'mattermost-redux/types/crypto';
import * as GlobalActions from 'actions/global_actions';
import postImage from 'images/post-1.png';
import { userInfo } from 'os';
type Props = {
    status?: string;
    userId: string;
    autoResetPref?: string;
    actions: {
        updateSettings: (userId: string, privacy:string,archive: boolean,mode:boolean) => void;
    }
    customStatus?: UserCustomStatus;
    storyList: Promise<Story[]>;
    profilePicture: string;
    currentUser: UserProfile;
    isCustomStatusEnabled: boolean;
    isCustomStatusExpired: boolean;
    isMilitaryTime: boolean;
    isStatusDropdownOpen: boolean;
    showCustomStatusPulsatingDot: boolean;
    timezone?: string;
    globalHeader?: boolean;
    selected: string;
    userSettings: Promise<UserSettings>;
    mutedStories: Promise<MutedList[]>;
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    photoStory: boolean;
    textStory: boolean;
    addText: boolean;
    privacyValue: string;
    textValue: string;
    colorValue: string;
    storyList: Story[];
    storyArchiveList: Story[];
    storyArchive?: boolean;
    selectedStory: string;
    modalSelected: string;
    userSettings: UserSettings;
    mutedStories: MutedList[];
    triggerUnmute: boolean;
    triggerMute: boolean;
};

export default class ViewStory extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {triggerMute: false,triggerUnmute: false,modalSelected: 'archive',photoStory: false,textStory: false, openUp: false, width: 0, isStatusSet: false, isDark:'light', addText: false, selectedStory:''};

        this.onChangePrivacy = this.onChangePrivacy.bind(this);
        this.onChangeSelected = this.onChangeSelected.bind(this);
        this.onTriggerUnmute = this.onTriggerUnmute.bind(this);
        this.onTriggerMute = this.onTriggerMute.bind(this);
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.selected !== undefined && this.props.selected !== null && this.props.selected !== ''){
            this.setState({selectedStory: this.props.selected});
        }
        if(this.props.storyList !== undefined && this.props.storyList !== null){
            Promise.resolve(this.props.storyList).then((value) => {this.setState({storyList: value});});
        }

        this.getUserSettings();

        if(this.props.mutedStories !== undefined && this.props.mutedStories !== null){
            Promise.resolve(this.props.mutedStories).then((value) => {this.setState({mutedStories: value});});
        }

        if(this.state.userSettings !== undefined && this.state.userSettings !== null){
            this.setState({privacyValue: this.state.userSettings.story_privacy});
        }
    }

    componentDidUpdate(_,prevState){
        if(this.state.triggerUnmute !== prevState.triggerUnmute || this.state.triggerMute !== prevState.triggerMute){
            this.getMuted();
            this.getList();
        }

        if(this.state.userSettings !== prevState.userSettings){
            this.setDefault(this.state.userSettings.story_privacy,this.state.userSettings.story_archive);
        }
    }

    handleEmitUserLoggedOutEvent = () =>{
        GlobalActions.emitUserLoggedOutEvent();
      }

    getUserSettings = () => {
        const data = Client4.userSettings(this.props.currentUser.id);
        data.then(
            (value) => { this.setState({userSettings: value});}
        );
    }

    getMuted = () => {
        const data = Client4.mutedStories(this.props.currentUser.id);
        data.then(
            (value) => {this.setState({mutedStories: value});}
        );
        this.setState({triggerUnmute: false});
    }

    getList = () => {
        const data = Client4.listSotries(this.props.currentUser.id);
        data.then(
            (value) => {this.setState({storyList: value});}
        );
        this.setState({triggerMute: false});
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
            />
        );
    }

    setDefault = (data: string,archive: boolean) => {
        this.setState({privacyValue: data,storyArchive: archive});
    }

    onChangePrivacy = (data: string) => {
        this.setState({privacyValue: data});
        this.onSubmitPrivacy(data);
    }

    onSubmitPrivacy = (data: string) => {
        const { actions } = this.props;
        const { storyArchive, userSettings } = this.state;
        actions.updateSettings(userSettings.user_id, data, storyArchive, userSettings.dark_mode);
    }

    onChangeArchive = (data: boolean) => {
        this.setState({storyArchive: data});
        this.onSubmitArchive(data);
    }

    onSubmitArchive = (data: boolean) => {  
        const { actions } = this.props;
        const { privacyValue, userSettings } = this.state;
        actions.updateSettings(userSettings.user_id, privacyValue, data, userSettings.dark_mode);
    }

    onChangeModal = (param: string) => {
        this.setState({modalSelected: param});
    }

    onChangeSelected = (value: string) => {
        this.setState({selectedStory: value});
    }

    onTriggerUnmute = (value: boolean) => {
        this.setState({triggerUnmute: value});
    }

    onTriggerMute = (value: boolean) => {
        this.setState({triggerMute: value});
    }

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        const {storyList,selectedStory,modalSelected, mutedStories, storyArchive} = this.state;
        let archiveBtn;
        let archiveBody;
        let archiveText;
        if(storyArchive){
            archiveBtn = (
                <a className='mt-3 mb-3 onClickturnoffstoryarchived' onClick={() => this.onChangeArchive(false)}><i className='bi-circle-fill'></i> Turn Off Story archive</a>
            );

            archiveBody = (
                <div className='row border border-1 mt-1'>
                    <div className='col-9 text-left mb-3'>
                    <p><img className='Avatar Avatar-lg mt-4 me-2 float-start' src={postImage}/> 
                        <small className='text-firstnames-stories float-start'><strong>Marcus Doe</strong><br/>Feb 28 <i className='bi-dot bi-dot-style'></i></small>
                    </p>
                    </div>
                    <div className='col-3 mt-4'>
                        <div className='dropdown'>
                        <a className='onClickstoriesdeleteorsavephoto float-end' id='dropdownMenuSavedelete' data-bs-toggle='dropdown' aria-expanded='false'><i className='bi-three-dots'></i></a>

                        <ul className='dropdown-menu' aria-labelledby='dropdownMenuSavedelete'>
                            <li><a className='dropdown-item'><i className='bi-trash-fill'></i> Delete photo</a></li>
                            <li><a className='dropdown-item'><i className='bi-save2-fill'></i> Save photo</a></li>
                        </ul>
                        </div>
                    </div>
                </div>
            );

            archiveText = (
                <p className='text-center text-only-you-see-your-storyarchive'>
                    <small><i className='bi-lock-fill'></i> Only you can see your story archive</small>
                </p>
            );
        }
        else{
            archiveBtn = (
                <a className='mt-3 mb-3 onClickturnonstoryarchived' onClick={() => this.onChangeArchive(true)}><i className='bi-circle'></i> Turn On Story archive</a>
            );

            archiveText = (
                <p className='text-center archived-on-off-text'>
                    <label><strong>Save to Archive</strong></label> <br/> Automatically archive photos and videos after they disappear from your story Only you can see your story archive.
                </p>
            );
        }
        let userRenderDesktop;
        let userRenderMobile;
        if(storyList){
            userRenderDesktop = (
                <>
                    {storyList.map((item,index) => {
                        return (
                            <StoryListView userId={item} view='desktop' onChangeSelected={this.onChangeSelected} key={`${item}-${index}`} />
                        );
                    })}
                </>
            );

            userRenderMobile = (
                <>
                    {storyList.map((item,index) => {
                        return (
                            <StoryListView userId={item} view='mobile' onChangeSelected={this.onChangeSelected} key={`${item}-${index}`} />
                        );
                    })}
                </>
            );
        }

        let selectedView;
        if(selectedStory === ''){
            selectedView = (
                <p>
                    <i className='bi-images'></i>
                    <br/>
                    <strong><label>Select a story to open</label></strong>
                </p>
            );
        }
        else{
            selectedView = (
                <StoryView userId={selectedStory} onChangeSelected={this.onChangeSelected} onTriggerMute={this.onTriggerMute}/>
            );
        }

        let modalHeader;
        let modalBody;
        if(modalSelected === 'privacy'){
            modalHeader = (
                <h3 className='modal-title text-story-privacy-title' id='staticBackdropLabel'><i className='bi-lock'></i> Story Privacy</h3>
            );

            modalBody = (
                <div className='story-privacy-content'>
                    <div className='row'>
                        <p><label><strong>Who can see your story?</strong></label><br/><small>Your story will be visible 24 hours on Crypter and Crypter Msg</small></p>
                        <div className='col-10'><p><i className='bi-globe'></i> <strong>Everyone</strong> <br/> <small>Everyone on Crypter</small></p></div>
                        <div className='col-2'>
                            <div className='form-check float-end'>
                                <input className='form-check-input onEveryonestoryprivacy' type='radio' value='everyone' onClick={() => this.onChangePrivacy('everyone')} checked={this.state.privacyValue === 'everyone'} name='flexRadioDefault' id='flexRadioEveryonestoryprivacy' />
                                <label className='form-check-label' htmlFor='flexRadioEveryonestoryprivacy'></label>
                            </div>
                        </div>
                        </div>
                        <div className='row mt-2'>
                        <div className='col-10'><p><i className='bi-people-fill'></i> <strong>Friends</strong> <br/><small>Only your Crypter friends</small></p></div>
                        <div className='col-2'>
                            <div className='form-check float-end'>
                                    <input className='form-check-input onFriendstoryprivacy' type='radio' value='friends' onClick={() => this.onChangePrivacy('friends')} checked={this.state.privacyValue === 'friends'} name='flexRadioDefault' id='flexRadioFriendstoryprivacy' />
                                    <label className='form-check-label' htmlFor='flexRadioFriendstoryprivacy'></label>
                            </div>
                        </div>
                        </div>
                        <div className='row mt-2'>
                            <div className='col-10'><p><i className='bi-person'></i> <strong>Private</strong> <br/><small>Only you see your Story</small></p></div>
                            <div className='col-2'>
                            <div className='form-check float-end'>
                                    <input className='form-check-input onOnlymestoryprivacy' type='radio' value='private' onClick={() => this.onChangePrivacy('private')} checked={this.state.privacyValue === 'private'} name='flexRadioDefault' id='flexRadioOnlymestoryprivacy' />
                                    <label className='form-check-label' htmlFor='flexRadioOnlymestoryprivacy'></label>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if(modalSelected === 'muted'){
            modalHeader = (
                <h3 className='modal-title text-stories-muted-title' id='staticBackdropLabel'><i className='bi-x-octagon'></i> Stories You've Muted</h3>
            );

            modalBody = (
                <div className='story-muted-content'>
                    {mutedStories && mutedStories.map((item,index) => {
                        return (
                            <MutedStoryList userId={item.friend_id} onTriggerUnmute={this.onTriggerUnmute} key={`${item.friend_id}---${index}`} />
                        );
                    })}
                    {!mutedStories.length && <div className='row border border-1 mt-1'>
                        <div className='col-12 text-center mb-3'>
                        <p className='mt-2'>
                            <small className='text-firstnames'><strong>There are no muted story.</strong></small>
                        </p>
                        </div>
                    </div>}
                </div>
            );
        }else{
            modalHeader = (
                <h3 className='modal-title text-story-archived-title' id='staticBackdropLabel'><i className='bi-archive'></i> Story Archive Setting</h3>
            );

            modalBody = (
                <div className='story-archived-content'>
                    <div className='turn-on-off-archived mt-4 mb-4'>
                        {archiveBody}
                    </div>
                    {archiveText}
                    <p className='text-center mt-4'>
                    {archiveBtn}
                    </p>
                </div>
            );
        }
        
        return (
            <>
                <div className='slidebarallStory animated fadeIn' id='staticBackdrop' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='false'>
                    <div className='col-md-12'>
                        <form>
                            <div className='row'>
                                <div className='col-lg-2 border p-4'>
                                    <p>
                                        <img className='img-fluid mt-2' src={logoDark} alt='logo' title='logo' />
                                        <a className='float-end mt-1 onClickcloseallstory closeallstory-desktop' href='/crypter/channels/town-square'><i className='bi-x-circle-fill'></i></a>
                                        <a className='float-end mt-1 onClickcloseallstorymobile closeallstory-mobile' href='/crypter/channels/town-square'><i className='bi-x-circle-fill'></i></a>
                                    </p>
                                    <div>
                                        <h5 className='mt-4'>Stories 
                                        <a className='onStorysettings text-dark float-end' data-bs-toggle='modal' data-bs-target='#staticBackdropStorySetting' onClick={() => {this.onChangeModal('privacy')}}><i className='bi-gear' data-bs-toggle='tooltip' data-bs-placement='top' title='Story Privacy'></i></a>
                                        <a className='onClickarchived text-dark' data-bs-toggle='modal' data-bs-target='#staticBackdropStorySetting' onClick={() => {this.onChangeModal('archive')}}><i className='bi-archive float-end me-2' data-bs-toggle='tooltip' data-bs-placement='top' title='Story Archive Setting'></i></a>  
                                        </h5>
                                    </div>

                                    <div className='your-story-desktop'>
                                        <div>
                                            <h5 className='mt-4'>Your Story <a className='onStoryprivacy float-end' data-bs-toggle='tooltip' data-bs-placement='top' title='Story privacy'></a></h5>
                                        </div>
                                        <p>
                                        <a className='onCreatenewstory text-dark' href='/stories/create'><i className='bi-plus-lg me-2 mt-0'></i>
                                            <label style={{verticalAlign: 'middle',}}><strong>Create a Story</strong><br/><small>Share a photo or write something</small></label></a>
                                        </p>
                                    </div>
                                    <div className='your-story-mobile'>
                                        {/*Create story mobile*/}
                                    </div>
                                    <div className='mt-4 mb-4'><h6>All Stories</h6></div>
                                    <div className='all-story-desktop'>
                                        <div className='all-stories-scroll'>
                                            <div className='mt-0'>
                                                {userRenderDesktop}
                                            </div>
                                        </div>
                                        <hr></hr>
                                    </div>
                                    <div className='all-story-mobile'>
                                        <div className='row'>
                                            {userRenderMobile}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-10 right-nav-story'>
                                    <div className='col-11 text-center p-5 select-a-story-to-open'>
                                        {selectedView}
                                    </div>
                                </div>

                                <div className='row p-3'>
                                    <div className='all-stories-float-icon-desktop'>
                                        <div className='position-absolute top-0 end-0 mt-4 me-4'>
                                           {/* <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                            <br/>
                                            <br/>
                                            <div className='mb-2'></div>
                                                <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                                <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                            <div className='mb-4'></div>
                                            */}
                                            <div className='d-flex'>
                                                <a className='onStoryprofilesettings' id='defaultDropdown' id='dropdownMenuOffset' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuOffset'>
                                                    <li><a className='dropdown-item text-dark' href='/profile'><i className='bi-person'></i> Profile</a></li>
                                                    {/*<li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                                    <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>*/}
                                                    <li><a className='dropdown-item onSettingsandprivacy text-dark' onClick={() => this.handleEmitUserLoggedOutEvent()}><i className='bi-gear-wide'></i> Sign out</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<div className='all-stories-float-icon-mobile'>
                                        <div className='position-absolute top-0 start-50 translate-middle-x me-5 mt-3'>
                                            <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                        </div>
                                        <div className='position-absolute top-0 start-50 translate-middle-x ms-5 mt-3'>
                                            <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                            <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                        </div>
                                    </div>*/}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='modal selectstoryprivacymutedandarchived' id='staticBackdropStorySetting' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content shadow-lg'>
                            <div className='modal-header'>
                                {modalHeader}
                                <a className='onClosestorysettings shadow float-end' data-bs-dismiss='modal'><i className='bi-x'></i></a>
                            </div>
                            <div className='modal-body'>
                                <div className='row mb-4'>
                                    <div className={this.state.modalSelected === 'archive' ? 'col-4 text-center onClickstoryarchived border-bottom border-3 pb-2':'col-4 text-center onClickstoryarchived'} onClick={() => {this.onChangeModal('archive')}}><small>Story archive</small></div>
                                    <div className={this.state.modalSelected === 'muted' ? 'col-4 text-center onClickstoriesmuted border-bottom border-3 pb-2':'col-4 text-center onClickstoriesmuted'} onClick={() => {this.onChangeModal('muted')}}><small>Stories you've muted</small></div>
                                    <div className={this.state.modalSelected === 'privacy' ? 'col-4 text-center onClickstoryprivacy border-bottom border-3 pb-2':'col-4 text-center onClickstoryprivacy'} onClick={() => {this.onChangeModal('privacy')}}><small>Story privacy</small></div>
                                </div>
                                {modalBody}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
