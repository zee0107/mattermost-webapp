// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import GroupDetails from 'components/group_details';
import GroupLogo from 'images/groupcover.png';
import { isGIFImage } from 'utils/utils';

type Props = {
    channelId:string;
    channelDisplayName: string;
    actions: {
        leaveChannelNew: (channelId: string) => Promise<ActionResult>;
    }
}

type State = {
    isDark: string;
    result_leave: boolean;
    uploadImage: boolean;
};

export default class GroupsHeader extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
        /*status: UserStatuses.OFFLINE,*/
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            isDark:'light',
            memberCount: '',
            data: [],
            result_leave: false,
            uploadImage: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
    }

    handleSubmit = (event) => {
        event.preventDefault();
    
        const data = new FormData();
        data.append('fileblob', event.target.files[0]);
        data.append('group_id', this.props.channelId);

        fetch('https://localhost:44312/api/crypter/uploadgroupcover', {
            method: 'POST',
            /*headers: {'Content-Type':'multipart/form-data'},*/
            body: data
        })
            .then((response) => response.json())
            .then((data)=>{
                console.log(data);
            })
            .catch(error => this.setState({ error, isLoading: false}));
    }

    
    handleLeaveChannel = (channel: string) => {
        const {actions} = this.props;
        const result = actions.leaveChannelNew(channel);
        console.log(result);
        if (result.error) {
            this.setState({serverError: result.error.message});
        } else {
            this.setState({result_leave: true});
        }
    }

    leaveGroup(channel){
        this.handleLeaveChannel(channel);
    }

    render= (): JSX.Element => {
        const {channelId, channelDisplayName} = this.props;
        const { result_leave, uploadImage } = this.state;
        
        let buttonJoin;
        if(result_leave){
            /*browserHistory.push(`${teamUrl}/channels/town-square`);*/
            window.location.href = '/mygroups';
        }
        else{
            buttonJoin = (<button type='button' onClick={() => {this.leaveGroup(channelId)}} className='btn btn-success float-end btn-sm mt-4'>Joined</button>);
        }

        let upload;
        if (uploadImage){
            upload = (
                <div className='col-md-12 chat-box mtop-10'>
                    <form onSubmit={this.handleSubmit}>
                        <input type='file' className='form-control float-start' required />
                        <button className='btn btn-success float-end' type='submit'>Upload</button>
                        <button className='btn btn-success float-end' type='button' onClick={() => {this.setState({uploadImage: false})}}>Cancel</button>
                    </form>
                </div>
            );
        }

        return (
            <div>
                <div className='col-md-12 group-cover-box mtop-10 p-0'>
                    <img width='100%' className='img-fluid' height='300' src={GroupLogo} alt=''/>
                    <div className='col-md-12'>
                        <div className='float-start'>
                            <h5 className='text-primary'>{channelDisplayName}</h5>
                            <h6 className='text-secondary'><GroupDetails channelId={channelId}/></h6>
                        </div>
                        {buttonJoin}
                        <button type='button' onClick={() => {this.setState({uploadImage: true})}} className='btn btn-success float-end btn-sm mt-4'>Upload Cover</button>
                    </div>
                </div>
                {upload}
            </div>
        );
    }
}
