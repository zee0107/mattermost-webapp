// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import {getShortenedURL,cleanUpUrlable} from 'utils/url';

import logoDark from 'images/logoBlack.png';
import HeaderImage from 'images/Page-dummy-cover.png';
import ModalInfoImage from 'images/Page-dummy-cover-informations.png';
import profPic from 'images/profiles/user-profile-1.png';
import Constants from 'utils/constants';

type Props = {
    userId: string;
    profilePicture: string;
    currentUser: UserProfile;
    teamId: string;
}

type State = {
    isDark: string;
    pageName: string;
    pageDisplayName: string;
    pageCategory: string;
    pageDescription: string;
    pageHeader: string;

    preview: boolean;
    displayNameError: boolean;
};

export default class CreatePage extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = { isDark:'light', preview: false,pageName: '', pageDisplayName: '', pageCategory: '', pageDescription: '', pageHeader: '', };
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
    }

    handleChangeName = (e) => {
        this.setState({pageName: e.target.value});
    }

    handleChangeCategory = (e) => {
        this.setState({pageCategory: e.target.value});
    }

    handleChangeDescription = (e) => {
        this.setState({pageDescription: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const pageNameValue = this.state.pageName;
        if (pageNameValue.length < Constants.MIN_CHANNELNAME_LENGTH) {
            this.setState({displayNameError: true});
            return;
        }

        this.onSubmit();
    }

    onSubmit = () => {
        if (!this.state.channelDisplayName) {
            this.setState({serverError: Utils.localizeMessage('channel_flow.invalidName', 'Invalid Channel Name')});
            return;
        }

        const {actions} = this.props;
        const channel: Channel = {
            team_id: this.props.teamId,
            name: this.state.pageName,
            display_name: this.state.channelDisplayName,
            purpose: this.state.channelPurpose,
            header: this.state.channelHeader,
            type: this.state.channelType,
            create_at: 0,
            creator_id: '',
            delete_at: 0,
            group_constrained: false,
            id: '',
            last_post_at: 0,
            last_root_post_at: 0,
            scheme_id: '',
            update_at: 0,
        };

        actions.createChannel(channel).then(({data, error}) => {
            if (error) {
                this.onCreateChannelError(error);
            } else if (data) {
                //browserHistory.push('./mygroups');
                this.setState({group_view: 'mygroups', result_create: true});
            }
        });
    };
   
    render= (): JSX.Element => {
        const {pageName, pageDescription, pageCategory, preview} = this.state;

        let name, desc, category, view;
        if(pageName){
            name = pageName;
        }else{
            name = 'Page name';
        }

        if(pageDescription){
            desc = pageDescription;
        }else{
            desc = 'Description';
        }

        if(pageCategory){
            category = pageCategory;
        }else{
            category = 'Category';
        }

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
                                    <a className='onGetstartedcreatepage' data-bs-toggle='modal' data-bs-target='#GetStarted'><i className='bi-info-circle bi-info-circle-style'  data-bs-toggle='tooltip' data-bs-placement='bottom' title='Get started'></i></a></div>
                                </div>
                                <form>
                                    <p className='mt-1'><label>Page information</label></p>
                                    <div>
                                        <div className='row g-1'>
                                            <div className='col-12'>
                                            <input type='text' className='form-control' placeholder='Page name (Required)' onChange={this.handleChangeName} value={pageName} aria-label='Page name (Required)'/>
                                            <p><small>Use the name of your business, brand or organization, or a name that explains what the Page is about. <a>Learn more</a></small></p>
                                            </div>
                                        </div>

                                        <div className='row g-1'>
                                            <div className='col-12'>
                                            <input type='text' className='form-control' placeholder='Category (Required)' onChange={this.handleChangeCategory} value={pageCategory} aria-label='Category (Required)'/>
                                            <p><small>Choose a category that describes what type of business, organization or topic the Page represents.</small></p>
                                            </div>
                                        </div>

                                        <div className='row g-1'>
                                            <div className='col-12'>
                                            <div className='form-floating'>
                                                <textarea style={{height: 135, border: '1px solid #ccc'}} onChange={this.handleChangeDescription} value={pageDescription} className='form-control' placeholder='Description'></textarea>
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

                            <div className='col-lg-8 right-nav-story'>
                                <div className={preview === true ? 'col-6 mx-auto mt-4 border border-1 p-4 rounded my-page-desktop-mobile-view' : 'col-12 mx-auto mt-4 border border-1 p-4 rounded my-page-desktop-mobile-view'}>
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
                                                <div className='col-lg-9 pt-5'>
                                                <h1 className='mt-5'>{name}</h1>
                                                <label>{category}</label>
                                                </div>
                                            </div>
                                            </div>
                                        </div>

                                        <div className='mypagepreviews-mobile'>
                                            <div className='mypageheadingpreviews'>
                                            <div className='row'>
                                                <div className='col-12 text-center'>
                                                <div className='col-5 mx-auto rounded-circle rounded-circle-photo border border-5'><i className='bi-flag-fill bi-flag-fill-style text-white'></i></div>
                                                </div>
                                                <div className='col-lg-12 text-center'>
                                                <h4 className='mt-3'>{name}</h4>
                                                <label>{category}</label>
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
                                                    <p><i className='bi-info-circle-fill info-circle-fill-style'></i> {desc}</p>
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
                                                        <p><i className='bi-info-circle-fill info-circle-fill-style'></i> {desc}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                

                                <div className='photo-and-albums-menu-mobile'>
                                    {/*<div className='position-absolute top-0 start-50 translate-middle-x mt-3'>
                                        <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                    </div>
                                    <div className='position-absolute top-0 start-50 translate-middle-x mt-3' style={{margin:'0px 0px 0px 61px'}}>
                                        <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                        <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                    </div>*/}
                                    <div className='position-absolute top-0 start-50 translate-middle-x mt-1' style={{margin:'0px 0px 0px -61px'}}>
                                        <div className='d-flex'>
                                            <a className='onStoryprofilesettings' id='defaultDropdown' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                                            <ul className='dropdown-menu' aria-labelledby='dropdownMenuOffset'>
                                            <li><a className='dropdown-item' href='profile.html'><i className='bi-person'></i> Profile</a></li>
                                            <li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                            <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>
                                            <li><a className='dropdown-item onSettingsandprivacy'><i className='bi-gear-wide'></i> Settings & Privacy</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-1'>
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
                                            <a className='onStoryprofilesettings' id='defaultDropdown' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                                            <ul className='dropdown-menu' aria-labelledby='dropdownMenuOffset'>
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

                <div className='modal getstarted' id='GetStarted' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-lg modal-dialog-center' role='document'>
                        <div className='modal-content' style={{background: 'transparent', border: 'transparent'}}>
                            <div className='modal-body'>
                                <div className='getstarted-information-desktop'>
                                    <div className='col-10 mx-auto mt-5'>
                                        <div className='row'>
                                            <div className='getstartedheader rounded shadow' style={{backgroundImage: `url(${ModalInfoImage})`,backgroundPosition: 'center'}}>
                                                <p className='p-3'><a className='onClosegetstarted shadow float-end' style={{zIndex: 99}} data-bs-dismiss='modal'><i className='bi-x'></i></a></p>
                                                <div className='row'>
                                                    <div className='col-10'></div>
                                                    <div className='col-2 text-center'></div>
                                                </div>
                                                </div>
                                                <div className='getstartedheaderinfo p-5 shadow'>
                                                    <h3 className='mb-3'>Create My Page</h3>
                                                    <p><i className='bi-flag bi-flag-style'></i> A page is a space where people can everyone connect with your business, personal brand or organization.</p>
                                                    <p><i className='bi-box-seam bi-box-seam-style'></i> You can do things like showcase products and services, collect donations and create ads.</p>
                                                    <p><i className='bi-people-fill bi-people-fill-style'></i> Millions of people discover and connect with Pages every day.</p>
                                                    <div className='d-grid'>
                                                        <button type='button' className='btn-primary onCreatemypage' data-bs-dismiss='modal'>Get Started</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        
                                    <div className='getstarted-information-mobile'>
                                        <div className='col-10 mx-auto mt-5'>
                                            <div className='row'>
                                                <div className='getstartedheader rounded shadow' style={{backgroundImage: `url(${ModalInfoImage})`,backgroundPosition: 'center'}}>
                                                <p className='p-3'><a className='onClosegetstarted shadow float-end' style={{zIndex: 99}} data-bs-dismiss='modal'><i className='bi-x'></i></a></p>
                                                <div className='row'>
                                                    <div className='col-10'></div>
                                                    <div className='col-2 text-center'>

                                                    </div>
                                                </div>
                                                </div>
                                                <div className='getstartedheaderinfo p-5 shadow'>
                                                    <h3 className='mb-3'>Create My Page</h3>
                                                    <p><i className='bi-flag bi-flag-style'></i> A page is a space where people can everyone connect with your business, personal brand or organization.</p>
                                                    <p><i className='bi-box-seam bi-box-seam-style'></i> You can do things like showcase products and services, collect donations and create ads.</p>
                                                    <p><i className='bi-people-fill bi-people-fill-style'></i> Millions of people discover and connect with Pages every day.</p>
                                                    <div className='d-grid'>
                                                        <button type='button' className='btn-primary onCreatemypage' data-bs-dismiss='modal'>Get Started</button>
                                                </div>
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
