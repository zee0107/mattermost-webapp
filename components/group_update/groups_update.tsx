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
import GroupDetail from 'components/group_details';
import Constants from 'utils/constants.jsx';
import * as Utils from 'utils/utils';
import {FormattedMessage} from 'react-intl';
import {browserHistory} from 'utils/browser_history';

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
    profilePicture: string;
    currentTeamId?: string;
    channelType: ChannelType;
    closeHandler?: (callback: () => void) => void;
    actions: {
        createChannel: (channel: Channel) => Promise<{data?: Channel; error?: ServerError}>;
        switchToChannel: (channel: Channel) => Promise<{data?: true; error?: true}>;
        joinChannel: (currentUserId: string, teamId: string, channelId: string) => Promise<ActionResult>;
        leaveChannelNew: (channelId: string) => Promise<ActionResult>;
        deleteChannel: (channelId: string) => Promise<ActionResult>;
        openModal: <P>(modalData: ModalData<P>) => void;
        setStatus: (status: UserStatus) => ActionFunc;
        unsetCustomStatus: () => ActionFunc;
        setStatusDropdown: (open: boolean) => void;
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
    serverError: JSX.Element | string | null;
    channelType: ChannelType;
    flowState: number;
    channelDisplayName: string;
    channelName: string;
    channelPurpose: string;
    channelHeader: string;
    nameModified: boolean;
};

type NewChannelData = {
    displayName: string;
    purpose: string;
    header: string;
}

export default class GroupUpdate extends React.PureComponent<Props, State> {
    isLeaving: boolean;
    static defaultProps = {
        userId: '',
        profilePicture: '',
    }

    constructor(props: Props) {
        super(props);

        this.state = { openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage, mygroups: [], suggestedgroup: [], group_view: 'mygroup',
            result_create: false, result_joined: false, result_leave: false, serverError: '', channelType: getChannelTypeFromProps(props), channelDisplayName: '', channelName: '',
            channelPurpose: '', channelHeader: '', nameModified: false, result_remove: false,
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
    }

    componentDidUpdate(){
        if(this.props.mychannels != null){
            Promise.resolve(this.props.mychannels).then(value => {this.setState({mygroups: value});})
        }

        if(this.props.suggestedChannels != null){
            Promise.resolve(this.props.suggestedChannels).then(value => {this.setState({suggestedgroup: value});})
        }
    }

    onSubmit = () => {
        if (!this.state.channelDisplayName) {
            this.setState({serverError: Utils.localizeMessage('channel_flow.invalidName', 'Invalid Channel Name')});
            return;
        }

        const {actions} = this.props;
        const channel: Channel = {
            team_id: '5meubtskybn1bg7iyfx7x4cm9c',
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
                this.setState({group_view: 'mygroups', result_create: true});
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
            //header: this.channelHeaderInput.current.value,
            purpose: this.channelPurposeInput.current.value,
        };
        this.channelDataChanged(newData);
    }

    handleTypeSelect = (e) => {
        this.typeSwitched(e.target.value);
    }

    updateGroup = () => {
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
                            <h4>Create new groups</h4>
                            <hr/>
                        </div>
                    </div>

                    <form role='form'>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Group name</small></label>
                                <input type="text" ref={this.displayNameInput} value={channelData.displayName} onChange={this.handleChange} id='newChannelName' className="form-control input-create-new-group" maxLength={Constants.MAX_CHANNELNAME_LENGTH} placeholder='E.g.: "Bugs", "Marketing", "客户支持"' aria-label="Group name"/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Group url</small></label>
                                <input type="text" className="form-control input-create-new-group" placeholder="Group url" value={prettyTeamURL + this.state.channelName} aria-label="Group url" readOnly/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <textarea ref={this.channelPurposeInput} value={channelData.purpose} onChange={this.handleChange} className="form-control form-textarea-custom no-resize" id='newChannelPurpose' rows="3" placeholder='E.g.: "A group to to share crypto improvements"' maxLength='250'></textarea>
                            </div>
                        </div>

                        <div className="row p-2">
                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label"><small>Group type</small></label>
                                <select id="inputState" className="form-control input-create-new-group" onChange={this.handleTypeSelect} value={this.state.channelType}>
                                <option value='O'>Public</option>
                                <option value='P'>Private</option>
                                </select>
                            </div>
                            <div className="col-md-6">
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
                                <a className="float-end rounded onCreategroups btn-sm ml-4" onClick={this.handleSubmit}> Create</a>
                                <a className="float-end rounded me-2 mt-2 zero-margin" onClick={() => { window.location.reload(); }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-arrow-left-short side-menu-align" viewBox="0 0 16 16">
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
        const viewDetails = this.updateGroup();

        return (
            <div>
                {viewDetails}
            </div>
        );
    }
}
