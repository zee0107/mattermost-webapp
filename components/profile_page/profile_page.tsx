// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import classNames from 'classnames';

import homeImage from 'images/homeFeed.png';
import coverImage from 'images/cover-photo.png';
import profPic from 'images/profiles/user-profile-1.png'
import ImgIcon from 'images/profiles/image.svg';
import LayoutIcon from 'images/profiles/columns-gap.svg';
import MusicIcon from 'images/profiles/music-note-beamed.svg';
import VideoIcon from 'images/profiles/camera-video.svg';
import GeoIcon from 'images/profiles/geo-alt.svg';
import AttachIcon from 'images/profiles/paperclip.svg';
import SplitIcon from 'images/profiles/menu-icon.svg';
import DoneIcon from 'images/profiles/done.svg';
import UndoneIcon from 'images/profiles/undone.svg';
import postImage from 'images/post-1.png';
import postPic from 'images/profiles/user-profile-2.png';
import completion from 'images/profiles/completion.png';

import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';
import ChannelHeaderMobile from 'components/channel_header_mobile';

import Sidebar from 'components/sidebar';
import SidebarRight from 'components/sidebar_right';
import SidebarRightMenu from 'components/sidebar_right_menu';

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
    coverUrl:string;
};

export default class ProfilPage extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
        /*status: UserStatuses.OFFLINE,*/
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            openUp: false,
            width: 0,
            isStatusSet: false,
            isDark:'light',
            img_path: homeImage,
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.coverPhoto != null){
            Promise.resolve(this.props.coverPhoto).then(value => this.setState({coverUrl: value}));
        }
    }

    componentDidUpdate(){

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


    render= (): JSX.Element => {
        const {globalHeader, currentUser} = this.props;
        const { coverUrl } = this.state;

        let coverImg;
        if(coverUrl !== undefined && coverUrl !== 'unavailable' && coverUrl !== ''){
            coverImg = (<img className='img-cover' src={coverUrl}></img>);
        }
        else{
            coverImg = (<img className='img-cover' src={coverImage}></img>);
        }

        return (
            <div className='profile-header-desktop'>
                <section id='profile' className='profile-views'>
                    <div className='container'>
                        <div className='box-top-profile-verion text-center'>
                            <div className='row'>
                                <div className='col-4'>
                                    <div className='blur-effects text-white'>
                                        <div className='row'>
                                            <div className='p-0'>
                                                <div className='col-12'>
                                                    <p>
                                                        {this.renderProfilePictureText('xl')}
                                                        <ToggleModalButtonRedux
                                                            id='accountSettings'
                                                            ariaLabel='Profile'
                                                            modalId={ModalIdentifiers.USER_SETTINGS}
                                                            dialogType={UserSettingsModal}
                                                            dialogProps={{isContentProductSettings: false}}
                                                            className={'float-end onEditclicks mt-1'}
                                                            showUnread={false}
                                                        >
                                                            Edit
                                                        </ToggleModalButtonRedux>
                                                        <label className='float-start ml-2 name-query-style'>{`${currentUser.first_name} ${currentUser.last_name}`}</label>
                                                        <br/>
                                                        <br/>
                                                        <label className='float-start ml-2 little-medium-text name-quuery-at small'>{'@' + currentUser.username}</label>
                                                        <br/>
                                                        <label className='float-start ml-2 little-medium-text text-muted small'>{currentUser.position}</label>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-8'>
                                    <div className='row'>
                                        <div className='col-4'></div>
                                        <div className='col-8'>
                                            <div className='row'>
                                                <div className='col-md-3 mt-5 text-center text-white'><p><br/><h5><label></label></h5></p></div>
                                                <div className='col-md-3 mt-5 text-center text-white'><p>Posts<br/><h5><label>2.6K</label></h5></p></div>
                                                <div className='col-md-3 mt-5 text-center text-white'><p>Following<br/><h5><label>561</label></h5></p></div>
                                                <div className='col-md-3 mt-5 text-center text-white'><p>Followers<br/><h5><label>16.2K</label></h5></p></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='blur-effects-menu-heading'>
                                        <div className='p-0'>
                                            <div className='row'>
                                                <div className='col-md-2'>
                                                <a className='float-start mr-5 ml-5'><img width='18' src='https://crypter.polywickstudio.ph/static/files/72d2138889140c51526aefce3a272ee0.svg' /></a></div>
                                                <div className='col-md-2'>
                                                <a className='float-start mr-5 ml-5'><img width='18' src='https://crypter.polywickstudio.ph/static/files/9ce1d2fa6e5f663e97224a4488d62884.svg' /></a></div>
                                                <div className='col-md-2'>
                                                <a className='float-start mr-5 ml-5'><img width='18' src='https://crypter.polywickstudio.ph/static/files/d90345991a9eaf243edaa2187adb064c.svg' /></a></div>
                                                <div className='col-md-2'>
                                                <a className='float-md-start mr-5 ml-5'><img width='18' src='https://crypter.polywickstudio.ph/static/files/7daf35f1d65ac32e86296b9afc8035b7.svg' /></a></div>
                                                <div className='col-md-2'>
                                                <a className='float-md-start mr-5 ml-5'><img width='18' src='https://crypter.polywickstudio.ph/static/files/7b6de3c9cc5c5a75fd7fef23f015c50a.svg' /></a></div>
                                                <div className='col-2'>
                                                <a className='float-md-start mr-5 ml-5'><img width='18' src='https://crypter.polywickstudio.ph/static/files/3b737edeb663be203dfa275d031717fc.svg' /></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
