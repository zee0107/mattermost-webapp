// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import deferComponentRender from 'components/deferComponentRender';
import PostView from 'components/post_view_new';

import homeImage from 'images/homeFeed.png';
import coverImage from 'images/cover-photo.png';

import {ModalData} from 'types/actions';

import { RequestList, SocialCount } from 'mattermost-redux/types/crypto';

type Props = {
    status?: string;
    userId: string;
    coverPhoto: Promise<string>;
    profilePicture: string;
    profilePictureLoggedin: string;
    autoResetPref?: string;
    actions: {
        openModal: <P>(modalData: ModalData<P>) => void;
        setStatus: (status: UserStatus) => ActionFunc;
        unsetCustomStatus: () => ActionFunc;
        setStatusDropdown: (open: boolean) => void;
        onFollowRequest: (user_id: string, friend_id: string) => void;
        onAcceptRequest: (request_id: string) => void;
        onUnfollowUser: (user_id: string, friend_id: string) => void;
        onCancelRequest: (request_id: string) => void;
    };
    socialCount: Promise<SocialCount>;
    customStatus?: UserCustomStatus;
    userData: UserProfile;
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
    followData?: Promise<RequestList>;
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
    socialCount: SocialCount;
    followData: RequestList;
    followStatus: number;
};

export default class RequestListsNf extends React.PureComponent<Props, State> {
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

    static defaultProps = {userId: '',profilePicture: '',profilePictureLoggedin: '',}

    constructor(props: Props) {
        super(props);
        this._isMounted = false;
        this.state = {followStatus: 0,postValues:[],listId:[],feeling: true,userActivity: '',userLocation: '',shareInfo: 'everyone',openUp: false,width: 0,isStatusSet: false,isDark:'light',img_path: homeImage,completionResult: 0,uploading: false};

        this.handleFollow = this.handleFollow.bind(this);
        this.handleAccept = this.handleAccept.bind(this);
        this.handleCancelRequest = this.handleCancelRequest.bind(this);
        this.handleUnfollow = this.handleUnfollow.bind(this);
    }

    componentDidMount(){
        this._isMounted = true;
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.coverPhoto != null){
            Promise.resolve(this.props.coverPhoto).then(value => this.setState({coverUrl: value}));
        }

        if(this.state.coverUrl === undefined || this.state.coverUrl === 'unavailable' || this.state.coverUrl === ''){
            this.setState({coverUrl: coverImage});
        }

        if(this.props.socialCount !== null){
            Promise.resolve(this.props.socialCount).then(value => { this.setState({socialCount: value});});
        }

        if(this.props.followData !== null && this.props.followData !== undefined){
            Promise.resolve(this.props.followData).then(value => { this.setState({followData: value}); });
        }
    }

    componentDidUpdate(prevProps: Props,prevState: State){
        if(this.props.followData !== prevProps.followData){
            if(this._isMounted){
                if(this.props.followData !== null && this.props.followData !== undefined){
                    Promise.resolve(this.props.followData).then(value => { this.setState({followData: value}); });
                }

                if(this.state.followData !== null && this.state.followData !== undefined){
                    this.setState({followStatus: this.state.followData.status});
                }
            }
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
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

    renderProfilePictureLoggedin = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePictureLoggedin) {
            return null;
        }
        
        return (
            <Avatar
                size={size}
                url={this.props.profilePictureLoggedin}
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
                text='request'
            />
        );
    }

    handleFollow = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        const {actions, currentUser, userData} = this.props;
        actions.onFollowRequest(userData.id,currentUser.id);
        this.setState({followStatus: 1});
    }

    handleAccept = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const {actions} = this.props;
        const {followData} = this.state;
        if(followData !== undefined){
            actions.onAcceptRequest(followData.id.toString());
            this.setState({followStatus: 2});
        }
    }

    handleCancelRequest = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const {actions} = this.props;
        const {followData} = this.state;
        if(followData !== undefined){
            actions.onCancelRequest(followData.id.toString());
            this.setState({followStatus: 5});
        }
    }

    handleUnfollow = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const {actions, currentUser, userData} = this.props;
        actions.onUnfollowUser(userData.id,currentUser.id);
        this.setState({followStatus: 4});
    }


    render= (): JSX.Element => {
        const { currentUser, userData} = this.props;
        const {followData, followStatus} = this.state;
        
       
        let name;
        let renderView;
        let buttonsView;
        if(currentUser !== undefined && currentUser !== null){
            if(currentUser.first_name !== '' && currentUser.first_name !== '' && currentUser.first_name !== null && currentUser.first_name !== null){
                name = (<>{currentUser.first_name}</>);
            }
            else{
                name = (<>{currentUser.username}</>);
            }

            if(userData.id !== currentUser.id){
                if(followData !== undefined){
                    if(followData.status === 0){
                        if(followStatus === 1){
                            buttonsView = (
                                <label className='mt-2 approve-reject-text'><a className='approveActions'>Requested</a> | <a onClick={this.handleCancelRequest} className='rejeectActions'>Cancel Request</a></label>
                            );
                        }
                        else{
                            buttonsView = (
                                <label className='mt-2 approve-reject-text'><a className='approveActions' onClick={this.handleFollow}>Add Friend</a> | <a onClick={this.handleCancelRequest} className='rejeectActions'>Remove</a></label>
                            );
                        }

                        renderView = (
                            <div className='list-group-item list-group-item-action border-0 friends-contents'>
                                <div className='d-flex w-100 justify-content-between mt-1 mb-1'>
                                    <label className='mb-0'>{this.renderProfilePictureText('lg')}<label>{name}</label></label>
                                    {buttonsView}
                                    <label className='mt-2 reject-text'><a className='reject-actions' ><i className='bi-x-lg'></i> Delete</a></label>
                                </div>
                            </div>
                        );
                    }
                } 
            }
        }

        return (
            <>
                {renderView}
            </>
        );
    }
}
