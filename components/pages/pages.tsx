// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import {getShortenedURL,cleanUpUrlable} from 'utils/url';
import homeImage from 'images/homeFeed.png';
import {ModalData} from 'types/actions';
import GroupLogo from 'images/groupcover.png';
import NewChannelFlow from 'components/new_channel_flow';
import {trackEvent} from 'actions/telemetry_actions';
import {ServerError} from 'mattermost-redux/types/errors';
import RightSideView from 'components/right_side_view';
import {ChannelType, Channel,ServerChannel,ChannelWithTeamData} from 'mattermost-redux/types/channels';
import {ModalIdentifiers} from 'utils/constants';
import PageDetail from 'components/page_details';
import Constants from 'utils/constants.jsx';
import * as Utils from 'utils/utils';
import {FormattedMessage} from 'react-intl';
import {browserHistory} from 'utils/browser_history';
import { group } from 'console';
import PageImage from 'components/page_image/page_image';
import { Team } from 'mattermost-redux/types/teams';

export function getChannelTypeFromProps(props: Props): ChannelType {
    let channelType = props.channelType || Constants.OPEN_CHANNEL;
    if (channelType === Constants.OPEN_CHANNEL) {
        channelType = Constants.PRIVATE_CHANNEL as ChannelType;
    }
    if (channelType === Constants.PRIVATE_CHANNEL) {
        channelType = Constants.OPEN_CHANNEL as ChannelType;
    }
    return channelType;
}

export type Props = {
    userId: string;
    goToPage: string;
    profilePicture: string;
    currentTeamId?: string;
    teamId?: string;
    channelType: ChannelType;
    isMember: Team[];
    closeHandler?: (callback: () => void) => void;
    actions: {
        createChannel: (channel: Channel) => Promise<{data?: Channel; error?: ServerError}>;
        updateChannel: (channel: Channel) => Promise<{data?: Channel; error?: ServerError}>;
        switchToChannel: (channel: Channel) => Promise<{data?: true; error?: true}>;
        joinChannel: (currentUserId: string, teamId: string, channelId: string) => Promise<ActionResult>;
        leaveChannelNew: (channelId: string) => Promise<ActionResult>;
        deleteChannel: (channelId: string) => Promise<ActionResult>;
        openModal: <P>(modalData: ModalData<P>) => void;
        setStatus: (status: UserStatus) => ActionFunc;
        unsetCustomStatus: () => ActionFunc;
        setStatusDropdown: (open: boolean) => void;
        addUserToTeam: (teamId: string, userId?: string) => any;
        likeThisPage: (user_id: string, page_id: string) => any;
        unlikeThisPage: (user_id: string, page_id: string) => any;
    };
    currentUser: UserProfile;
    mychannels: Promise<ServerChannel[]>;
    suggestedChannels: Promise<ChannelWithTeamData[]>;
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
    group_view: string;
    result_create: boolean;
    result_joined: boolean;
    result_leave: boolean;
    result_remove: boolean;
    result_update: boolean;
    serverError: JSX.Element | string | null;
    channelType: ChannelType;
    flowState: number;
    channelDisplayName: string;
    channelName: string;
    channelId: string;
    channelPurpose: string;
    channelHeader: string;
    nameModified: boolean;
};

type NewChannelData = {
    displayName: string;
    purpose: string;
    header: string;
}

export default class MyPages extends React.PureComponent<Props, State> {
    isLeaving: boolean;
    static defaultProps = {
        userId: '',
        profilePicture: '',
    }

    constructor(props: Props) {
        super(props);

        this.state = { openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage, mygroups: [], suggestedgroup: [], group_view: 'mypages',
            result_create: false, result_joined: false, result_update: false, result_leave: false, serverError: '', channelType: getChannelTypeFromProps(props), channelDisplayName: '', channelName: '',
            channelPurpose: '', channelHeader: '', channelId: '', nameModified: false, result_remove: false,
        };

        this.channelHeaderInput = React.createRef();
        this.channelPurposeInput = React.createRef();
        this.displayNameInput = React.createRef();
        this.isLeaving = false;
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
        if(this.props.mychannels != null){
            Promise.resolve(this.props.mychannels).then(value => {this.setState({mygroups: value});})
        }

        if(this.props.suggestedChannels != null){
            Promise.resolve(this.props.suggestedChannels).then(value => {this.setState({suggestedgroup: value});})
        }

        if(this.props.goToPage){
            this.setState({group_view: this.props.goToPage});
        }

        this.checkIfMember();
    }

