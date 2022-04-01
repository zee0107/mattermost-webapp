// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import GroupDetails from 'components/group_details';
import GroupLogo from 'images/groupcover.png';
import { isGIFImage } from 'utils/utils';
import { throws } from 'assert';

export type Props = {
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
    selectedFile: any;
    img_url: string;
    id:string;
};

export default class GroupsHeader extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isDark:'light',
            memberCount: '',
            data: [],
            result_leave: false,
            uploadImage: false,
            img_url: 'unavailable',
            id: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () =>{
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
        /*const chnId = window.localStorage.getItem('channelId');
        if (chnId !== null){
            this.setState({id: chnId});
            this.getImage(this.state.id);
        }
        else{
            this.setState({img_url: 'unavailable'});
        }*/

        fetch(`https://localhost:44312/api/crypter/coverimg?id=${this.props.channelId}`, {
            method: 'GET'
        })
        .then((response)=>{
            const imageBlob = response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            this.setState({img_url: imageObjectURL});
            console.log(this.state.img_url);

            console.log(response);
        }).catch(error => this.setState({ error, isLoading: false}));
    }

    handelChange = (e) => {
        this.setState({selectedFile: e.target.files[0]});
    }

    handleSubmit = () => {
        'use strict';
        const data = new FormData();
        data.append('fileblob', this.state.selectedFile);
        data.append('group_id', this.props.channelId);

        fetch('https://localhost:44312/api/crypter/uploadgroupcover', {
            method: 'POST',
            //headers: {'Content-Type':'multipart/form-data'},
            body: data,
        })
            .then((response) => response.json())
            .then((data)=>{
                if (data === 'Uploaded'){
                    this.setState({uploadImage: false});
                    this.getImage(this.props.channelId);
                }
            })
            .catch(error => this.setState({ error, isLoading: false}));
    }

 

    getImage = (channel: string) => {
        fetch(`https://localhost:44312/api/crypter/coverimg?id=${channel}`, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((response)=>{
                /*const imageBlob = await response.blob()
                const imageObjectURL = URL.createObjectURL(imageBlob);
                this.setState({img_url: imageObjectURL});
                console.log(this.state.img_url);*/

                console.log(response);
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
        const { result_leave, uploadImage, img_url} = this.state;

        let cover;
        if(img_url === 'unavailable'){
            cover = (<img width='100%' className='img-fluid' height='300' src={GroupLogo} alt=''/>);
        }
        else{
            cover = (<img width='100%' className='img-fluid' height='300' src={this.state.img_url} alt=''/>);
        }
        let buttonJoin;
        if(result_leave){
            /*browserHistory.push(`${teamUrl}/channels/town-square`);*/
            window.location.href = '/mygroups';
        }
        else{
            buttonJoin = (<button type='button' onClick={() => {this.leaveGroup(channelId)}} className='btn btn-success float-end btn-sm mt-4 mr-2'>Joined</button>);
        }
        
        let upload;
        if (uploadImage){
            upload = (
                <div className='col-md-12 chat-box mtop-10'>
                    <div className='row mt-2'>
                        <div className='col-md-7'>
                            <input type='file' className='form-control float-start' onChange={this.handelChange} required />
                        </div>
                        <div className='col-md-5'>
                            <button className='btn buttonBgGreen text-white float-end btn-sm' type='button' onClick={() => {this.setState({uploadImage: false})}}>Cancel</button>
                            <button className='btn buttonBgGreen text-white float-end btn-sm mr-2' type='button' onClick={this.handleSubmit}>Upload</button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className='col-md-12 group-cover-box mtop-10 p-0'>
                    {cover}
                    <div className='col-md-12'>
                        <div className='float-start'>
                            <h5 className='text-primary'>{channelDisplayName}</h5>
                            <h6 className='text-secondary'><GroupDetails channelId={channelId}/></h6>
                        </div>

                        <button type='button' onClick={() => {this.setState({uploadImage: true})}} className='btn buttonBgGreen text-white float-end btn-sm mt-4'>Upload</button>
                        {buttonJoin}
                    </div>
                </div>
                {upload}
            </div>
        );
    }
}
