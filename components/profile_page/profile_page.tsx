// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import deferComponentRender from 'components/deferComponentRender';
import PostView from 'components/post_view_new';
import EditPostModal from 'components/edit_post_modal';

import homeImage from 'images/homeFeed.png';
import coverImage from 'images/cover-photo.png';
import profPic from 'images/profiles/user-profile-1.png';
import ImgIcon from 'images/profiles/image.svg';
import LayoutIcon from 'images/profiles/columns-gap.svg';
import MusicIcon from 'images/profiles/music-note-beamed.svg';
import VideoIcon from 'images/profiles/camera-video.svg';
import GeoIcon from 'images/profiles/geo-alt.svg';
import AttachIcon from 'images/profiles/paperclip.svg';
import GlobeIcon from 'images/icon-global2.png';
import SmileIcon from 'images/emoji-smile-fill.svg';
import xIcon from 'images/x.svg';
import postImage from 'images/post-1.png';
import postPic from 'images/profiles/user-profile-2.png';
import completion from 'images/profiles/completion.png';
import ShareMobile from 'images/icon-share2.png';
import GlobeMobile from 'images/icon-globe2.png';
import VideoMobile from 'images/icon-cideo-camera.png';
import DoneIcon from 'images/profiles/done.svg';
import UndoneIcon from 'images/profiles/undone.svg';
import styled from 'styled-components';

import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import PostModal from 'components/user_settings/modal_post/post_modal';
import CreatePostProfile from 'components/create_post_profile';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';
import ChannelHeaderMobile from 'components/channel_header_mobile';

import Sidebar from 'components/sidebar';
import SidebarRight from 'components/sidebar_right';
import SidebarRightMenu from 'components/sidebar_right_menu';
import { CssFontSource } from '@stripe/stripe-js';
import { toggleRHSPlugin } from 'actions/views/rhs';

type Props = {
    status?: string;
    userId: string;
    coverPhoto: Promise<string>;
    profilePicture: string;
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
    lhsOpen: boolean;
    rhsOpen: boolean;
    rhsMenuOpen: boolean;
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
    coverUrl: string;
    completionResult: number;
    currentUser: UserProfile;
    uploading: boolean;
    deferredPostView: any;
    userLocation: string;
    userActivity: string;
    shareInfo: string;
    feeling: boolean;
};

export default class ProfilPage extends React.PureComponent<Props, State> {
    public static createDeferredPostView = () => {
        return deferComponentRender(
            PostView,
            <div
                id='post-list'
                className='a11y__region'
                data-a11y-sort-order='1'
                data-a11y-focus-child={true}
                data-a11y-order-reversed={false}
            />,
        );
    }

    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {feeling: true,userActivity: '',userLocation: '',shareInfo: 'everyone',openUp: false,width: 0,isStatusSet: false,isDark:'light',img_path: homeImage,completionResult: 0,uploading: false,deferredPostView: ProfilPage.createDeferredPostView()};
        