    componentDidUpdate(prevProps,prevState){
        if(this.props.mychannels != null){
            Promise.resolve(this.props.mychannels).then(value => {this.setState({mygroups: value});})
        }

        if(this.props.suggestedChannels != null){
            Promise.resolve(this.props.suggestedChannels).then(value => {this.setState({suggestedgroup: value});})
        }

        if(this.props.goToPage !== prevProps.goToPage){
            this.setState({group_view: this.props.goToPage});
        }
    }

    checkIfMember = () => {
        const { isMember, teamId, userId, actions} = this.props;
        if(isMember){
            let found = false;
            isMember.map((item) => {
                if(item.id === teamId){
                    found = true;
                }
            });

            if(!found){
                if(teamId !== undefined){
                    actions.addUserToTeam(teamId,userId);
                }
            }
        }
    }
    onSubmit = () => {
        if (!this.state.channelDisplayName) {
            this.setState({serverError: Utils.localizeMessage('channel_flow.invalidName', 'Invalid Channel Name')});
            return;
        }

        const {actions} = this.props;
        const channel: Channel = {
            team_id: this.props.teamId,
            name: this.state.channelName,
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
                this.setState({group_view: 'mypages', result_create: true});
            }
        });
    };

    onCreateChannelError = (err: ServerError) => {
        if (err.server_error_id === 'model.channel.is_valid.2_or_more.app_error') {
            this.setState({
                serverError: (
                    <FormattedMessage
                        id='channel_flow.handleTooShort'
                        defaultMessage='Channel URL must be 2 or more lowercase alphanumeric characters'
                    />
                ),
            });
        } else if (err.server_error_id === 'store.sql_channel.update.exists.app_error') {
            this.setState({serverError: Utils.localizeMessage('channel_flow.alreadyExist', 'A channel with that URL already exists')});
        } else {
            this.setState({serverError: err.message});
        }
    };

    typeSwitched = (channelType: ChannelType) => {
        this.setState({
            channelType,
            serverError: '',
        });
    };

    channelDataChanged = (data: NewChannelData) => {
        this.setState({
            channelDisplayName: data.displayName,
            channelPurpose: data.purpose,
            channelHeader: data.header,
        });
        if (!this.state.nameModified) {
            this.setState({channelName: cleanUpUrlable(data.displayName.trim())});
        }
    };

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

    handleSubmit = (e) => {
        e.preventDefault();

        const displayName = this.displayNameInput.current.value.trim();
        if (displayName.length < Constants.MIN_CHANNELNAME_LENGTH) {
            this.setState({displayNameError: true});
            return;
        }

        this.onSubmit();
    }

    handleChange = () => {
        const newData = {
            displayName: this.displayNameInput.current.value,
            purpose: this.channelPurposeInput.current.value,
        };
        this.channelDataChanged(newData);
    }

    handleTypeSelect = (e) => {
        this.typeSwitched(e.target.value);
    }

    handleLike = (channel: ServerChannel) => {
        const {actions} = this.props;
        actions.likeThisPage(this.props.userId, channel.id);
        actions.joinChannel(this.props.userId, this.props.teamId, channel.id);
        this.setState({result_joined: true});
    }

    likePage(channel) {
        this.handleLike(channel);
    }

    handleUnlike = (channel: ServerChannel) => {
        const {actions} = this.props;
        actions.likeThisPage(this.props.userId, channel.id);
        actions.leaveChannelNew(channel.id);5
        this.setState({result_leave: true});
    }

    unlikePage(channel) {
        this.handleUnlike(channel);
    }

    handleRemoveChannel = (channel: ServerChannel) => {
        const {actions} = this.props;
        const result = actions.deleteChannel(channel.id);

        if (result.error) {
            this.setState({serverError: result.error.message});
        } else {
            this.setState({result_remove: true});
        }
    }

    removeGroup(channel){
        this.handleRemoveChannel(channel);
    }

    onSubmitUpdate = () => {
        if (!this.state.channelDisplayName) {
            this.setState({serverError: Utils.localizeMessage('channel_flow.invalidName', 'Invalid Channel Name')});
            return;
        }

        const {actions} = this.props;
        const channel: Channel = {
            id: this.state.channelId,
            team_id: this.props.teamId,
            name: this.state.channelName,
            display_name: this.state.channelDisplayName,
            purpose: this.state.channelPurpose,
            header: this.state.channelHeader,
            type: this.state.channelType,
            create_at: 0,
            creator_id: '',
            delete_at: 0,
            group_constrained: false,
            last_post_at: 0,
            last_root_post_at: 0,
            scheme_id: '',
            update_at: 0,
        };

        actions.updateChannel(channel).then(({data, error}) => {
            if (error) {
                this.onCreateChannelError(error);
            } else if (data) {
                //browserHistory.push('./mygroups');
                this.setState({group_view: 'mypages', result_update: true});
            }
        });
    }

    handleSubmitUpdate = (e) => {
        e.preventDefault();

        const displayName = this.displayNameInput.current.value.trim();
        if (displayName.length < Constants.MIN_CHANNELNAME_LENGTH) {
            this.setState({displayNameError: true});
            return;
        }

        this.onSubmitUpdate();
    }

    handleRedirect = (name: string, id: string) => {
        window.localStorage.setItem('channelId', id);
        window.location.href = `./page/channels/${name}`;
    }

    likePages = () => {
        let errorServer;
        if (this.state.serverError) {
            errorServer = (<div className='alert alert-danger'>
                    <label>{this.state.serverError}</label>
                </div>);
        }

        if(this.state.result_leave){
            errorServer = (<div className='alert alert-success'>
                    <label>Leaved group successfully.</label>
                </div>);
        }

        return (
            <div className='joinedcontent col-md-12'>
                {errorServer}
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                    {this.state.mygroups.map((item,index) => {
                        if(item.display_name !== ''  && item.display_name !== 'Town Square'){
                            return(
                                <div className='col-md-3 p-1'>
                                    <div className='box-each-groups'>
                                        <PageImage channelId={item.id} channelName={item.name} suggested={false} />
                                        <p onClick={this.handleRedirect.bind(this,item.name,item.id)} className='mt-4 ms-3 ml-5'>
                                        <label className='text-name-products'><strong>{item.display_name}</strong></label><br/><PageDetail channelId={item.id}/>
                                        </p>
    
                                        <div className='col-md-12 mb-3 p-3 text-center'>
                                            <div className='d-grid'><button type='button' className='btn onUnfollowsuggested' onClick={this.unlikePage.bind(this,item)}><label>Unlike</label></button></div>
                                        </div>
                                        <div className='row'></div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        );
    }

    myPagesList = () => {
        let errorServer;
        if (this.state.serverError) {
            errorServer = (<div className='alert alert-danger'>
                    <label>{this.state.serverError}.</label>
                </div>);
        }

        if(this.state.result_create){
            errorServer = (<div className='alert alert-success'>
                    <label>Successfully created a page.</label>
                </div>);
        }

        if(this.state.result_update){
            errorServer = (<div className='alert alert-success'>
                    <label>Successfully updated page.</label>
                </div>);
        }

        if(this.state.result_remove){
            errorServer = (<div className='alert alert-success'>
                    <label>Page has been archive.</label>
                </div>);
        }

        return (
            <div className='mygroupcontent col-md-12'>
                {errorServer}
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                    {this.state.mygroups.map((item,index) => {
                        if(item.display_name !== '' && item.display_name !== 'Town Square'){
                            if(item.creator_id === this.props.userId)
                            {
                                return(
                                    <div className='col-md-3 p-1'>
                                        <div className='box-each-groups'>
                                            <PageImage channelId={item.id} channelName={item.name} suggested={false}/>
                                            <p onClick={this.handleRedirect.bind(this,item.name,item.id)} className='mt-4 ms-3 ml-5'>
                                            <label className='text-name-products'><strong>{item.display_name}</strong></label><br/><PageDetail channelId={item.id}/>
                                            </p>
        
                                            <div className='d-flex'>
                                                <div className='col-md-6 mt-2 mb-3 '><button type='button' className='float-end onEditgroups' onClick={() => {
                                                    this.setState({group_view: 'update_page',channelId: item.id, channelName: item.name,channelDisplayName: item.display_name,channelPurpose: item.purpose,channelHeader: item.header,channelType: item.type })
                                                }}><label>Edit</label></button></div>
                                                <div className='col-md-6 mt-2 mb-3  '><button type='button' className='float-start onDeletegroups' onClick={this.removeGroup.bind(this,item)}><label>Delete</label></button></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        }
                    })}
                </div> 
            </div> 
        );
    }

    suggestedGroup = () => {
        let errorServer;
        if (this.state.serverError) {
            errorServer = (<div className='alert alert-danger'>
                    <label>{this.state.serverError}</label>
                </div>);
        }

        if(this.state.result_joined){
            errorServer = (<div className='alert alert-success'>
                    <label>Successfully joined a group. Group is available on Joined Tab.</label>
                </div>);
        }

        return (
            <div className='suggestedcontent col-md-12'>
                {errorServer}
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                    {this.state.suggestedgroup.filter((data1) => {
                        return !this.state.mygroups.some((data2) => {
                            return data1.id === data2.id;
                        })
                    }).map((item,index) => {
                        if(item.display_name !== ''  && item.display_name !== 'Town Square'){
                            return(
                                <div className='col-md-3 p-1'>
                                    <div className='box-each-groups'>
                                        <PageImage channelId={item.id} channelName={item.name} suggested={true}/>
                                        <p className='mt-4 ms-3 ml-5'>
                                        <label className='text-name-products'><strong>{item.display_name}</strong></label><br/><PageDetail channelId={item.id}/>
                                        </p>
    
                                        <div className='col-md-12 mb-3 p-3 text-center'>
                                            <div className='d-grid'><button type='button' className='btn onFollowsuggested' onClick={this.likePage.bind(this,item)}><label>Like</label></button></div>
                                        </div>
                                        <div className='row'></div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        );
    }

    createPage = () => {
        const prettyTeamURL = getShortenedURL();

        const channelData = {
            name: this.state.channelName,
            displayName: this.state.channelDisplayName,
            purpose: this.state.channelPurpose,
            header: this.state.channelHeader,
        };

        let errorServer;
        if (this.state.serverError) {
            errorServer = (<div className='alert alert-danger'>
                    <label>{this.state.serverError}</label>
                </div>);
        }

        return (
            <div className="create-new-group">
                {errorServer}
                <div className="box-middle-panel-create-new-group">
                    <div className="row">
                        <div className='col-md-12'>
                            <h4>Create Page</h4>
                            <hr/>
                        </div>
                    </div>

                    <form role='form'>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Page name</small></label>
                                <input type="text" ref={this.displayNameInput} value={channelData.displayName} onChange={this.handleChange} id='newChannelName' className="form-control input-create-new-group" maxLength={Constants.MAX_CHANNELNAME_LENGTH} placeholder='E.g.: "Bugs", "Marketing", "客户支持"' aria-label="Group name"/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Page url</small></label>
                                <input type="text" className="form-control input-create-new-group" placeholder="Group url" value={prettyTeamURL + this.state.channelName} aria-label="Group url" readOnly/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <textarea ref={this.channelPurposeInput} value={channelData.purpose} onChange={this.handleChange} className="form-control form-textarea-custom no-resize" id='newChannelPurpose' rows="3" placeholder='E.g.: "A group to to share crypto improvements"' maxLength='250'></textarea>
                            </div>
                        </div>

                        <div className="row p-2">
                            <div className="col-md-12">
                                <label htmlFor="inputState" className="form-label"><small>Category</small></label>
                                <select id="inputState" className="form-control input-create-new-group">
                                <option value='Meme'>Meme</option>
                                <option value='NFT'>NFT</option>
                                <option value='P2E'>Play to Earn</option>
                                <option value='Deflationary'>Deflationary</option>
                                <option value='YieldFarm'>Yield Farm</option>
                                <option value='Calls'>Calls</option>
                                <option value='Lounge'>Lounge</option>
                                <option value='Others'>Others</option>
                                </select>
                            </div>
                        </div>

                        <div className="row p-2">
                            <div className="col-md-6"></div>
                            <div className="col-md-6">
                                <a className="float-end rounded onCreategroups ml-4" onClick={this.handleSubmit}> Create</a>
                                <a className="float-end rounded me-2 mt-2 zero-margin" onClick={() => { this.setState({group_view: 'mypages', serverError: ''})}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-arrow-left-short side-menu-align" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                                </svg> Go Back</a>
                            </div>
                        </div>
                    </form>
                </div>
           </div>
        );
    }

    updatePage = () => {
        const prettyTeamURL = getShortenedURL();

        const channelData = {
            id: this.state.channelId,
            name: this.state.channelName,
            displayName: this.state.channelDisplayName,
            purpose: this.state.channelPurpose,
            header: this.state.channelHeader,
        };

        let errorServer;
        if (this.state.serverError) {
            errorServer = (<div className='alert alert-danger'>
                    <label>{this.state.serverError}</label>
                </div>);
        }

        return (
            <div className="create-new-group">
                {errorServer}
                <div className="box-middle-panel-create-new-group">
                    <div className="row">
                        <div className='col-md-12'>
                            <h4>Update Page</h4>
                            <hr/>
                        </div>
                    </div>

                    <form role='form'>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Page name</small></label>
                                <input type="text" ref={this.displayNameInput} value={channelData.displayName} onChange={this.handleChange} id='newChannelName' className="form-control input-create-new-group" maxLength={Constants.MAX_CHANNELNAME_LENGTH} placeholder='E.g.: "Bugs", "Marketing", "客户支持"' aria-label="Group name"/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Page url</small></label>
                                <input type="text" className="form-control input-create-new-group" placeholder="Group url" value={prettyTeamURL + this.state.channelName} aria-label="Group url" readOnly/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <textarea ref={this.channelPurposeInput} value={channelData.purpose} onChange={this.handleChange} className="form-control form-textarea-custom no-resize" id='newChannelPurpose' rows="3" placeholder='E.g.: "A group to to share crypto improvements"' maxLength='250'></textarea>
                            </div>
                        </div>

                        <div className="row p-2">
                            <div className="col-md-12">
                                <label htmlFor="inputState" className="form-label"><small>Category</small></label>
                                <select id="inputState" className="form-control input-create-new-group">
                                <option value='Meme'>Meme</option>
                                <option value='NFT'>NFT</option>
                                <option value='P2E'>Play to Earn</option>
                                <option value='Deflationary'>Deflationary</option>
                                <option value='YieldFarm'>Yield Farm</option>
                                <option value='Calls'>Calls</option>
                                <option value='Lounge'>Lounge</option>
                                <option value='Others'>Others</option>
                                </select>
                            </div>
                        </div>

                        <div className="row p-2">
                            <div className="col-md-6"></div>
                            <div className="col-md-6">
                                <a className="float-end rounded onCreategroups ml-4" onClick={this.handleSubmitUpdate}> Update</a>
                                <a className="float-end rounded me-2 mt-2 zero-margin" onClick={() => { 
                                    this.setState({group_view: 'mypages',channelId: '', channelName: '',channelDisplayName: '',channelPurpose: '',channelHeader: '',channelType: '', serverError: '' })
                                    }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-arrow-left-short side-menu-align" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                                </svg> Go Back</a>
                            </div>
                        </div>
                    </form>
                </div>
           </div>
        );
    }

    render= (): JSX.Element => {
        const { group_view } = this.state;
        let viewDetails;
        if(this.state.group_view === "liked"){
            viewDetails = this.likePages();
        }
        else if(this.state.group_view === "suggested"){
            viewDetails = this.suggestedGroup();
        }
        else if(this.state.group_view === "createpage"){
            viewDetails = this.createPage();
        }
        else if(this.state.group_view === "update_page"){
            viewDetails = this.updatePage();
        }
        else{
            viewDetails = this.myPagesList();
        }

        return (
            <div className='row'>
                <div className='col-md-9'>
                    <div className='crypter-section-desktop'>
                        <div className='box-middle-panel-forums-menu'>
                            <div className='col-12 mt-2 mx-auto row'>
                                <div className='col-md-3'>
                                    <a href='/mypages' className='onCartmarketplaceicon onMarketplace float-start mr-5'><i className='bi-flag-fill'></i></a>
                                    <label className='ms-2 text-mygroups float-start mt-2 me-5'><strong>Pages</strong></label>
                                </div>
                                <div className='col-md-6'>
                                    <div className='row'>
                                        <div className='col-md-4 text-start mt-2 mb-2 p-0'><a className={group_view === 'mypages' ? 'onMygroupspages p-6 active-group-menu' : 'onMygroupspages p-6'} onClick={() => { this.setState({group_view: 'mypages', result_create: false, result_joined: false, result_leave: false, result_remove: false, result_update: false , serverError: ''})}}>My Pages</a></div>
                                        <div className='col-md-4 text-start mt-2 mb-2 p-0'><a className={group_view === 'suggested' ? 'onMycarts p-6 active-group-menu' : 'onMycarts p-6'} onClick={() => { this.setState({group_view: 'suggested', result_create: false, result_joined: false, result_leave: false, result_remove: false, result_update: false, serverError: ''})}}>Suggested</a></div>
                                        <div className='col-md-4 text-start mt-2 mb-2 p-0'><a className={group_view === 'liked' ? 'onMyjoined p-6 active-group-menu' : 'onMyjoined p-6'} onClick={() => { this.setState({group_view: 'liked', result_create: false, result_joined: false, result_leave: false, result_remove: false, result_update: false, serverError: ''})}}>Liked</a></div>
                                    </div>
                                </div>
                                <div className='col-md-3 text-end'>
                                    <a className='float-end rounded onCreategroups negative-margin-top' id='showNewChannel' onClick={/*this.showNewChannelModal*/() => { this.setState({group_view: 'createpage'})}}>
                                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#fff' className='bi bi-plus side-menu-align' viewBox='0 0 16 16'>
                                        <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/>
                                    </svg> Create</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='crypter-section-mobile'>
                        <div className='position-sticky float-middle-panel'>
                            <div className='d-flex mt-2'>
                                <div className='col-md-7 '><a className='onCartmarketplaceicon onMarketplace float-start'><i className='bi-flag-fill'></i></a>
                                    <strong className='float-start mt-3 ml-2 text-mygroups'>Pages</strong>
                                </div>
                                <div className='col-md-5 '><a className='float-end rounded onCreategroupsdesktop btn-sm text-center mt-3' onClick={() => { this.setState({group_view: 'createpage'})}}>
                                    <i className='bi-plus'></i> Create</a>
                                </div>
                            </div>
                        </div>
                        <div className='box-middle-panel-marketplace-mobile mt-3 col-md-12'>
                            <div className='d-flex'>
                                <div className='col-md-4  text-center p-0'>
                                    <a 
                                        className={group_view === 'mypages' ? 'onMygroupspages btn-md p-2 active-group-menu text-success' : 'onMygroupspages btn-md p-2'}
                                        onClick={() => { this.setState({group_view: 'mypages', result_create: false, result_joined: false, result_leave: false, result_remove: false, result_update: false , serverError: ''})}}
                                    ><small>My Pages</small></a>
                                </div>
                                <div className='col-md-4  text-center p-0'>
                                    <a 
                                        className={group_view === 'suggested' ? 'onMycarts btn-md p-2 active-group-menu text-success' : 'onMycarts btn-md p-2'}
                                        onClick={() => { this.setState({group_view: 'suggested', result_create: false, result_joined: false, result_leave: false, result_remove: false, result_update: false, serverError: ''})}}
                                    ><small>Suggested</small></a>
                                </div>
                                <div className='col-md-4  text-center p-0'>
                                    <a 
                                        className={group_view === 'liked' ? 'onMyjoined btn-md p-2 active-group-menu text-success' : 'onMyjoined btn-md p-2'}><small className='ms-2'
                                        onClick={() => { this.setState({group_view: 'liked', result_create: false, result_joined: false, result_leave: false, result_remove: false, result_update: false, serverError: ''})}}
                                    >Liked</small></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {viewDetails}
                </div>
                <div className='col-md-3' id='rightSideView'>
                    <RightSideView/>
                </div>
            </div>
        );
    }
}
