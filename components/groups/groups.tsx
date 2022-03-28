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
                <div className='col-md-9'>
                    <div className='joinedcontent'>
                        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>
                                    
                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onUnfollowsuggested'><small>Unfollow</small></a></div></div>
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
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-12 mb-3 p-3'>
                                        <div className='d-grid'><a className='btn btn-sm onFollowsuggested'><small>Unfollow</small></a></div></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    
                    <div className='mygroupcontent'>
                        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><small>Edit</small></a></div>
                                        <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><small>Delete</small></a></div>
                                    </div>
                                </div>
                            </div>

                            {/*<div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>95K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><small>Edit</small></a></div>
                                        <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><small>Delete</small></a></div>
                                    </div>
                                </div>
                            </div>

                            <div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>1.5M Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><small>Edit</small></a></div>
                                        <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><small>Delete</small></a></div>
                                    </div>

                                </div>
                            </div>*/}

                            {/*<div className='col p-1'>
                                <div className='box-each-groups'>
                                    <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                    <p className='mt-4 ms-3'>
                                    <large className='text-name-products'><strong>Lorem Ipsum</strong></large><br/><medium className='text-count-members'>5K Members</medium>
                                    </p>

                                    <div className='row'>
                                        <div className='col-6 mt-2 mb-3'><a className='btn-sm float-end onEditgroups'><small>Edit</small></a></div>
                                        <div className='col-6 mt-2 mb-3'><a className='btn-sm float-start onDeletegroups'><small>Delete</small></a></div>
                                    </div>
                                </div>
                            </div>*/}
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <RightSideView/>
                </div>
            </div>
        );
    }
}
