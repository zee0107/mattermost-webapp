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
    photoValue: string[];
    photoValueName: string[];
    prevName: string;
};

export default class CreateAlbum extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {photoValueName: [],photoValue: [],image: [],openUp: false, width: 0, isStatusSet: false, isDark:'light', privacyValue: 'everyone',};

        this.selectInput = React.createRef();
        this.onChangePrivacy = this.onChangePrivacy.bind(this);
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    componentDidUpdate(_,prevState) {
        const {photoValue} = this.state;
        console.log('currrent: ',photoValue);
        console.log('previous: ',prevState.photoValue);
        if (photoValue !== prevState.photoValue) {
            photoValue.forEach((value) => {
                this.setPicture(value);
            });
        }
    }

    onChangePrivacy = (event) => {
        this.setState({privacyValue: event.target.value});
    }

    handleInputFile = () => {
        this.selectInput.current.value = '';
        this.selectInput.current.click();
    }

    updatePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if(e.target.files.length > 0 ){
                for(var i = 0; i < e.target.files.length; i++){
                    const file = e.target.files[i];
                    this.setState((prevState) => ({
                        photoValue: [...prevState.photoValue, file],
                        //photoValueName: [...prevState.photoValueName, file.name]
                    }));
                }
                /*for(var i = 0; i <= e.target.files.length; i++){
                   
                }*/
            }
        } else {
            this.setState({photoValue: null});
        }
    }

    setPicture = (file) => {
        if (file) {
            this.previewBlob = URL.createObjectURL(file);

            var reader = new FileReader();
            reader.onload = (e) => {
                //const orientation = FileUtils.getExifOrientation(e.target.result);
                //const orientationStyles = FileUtils.getOrientationStyles(orientation);

                this.setState((prevState) => ({
                    image: [...prevState.image, this.previewBlob],
                }));
            };
            reader.readAsArrayBuffer(file);
        }
    }

   /*

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
    }*/

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        const { privacyValue, image } = this.state;
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
                                        {/*<div className='row g-1 mt-1'>
                                            <div className='col-6'>
                                            <input type='text' className='form-control' placeholder='Date' aria-label='Date'/>
                                            </div>
                                            <div className='col-6'>
                                            <input type='text' className='form-control' placeholder='Time' aria-label='Time'/>
                                            </div>
                                        </div>*/}
                                        <div className='row g-1 mt-1'>
                                            <div className='col-12'>
                                            <div className='d-grid gap-2'>
                                            <span>
                                                <input
                                                data-testid='uploadPicture'
                                                ref={this.selectInput}
                                                className='hidden'
                                                accept='image/*'
                                                type='file'
                                                onChange={this.updatePhoto}
                                                //disabled={this.props.loadingPicture}
                                                aria-hidden={true}
                                                tabIndex='-1'/>
                                            </span>
                                                <button type='button' onClick={this.handleInputFile} className='btn-primary p-2' style={{borderRadius: 19,}}><i className='bi-file-earmark-image'></i> Upload photos or videos</button>
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
                                   <div className='col-12'>
                                        <div className='row'>
                                            {image && image.map((item,index) => {
                                                return (
                                                    <div className='col-3 text-center mt-1 mb-1' key={`${item}-${index}`}>
                                                        <div className='position-relative'>
                                                            <img className='img-fluid rounded border border-2' src={item} alt=''/>
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
                                                );
                                            })}
                                            
                                             {/*<div className='col-3 text-center mt-1 mb-1'>
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
                                            </div>*/}
                                        </div>
                                    </div>
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
                                        {/*<div className='position-absolute top-0 start-50 translate-middle-x mt-3'>
                                            <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                        </div>
                                        <div className='position-absolute top-0 start-50 translate-middle-x mt-3' style={{margin:'0px 0px 0px 61px',}}>
                                            <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                            <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                        </div>*/}
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
                        <div className='modal-content shadow-lg'>
                            <div className='modal-header'>
                                <h3 className='modal-title text-story-privacy-title' id='staticBackdropLabel'><i className='bi-lock'></i> Select audience</h3>
                                <a className='onClosephotosandalbumsselectaudience shadow float-end' data-bs-dismiss='modal'><i className='bi-x'></i></a>
                            </div>
                            <div className='modal-body'>
                                <div className='story-privacy-content'>
                                    <div className='row'>
                                        <p><label><strong>Who can see your photos and albums?</strong></label><br/><small>Your photos and albums will be visible 24 hours on Crypter.</small></p>
                                        <div className='col-10'><p><i className='bi-globe'></i> <strong>Everyone</strong> <br/> <small>Everyone on Crypter</small></p></div>
                                            <div className='col-2'>
                                                <div className='form-check float-end'>
                                                    <input className='form-check-input onEveryonestoryprivacy' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='everyone' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'everyone'} name='flexRadioDefault' id='flexRadioEveryonestoryprivacy'/>
                                                    <label className='form-check-label' htmlFor='flexRadioEveryonestoryprivacy'></label>
                                                </div>
                                            </div>
                                        </div>

                                    <div className='row mt-2'>
                                        <div className='col-10'><p><i className='bi-people-fill'></i> <strong>Friends</strong> <br/><small>Only your Crypter friends</small></p></div>
                                        <div className='col-2'>
                                            <div className='form-check float-end'>
                                                    <input className='form-check-input onFriendstoryprivacy' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='friends' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'friends'} name='flexRadioDefault' id='flexRadioFriendstoryprivacy'/>
                                                    <label className='form-check-label' htmlFor='flexRadioFriendstoryprivacy'></label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row mt-2'>
                                        <div className='col-10'><p><i className='bi-person'></i> <strong>Private</strong> <br/><small>Only you see your Story</small></p></div>
                                        <div className='col-2'>
                                            <div className='form-check float-end'>
                                                    <input className='form-check-input onOnlymestoryprivacy' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='private' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'private'} name='flexRadioDefault' id='flexRadioOnlymestoryprivacy'/>
                                                    <label className='form-check-label' htmlFor='flexRadioOnlymestoryprivacy'></label>
                                            </div>
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
