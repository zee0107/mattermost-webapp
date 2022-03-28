// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';

import homeImage from 'images/homeFeed.png';
import {ModalData} from 'types/actions';

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
                            <a className='onCartmarketplaceicon onMarketplace float-start'><i className='bi-people-fill'></i></a>
                            <h6 className='ms-2 text-mygroups float-start mt-2 me-5'><strong>Group</strong></h6>
                            <div className='row'>
                            <div className='col mx-auto'>
                                <a className='btn onMygroupspages btn-md float-start'><h6>My groups</h6></a>
                                <a className='btn onMycarts btn-md float-start'><h6>Suggested</h6></a>
                                <a className='btn btn-md float-start onMyjoined'><h6 className='ms-2'>Joined</h6></a>
                            </div>
                            </div>
                            <a className='float-end rounded onCreategroups' style=' margin:-39px 0px 0px 0px;'>
                            <i className='bi-plus'></i> Create</a>
                        </div>
                    </div>

                    <div className='box-middle-panel-products'>
                        <div className='joinedcontent'>
                            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/suggestedcover4.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><h6>Unfollow</h6></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/suggestedcover3.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><h6>Unfollow</h6></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/suggestedcover2.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><h6>Unfollow</h6></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/suggestedcover1.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><h6>Unfollow</h6></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/joined1.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><h6>Unfollow</h6></a></div></div>
                                </div>

                                </div>
                            </div>

                            </div>
                        </div>
                        
                        <div className='suggestedcontent'>
                            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/suggestedcover1.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><h6>Unfollow</h6></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/suggestedcover2.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><h6>Unfollow</h6></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/suggestedcover3.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><h6>Unfollow</h6></a></div></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/suggestedcover4.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><h6>Unfollow</h6></a></div></div>
                                </div>

                                </div>
                            </div>

                            </div>
                        </div>

                        <div className='mygroupcontent'>
                            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/groupcover1.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><h6>Edit</h6></a></div>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><h6>Delete</h6></a></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/groupcover2.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><h6>Edit</h6></a></div>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><h6>Delete</h6></a></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/groupcover3.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>1.5M Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><h6>Edit</h6></a></div>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><h6>Delete</h6></a></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                <img width='100%' className='img-fluid' src='assets/images/groupcover4.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>5K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><h6>Edit</h6></a></div>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><h6>Delete</h6></a></div>
                                </div>

                                </div>
                            </div>

                            </div>

                            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                            <div className='col p-1'>
                                <div className='box-each-products'>
                                <img width='100%' className='img-fluid' src='assets/images/groupcover5.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><h6>Edit</h6></a></div>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><h6>Delete</h6></a></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-products'>
                                <img width='100%' className='img-fluid' src='assets/images/groupcover6.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>95K Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><h6>Edit</h6></a></div>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><h6>Delete</h6></a></div>
                                </div>

                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-products'>
                                <img width='100%' className='img-fluid' src='assets/images/groupcover7.png' alt=''/>
                                <p className='mt-4 ms-3'>
                                    <h4 className='text-name-products'><strong>Lorem Ipsum</strong></h4><br/><h5 className='text-count-members'>1.5M Members</h5>
                                </p>

                                <div className='row'>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><h6>Edit</h6></a></div>
                                    <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><h6>Delete</h6></a></div>
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
