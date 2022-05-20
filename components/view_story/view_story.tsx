// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import StoryListView from 'components/story_list_view';
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
};

export default class ViewStory extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {photoStory: false,textStory: false, openUp: false, width: 0, isStatusSet: false, isDark:'light', privacyValue: 'everyone', addText: false,};

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

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        const { photoStory, textStory,privacyValue, addText, storyList } = this.state;
        
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
                                        <p>
                                        <i className='bi-images'></i>
                                        <br/>
                                        <strong><label>Select a story to open</label></strong>
                                        </p>

                                        {/*Previews all story*/}
                                        <div className='row p-3'>
                                            <div className='create-all-stories-previews'>
                                                <div className='row'>
                                                    <div className='col-8'>
                                                        <img className='img-fluid float-none' src='assets/images/sample-user-primary-picture-5.png'/>
                                                        <small className='float-none ms-2 text-muted'><strong>Firstname 8m</strong> <i className='bi-people-fill'></i></small>
                                                    </div>
                                                    <div className='col-4'>
                                                        <div className='dropdown'>
                                                        <a className='onClosestoryallpreviewsactions float-end shadow ms-1' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'><i className='bi-three-dots-vertical'></i></a>
                                                        <a className='onClosestoryallpreviews float-end shadow ms-1'><i className='bi-x-lg'></i></a>
                                                    </div>

                                                    <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuButton1'>
                                                        <li><a className='dropdown-item'><i className='bi-x-octagon-fill'></i> Mute Firstname goes here</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-patch-exclamation-fill'></i> Find support or report story</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className='previews-content mt-3 mb-3 text-center'>
                                                <div id='carouselStoryloopIndicators' className='carousel slide' data-bs-ride='carousel'>
                                                    <div className='carousel-indicators'>
                                                        <button type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide-to='0' className='active' aria-current='true' aria-label='Slide 1'></button>
                                                        <button type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide-to='1' aria-label='Slide 2'></button>
                                                        <button type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide-to='2' aria-label='Slide 3'></button>
                                                    </div>
                                                    {/*Loop for many story post*/}
                                                    <div className='carousel-inner text-center'>
                                                        <div className='carousel-item active'>
                                                        <img width='' src='assets/images/Cover-album-2.jpg' className='d-block w-100' alt=''/>
                                                        </div>
                                                        <div className='carousel-item'>
                                                        <img src='assets/images/Cover-album-3.jpg' className='d-block w-100' alt=''/>
                                                        </div>
                                                        <div className='carousel-item'>
                                                        <img src='assets/images/Cover-album.jpg' className='d-block w-100' alt=''/>
                                                        </div>
                                                    </div>
                                                    {/*Loop for many story post*/}
                                                    <button className='carousel-control-prev' type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide='prev'>
                                                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                                                    <span className='visually-hidden'>Previous</span>
                                                    </button>
                                                    <button className='carousel-control-next' type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide='next'>
                                                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                                                    <span className='visually-hidden'>Next</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='previews-content-actions'>
                                                <div className='row'>
                                                    <div className='col-lg-9'>
                                                        <div className='form-floating'>
                                                        <textarea className='form-control textares-stories-input' placeholder='Send messages...' id=''></textarea>
                                                        <label htmlFor='floatingTextarea'>Send messages...</label>
                                                        </div>
                                                        <div className='position-relative float-end'>
                                                        <a className='onSendmessage'>
                                                            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='bi bi-send-fill send-icons-previews' viewBox='0 0 16 16'>
                                                            <path d='M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z'/>
                                                            </svg>
                                                        </a>
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-3 text-center'>
                                                    <p>
                                                        <a className='onClicklikepreviewstories position-relative me-3'><i className='bi-hand-thumbs-up style-hand-thumbs-up-fill'></i>
                                                        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger count-likes-previews'>
                                                            2m+
                                                        </span>
                                                        </a>
                                                        <a className='onClickheartpreviewstories position-relative'><i className='bi-heart style-heart-fill'></i>
                                                        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger count-heart-previews'>
                                                            3.5k+
                                                        </span>
                                                        </a>
                                                    </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                            </div>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}
