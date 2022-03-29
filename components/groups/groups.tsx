// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';

import homeImage from 'images/homeFeed.png';
import {ModalData} from 'types/actions';
import GroupLogo from 'images/groupcover.png';
import NewChannelFlow from 'components/new_channel_flow';
import {trackEvent} from 'actions/telemetry_actions';
import RightSideView from 'components/right_side_view';
import {ChannelMembership,ServerChannel} from 'mattermost-redux/types/channels';
import {ModalIdentifiers} from 'utils/constants';
import GroupDetail from 'components/group_details';

type Props = {
    userId: string;
    profilePicture: string;
    actions: {
        openModal: <P>(modalData: ModalData<P>) => void;
        setStatus: (status: UserStatus) => ActionFunc;
        unsetCustomStatus: () => ActionFunc;
        setStatusDropdown: (open: boolean) => void;
    };
    currentUser: UserProfile;
    mychannels: Promise<ServerChannel[]>;
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
    group_view: string;
};

export default class MyGroups extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            openUp: false,
            width: 0,
            isStatusSet: false,
            isDark:'light',
            img_path: homeImage,
            mygroups: [],
            group_view: 'mygroup',
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.mychannels != null){
            Promise.resolve(this.props.mychannels).then(value => {this.setState({mygroups: value});})
        }
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

    showNewChannelModal = () => {
        this.props.actions.openModal({
            modalId: ModalIdentifiers.NEW_CHANNEL_FLOW,
            dialogType: NewChannelFlow,
        });
        trackEvent('ui', 'ui_channels_create_channel_v2');
    }

    joinedGroup = () => {
        return (
            <div className='joinedcontent col-md-12'>
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                    {this.state.mygroups.map((item,index) => {
                        if(item.display_name !== ''){
                            return(
                                <div className='col-md-3 p-1'>
                                    <div className='box-each-groups'>
                                        <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                        <p className='mt-4 ms-3 ml-5'>
                                        <label className='text-name-products'><strong>{item.display_name}</strong></label><br/><GroupDetail channelId={item.id}/>
                                        </p>
    
                                        <div className='row'>
                                            <div className='col-md-12 mb-3 p-3 text-center'>
                                            <div className='d-grid'><a className='btn onUnfollowsuggested'><label>Unfollow</label></a></div></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        );
    }

    myGroupList = () => {
        return (
            <div className='mygroupcontent col-md-12'>
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                    {this.state.mygroups.map((item,index) => {
                        if(item.display_name !== ''){
                            return(
                                <div className='col-md-3 p-1'>
                                    <div className='box-each-groups'>
                                        <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                                        <p className='mt-4 ms-3 ml-5'>
                                        <label className='text-name-products'><strong>{item.display_name}</strong></label><br/><GroupDetail channelId={item.id}/>
                                        </p>
    
                                        <div className='row'>
                                            <div className='col-md-6 mt-2 mb-3'><a className='float-end onEditgroups'><label>Edit</label></a></div>
                                            <div className='col-md-6 mt-2 mb-3'><a className='float-start onDeletegroups'><label>Delete</label></a></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div> 
            </div> 
        );
    }

    suggestedGroup = () => {
        var test = document.getElementsByClassName('onMycarts');
        /*test.classList.add('active');*/
        return (
            <div className='suggestedcontent col-md-12'>
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                    <div className='col-md-3 p-1'>
                        <div className='box-each-groups'>
                            <img width='100%' className='img-fluid' src={GroupLogo} alt=''/>
                            <p className='mt-4 ms-3 ml-5'>
                            <label className='text-name-products'><strong>Lorem Ipsum</strong></label><br/><label className='text-count-members'>95K Members</label>
                            </p>

                            <div className='row'>
                                <div className='col-md-12 mb-3 p-3 text-center'>
                                <div className='d-grid'><a className='btn onFollowsuggested'><label>Follow</label></a></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    createGroup = () => {
        return (
            <div className="create-new-group">
                <div className="box-middle-panel-create-new-group">
                    <div className="row">
                        <div className='col-md-12'>
                            <h4>Create new groups</h4>
                            <hr/>
                        </div>
                    </div>

                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Group name</small></label>
                                <input type="text" className="form-control input-create-new-group" placeholder="Group name" aria-label="Group name"/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Group url</small></label>
                                <input type="text" className="form-control input-create-new-group" placeholder="Group url" aria-label="Group url"/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <textarea className="form-control form-textarea-custom" id="" rows="3" placeholder="Group description"></textarea>
                            </div>
                        </div>

                        <div className="row p-2">
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Group type</small></label>
                                <select id="inputState" className="form-control input-create-new-group">
                                <option selected>Choose...</option>
                                <option>...</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Category</small></label>
                                <select id="inputState" className="form-control input-create-new-group">
                                <option selected>Choose...</option>
                                <option>...</option>
                                </select>
                            </div>
                        </div>

                        <div className="row p-2">
                            <div className="col-md-6"></div>
                            <div className="col-md-6">
                                <a className="float-end rounded onCreategroups btn-sm ml-4"> Create</a>
                                <a className="float-end rounded me-2 mt-2 zero-margin" onClick={() => { this.setState({group_view: 'mygroups'})}}> <i className="bi-arrow-left"></i> Go Back</a>
                            </div>
                        </div>
                    </form>
                </div>
           </div>
        );
    }

    render= (): JSX.Element => {
        const {globalHeader, currentUser} = this.props;
        
        let viewDetails;
        if(this.state.group_view === "joined"){
            viewDetails = this.joinedGroup();
        }
        else if(this.state.group_view === "suggested"){
            viewDetails = this.suggestedGroup();
        }
        else if(this.state.group_view === "creategroup"){
            viewDetails = this.createGroup();
        }
        else{
            viewDetails = this.myGroupList();
        }

        return (
            <div className='row'>
                <div className='col-md-9'>
                    <div className='crypter-section-desktop'>
                        <div className='box-middle-panel-forums-menu'>
                            <div className='col-12 mt-2 mx-auto row'>
                                <div className='col-md-3'>
                                    <a href='/mygroups' className='onCartmarketplaceicon onMarketplace float-start mr-5'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#fff' className='bi bi-people-fill' viewBox='0 0 16 16'>
                                        <path d='M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/>
                                        <path fillRule='evenodd' d='M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z'/>
                                        <path d='M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'/>
                                    </svg></a>
                                    <label className='ms-2 text-mygroups float-start mt-2 me-5'><strong>Group</strong></label>
                                </div>
                                <div className='col-md-7'>
                                    <div className='row'>
                                        <div className='col-md-3 text-start mt-2 mb-2 p-0'><a className='onMygroupspages p-4' onClick={() => { this.setState({group_view: 'mygroups'})}}>MyGroups</a></div>
                                        <div className='col-md-3 text-start mt-2 mb-2 p-0'><a className='onMycarts p-4' onClick={() => { this.setState({group_view: 'suggested'})}}>Suggested</a></div>
                                        <div className='col-md-3 text-start mt-2 mb-2 p-0'><a className='onMyjoined p-4' onClick={() => { this.setState({group_view: 'joined'})}}>Joined</a></div>
                                        <div className='col-md-3 text-start mt-2 mb-2 p-0'><a className='p-4'></a></div>
                                    </div>
                                </div>
                                <div className='col-md-2 text-end'>
                                    <a className='float-end rounded onCreategroups negative-margin-top' id='showNewChannel' onClick={/*this.showNewChannelModal*/() => { this.setState({group_view: 'creategroup'})}}>
                                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#fff' className='bi bi-plus side-menu-align' viewBox='0 0 16 16'>
                                        <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/>
                                    </svg> Create</a>
                                </div>
                            </div>
                        </div>
                        {viewDetails}
                    </div>
                    
                </div>
                <div className='col-md-3' id='rightSideView'>
                    <RightSideView/>
                </div>
            </div>
        );
    }
}
