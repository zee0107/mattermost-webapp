// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import logoDark from 'images/logoBlack.png';
import postImage from 'images/post-1.png';

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
        const { photoStory, textStory,privacyValue, addText } = this.state;

        return (
            <>
                <div className='modal slidebarallStory animated fadeIn' id='staticBackdrop' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='false'>
                    <div className='col-md-12'>
                        <form>
                            <div className='row'>
                                <div className='col-lg-2 border p-4'>
                                    <p>
                                        <img className='img-fluid mt-2' src='assets/images/logo-story.png' alt='logo' title='logo' />
                                        <a className='float-end mt-1 onClickcloseallstory closeallstory-desktop'><i className='bi-x-circle-fill'></i></a>
                                        <a className='float-end mt-1 onClickcloseallstorymobile closeallstory-mobile'><i className='bi-x-circle-fill'></i></a>
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
                                        <a className='onCreatenewstory'><i className='bi-plus-lg me-2 mt-0'></i>
                                            <label><strong>Create a Story</strong><br/><small className='ms-4'>Share a photo or write something</small></label></a>
                                        </p>
                                    </div>
                                    <div className='your-story-mobile'>
                                        {/*Create story mobile*/}
                                    </div>
                                    <div className='mt-4 mb-4'><h6>All Stories</h6></div>
                                    <div className='all-story-desktop'>
                                        <div className='all-stories-scroll'>
                                            <div className='mt-0'>
                                                <a className='onViewsfriendstories'>
                                                    <div className='padding-view-firends-style'>
                                                        <img className='img-fluid circle-rounded me-2 mt-3' src='assets/images/sample-user-primary-picture-6.png'/>
                                                        <small className='mt-1 text-muted'><strong>First name goes here</strong></small>
                                                        <br/>
                                                        <div className='yourstoryminutes'><small className='ms-5'>8m</small></div>
                                                    </div>
                                                </a>

                                                <a>
                                                    <div className='padding-view-firends-style'>
                                                    <img className='img-fluid circle-rounded me-2 mt-3' src='assets/images/sample-user-primary-picture-5.png'/>
                                                    <small className='mt-1 text-muted'><strong>First name goes here</strong></small>
                                                    <br/>
                                                    <div className='yourstoryminutes'><small className='ms-5'>12h</small></div>
                                                    </div>
                                                </a>

                                                <a>
                                                    <div className='padding-view-firends-style'>
                                                    <img className='img-fluid circle-rounded me-2 mt-3' src='assets/images/sample-user-primary-picture-4.png'/>
                                                    <small className='mt-1 text-muted'><strong>First name goes here</strong></small>
                                                    <br/>
                                                    <div className='yourstoryminutes'><small className='ms-5'>3h</small></div>
                                                    </div>
                                                </a>

                                                <a>
                                                    <div className='padding-view-firends-style'>
                                                    <img className='img-fluid circle-rounded me-2 mt-3' src='assets/images/sample-user-primary-picture-3.png'/>
                                                    <small className='mt-1 text-muted'><strong>First name goes here</strong></small>
                                                    <br/>
                                                    <div className='yourstoryminutes'><small className='ms-5'>1h</small></div>
                                                    </div>
                                                </a>

                                                <a>
                                                    <div className='padding-view-firends-style'>
                                                    <img className='img-fluid circle-rounded me-2 mt-3' src='assets/images/sample-user-primary-picture-2.png'/>
                                                    <small className='mt-1 text-muted'><strong>First name goes here</strong></small>
                                                    <br/>
                                                    <div className='yourstoryminutes'><small className='ms-5'>40s</small></div>
                                                    </div>
                                                </a>

                                                <a>
                                                    <div className='padding-view-firends-style'>
                                                    <img className='img-fluid circle-rounded me-2 mt-3' src='assets/images/sample-user-primary-picture.png'/>
                                                    <small className='mt-1 text-muted'><strong>First name goes here</strong></small>
                                                    <br/>
                                                    <div className='yourstoryminutes'><small className='ms-5'>99h</small></div>
                                                    </div>
                                                </a>

                                                <a>
                                                    <div className='padding-view-firends-style'>
                                                    <img className='img-fluid circle-rounded me-2 mt-3' src='assets/images/sample-user-primary-picture-3.png'/>
                                                    <small className='mt-1 text-muted'><strong>First name goes here</strong></small>
                                                    <br/>
                                                    <div className='yourstoryminutes'><small className='ms-5'>1h</small></div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>

                                        <div className='all-story-mobile'>
                                            <div className='row'>
                                                <div className='col-2 text-center'>
                                                    <a className='onViewsfriendstories'>
                                                        <img className='img-fluid rounded-circle mt-0 border border-2 border-success' src='assets/images/sample-user-primary-picture-6.png'/>
                                                        <p><small>Firstname <br/> <strong>8m</strong></small></p>
                                                    </a>
                                                </div>
                                                <div className='col-2 text-center'>
                                                    <img className='img-fluid rounded-circle mt-0 border border-2 border-success' src='assets/images/sample-user-primary-picture-5.png'/>
                                                    <p><small>Firstname <br/> <strong>12h</strong></small></p>
                                                </div>
                                                    <div className='col-2 text-center'>
                                                    <img className='img-fluid rounded-circle mt-0 border border-2 border-success' src='assets/images/sample-user-primary-picture-4.png'/>
                                                    <p><small>Firstname <br/> <strong>3h</strong></small></p>
                                                </div>
                                                <div className='col-2 text-center'>
                                                    <img className='img-fluid rounded-circle mt-0 border border-2 border-success' src='assets/images/sample-user-primary-picture-3.png'/>
                                                    <p><small>Firstname <br/> <strong>40s</strong></small></p>
                                                </div>
                                                    <div className='col-2 text-center'>
                                                    <img className='img-fluid rounded-circle mt-0 border border-2 border-success' src='assets/images/sample-user-primary-picture-2.png'/>
                                                    <p><small>Firstname <br/> <strong>99h</strong></small></p>
                                                </div>
                                                <div className='col-2 text-center'>
                                                    <img className='img-fluid rounded-circle mt-0 border border-2 border-success' src='assets/images/sample-user-primary-picture.png'/>
                                                    <p><small>Firstname <br/> <strong>1h</strong></small></p>
                                                </div>
                                            </div>
                                        </div>

                                        <hr></hr>
                                    </div>
                                </div>
                                <div className='col-lg-10 right-nav-story'>
                                    <div className='col-12 text-center p-5 select-a-story-to-open'>
                                        <p>
                                        <i className='bi-images'></i>
                                        <br/>
                                        <strong><label>Select a story to open</label></strong>
                                        </p>
                                    </div>

                                    <div className='row p-3'>
                                        {/*Previews all story*/}
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

                                                        <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuButton1'>
                                                            <li><a className='dropdown-item'><i className='bi-x-octagon-fill'></i> Mute Firstname goes here</a></li>
                                                            <li><a className='dropdown-item'><i className='bi-patch-exclamation-fill'></i> Find support or report story</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='previews-content mt-3 mb-3 text-center'>
                                                <strong className='text-center text-white'><label>CREATED STORIES FROM YOU GOES HERE</label></strong>
                                            </div>

                                            {/*Previews content actions*/}
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
                                            {/*Previews content actions*/}
                                        </div>
                                        {/*Previews all story*/}

                                        {/*Previews all story*/}
                                        <div className='create-photo-story-previews'>
                                            <strong>
                                            <label>Previews</label></strong>
                                            <a className='onClosetexttypings shadow float-end'><i className='bi-x'></i></a>

                                            <div className='previews-photo-content mt-4 mb-1'>
                                                <div className='col-lg-12'>
                                                    <div className='photo-story-uploaded rounded' id='resizable'>
                                                        <div className='add-text-on-photo'>
                                                            <div id='draggable' className='ui-widget-content'>
                                                                <div>
                                                                    <div className='form-floating'>
                                                                        <textarea style={{height: 150,}} className='form-control text-start-styping' placeholder='Start typing' id='floatingTextarea'></textarea>
                                                                        <label htmlFor='floatingTextarea'>Start typing</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className='text-center'><strong>Browse photo</strong></p>
                                        </div>
                                        {/*Previews all story*/}
                                        <div className='all-stories-float-icon-desktop'>
                                            <div className='position-absolute top-0 end-0 mt-4 me-4'>
                                                <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                                <br/>
                                                <br/>
                                                <div className='mb-2'></div>
                                                    <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                                    <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                                <div className='mb-4'></div>
                                                
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
                                        <div className='all-stories-float-icon-mobile'>
                                            <div className='position-absolute top-0 start-50 translate-middle-x me-5 mt-3'>
                                                <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                            </div>
                                            <div className='position-absolute top-0 start-50 translate-middle-x ms-5 mt-3'>
                                                <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                                <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                            </div>
                                        </div>
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
