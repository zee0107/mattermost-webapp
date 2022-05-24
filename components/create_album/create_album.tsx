// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import logoDark from 'images/logoBlack.png';
import postImage from 'images/post-1.png';
import $ from 'jquery';
import { throws } from 'assert';

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
    privacyValue: string;
};

export default class CreateAlbum extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', privacyValue: 'everyone',};

        //this.selectInput = React.createRef();
        this.onChangePrivacy = this.onChangePrivacy.bind(this);
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    onChangePrivacy = (event) => {
        this.setState({privacyValue: event.target.value});
    }

   /*componentDidUpdate(_,prevState) {
        console.log('Prev: ', prevState)
        if (this.state.photoValueName !== prevState.photoValueName) {
            this.setPicture(this.state.photoValue);
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

    

    handleInputFile = () => {
        this.selectInput.current.value = '';
        this.selectInput.current.click();
    }

    setPicture = (file) => {
        if (file) {
            this.previewBlob = URL.createObjectURL(file);

            var reader = new FileReader();
            reader.onload = (e) => {
                //const orientation = FileUtils.getExifOrientation(e.target.result);
                //const orientationStyles = FileUtils.getOrientationStyles(orientation);

                this.setState({
                    image: this.previewBlob,
                });
            };
            reader.readAsArrayBuffer(file);
        }
    }*/

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        const { privacyValue } = this.state;

        let privacyView;
        if(privacyValue === 'private'){
            privacyView = (
                <a className='ms-0 storyprivacyonlymeviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Only you is selected go to your photos and albums'><i className='bi-person'></i> Private</a>
            );
        }
        else if(privacyValue === 'friends'){
            privacyView = (
                <a className='ms-0 storyprivacyfriendsviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Friends is selected go to your photos and albums'><i className='bi-people-fill'></i> Friends</a>
            );
        }
        else{
            privacyView = (
                <a className='ms-0 storyprivacyeveryoneviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Everyone is selected go to your photos and albums'><i className='bi-globe'></i> Everyone</a>
            );
        }
        return (
            <>
                <div className='createyourPhotosandyouralbums'>
                    <div className='container'>
                        <form>
                            <div className='row'>
                                <div className='col-lg-3 border-end p-4'>
                                    <p><img className='img-fluid mt-2' src={logoDark} alt='logo' title='logo' />
                                        <a className='float-end mt-1 onClickcloseyourphotosandalbums yourphotosandalbums-desktop text-dark' href='/crypter/channels/town-square'><i className='bi-x-circle-fill'></i></a>
                                        <a className='float-end mt-1 onClickcloseyourphotosandalbumsmobile yourphotosandalbums-mobile text-dark' href='/crypter/channels/town-square'><i className='bi-x-circle-fill'></i></a>
                                    </p>
                                    <div>
                                        <h3 className='mt-4 mb-4'>Create album 
                                            <a className='onSelectphotosandalbums float-end' data-bs-toggle='modal' data-bs-target='#staticBackdropAudience'><i className='bi-gear' data-bs-toggle='tooltip' data-bs-placement='top' title='Photos or Albums Setting'></i></a>
                                        </h3>
                                    </div>
                                    <div className='mt-4 mb-4'>
                                        <div className='createalbumsandphotosprivacy'>
                                            {privacyView}
                                        </div>
                                    </div>
                                <div>
                                    <div>
                                        <div className='row g-1'>
                                            <div className='col-12'>
                                            <input type='text' className='form-control' placeholder='Album name' aria-label='Album name'/>
                                            </div>
                                        </div>
                                        <div className='row g-1 mt-1'>
                                            <div className='col-6'>
                                            <input type='text' className='form-control' placeholder='Date' aria-label='Date'/>
                                            </div>
                                            <div className='col-6'>
                                            <input type='text' className='form-control' placeholder='Time' aria-label='Time'/>
                                            </div>
                                        </div>
                                        <div className='row g-1 mt-1'>
                                            <div className='col-12'>
                                            <div className='d-grid gap-2'>
                                                <button type='button' className='btn-primary p-2' style={{borderRadius: 19,}}><i className='bi-file-earmark-image'></i> Upload photos or videos</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <hr/>
                                    <div>
                                        <div className='col-12'>
                                            <div className='d-grid gap-2'>
                                                <button type='button' className='btn-primary p-2' style={{borderRadius: 19,}}>Post</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div className='col-lg-9 right-nav-story'>
                                    <div className='col-12 text-center p-5 uploaded-photos-or-video-goes-here'>
                                        <p>
                                        <i className='bi-images'></i>
                                        <br/>
                                        <strong><label>Ready to add something?</label></strong>
                                        </p>
                                    </div>
                                    {/*<div className='col-12'>
                                        <div className='row'>
                                            <div className='col-3 text-center mt-1 mb-1'>
                                            <div className='position-relative'>
                                                <img className='img-fluid rounded border border-2' src='assets/images/sample-mobile-picture-5.png' alt=''/>
                                                <div className='dropdown' style={{zIndex: 99,}}>
                                                <span className='position-absolute top-0 start-100 translate-middle border-2 border-light rounded-circle padding-actions-photo'>
                                                    <a className='onEachphotoactions' id='dropdownMenuButton2' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-pencil-fill text-white'></i></a>
                                                    <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuButton2'>
                                                        <li><a className='dropdown-item'><i className='bi-x-square-fill x-square-fill-style'></i> Delete photo</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-download download-style'></i> Download</a></li>
                                                        <li><a className='dropdown-item onEditphotovideodate'><i className='bi-calendar2-date-fill calendar2-date-fill-style'></i> Edit date</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-card-image card-image-style'></i> Make profile picture</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-image-alt image-alt-style'></i> Make cover photo</a></li>
                                                    </ul>
                                                </span>
                                                </div>
                                            </div>
                                            </div>
                                            <div className='col-3 text-center mt-1 mb-1'>
                                            <div className='position-relative'>
                                                <img className='img-fluid rounded border border-2' src='assets/images/sample-mobile-picture-4.png' alt=''/>
                                                <div className='dropdown' style={{zIndex: 99,}}>
                                                <span className='position-absolute top-0 start-100 translate-middle border-2 border-light rounded-circle padding-actions-photo'>
                                                    <a className='onEachphotoactions' id='dropdownMenuButton2' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-pencil-fill text-white'></i></a>
                                                    <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuButton2'>
                                                        <li><a className='dropdown-item'><i className='bi-x-square-fill x-square-fill-style'></i> Delete photo</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-download download-style'></i> Download</a></li>
                                                        <li><a className='dropdown-item onEditphotovideodate'><i className='bi-calendar2-date-fill calendar2-date-fill-style'></i> Edit date</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-card-image card-image-style'></i> Make profile picture</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-image-alt image-alt-style'></i> Make cover photo</a></li>
                                                    </ul>
                                                </span>
                                                </div>
                                            </div>
                                            </div>
                                            <div className='col-3 text-center mt-1 mb-1'>
                                            <div className='position-relative'>
                                                <img className='img-fluid rounded border border-2' src='assets/images/sample-mobile-picture-3.png' alt=''/>
                                                <div className='dropdown' style={{zIndex: 99,}}>
                                                <span className='position-absolute top-0 start-100 translate-middle border-2 border-light rounded-circle padding-actions-photo'>
                                                
                                                    <a className='onEachphotoactions' id='dropdownMenuButton2' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-pencil-fill text-white'></i></a>
                                                
                                                    <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuButton2'>
                                                        <li><a className='dropdown-item'><i className='bi-x-square-fill x-square-fill-style'></i> Delete photo</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-download download-style'></i> Download</a></li>
                                                        <li><a className='dropdown-item onEditphotovideodate'><i className='bi-calendar2-date-fill calendar2-date-fill-style'></i> Edit date</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-card-image card-image-style'></i> Make profile picture</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-image-alt image-alt-style'></i> Make cover photo</a></li>
                                                    </ul>
                                                </span>
                                                </div>
                                            </div>
                                            </div>
                                            <div className='col-3 text-center mt-1 mb-1'>
                                            <div className='position-relative'>
                                                <img className='img-fluid rounded border border-2' src='assets/images/sample-mobile-picture-2.png' alt=''/>
                                                <div className='dropdown' style={{zIndex: 99,}}>
                                                <span className='position-absolute top-0 start-100 translate-middle border-2 border-light rounded-circle padding-actions-photo'>
                                                
                                                    <a className='onEachphotoactions' id='dropdownMenuButton2' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-pencil-fill text-white'></i></a>
                                                
                                                    <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuButton2'>
                                                        <li><a className='dropdown-item'><i className='bi-x-square-fill x-square-fill-style'></i> Delete photo</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-download download-style'></i> Download</a></li>
                                                        <li><a className='dropdown-item onEditphotovideodate'><i className='bi-calendar2-date-fill calendar2-date-fill-style'></i> Edit date</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-card-image card-image-style'></i> Make profile picture</a></li>
                                                        <li><a className='dropdown-item'><i className='bi-image-alt image-alt-style'></i> Make cover photo</a></li>
                                                    </ul>
                                                </span>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>*/}
                                    <div className='photo-and-albums-menu-desktop'>
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
                                                <li><a className='dropdown-item' href='profile.html'><i className='bi-person'></i> Profile</a></li>
                                                <li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                                <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>
                                                <li><a className='dropdown-item onSettingsandprivacy'><i className='bi-gear-wide'></i> Settings & Privacy</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='photo-and-albums-menu-mobile'>
                                        <div className='position-absolute top-0 start-50 translate-middle-x mt-3'>
                                            <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                        </div>
                                        <div className='position-absolute top-0 start-50 translate-middle-x mt-3' style={{margin:'0px 0px 0px 61px',}}>
                                            <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                            <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                        </div>
                                        <div className='position-absolute top-0 start-50 translate-middle-x mt-1' style={{margin:'0px 0px 0px -61px',}}>
                                            <div className='d-flex'>
                                                <a className='onStoryprofilesettings' id='defaultDropdown' id='dropdownMenuOffset' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                                                <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuOffset'>
                                                <li><a className='dropdown-item' href='profile.html'><i className='bi-person'></i> Profile</a></li>
                                                <li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                                <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>
                                                <li><a className='dropdown-item onSettingsandprivacy'><i className='bi-gear-wide'></i> Settings & Privacy</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='modal selectaudience' id='staticBackdropAudience' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>Select audience</h6>
                                <a className='onBacktopost' data-bs-dismiss='modal'><i className='bi-arrow-left-circle'></i></a>
                            </div>
                            <div className='modal-body'>
                                <div className='row'>
                                    <div className='col-10'>Everyone</div>
                                    <div className='col-2'>
                                        <div className='form-check float-end'>
                                            <input className='form-check-input onPublicselect' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='everyone' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'everyone'} name='flexRadioDefault' id='flexRadioPublicselect'/>
                                            <label className='form-check-label' htmlFor='flexRadioPublicselect'></label>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-10'>Friends</div>
                                    <div className='col-2'>
                                        <div className='form-check float-end'>
                                                <input className='form-check-input onFriendselect' data-bs-dismiss='modal' name='flexRadioDefault' value='friends' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'friends'} type='radio' name='flexRadioDefault' id='flexRadioFriendselect'/>
                                                <label className='form-check-label' htmlFor='flexRadioFriendselect'></label>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-10'>Private</div>
                                    <div className='col-2'>
                                        <div className='form-check float-end'>
                                                <input className='form-check-input onOnlyme' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='private' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'private'} name='flexRadioDefault' id='flexRadioOnlyme'/>
                                                <label className='form-check-label' htmlFor='flexRadioOnlyme'></label>
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
