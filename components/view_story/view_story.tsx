// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import StoryListView from 'components/story_list_view';
import StoryView from 'components/story_view';
import logoDark from 'images/logoBlack.png';
import postImage from 'images/post-1.png';
import profPic1 from 'images/profiles/user-profile-1.png';
import profPic2 from 'images/profiles/user-profile-2.png';
import profPic3 from 'images/profiles/user-profile-3.png';
import profPic4 from 'images/profiles/user-profile-4.png';
import profPic5 from 'images/profiles/user-profile-5.png';
import profPic6 from 'images/profiles/user-profile-6.png';
import profPic7 from 'images/profiles/user-profile-7.png';
import { Story } from 'mattermost-redux/types/crypto';
type Props = {
    status?: string;
    userId: string;
    autoResetPref?: string;
    actions: {
        openModal: <P>(modalData: ModalData<P>) => void;
        setStatus: (status: UserStatus) => ActionFunc;
        unsetCustomStatus: () => ActionFunc;
        setStatusDropdown: (open: boolean) => void;
    };
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
    selectedStory: string;
};

export default class ViewStory extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {photoStory: false,textStory: false, openUp: false, width: 0, isStatusSet: false, isDark:'light', privacyValue: 'everyone', addText: false, selectedStory:''};

        this.onChangePrivacy = this.onChangePrivacy.bind(this);
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.storyList !== undefined && this.props.storyList !== null){
            Promise.resolve(this.props.storyList).then((value) => {this.setState({storyList: value});});
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
            />
        );
    }

    onChangePrivacy = (event) => {
        this.setState({privacyValue: event.target.value});
    }

    onChangeSelected = (value: string) => {
        this.setState({selectedStory: value});
    }

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        const { photoStory, textStory,privacyValue, addText, storyList,selectedStory } = this.state;
        
        let userRenderDesktop;
        let userRenderMobile;
        if(storyList){
            userRenderDesktop = (
                <>
                    {storyList.map((item,index) => {
                        return (
                            <StoryListView userId={item} view='desktop' key={`${item}-${index}`} />
                        );
                    })}
                </>
            );

            userRenderMobile = (
                <>
                    {storyList.map((item,index) => {
                        return (
                            <StoryListView userId={item} view='mobile' key={`${item}-${index}`} />
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
                <StoryView userId={selectedStory} />
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
                                        <a className='float-end mt-1 onClickcloseallstory closeallstory-desktop' href='/crypter/town-square'><i className='bi-x-circle-fill'></i></a>
                                        <a className='float-end mt-1 onClickcloseallstorymobile closeallstory-mobile' href='/crypter/town-square'><i className='bi-x-circle-fill'></i></a>
                                    </p>
                                    <div>
                                        <h5 className='mt-4'>Stories 
                                        <a className='onStorysettings float-end'><i className='bi-gear' data-bs-toggle='tooltip' data-bs-placement='top' title='Story Privacy'></i></a>
                                        <a className='onClickarchived'><i className='bi-archive float-end me-2' data-bs-toggle='tooltip' data-bs-placement='top' title='Story Archive Setting'></i></a>  
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
                                                <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuOffset'>
                                                    <li><a className='dropdown-item'><i className='bi-person'></i> Profile</a></li>
                                                    <li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                                    <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>
                                                    <li><a className='dropdown-item onSettingsandprivacy'><i className='bi-gear-wide'></i> Settings & Privacy</a></li>
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
            </>
        );
    }
}
