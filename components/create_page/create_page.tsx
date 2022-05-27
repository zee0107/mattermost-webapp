// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import logoDark from 'images/logoBlack.png';
import HeaderImage from 'images/Page-dummy-cover.png';
import profPic from 'images/profiles/user-profile-1.png';
import $ from 'jquery';
import { throws } from 'assert';
import { UploadBlob } from 'mattermost-redux/types/crypto';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import { toInteger } from 'lodash';

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
};

export default class CreatePage extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', privacyValue: 'everyone',};
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

   
    render= (): JSX.Element => {
        return (
            <>
                <div style={{zIndex: 180}} className='createmypage' id='staticBackdrop'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-3 border-end p-4'>
                                <div className='mt-4'><img className='img-fluid mt-2' src={logoDark} alt='logo' title='logo'/>
                                    <a className='float-end mt-1 onClickclosecreatemypage yourphotosandalbums-desktop'><i className='bi-x-circle-fill'></i></a>
                                    <a className='float-end mt-1 onClickclosecreatemypagemobile yourphotosandalbums-mobile'><i className='bi-x-circle-fill'></i></a>
                                </div>
                                <div className='row mt-4'>
                                    <div className='col-10'><h6 className='mt-2'>Create My Page</h6></div>
                                    <div className='col-1 float-end'>
                                    <a className='onGetstartedcreatepage' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Get started'><i className='bi-info-circle bi-info-circle-style'></i></a></div>
                                </div>
                                <form>
                                    <p className='mt-1'><label>Page information</label></p>
                                    <div>
                                        <div className='row g-1'>
                                            <div className='col-12'>
                                            <input type='text' className='form-control' placeholder='Page name (Required)' aria-label='Page name (Required)'/>
                                            <p><small>Use the name of your business, brand or organization, or a name that explains what the Page is about. <a>Learn more</a></small></p>
                                            </div>
                                        </div>

                                        <div className='row g-1'>
                                            <div className='col-12'>
                                            <input type='text' className='form-control' placeholder='Category (Required)' aria-label='Category (Required)'/>
                                            <p><small>Choose a category that describes what type of business, organization or topic the Page represents.</small></p>
                                            </div>
                                        </div>

                                        <div className='row g-1'>
                                            <div className='col-12'>
                                            <div className='form-floating'>
                                                <textarea style={{height: 135, border: '1px solid #ccc'}} className='form-control' placeholder='Description'></textarea>
                                                <label htmlFor='floatingTextarea'>Description</label>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='col-12 mt-5'>
                                            <div className='d-grid gap-2'>
                                                <button type='button' className='btn-primary'>Create Page</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className='col-lg-9 right-nav-story'>
                                <div className='col-12 mx-auto mt-4 border border-1 p-4 rounded my-page-desktop-mobile-view'>
                                    <div className='row'>
                                        <div className='col-8'>
                                            <div className='mypagetext-desktop'>
                                                <label className='text-desktop-views'><strong>Desktop previews</strong></label>
                                                <label className='text-mobile-views'><strong>Mobile previews</strong></label>
                                            </div>
                                            <div className='mypagetext-mobile'>
                                                <label><strong>Mobile previews</strong></label>
                                            </div>
                                        </div>
                                        <div className='col-4'>
                                            <div className='mypages-icons-desktop'>
                                                <a className='onDesktoppreviews'><i className='bi-phone bi-phone-style float-end'></i></a>
                                                <a className='onMobilepreviews'><i className='bi-display bi-display-style float-end me-2'></i></a>
                                            </div>
                                            <div className='mypages-icons-mobile'>
                                                <a className=''><i className='bi-phone bi-display-style float-end me-2'></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='mypageheaderpreviews' style={{backgroundImage: `url(${HeaderImage})`, backgroundPosition: 'center bottom'}}>
                                            <h3 className='text-center text-white'></h3>
                                        </div>

                                        <div className='mypagepreviews-desktop'>
                                            <div className='mypageheadingpreviews'>
                                            <div className='row'>
                                                <div className='col-lg-3 text-center'>
                                                <div className='rounded-circle rounded-circle-photo border border-5'><i className='bi-flag-fill bi-flag-fill-style text-white'></i></div>
                                                </div>
                                                <div className='col-lg-9'>
                                                <h4 className='mt-5'>Page name</h4>
                                                <label>Category</label>
                                                </div>
                                            </div>
                                            </div>
                                        </div>

                                        <div className='mypagepreviews-mobile'>
                                            <div className='mypageheadingpreviews'>
                                            <div className='row'>
                                                <div className='col-12 text-center'>
                                                <div className='col-3 mx-auto rounded-circle rounded-circle-photo border border-5'><i className='bi-flag-fill bi-flag-fill-style text-white'></i></div>
                                                </div>
                                                <div className='col-lg-12 text-center'>
                                                <h4 className='mt-3'>Page name</h4>
                                                <label>Category</label>
                                                </div>
                                            </div>
                                            </div>
                                        </div>

                                        <hr/>

                                        <div className='row mt-2'>
                                            <div className='col-3 text-center'><small>Home</small></div>
                                            <div className='col-3 text-center'><small>About</small></div>
                                            <div className='col-3 text-center'><small>Photos</small></div>
                                            <div className='col-3 text-center'><small>Videos</small></div>
                                        </div>

                                        <div className='mypages-previews-content-dekstop'>
                                            <div className='mypagecontentpreviews'>
                                                <div className='row'>
                                                <div className='col-lg-5 mt-1 mb-1'>
                                                    <div className='mypagepreviewsabout'>
                                                    <h6>About</h6>
                                                    <p><i className='bi-info-circle-fill info-circle-fill-style'></i> Description</p>
                                                    </div>
                                                </div>
                                                <div className='col-lg-7 mt-1 mb-1'>
                                                    <div className='mypagepreviewsabout'>
                                                        <div className='row'>
                                                            <div className='col-2'><img className='' width='40' height='40' src={profPic} alt=''/></div>
                                                            <div className='col-10'><div className='d-grid'><button type='button' className='btn-primary' disabled>Create post</button></div></div>
                                                        </div>
                                                        <div className='row mt-2'>
                                                        <div className='col-4 text-center'>
                                                            <i className='bi-camera-video float-start'></i> <small className='float-start mt-1 ms-1'>Videos</small></div>
                                                        <div className='col-4 text-center'>
                                                            <i className='bi-image float-start'></i> <small className='float-start mt-1 ms-1'>Photos</small></div>
                                                        <div className='col-4 text-center'>
                                                            <i className='bi-geo-alt-fill float-start'></i> <small className='float-start mt-1 ms-1'>Locations</small></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='mypages-previews-content-mobile'>
                                            <div className='mypagecontentpreviews'>
                                                <div className='row'>
                                                    <div className='col-lg-7 mt-1 mb-1'>
                                                        <div className='mypagepreviewsabout'>
                                                            <div className='row'>
                                                                <div className='col-2'><img className='' width='40' height='40' src='assets/images/sample-user-primary-picture.png' alt='' /></div>
                                                                <div className='col-10'><div className='d-grid'><button type='button' className='btn btn-primary' disabled>Create post</button></div></div>
                                                            </div>
                                                            <div className='row mt-2'>
                                                            <div className='col-4 text-center'>
                                                                <i className='bi-camera-video'></i></div>
                                                            <div className='col-4 text-center'>
                                                                <i className='bi-image'></i></div>
                                                            <div className='col-4 text-center'>
                                                                <i className='bi-geo-alt-fill'></i></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-5 mt-1 mb-1'>
                                                        <div className='mypagepreviewsabout'>
                                                        <h6>About</h6>
                                                        <p><i className='bi-info-circle-fill info-circle-fill-style'></i> Description</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                            <a className='onStoryprofilesettings' id='defaultDropdown' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
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
                                    <div className='position-absolute top-0 start-50 translate-middle-x mt-3' style={{margin:'0px 0px 0px 61px'}}>
                                        <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                        <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                    </div>
                                    <div className='position-absolute top-0 start-50 translate-middle-x mt-1' style={{margin:'0px 0px 0px -61px'}}>
                                        <div className='d-flex'>
                                            <a className='onStoryprofilesettings' id='defaultDropdown' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
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
                    </div>
                </div>
            </>
        );
    }
}