        this.onChangeShareInfo = this.onChangeShareInfo.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onChangeActivity = this.onChangeActivity.bind(this);
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.coverPhoto != null){
            Promise.resolve(this.props.coverPhoto).then(value => this.setState({coverUrl: value}));
        }

        if(this.state.coverUrl === undefined || this.state.coverUrl === 'unavailable' || this.state.coverUrl === ''){
            this.setState({coverUrl: coverImage});
        }
        console.log(this.props.userId);
        this.getCompletionRate();
    }

    componentDidUpdate(){
        this.getCompletionRate();
    }

    getCompletionRate = () =>{
        const { profilePicture, currentUser} = this.props;
        let result = 0;
        if(profilePicture.includes('image?')){
            result += 25;
        }
        else{
            if(result >= 25){
                result -= 25;
            }
        }

        if(currentUser.position !== '' && currentUser.position !== null){
            result += 25;
        }
        else{
            if(result >= 25){
                result -= 25;
            }
        }

        if(currentUser.first_name !== '' && currentUser.first_name !== '' && currentUser.first_name !== null && currentUser.first_name !== null){
            result += 25;
        }
        else{
            if(result >= 25){
                result -= 25;
            }
        }

        this.setState({completionResult: result});
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

    onChangeShareInfo = (event) => {
        this.setState({shareInfo: event.target.value});
    }

    onChangeLocation = (event) => {
        this.setState({userLocation: event.target.value});
    }

    onChangeActivity = (event) => {
        this.setState({userActivity: event.target.value});
    }

    renderProfilePictureText = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
                text='plain'
            />
        );
    }

    closeModal = () => {
        this.setState({uploading: false});
    }

    render= (): JSX.Element => {
        const {globalHeader, currentUser, profilePicture} = this.props;
        const { coverUrl,completionResult, uploading, shareInfo, userLocation, feeling} = this.state;

        let photoAvailable;
        let nameAvailable;
        let locationAvailable;
        let shareInfoBtn;
        let shareInfoDd;
        let location;
        let feelact;
        let feelactView;
        let WorkspaceAvailable = (<img className='bg-check-arrow-plus rounded-circle' src={UndoneIcon} alt=''/>);
        
        let textValue;
        let icon;
        if(this.state.userActivity !== null && this.state.userActivity !== ''){
            const activityValue = this.state.userActivity.split('&');
            textValue = activityValue[0];
            icon = String.fromCodePoint(activityValue[1].substring(1, activityValue[1].length - 1));
            feelact = (
                <a href='#' className='feelingspost text-primary'><small className='text-muted'>is feeling {textValue}</small> {icon}&nbsp;</a>
            );
        }

        if(feeling){
            feelactView = (
                <div className='feelingscontent'>
                    <div className='input-group d-flex mb-0'>
                        <span className='input-group-text input-search-crypter-span p-2' id='basic-addon1'><i className='bi-search'></i></span>
                        <input id='searchFeelings' type='text' className='form-control form-control-dark input-search-crypter p-5' placeholder='Search' aria-label='Search'/>
                    </div>
    
                    <div className='row mt-3'>
                        {this.state.userActivity && <a className='feelingspost onClosefeelingsviews ml-4 p-2' style={{ border: '1px solid grey', borderRadius: 8}} onClick={() => {this.setState({userActivity: ''});}}><label className='text-primary'>{textValue} {icon}<i className='bi-x-lg'></i></label></a>}
                    </div>
    
                    <div id='searchfeelings'>
                        <div className='d-flex mt-3'>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1 onFeelingselect' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Grinning face &#128512;'}); }}>&#128512;</label> <br /> <small>Grinning face</small></p> 
                        </div>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Smiling eyes &#128513;'}); }}>&#128513;</label> <br /> <small>Smiling eyes</small></p>
                        </div>
                        </div>
    
                        <div className='d-flex'>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Tears of joy &#128514;'}); }}>&#128514;</label> <br /> <small>Tears of joy</small></p> 
                        </div>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Open mouth &#128515;'}); }}>&#128515;</label> <br /> <small>Open mouth</small></p> 
                        </div>
                        </div>
    
                        <div className='d-flex'>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Smilling eyes &#128516;'}); }}>&#128516;</label> <br /> <small>Smiling eyes</small></p> 
                        </div>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Cold sweat &#128517;'}); }}>&#128517;</label> <br /> <small>Cold sweat</small></p>
                        </div>
                        </div>
    
                        <div className='d-flex'>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Tightly closed eye &#128518;'}); }}>&#128518;</label> <br /> <small>Tightly closed eye</small></p>
                        </div>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Smiling with halo &#128519;'}); }}>&#128519;</label> <br /> <small>Smiling with halo</small></p>
                        </div>
                        </div>
                    </div>
    
                </div>
            );
        }
        else{
            feelactView = (
                <div className='activitiescontent'>
                    <div className='input-group d-flex mb-0'>
                        <span className='input-group-text input-search-crypter-span p-2' id='basic-addon1'><i className='bi-search'></i></span>
                        <input id='searchActivities' type='text' className='form-control form-control-dark input-search-crypter p-5' placeholder='Search' aria-label='Search'/>
                    </div>
    
                    <div className='row mt-3 mb-3'>
                        {this.state.userActivity && <a className='activitiespost onCloseactivitiessviews ml-4 p-2' style={{ border: '1px solid grey', borderRadius: 8}} onClick={() => {this.setState({userActivity: ''});}}><label className='text-primary'>{textValue} {icon}<i className='bi-x-lg'></i></label></a>}
                    </div>
    
                    <div id='searchactivities'>
                        <div className='d-flex mt-1'>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1 onActivitiesselect' style={{border: '1px solid grey', borderRadius: 8,}} onClick={() => { this.setState({userActivity: 'Loving &#128151;'}); }}><label style={{fontSize: 20}}>&#128151;</label> <br /> <small>Loving</small></p> 
                        </div>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Face screaming in fear &#128561;'}); }}>&#128561;</label> <br /> <small>Face screaming in fear</small></p> 
                        </div>
                        </div>
    
                        <div className='d-flex mt-1'>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1 onFeelingselect' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Astonished face &#128562;'}); }}>&#128562;</label> <br /> <small>Astonished face</small></p>
                        </div>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Sleeping face &#128564;'}); }}>&#128564;</label> <br /> <small>Sleeping face</small></p>
                        </div>
                        </div>
    
                        <div className='d-flex mt-1'>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1 onFeelingselect' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Dizzy face &#128565;'}); }}>&#128565;</label> <br /> <small>Dizzy face</small></p>
                        </div>
                        <div className='col-md-6 width-50 text-center'>
                            <p className='border p-1' style={{border: '1px solid grey', borderRadius: 8,}}><label style={{fontSize: 20}} onClick={() => { this.setState({userActivity: 'Face with medical mask &#128567;'}); }}>&#128567;</label> <br /> <small>Face with medical mask</small></p>
                        </div>
                        </div>
                    </div>
                </div>
            );
        }

        if(userLocation !== null && userLocation !== ''){
            location = (<a href='#' className='locationviewpost text-primary'><small className='text-muted'> is in</small> {userLocation}</a> );
        }

        if(shareInfo === 'private'){
            shareInfoBtn = (<button className='box-live-post btn-sm width-100' data-toggle='modal' data-target='#staticBackdropShare'><i className='bi bi-person-fill'></i> Private <i className='bi bi-chevron-down'></i></button>);
            shareInfoDd = (<a className='onSelectactiononlyme text-primary' data-toggle='modal' data-target='#staticBackdropShare' data-dismiss='modal'><i className='bi-person-fill'></i> Private <i className='bi-chevron-down'></i></a>);
        }else if(shareInfo === 'friends'){
            shareInfoBtn = (<button className='box-live-post btn-sm width-100' data-toggle='modal' data-target='#staticBackdropShare'><i className='bi bi-people-fill'></i> Friends <i className='bi bi-chevron-down'></i></button>);
            shareInfoDd = (<a className='onSelectactionfriends text-primary' data-toggle='modal' data-target='#staticBackdropShare' data-dismiss='modal'><i className='bi-people-fill'></i> Friends <i className='bi-chevron-down'></i></a>);
        }else{
            shareInfoBtn = (<button className='box-live-post btn-sm width-100' data-toggle='modal' data-target='#staticBackdropShare'><i className='bi bi-globe'></i> Everyone <i className='bi bi-chevron-down'></i></button>);
            shareInfoDd = (<a className='onSelectactionpublic text-primary' data-toggle='modal' data-target='#staticBackdropShare' data-dismiss='modal'><i className='bi-globe'></i> Everyone <i className='bi-chevron-down'></i></a>);
        }

        if(currentUser.first_name !== '' && currentUser.first_name !== '' && currentUser.first_name !== null && currentUser.first_name !== null){
            nameAvailable = (<img className='bg-check-arrow rounded-circle' src={DoneIcon} alt=''/>);
        }
        else{
            nameAvailable = (<img className='bg-check-arrow-plus rounded-circle' src={UndoneIcon} alt=''/>);
        }

        if (currentUser.position !== '' && currentUser.position !== null){
            locationAvailable = (<img className='bg-check-arrow rounded-circle' src={DoneIcon} alt=''/>);
        }
        else{
            locationAvailable = (<img className='bg-check-arrow-plus rounded-circle' src={UndoneIcon} alt=''/>);
        }

        if (profilePicture.includes('image?')){
            photoAvailable = (<img className='bg-check-arrow rounded-circle' src={DoneIcon} alt=''/>);
        }
        else{
            photoAvailable = (<img className='bg-check-arrow-plus rounded-circle' src={UndoneIcon} alt=''/>);
        }

        let completionView;
        if(completionResult < 100){
            completionView = (
                <div className='box-left-panel-egzo'>
                    <div className='d-flex completion-box-bg'>
                        <div className='d-flex completion-text width-100'>
                            <div className='col-lg-9 width-100'>
                                 <h5>Profile Completion</h5>
                            </div> 
                            <div className='col-lg-3'>
                                <h4 className='competion-text-percent'>{completionResult}%</h4>
                            </div>
                        </div>
                        <img src={completion} className='completion-img' height='50' width={`${completionResult}%`}></img>
                    </div>
                    <ul className='list-group p-3'>
                        <li className='list-group-item border-transparent'>{photoAvailable} <label className='ms-2'>Add Your Photo</label></li>
                        <li className='list-group-item border-transparent'>{nameAvailable} <label className='ms-2'>Add Your Name</label></li>
                        <li className='list-group-item border-transparent'>{WorkspaceAvailable} <label className='ms-2'>Add Your Workspace</label></li>
                        <li className='list-group-item border-transparent'>{locationAvailable} <label className='ms-2'>Add Your Address</label></li>
                    </ul>
                </div>
            );
        }

        const DeferredPostView = this.state.deferredPostView;

        return (
            <div>
                <SidebarRight topLevel={70}/>
                <div className='profile-header-desktop'>
                    <section id='profile' className='profile-views'>
                        <div className='container'>
                            <div
                                className='box-top-profile-verion text-center'
                                style={{background: `Url(${coverUrl}) no-repeat center bottom #222222`}}
                            >
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='blur-effects text-white'>
                                            <div className='row'>
                                                <div className='p-0'>
                                                    <div className='col-md-12'>
                                                        {this.renderProfilePictureText('mxl')}
                                                        <ToggleModalButtonRedux
                                                            id='accountSettings'
                                                            aria-label='Profile'
                                                            modalId={ModalIdentifiers.USER_SETTINGS}
                                                            dialogType={UserSettingsModal}
                                                            dialogProps={{isContentProductSettings: false}}
                                                            className={'float-end onEditclicks mt-1'}
                                                            showUnread={false}
                                                        >
                                                            Edit
                                                        </ToggleModalButtonRedux>
                                                        <h4 className='float-start ml-2 mt-2 name-query-style text-white'>{`${currentUser.first_name} ${currentUser.last_name}`}</h4>
                                                        <br />
                                                        <br />
                                                        <h5 className='float-start ml-2 little-medium-text name-quuery-at text-white'>{'@' + currentUser.username}</h5>
                                                        <br />
                                                        <h5 className='float-start ml-2 little-medium-text text-muted'>{currentUser.position}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-8'>
                                        <div className='row'>
                                            <div className='col-md-4'></div>
                                            <div className='col-md-8'>
                                                <div className='row'>
                                                    <div className='col-md-3 mt-5 text-center text-white'><p></p><br /><h4><label></label></h4></div>
                                                    <div className='col-md-3 mt-5 text-center text-white'><p>Posts<br /></p><h4><label>2.6K</label></h4></div>
                                                    <div className='col-md-3 mt-5 text-center text-white'><p>Following<br /></p><h4><label>561</label></h4></div>
                                                    <div className='col-md-3 mt-5 text-center text-white'><p>Followers<br /></p><h4><label>16.2K</label></h4></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='blur-effects-menu-heading'>
                                            <div className='p-0'>
                                                <div className='row'>
                                                    <div className='col-md-2'>
                                                    <a className='float-start mr-5 ml-5'><img width='18' src={LayoutIcon} /></a></div>
                                                    <div className='col-md-2'>
                                                    <a className='float-start mr-5 ml-5'><img width='18' src={ImgIcon} /></a></div>
                                                    <div className='col-md-2'>
                                                    <a className='float-start mr-5 ml-5'><img width='18' src={VideoIcon} /></a></div>
                                                    <div className='col-md-2'>
                                                    <a className='float-md-start mr-5 ml-5'><img width='18' src={MusicIcon} /></a></div>
                                                    <div className='col-md-2'>
                                                    <a className='float-md-start mr-5 ml-5'><img width='18' src={AttachIcon} /></a></div>
                                                    <div className='col-2'>
                                                    <a className='float-md-start mr-5 ml-5'><img width='18' src={GeoIcon} /></a></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className='profile-header-mobile'>
                    <section id='profile-mobile' className='profile-views'>
                            <div className='container-fluid'>
                            <div
                                className='box-top-profile-mobile text-center'
                                style={{background: `Url(${coverUrl}) no-repeat center bottom #222222`}}
                            >
                                    <div className='row'>
                                        <div className='col-md-10 mx-auto'>
                                        <div className='blur-effects-mobile text-white'>
                                            <div className='row'>
                                                <div className='col-lg-3 text-center'>
                                                    {this.renderProfilePicture('xxl')}
                                                </div>
                                                <div className='col-lg-5 text-center'>
                                                    <h3 className='name-query-mobile-style text-white'>{`${currentUser.first_name} ${currentUser.last_name}`}</h3>
                                                    <h4 className='hash-name text-white'>{'@' + currentUser.username}</h4>
                                                    <h4 className='little-medium-text name-quuery-at text-muted'>{currentUser.position}</h4>
                                                    <br />
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className='d-grid w-50 mx-auto'>
                                                        <ToggleModalButtonRedux
                                                            id='accountSettings'
                                                            aria-label='Profile'
                                                            modalId={ModalIdentifiers.USER_SETTINGS}
                                                            dialogType={UserSettingsModal}
                                                            dialogProps={{isContentProductSettings: false}}
                                                            className={'onEditclicks mt-1'}
                                                            showUnread={false}
                                                        >
                                                            Edit
                                                        </ToggleModalButtonRedux>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-10 mx-auto mt-3 mb-1'>
                                        <div className='d-flex'>
                                            <div className='col-md-4 text-center text-white width-100'><p>Posts</p><br /><h4><strong>0</strong></h4></div>
                                            <div className='col-md-4 text-center text-white width-100'><p>Following</p><br /><h4><strong>0</strong></h4></div>
                                            <div className='col-md-4 text-center text-white width-100'><p>Followers</p><br /><h4><strong>0</strong></h4></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className='container'>
                    <div className='col-lg-12 removePadding'>
                        <div className='row'>
                            <div className='col-lg-8'>
                                <div className='box-middle-panel crypter-section-profile-desktop'>
                                    <div className='row'>
                                        <div className='col-md-5 text-center removePaddingRight'>
                                            <div className='d-flex input-group float-start width-100'>
                                                <span className='input-group-text input-search-crypter-whats-going-on' id='basic-addon22'>
                                                    {this.renderProfilePicture('md')}</span>
                                                <input type='text' className='form-control input-search-crypter-whats-going-on onCreatepost mt-1' placeholder={`What's going on, ${currentUser.first_name} ${currentUser.last_name}`} aria-label={`What's going on, ${currentUser.first_name} ${currentUser.last_name}`} aria-describedby='basic-addon55' data-toggle='modal' data-target='#staticBackdrop'/>
                                                <span className='input-group-text input-search-crypter-whats-going-on onPhotoaddpost mt-1' onClick={() => {this.setState({uploading: true});}} id='basic-addon33' data-toggle='modal' data-target='#staticBackdrop'>
                                                    <a href='#'><svg width='21' height='21' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                        <path d='M13.7555 4.41165H11.7685L10.6215 3.15802H6.86061V4.41165H10.0699L11.217 5.66527H13.7555V13.187H3.72656V7.54571H2.47293V13.187C2.47293 13.8765 3.03706 14.4406 3.72656 14.4406H13.7555C14.445 14.4406 15.0092 13.8765 15.0092 13.187V5.66527C15.0092 4.97578 14.445 4.41165 13.7555 4.41165ZM5.60699 9.42614C5.60699 11.1561 7.01105 12.5602 8.74105 12.5602C10.4711 12.5602 11.8751 11.1561 11.8751 9.42614C11.8751 7.69614 10.4711 6.29208 8.74105 6.29208C7.01105 6.29208 5.60699 7.69614 5.60699 9.42614ZM8.74105 7.54571C9.77529 7.54571 10.6215 8.3919 10.6215 9.42614C10.6215 10.4604 9.77529 11.3066 8.74105 11.3066C7.70681 11.3066 6.86061 10.4604 6.86061 9.42614C6.86061 8.3919 7.70681 7.54571 8.74105 7.54571ZM3.72656 4.41165H5.60699V3.15802H3.72656V1.27759H2.47293V3.15802H0.592499V4.41165H2.47293V6.29208H3.72656V4.41165Z' fill='var(--text-primary)'/>
                                                    </svg></a></span>
                                                <span className='input-group-text input-search-crypter-whats-going-on onEmoji p-2 mt-1' id='basic-addon44' data-toggle='modal' data-target='#staticBackdropAct'>
                                                    <a href='#'><svg width='18' height='18' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                        <path d='M8.75 7.875C8.75 8.10706 8.65781 8.32962 8.49372 8.49372C8.32962 8.65781 8.10706 8.75 7.875 8.75C7.64294 8.75 7.42038 8.65781 7.25628 8.49372C7.09219 8.32962 7 8.10706 7 7.875C7 7.64294 7.09219 7.42038 7.25628 7.25628C7.42038 7.09219 7.64294 7 7.875 7C8.10706 7 8.32962 7.09219 8.49372 7.25628C8.65781 7.42038 8.75 7.64294 8.75 7.875V7.875ZM13.125 8.75C13.3571 8.75 13.5796 8.65781 13.7437 8.49372C13.9078 8.32962 14 8.10706 14 7.875C14 7.64294 13.9078 7.42038 13.7437 7.25628C13.5796 7.09219 13.3571 7 13.125 7C12.8929 7 12.6704 7.09219 12.5063 7.25628C12.3422 7.42038 12.25 7.64294 12.25 7.875C12.25 8.10706 12.3422 8.32962 12.5063 8.49372C12.6704 8.65781 12.8929 8.75 13.125 8.75V8.75ZM1.75 5.25C1.75 4.32174 2.11875 3.4315 2.77513 2.77513C3.4315 2.11875 4.32174 1.75 5.25 1.75H15.75C16.6783 1.75 17.5685 2.11875 18.2249 2.77513C18.8812 3.4315 19.25 4.32174 19.25 5.25V13.125C19.2502 13.24 19.2277 13.3539 19.1839 13.4602C19.1401 13.5665 19.0757 13.6631 18.9945 13.7445L13.7445 18.9945C13.6631 19.0757 13.5665 19.1401 13.4602 19.1839C13.3539 19.2277 13.24 19.2502 13.125 19.25H5.25C4.32174 19.25 3.4315 18.8812 2.77513 18.2249C2.11875 17.5685 1.75 16.6783 1.75 15.75V5.25ZM5.25 3.5C4.78587 3.5 4.34075 3.68437 4.01256 4.01256C3.68437 4.34075 3.5 4.78587 3.5 5.25V15.75C3.5 16.2141 3.68437 16.6592 4.01256 16.9874C4.34075 17.3156 4.78587 17.5 5.25 17.5H10.5V14.0175H10.493C9.3065 14.0175 8.442 13.419 7.91175 12.8852C7.59864 12.5698 7.33015 12.213 7.11375 11.8247L7.09975 11.7985L7.09625 11.7897L7.0945 11.7862L7.09275 11.7845C6.99319 11.5745 6.98115 11.3335 7.05925 11.1146C7.13736 10.8957 7.29923 10.7168 7.50925 10.6172C7.71927 10.5177 7.96023 10.5056 8.17913 10.5838C8.39804 10.6619 8.57694 10.8237 8.6765 11.0337C8.80777 11.2579 8.9665 11.4649 9.149 11.6497C9.492 11.9927 9.9365 12.2675 10.493 12.2675C10.6679 12.2677 10.8417 12.2394 11.0075 12.1835C11.62 11.1737 12.7312 10.5 14 10.5H17.5V5.25C17.5 4.78587 17.3156 4.34075 16.9874 4.01256C16.6592 3.68437 16.2141 3.5 15.75 3.5H5.25ZM17.5 12.25H14C13.5359 12.25 13.0908 12.4344 12.7626 12.7626C12.4344 13.0908 12.25 13.5359 12.25 14V17.5H12.7627L17.5 12.7627V12.25Z' fill='var(--text-primary)'/>
                                                    </svg></a>
                                                </span>
                                            </div>
                                        </div>
                                        <div className='col-md-3'><div className='d-grid'>
                                            {shareInfoBtn}</div></div>
                                            <div className='col-md-2'><div className='d-grid'><button className='box-live-post btn-sm width-100' onClick={() => { this.setState({uploading: true});}} aria-describedby='basic-addon1010' data-toggle='modal' data-target='#staticBackdrop'><svg xmlns='http://www.w3.org/2000/svg' width='19' height='19' fill='var(--text-primary)' className='bi bi-camera-video side-menu-align' viewBox='0 0 16 16'>
                                                    <path fillRule='evenodd' d='M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z' fill='var(--text-primary)'/>
                                                    </svg> Live</button></div>
                                            </div>
                                            <div className='col-md-2'><div className='d-grid'><button className='box-button-share btn-sm text-white onCreatepost width-100' aria-describedby='basic-addon99' data-toggle='modal' data-target='#staticBackdrop'>Share</button></div>
                                        </div>
                                    </div>
                                </div>
                                <div id='post-mobile'>
                                    {completionView}
                                    <div className='d-flex'>
                                        <div className='whats-going-on-here-style float-start'>
                                            <div className='input-group d-flex bg-inputs-whats'>
                                                <span className='input-group-text input-search-crypter-whats-going-on' id='basic-addon22'>
                                                {this.renderProfilePicture('md')}</span>
                                                <input type='text' className='form-control input-search-crypter-whats-going-on onCreatepost mt-1' placeholder={`What's going on, ${currentUser.first_name} ${currentUser.last_name}`} aria-label={`What's going on, ${currentUser.first_name} ${currentUser.last_name}`} aria-describedby='basic-addon55' data-toggle='modal' data-target='#staticBackdrop' />
                                                <span className='input-group-text input-search-crypter-whats-going-on onPhotoaddpost mt-1' onClick={() => { this.setState({uploading: true});}} aria-describedby='basic-addon1011' data-toggle='modal' data-target='#staticBackdrop'>
                                                    <a href='#'><svg width='21' height='21' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                        <path d='M13.7555 4.41165H11.7685L10.6215 3.15802H6.86061V4.41165H10.0699L11.217 5.66527H13.7555V13.187H3.72656V7.54571H2.47293V13.187C2.47293 13.8765 3.03706 14.4406 3.72656 14.4406H13.7555C14.445 14.4406 15.0092 13.8765 15.0092 13.187V5.66527C15.0092 4.97578 14.445 4.41165 13.7555 4.41165ZM5.60699 9.42614C5.60699 11.1561 7.01105 12.5602 8.74105 12.5602C10.4711 12.5602 11.8751 11.1561 11.8751 9.42614C11.8751 7.69614 10.4711 6.29208 8.74105 6.29208C7.01105 6.29208 5.60699 7.69614 5.60699 9.42614ZM8.74105 7.54571C9.77529 7.54571 10.6215 8.3919 10.6215 9.42614C10.6215 10.4604 9.77529 11.3066 8.74105 11.3066C7.70681 11.3066 6.86061 10.4604 6.86061 9.42614C6.86061 8.3919 7.70681 7.54571 8.74105 7.54571ZM3.72656 4.41165H5.60699V3.15802H3.72656V1.27759H2.47293V3.15802H0.592499V4.41165H2.47293V6.29208H3.72656V4.41165Z' fill='var(--text-primary)'/>
                                                    </svg></a></span>
                                                <span className='input-group-text input-search-crypter-whats-going-on onEmoji p-2 mt-1' id='basic-addon45' data-toggle='modal' data-target='#staticBackdropAct'>
                                                    <a href='#'><svg width='18' height='18' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                        <path d='M8.75 7.875C8.75 8.10706 8.65781 8.32962 8.49372 8.49372C8.32962 8.65781 8.10706 8.75 7.875 8.75C7.64294 8.75 7.42038 8.65781 7.25628 8.49372C7.09219 8.32962 7 8.10706 7 7.875C7 7.64294 7.09219 7.42038 7.25628 7.25628C7.42038 7.09219 7.64294 7 7.875 7C8.10706 7 8.32962 7.09219 8.49372 7.25628C8.65781 7.42038 8.75 7.64294 8.75 7.875V7.875ZM13.125 8.75C13.3571 8.75 13.5796 8.65781 13.7437 8.49372C13.9078 8.32962 14 8.10706 14 7.875C14 7.64294 13.9078 7.42038 13.7437 7.25628C13.5796 7.09219 13.3571 7 13.125 7C12.8929 7 12.6704 7.09219 12.5063 7.25628C12.3422 7.42038 12.25 7.64294 12.25 7.875C12.25 8.10706 12.3422 8.32962 12.5063 8.49372C12.6704 8.65781 12.8929 8.75 13.125 8.75V8.75ZM1.75 5.25C1.75 4.32174 2.11875 3.4315 2.77513 2.77513C3.4315 2.11875 4.32174 1.75 5.25 1.75H15.75C16.6783 1.75 17.5685 2.11875 18.2249 2.77513C18.8812 3.4315 19.25 4.32174 19.25 5.25V13.125C19.2502 13.24 19.2277 13.3539 19.1839 13.4602C19.1401 13.5665 19.0757 13.6631 18.9945 13.7445L13.7445 18.9945C13.6631 19.0757 13.5665 19.1401 13.4602 19.1839C13.3539 19.2277 13.24 19.2502 13.125 19.25H5.25C4.32174 19.25 3.4315 18.8812 2.77513 18.2249C2.11875 17.5685 1.75 16.6783 1.75 15.75V5.25ZM5.25 3.5C4.78587 3.5 4.34075 3.68437 4.01256 4.01256C3.68437 4.34075 3.5 4.78587 3.5 5.25V15.75C3.5 16.2141 3.68437 16.6592 4.01256 16.9874C4.34075 17.3156 4.78587 17.5 5.25 17.5H10.5V14.0175H10.493C9.3065 14.0175 8.442 13.419 7.91175 12.8852C7.59864 12.5698 7.33015 12.213 7.11375 11.8247L7.09975 11.7985L7.09625 11.7897L7.0945 11.7862L7.09275 11.7845C6.99319 11.5745 6.98115 11.3335 7.05925 11.1146C7.13736 10.8957 7.29923 10.7168 7.50925 10.6172C7.71927 10.5177 7.96023 10.5056 8.17913 10.5838C8.39804 10.6619 8.57694 10.8237 8.6765 11.0337C8.80777 11.2579 8.9665 11.4649 9.149 11.6497C9.492 11.9927 9.9365 12.2675 10.493 12.2675C10.6679 12.2677 10.8417 12.2394 11.0075 12.1835C11.62 11.1737 12.7312 10.5 14 10.5H17.5V5.25C17.5 4.78587 17.3156 4.34075 16.9874 4.01256C16.6592 3.68437 16.2141 3.5 15.75 3.5H5.25ZM17.5 12.25H14C13.5359 12.25 13.0908 12.4344 12.7626 12.7626C12.4344 13.0908 12.25 13.5359 12.25 14V17.5H12.7627L17.5 12.7627V12.25Z' fill='var(--text-primary)'/>
                                                    </svg></a>
                                                </span>
                                            </div>
                                        </div>
                                        <div className='button-share-camera-globe'>
                                            <div className='d-flex'>
                                            <div className='col-md-4 text-center mt-3'>
                                                <a className='onSelectactionfriendsdesktop'><img width='24' className='mt-1' src={GlobeMobile} /></a></div>
                                            <div className='col-md-4 text-center mt-3'>
                                                <a className='onPhotoaddpost' onClick={() => { this.setState({uploading: true});}} aria-describedby='basic-addon1011' data-toggle='modal' data-target='#staticBackdrop'><img width='24' className='mt-1' src={VideoMobile} /></a></div>
                                            <div className='col-md-4 text-center mt-3'>
                                                <a className='onCreatepost' data-toggle='modal' data-target='#staticBackdrop'><img width='24' className='mt-1' src={ShareMobile} /></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='mtop-20'>
                                    <DeferredPostView
                                        //channelId='kqe4sihhdid47gprhk6dwbuc4o'
                                        channelId='dodurztr1fbupnpenjgxqjso3a'
                                        focusedPostId={''}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-4' id='rsvDesktop'>
                                {completionView}
                                <div className='col-lg-12 chat-box removePadding mtop-10'>
                                    <div className='d-flex'>
                                        <div className='col-lg-4 width-100'>
                                            <div className='d-flex'>
                                                <div className='col-sm-3'>
                                                    <h4>
                                                        <a href='#' title='Personal Chat'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='var(--text-primary)' className='bi bi-person' viewBox='0 0 16 16'>
                                                            <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z'/>
                                                        </svg></a>
                                                    </h4>
                                                </div>
                                                <div className='col-sm-3'>
                                                    <h4>
                                                        <a href='#' title='Group Chat'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='var(--text-primary)' className='bi bi-people' viewBox='0 0 16 16'>
                                                            <path d='M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'/>
                                                        </svg></a>
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-4 width-100 text-center'>
                                            <h4 className='getStartPrimaryText'>Chat</h4>
                                        </div>
                                        <div className='col-lg-4 width-100 chat-setting'>
                                            <h4><a href='#' title='Settings'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='var(--text-primary)' className='bi bi-gear' viewBox='0 0 16 16'>
                                                <path d='M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z'/>
                                                <path d='M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z'/>
                                            </svg></a>
                                            </h4>
                                        </div>
                                    </div>
                                    <br />
                                    <div className='col-lg-12 chat-hover removePadding'>
                                        <div className='d-flex'>
                                            <div className='col-lg-3 marginTopImg'>
                                                <img src={profPic} className='chat-img'></img>
                                            </div>
                                            <div className='col-lg-9 width-100 removePaddingLeft'>
                                                <div className='d-flex'>
                                                    <div className='col-sm-6 width-100 removePaddingLeft'>
                                                        <h6 className='getStartPrimaryText'>Allysa Kate</h6>
                                                    </div>
                                                    <div className='col-sm-6 removePaddingLeft chat-text'>
                                                        <h6 className='getStartPrimaryText'>Today, 12:04</h6>
                                                    </div>
                                                </div>
                                                <h6 className='getSecondaryText'>A Facebook-like platform...</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-12 chat-hover removePadding'>
                                        <div className='d-flex'>
                                            <div className='col-lg-3 marginTopImg'>
                                                <img src={profPic} className='chat-img'></img>
                                            </div>
                                            <div className='col-lg-9 width-100 removePaddingLeft'>
                                                <div className='d-flex'>
                                                    <div className='col-sm-6 width-100 removePaddingLeft'>
                                                        <h6 className='getStartPrimaryText'>Mark Olympus</h6>
                                                    </div>
                                                    <div className='col-sm-6 removePaddingLeft chat-text'>
                                                        <h6 className='getStartPrimaryText'>Today, 12:04</h6>
                                                    </div>
                                                </div>
                                                <h6 className='getSecondaryText'>A Facebook-like platform...</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-12 chat-hover removePadding'>
                                        <div className='d-flex'>
                                            <div className='col-lg-3 marginTopImg'>
                                                <img src={profPic} className='chat-img'></img>
                                            </div>
                                            <div className='col-lg-9 width-100 removePaddingLeft'>
                                                <div className='d-flex'>
                                                    <div className='col-sm-6 width-100 removePaddingLeft'>
                                                        <h6 className='getStartPrimaryText'>Janine Tenoso</h6>
                                                    </div>
                                                    <div className='col-sm-6 removePaddingLeft chat-text'>
                                                        <h6 className='getStartPrimaryText'>Today, 12:04</h6>
                                                    </div>
                                                </div>
                                                <h6 className='getSecondaryText'>A Facebook-like platform...</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='modal postcontent' id='staticBackdrop' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='form'>
                                <div className='modal-header'>
                                    <h6 className='modal-title'>Create post</h6>
                                    <a className='btn-close-canvas shadow onClosecreatepost float-end' data-dismiss='modal' aria-label='Close' onClick={() => {this.setState({uploading: false});}}><img src={xIcon}/></a>
                                </div>

                                <div className='modal-body'>
                                    <div className='row'>
                                        <div className='col-md-2 text-center'>
                                            {this.renderProfilePicture('xl')}
                                        </div>
                                        <div className='col-md-10 text-left'>
                                            <strong>
                                                <a href='#' className='text-primary'>{currentUser.first_name} {currentUser.last_name}</a> 
                                                {feelact}
                                                {location}
                                                {/*<a href='#' className='tagviewpost text-primary'><small className='text-muted'>with</small> Friend name goes here</a> 
                                                <a href='#' className='activities text-primary'><small className='text-muted'>Activities</small> &#128151;</a>*/}
                                            </strong>
                                            <br />
                                            {shareInfoDd}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-12 mt-3'>
                                            <CreatePostProfile uploading={this.state.uploading} userActivity={this.state.userActivity} userLocation={this.state.userLocation} shareInfo={this.state.shareInfo} />
                                        </div>
                                    </div>
                                    <div className='post-music-content'>
                                        <div className='container'>
                                            <div className='row'>
                                                <div className='col-md-2 text-left'><img width='50px' className='rounded' src='assets/images/Cover-album.jpg' alt='Cover album' /></div>
                                                <div className='col-md-8 mt-0'>
                                                <label className='ms-3'><strong>Lovely</strong></label>
                                                <p className='ms-3'><small>Eric Godlow</small></p>
                                                </div>
                                                <div className='col-md-2 mt-0'>
                                                <a className='onClosemusicpost float-end'><i className='bi-x'></i></a>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <label className='mb-2'><strong>Lyrics:</strong> <br /><br /> What a wonderful world is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. <br /><br /> when an unknown printer took a galley of type and scrambled it to make a type specimen book.</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='modal tagfriends' id='staticBackdropTag' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>Tag people</h6>
                                <a className='onBacktotag float-end' data-toggle='modal' data-target='#staticBackdrop' data-dismiss='modal' aria-label='Close'><i className='bi-arrow-left-circle'></i></a>
                            </div>
                            <div className='modal-body'>
                                <div className='input-group d-flex mb-0'>
                                    <span className='input-group-text input-search-crypter-span p-2' id='basic-addon1'><i className='bi-search'></i></span>
                                   <input id='searchforFriends' type='text' className='form-control form-control-dark input-search-crypter p-5' placeholder='Search for friend' aria-label='Search for friend'/>
                                </div>
                    
                                <div className='row mt-3'>
                                    <a href='#' className='tagviewpost onUntag'>Friend name goes here <i className='bi-x-lg'></i></a>
                                </div>
                    
                                <div id='searchforfriends'>
                                    <div className='row mt-3'>
                                        <div className='col-md-10'>
                                            <p><img width='40px' className='img-fluid' src={profPic} /> Analyn Natividad</p>
                                        </div>
                                        <div className='col-md-2'>
                                                <div className='form-check mt-2 float-end'>
                                                    <input className='form-check-input onTagfriends' type='checkbox' value=''/>
                                                </div>
                                        </div>
                                    </div>
                                    <div className='row mt-0'>
                                        <div className='col-md-10'>
                                            <p><img width='40px' className='img-fluid' src={profPic} /> Mark Tristan</p>
                                        </div>
                                        <div className='col-md-2'>
                                            <div className='form-check mt-2 float-end'>
                                                <input className='form-check-input' type='checkbox' value='' id='flexCheckDefault2'/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row mt-0'>
                                        <div className='col-md-10'>
                                            <p><img width='40px' className='img-fluid' src={profPic} /> Dysania Marie</p>
                                        </div>
                                        <div className='col-md-2'>
                                            <div className='form-check mt-2 float-end'>
                                                <input className='form-check-input' type='checkbox' value='' id='flexCheckDefault3'/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row mt-0'>
                                        <div className='col-md-10'>
                                            <p><img width='40px' className='img-fluid' src={profPic} /> Jason Born</p>
                                        </div>
                                        <div className='col-md-2'>
                                            <div className='form-check mt-2 float-end'>
                                                <input className='form-check-input' type='checkbox' value='' id='flexCheckDefault3'/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row mt-0'>
                                        <div className='col-md-10'>
                                            <p><img width='40px' className='img-fluid' src={profPic} /> John Doe</p>
                                        </div>
                                        <div className='col-md-2'>
                                            <div className='form-check mt-2 float-end'>
                                                <input className='form-check-input' type='checkbox' value='' id='flexCheckDefault2'/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='modal selectlocation' id='staticBackdropLoc' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>Search for location</h6>
                                <a className='onBacktolocation float-end' data-toggle='modal' data-target='#staticBackdrop' data-dismiss='modal' aria-label='Close'><i className='bi-arrow-left-circle'></i></a>
                            </div>
                            <div className='modal-body'>
                                <div className=''>
                                    <div className='input-group d-flex mb-0'>
                                    <span className='input-group-text input-search-crypter-span p-2' id='basic-addon1'><i className='bi-search'></i></span>
                                    <input id='searchLocations' type='text' className='form-control form-control-dark input-search-crypter p-5' placeholder='Where are you?' aria-label='Where are you?'/>
                                </div>
                
                                <div className='row mt-3 mb-4'>
                                    {this.state.userLocation && <a className='locationviewpost onUnselectlocation ml-4 p-2' style={{ border: '1px solid grey', borderRadius: 8}} onClick={() => {this.setState({userLocation: ''});}}><label className='text-primary'>{this.state.userLocation} <i className='bi-x-lg'></i></label></a>}
                                </div>
                
                                <div id='searchforlocations'>
                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 width-100'>
                                        <label className='onAddlocation'>Muntinlupa City</label>
                                        <p><small>Muntinlupa City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input onAddlocation' type='radio' name='locationRadios' value='Muntinlupa City' onChange={this.onChangeLocation} id='locationRadios4' />
                                                <label className='form-check-label' htmlFor='locationRadios4'></label>
                                            </div>
                                        </div>
                                    </div>
                
                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 width-100'>
                                        <label>Makati City</label>
                                        <p><small>Makati City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input' type='radio' name='locationRadios' value='Makati City' onChange={this.onChangeLocation} id='locationRadios5' />
                                                <label className='form-check-label' htmlFor='locationRadios5'></label>
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 width-100'>
                                        <label>Taguig City</label>
                                        <p><small>Taguig City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input' type='radio' name='locationRadios' value='Taguig City' onChange={this.onChangeLocation} id='locationRadios6' />
                                                <label className='form-check-label' htmlFor='locationRadios6'></label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 width-100'>
                                        <label>Santa Rosa City</label>
                                        <p><small>Santa Rosa City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input' type='radio' name='locationRadios' value='Santa Rosa City' onChange={this.onChangeLocation} id='locationRadios7' />
                                                <label className='form-check-label' htmlFor='locationRadios6'></label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='d-flex'>
                                        <div className='col-md-2 text-center'><i className='bi-geo-alt'></i></div>
                                        <div className='col-md-8 width-100'>
                                        <label>San Pedro City</label>
                                        <p><small>San Pedro City Philippines</small></p>
                                        </div>
                                        <div className='col-md-2 text-center'>
                                            <div className='form-check mt-3'>
                                                <input className='form-check-input' type='radio' name='locationRadios' value='San Pedro City' onChange={this.onChangeLocation} id='locationRadios8' />
                                                <label className='form-check-label' htmlFor='locationRadios6'></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal selectemoticons' id='staticBackdropAct' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h6 className='modal-title' id='staticBackdropLabel'>How are you feeling?</h6>
                            <a className='onBacktoemoticons float-end' data-toggle='modal' data-target='#staticBackdrop' data-dismiss='modal' aria-label='Close'><i className='bi-arrow-left-circle'></i></a>
                        </div>
            
                        <div className='modal-body'>
                            <div>
                                <div className='d-flex mt-1 mb-4 gap-1'>
                                    <div className='col-md-3 text-center rounded p-1 mr-2' style={{border: '1px solid grey', borderRadius: 8}}>
                                    <a className='onFeelings text-primary' onClick={() => { this.setState({feeling: true});}}><small> Feelings</small></a></div>
                                    <div className='col-md-3 text-center rounded p-1' style={{border: '1px solid grey', borderRadius: 8}}>
                                    <a className='onActivities text-primary' onClick={() => { this.setState({feeling: false});}}><small> Activities</small></a></div>
                                </div>
                            </div>
                            {feelactView}
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal selectaudience' id='staticBackdropShare' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h6 className='modal-title' id='staticBackdropLabel'>Select audience</h6>
                            <a className='onBacktopost float-end' data-toggle='modal' data-target='#staticBackdrop' data-dismiss='modal' aria-label='Close'><i className='bi-arrow-left-circle'></i></a>
                        </div>

                        <div className='modal-body'>
                            <div className='row'>
                                <div className='col-md-10'>Everyone</div>
                                <div className='col-md-2'>
                                    <div className='form-check float-end'>
                                        <input className='form-check-input onPublicselect' type='radio' name='flexRadioDefault' value='everyone' onChange={this.onChangeShareInfo} checked={this.state.shareInfo === 'everyone'} id='flexRadioPublicselect'/>
                                        <label className='form-check-label' htmlFor='flexRadioPublicselect'></label>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-2'>
                                <div className='col-md-10'>Friends</div>
                                <div className='col-md-2'>
                                    <div className='form-check float-end'>
                                            <input className='form-check-input onFriendselect' type='radio' name='flexRadioDefault' value='friends' onChange={this.onChangeShareInfo} checked={this.state.shareInfo === 'friends'} id='flexRadioFriendselect'/>
                                            <label className='form-check-label' htmlFor='flexRadioFriendselect'></label>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-2'>
                                <div className='col-md-10'>Private</div>
                                <div className='col-md-2'>
                                    <div className='form-check float-end'>
                                            <input className='form-check-input onOnlyme' type='radio' name='flexRadioDefault' value='private' onChange={this.onChangeShareInfo} checked={this.state.shareInfo === 'private'} id='flexRadioOnlyme'/>
                                            <label className='form-check-label' htmlFor='flexRadioOnlyme'></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditPostModal/>
        </div>
        );
    }
}
