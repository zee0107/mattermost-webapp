// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';

import homeImage from 'images/homeFeed.png';
import {ModalData} from 'types/actions';
import GroupLogo from 'images/groupcover.png';

import RightSideView from 'components/right_side_view';

type Props = {
    status?: string;
    userId: string;
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
};

export default class MyGroups extends React.PureComponent<Props, State> {
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
        const {globalHeader, currentUser} = this.props;
        return (
            <div className='row'>
                <div className='col-md-8'>
                    <div className='box-middle-panel'>
                        <div className='col-12 mx-auto'>
                            <a href='/mygroups' className='onCartmarketplaceicon onMarketplace float-start'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#fff' className='bi bi-people-fill' viewBox='0 0 16 16'>
                                <path d='M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/>
                                <path fillRule='evenodd' d='M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z'/>
                                <path d='M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'/>
                            </svg></a>
                            <label className='ml-2 text-mygroups float-start mt-2 mr-5'><strong>Group</strong></label>
                            <div className='row'>
                            <div className='col mx-auto'>
                                <a className='btn onMygroupspages btn-md float-start'><label>My groups</label></a>
                                <a className='btn onMycarts btn-md float-start'><label>Suggested</label></a>
                                <a className='btn btn-md float-start onMyjoined'><label className='ml-2'>Joined</label></a>
                            </div>
                            </div>
                            <a className='float-end onCreategroups negative-margin-top'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#fff' className='bi bi-plus side-menu-align' viewBox='0 0 16 16'>
                                <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/>
                            </svg> Create</a>
                        </div>
                    </div>

                    <div className='box-middle-panel-products'>
                        <div className='joinedcontent'>
                            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                <p className='mt-4 ml-3'>
                                    <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><label>Unfollow</label></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                <p className='mt-4 ml-3'>
                                    <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><label>Unfollow</label></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                <p className='mt-4 ml-3'>
                                    <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><label>Unfollow</label></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                <p className='mt-4 ml-3'>
                                    <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><label>Unfollow</label></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                <p className='mt-4 ml-3'>
                                    <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><label>Unfollow</label></a></div></div>
                                </div>

                                </div>
                            </div>

                            </div>
                        </div>
                        
                        <div className='suggestedcontent'>
                            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                <p className='mt-4 ml-3'>
                                    <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><label>Unfollow</label></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                <p className='mt-4 ml-3'>
                                    <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><label>Unfollow</label></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid'  src={GroupLogo} alt=''/>
                                <p className='mt-4 ml-3'>
                                    <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><label>Unfollow</label></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid'  src={GroupLogo} alt=''/>
                                <p className='mt-4 ml-3'>
                                    <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><label>Unfollow</label></a></div></div>
                                </div>

                                </div>
                            </div>

                            </div>
                        </div>

                        <div className='mygroupcontent'>
                            <div className='col-md-12'>
                                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                                    <div className='col-md-4 p-1'>
                                        <div className='box-each-groups'>
                                        <img width='100%' className='img-fluid'  src={GroupLogo} alt=''/>
                                        <p className='mt-4 ml-3'>
                                            <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                        </p>

                                        <div className='d-flex text-center'>
                                            <div className='col-6 mt-2 mb-3 mr-2'><a className='btn-sm onEditgroups'><label>Edit</label></a></div>
                                            <div className='col-6 mt-2 mb-3'><a className='btn-sm onDeletegroups'><label>Delete</label></a></div>
                                        </div>

                                        </div>
                                    </div>

                                    <div className='col-md-4 p-1'>
                                        <div className='box-each-groups'>
                                        <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                        <p className='mt-4 ml-3'>
                                            <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                                        </p>

                                        <div className='d-flex text-center'>
                                            <div className='col-6 mt-2 mb-3 mr-2'><a className='btn-sm onEditgroups'><label>Edit</label></a></div>
                                            <div className='col-6 mt-2 mb-3'><a className='btn-sm onDeletegroups'><label>Delete</label></a></div>
                                        </div>

                                        </div>
                                    </div>

                                    <div className='col-md-4 p-1'>
                                        <div className='box-each-groups'>
                                        <img width='100%' className='img-fluid'  src={GroupLogo} alt=''/>
                                        <p className='mt-4 ml-3'>
                                            <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>1.5M Members</label>
                                        </p>

                                        <div className='d-flex text-center'>
                                            <div className='col-6 mt-2 mb-3 mr-2'><a className='btn-sm onEditgroups'><label>Edit</label></a></div>
                                            <div className='col-6 mt-2 mb-3'><a className='btn-sm onDeletegroups'><label>Delete</label></a></div>
                                        </div>

                                        </div>
                                    </div>

                                    <div className='col-md-4 p-1'>
                                        <div className='box-each-groups'>
                                        <img width='100%' className='img-fluid'  src={GroupLogo} alt=''/>
                                        <p className='mt-4 ml-3'>
                                            <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>5K Members</label>
                                        </p>

                                        <div className='d-flex text-center'>
                                            <div className='col-6 mt-2 mb-3 mr-2'><a className='btn-sm onEditgroups'><label>Edit</label></a></div>
                                            <div className='col-6 mt-2 mb-3'><a className='btn-sm onDeletegroups'><label>Delete</label></a></div>
                                        </div>

                                        </div>
                                    </div>

                                    <div className='col-md-4 p-1'>
                                        <div className='box-each-groups'>
                                        <img width='100%' className='img-fluid'  src={GroupLogo} alt=''/>
                                        <p className='mt-4 ml-3'>
                                            <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>5K Members</label>
                                        </p>

                                        <div className='d-flex text-center'>
                                            <div className='col-6 mt-2 mb-3 mr-2'><a className='btn-sm onEditgroups'><label>Edit</label></a></div>
                                            <div className='col-6 mt-2 mb-3'><a className='btn-sm onDeletegroups'><label>Delete</label></a></div>
                                        </div>

                                        </div>
                                    </div>

                                    <div className='col-md-4 p-1'>
                                        <div className='box-each-groups'>
                                        <img width='100%' className='img-fluid'  src={GroupLogo} alt=''/>
                                        <p className='mt-4 ml-3'>
                                            <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>5K Members</label>
                                        </p>

                                        <div className='d-flex text-center'>
                                            <div className='col-6 mt-2 mb-3 mr-2'><a className='btn-sm onEditgroups'><label>Edit</label></a></div>
                                            <div className='col-6 mt-2 mb-3'><a className='btn-sm onDeletegroups'><label>Delete</label></a></div>
                                        </div>

                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <RightSideView/>
                </div>
            </div>
        );
    }
}
