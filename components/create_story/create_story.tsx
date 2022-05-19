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
};

export default class CreateStory extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {photoStory: false,textStory: false, openUp: false, width: 0, isStatusSet: false, isDark:'light'};
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

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        const { photoStory, textStory } = this.state;

        let sidePhotoMenu;
        let sideTextMenu;
        let photoPreview;
        let textPreview;
        if(photoStory){
            sidePhotoMenu = (
                <div className='create-photo-story-box'>
                    <p><a className='onAddtextonphoto'><i className='bi-textarea-t'></i> <strong>Add Text</strong></a></p>
                    <div className='col-12 mx-auto mt-2 mb-1 border p-3 rounded'>
                        <div className='row'>
                                <p className='mb-2'><strong><label>Text color</label></strong></p>
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
                                <p className='mb-2'><strong><label>Text background</label></strong></p>
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
                        <a className='btn btn-primary btn-discard onClickdiscardphotostory' onClick={() => { this.setState({photoStory: false,textStory: false});}}>Discard</a>
                        <a className='btn btn-primary btn-share-to-story'>Share to story</a>
                    </div>
                </div>
            </div>
            );

            photoPreview = (
                <>
                    {/*Previews Create photo story*/}
                    <div className='create-photo-story-previews'>
                        <strong><label>Previews</label></strong>
                        <a className='onClosetexttypings shadow float-end'><i className='bi-x'></i></a>
                        <div className='previews-photo-content mt-4 mb-1'>
                            <div className='col-lg-9 mx-auto'>
                                <div style={{ backgroundImage: `url(${postImage})`}} className='photo-story-uploaded rounded' id='resizable'>
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
                    {/*Previews Create photo story*/}
                </>
            )
        }

        if(textStory){
            sideTextMenu = (
                <div className='create-text-story-box'>
                    <div className='form-floating'>
                        <textarea style={{height: 180,}} className='form-control' placeholder='Start typing'></textarea>
                        <label htmlFor='floatingTextarea'>Start typing</label>
                        </div>

                        <div className='col-12 mx-auto mt-5 mb-1 border p-3 rounded'>
                        <div className='row'>
                                <p className='mb-2'><strong><label>Backgrounds</label></strong></p>
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
                            <a className='btn btn-primary btn-discard onClickdiscard' onClick={() => { this.setState({photoStory: false,textStory: false});}}>Discard</a>
                            <a className='btn btn-primary btn-share-to-story'>Share to story</a>
                            </div>
                        </div>
                </div>
            );

            textPreview = (
                <>
                    {/*Previews Create text story*/}
                    <div className='create-text-story-previews'>
                        <strong><label>Previews</label></strong>

                        <div className='previews-content mt-3 mb-3 text-center'>
                            <strong className='text-center text-white'><label>START TYPING</label></strong>
                        </div>

                    </div>
                    {/*Previews Create text story*/}
                </>
            );
        }
        let rightNav;
        if(!photoStory && !textStory){
            rightNav = (
                <div className='row gx-5'>
                    <div className='col' onClick={() => { this.setState({photoStory: true,textStory: false});}}>
                        <div className='p-3 border bg-light text-center create-photo-story onCreatephotostory'><p className='text-white'><i className='bi-image text-white'></i><br/>Create a photo story</p></div>
                    </div>
                    <div className='col' onClick={() => { this.setState({photoStory: false,textStory: true});}}>
                        <div className='p-3 border bg-light text-center create-text-story onCreatetextstory'><p className='text-white'><i className='bi-textarea-t text-white'></i><br/>Create a text story</p></div>
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className='slidebarStory'>
                    <div className='col-md-12'>
                        <form>
                            <div className='row'>
                    
                                <div className='col-lg-2 border-end p-4'>
                                <p><img className='img-fluid mt-2' src={logoDark} alt='logo' title='logo'/><a href='/crypter/towm-square' className='float-end mt-1 onClickclosestory'><i className='bi-x-circle-fill'></i></a></p>
                                <div>
                                    <h2 className='mt-4'>Your Story <a className='onStoryprivacy float-end' data-bs-toggle='tooltip' data-bs-placement='top' title='Story privacy'><i className='bi-gear'></i></a></h2>
                                </div>
                                <div>
                                    {this.renderProfilePicture('xl')}
                                    {/*<img className='img-fluid circle-rounded mr-2 mt-3' src='assets/images/sample-user-primary-picture-6.png'/>*/}
                                    <label className='mt-1'><strong>{currentUser.first_name}</strong>
                                    <br/>
                                    <div className='yourstoryprivacytext'>
                                    <a className='ml-5 storyprivacyeveryoneviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Everyone is selected go to your story privacy to change your privacy'><i className='bi-globe'></i> Everyone</a>
                                    <a className='ml-5 storyprivacyfriendsviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Friends is selected go to your story privacy to change your privacy'><i className='bi-people-fill'></i> Friends</a>
                                    <a className='ml-5 storyprivacyonlymeviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Private is selected go to your story privacy to change your privacy'><i className='bi-person'></i> Private</a>
                                    </div>
                                    </label>
                                </div>
                                <hr/>
                                {sidePhotoMenu}
                                {sideTextMenu}
                                </div>
                                <div className='col-lg-10 right-nav-story'>
                                    <div className='position-absolute top-0 end-0 mt-4 mr-4'>
                                        {/*<a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                        <br/>
                                        <br/>
                                        <div className='mb-1'></div>*/}
                    
                                        <div className='d-flex'>
                                        <a className='onStoryprofilesettings' id='defaultDropdown' id='dropdownMenuOffset' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                    
                                        <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuOffset'>
                                            <li><a className='dropdown-item' href='profile.html'><i className='bi-person'></i> Profile</a></li>
                                            {/*<li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                            <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>*/}
                                            <li><a className='dropdown-item onSettingsandprivacy'><i className='bi-gear-wide'></i> Sign out</a></li>
                                        </ul>
                    
                                        </div>
                                    </div>
                    
                                    
                                    <div className='container px-4'>
                                        {rightNav}
                                        <div className='row'>
                                            {textPreview}
                                            {photoPreview}
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
