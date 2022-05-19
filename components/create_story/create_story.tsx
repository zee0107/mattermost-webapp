// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import fillImage from 'images/fill.svg';
import CurrencyIcons from 'components/currency_icons';
import ProgressBar from 'components/progress_bar_new';
import CurrencyCap from 'components/currency_cap/currency_cap';
import logoDark from 'images/logoDark.png';

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

export default class CreateStory extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light'};
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    render= (): JSX.Element => {
        return (
            <>
                <div className='slidebarStory'>
                    <div className='container'>
                        <form>
                            <div className='row'>
                    
                                <div className='col-lg-3 border-end p-4'>
                                <p><img className='img-fluid mt-2' src='assets/images/logo-story.png' alt='logo' title='logo'/><a href='#' className='float-end mt-1 onClickclosestory'><i className='bi-x-circle-fill'></i></a></p>
                                <p>
                                    <h5 className='mt-4'>Your Story <a className='onStoryprivacy float-end' data-bs-toggle='tooltip' data-bs-placement='top' title='Story privacy'><i className='bi-gear'></i></a></h5>
                                </p>
                                <p>
                                    <img className='img-fluid circle-rounded mr-2 mt-3' src='assets/images/sample-user-primary-picture-6.png'/>
                                    <medium className='mt-1'><strong>First name goes here</strong>
                                    <br/>
                                    <div className='yourstoryprivacytext'>
                                    <a className='ml-5 storyprivacyeveryoneviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Everyone is selected go to your story privacy to change your privacy'><i className='bi-globe'></i> Everyone</a>
                                    <a className='ml-5 storyprivacyfriendsviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Friends is selected go to your story privacy to change your privacy'><i className='bi-people-fill'></i> Friends</a>
                                    <a className='ml-5 storyprivacyonlymeviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Private is selected go to your story privacy to change your privacy'><i className='bi-person'></i> Private</a>
                                    </div>
                                    </medium>
                                </p>
                                <hr/>
                    
                                <div className='create-photo-story-box'>
                                    <p><a className='onAddtextonphoto'><i className='bi-textarea-t'></i> <strong>Add Text</strong></a></p>
                    
                                        <div className='col-12 mx-auto mt-2 mb-1 border p-3 rounded'>
                                        <div className='row'>
                                                <p className='mb-2'><strong><large>Text color</large></strong></p>
                                                <div className='col-1 border border-3 text-center bg-dark text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-dsuccess text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-dsuccess text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                        </div>
                                        </div>
                    
                                        <div className='col-12 mx-auto mt-2 mb-1 border p-3 rounded'>
                                        <div className='row'>
                                                <p className='mb-2'><strong><large>Text background</large></strong></p>
                                                <div className='col-1 border border-3 text-center bg-dark text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-dsuccess text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-dsuccess text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                        </div>
                                        </div>
                    
                                        <div className='row mt-4'>
                                            <div className='btn-group gap-1' role='group' aria-label='Button discard and share to story'>
                                            <a className='btn btn-primary btn-sm btn-discard onClickdiscardphotostory'>Discard</a>
                                            <a className='btn btn-primary btn-sm btn-share-to-story'>Share to story</a>
                                            </div>
                                        </div>
                                </div>
                                {/*reate-text-story-box*/}
                                <div className='create-text-story-box'>
                                        <div className='form-floating'>
                                        <textarea style=' height: 180px;' className='form-control' placeholder='Start typing'></textarea>
                                        <label for='floatingTextarea'>Start typing</label>
                                        </div>
                    
                                        <div className='col-12 mx-auto mt-5 mb-1 border p-3 rounded'>
                                        <div className='row'>
                                                <p className='mb-2'><strong><large>Backgrounds</large></strong></p>
                                                <div className='col-1 border border-3 text-center bg-dark text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-dsuccess text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-danger text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-info text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-dsuccess text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-warning text-white p-3 rounded-circle mt-1 ml-1'></div>
                                                <div className='col-1 border border-3 text-center bg-success text-white p-3 rounded-circle mt-1 ml-1'></div>
                                        </div>
                                        </div>
                    
                                        <div className='row mt-3'>
                                            <div className='btn-group gap-1' role='group' aria-label='Button discard and share to story'>
                                            <a className='btn btn-primary btn-sm btn-discard onClickdiscard'>Discard</a>
                                            <a className='btn btn-primary btn-sm btn-share-to-story'>Share to story</a>
                                            </div>
                                        </div>
                                </div>
                                {/*create-text-story-box*/}
                                </div>
                                <div className='col-lg-9 right-nav-story'>
                                    <div className='position-absolute top-0 end-0 mt-4 mr-4'>
                                        <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                        <br/>
                                        <br/>
                                        <div className='mb-1'></div>
                    
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
                    
                                    
                                    <div className='container px-4'>
                                    <div className='row gx-5'>
                                        <div className='col'>
                                        <div className='p-3 border bg-light text-center create-photo-story onCreatephotostory'><p className='text-white'><i className='bi-image text-white'></i><br/>Create a photo story</p></div>
                                        </div>
                                        <div className='col'>
                                        <div className='p-3 border bg-light text-center create-text-story onCreatetextstory'><p className='text-white'><i className='bi-textarea-t text-white'></i><br/>Create a text story</p></div>
                                        </div>
                                    </div>
                    
                                    <div className='row'>
                                        {/*Previews Create text story*/}
                                        <div className='create-text-story-previews'>
                                            <strong><medium>Previews</medium></strong>
                    
                                            <div className='previews-content mt-3 mb-3 text-center'>
                                                <strong className='text-center text-white'><large>START TYPING</large></strong>
                                            </div>
                    
                                        </div>
                                        {/*Previews Create text story*/}
                    
                                        {/*Previews Create photo story*/}
                                        <div className='create-photo-story-previews'>
                                            <strong><medium>Previews</medium></strong>
                                            <a className='onClosetexttypings shadow float-end'><i className='bi-x'></i></a>
                    
                                            <div className='previews-photo-content mt-4 mb-1'>
                                            <div className='col-lg-9 mx-auto'>
                                                <div className='photo-story-uploaded rounded' id='resizable'>
                                                <div className='add-text-on-photo'>
                    
                                                    <div id='draggable' className='ui-widget-content'>
                                                        <form>
                                                                <div className='form-floating'>
                                                                <textarea style=' height: 150px;' className='form-control text-start-styping' placeholder='Start typing' id='floatingTextarea'></textarea>
                                                                <label for='floatingTextarea'>Start typing</label>
                                                                </div>
                                                        </form>
                                                    </div>
                    
                                                </div>
                                                </div>
                                            </div>
                                            </div>
                    
                                            <p className='text-center'><strong>Browse photo</strong></p>
                                        </div>
                                        {/*Previews Create photo story*/}
                    
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
