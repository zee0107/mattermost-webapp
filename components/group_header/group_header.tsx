// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import GroupDetails from 'components/group_details';
import GroupLogo from 'images/groupcover.png';
import { isGIFImage } from 'utils/utils';
import { throws } from 'assert';
import ThemeSetting from 'components/user_settings/display/user_settings_theme/user_settings_theme';
import { ChannelMembership } from 'mattermost-redux/types/channels';
import ThreadsIcon from 'components/threading/global_threads_link/threads_icon';
import { url } from 'inspector';

export type Props = {
    channelId:string;
    channelDisplayName: string;
    channelAdmin: boolean;
    channelRole: Promise<ChannelMembership>;
    actions: {
        leaveChannelNew: (channelId: string) => Promise<ActionResult>;
    }
}

type State = {
    isDark: string;
    result_leave: boolean;
    uploadImage: boolean;
    selectedFile: any;
    file_name: string;
    img_url: string;
    id: string;
    uploadError: string;
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

        if(this.props.channelRole != null){
            Promise.resolve(this.props.channelRole).then(value => {this.setState({data: value});})
        }

        
        
        this.getImage(this.props.channelId);
    }

    handelChange = (e) => {
        this.setState({selectedFile: e.target.files[0],
            file_name: e.target.files[0].name});
    }

    handleSubmit = () => {
        'use strict';
        const uri = new URL('https://crypterfighter.polywickstudio.ph/api/crypter/uploadgroupcover?');
        const params = {group_id: this.props.channelId, file_id: this.state.file_name};
        uri.search = new URLSearchParams(params);

        fetch(uri, {
            method: 'POST',
            body: this.state.selectedFile,
        }).then((response) => response.json()).then((data)=>{
                if (data === 'Uploaded'){
                    this.setState({uploadImage: false});
                    this.getImage(this.props.channelId);
                }

                if (data === 'Not exist'){
                    this.setState({uploadError: 'Please select a file to upload.'});
                }
            }).catch(error => this.setState({error, isLoading: false}));
    }

    getImage = async (channel: string) => {
        const response = await fetch(`https://crypterfighter.polywickstudio.ph/api/crypter/coverimg?id=${channel}`);
        const imageBlob = await response.blob();
        const textBlob = await imageBlob.text();
        if (textBlob.toString() === '\"unavailable\"' || textBlob.toString() === 'unavailable')
        {
            this.setState({img_url: 'unavailable'});
        }
        else
        {
            const imageObjectURL = URL.createObjectURL(imageBlob);
            this.setState({img_url: imageObjectURL});
        }
    }
    
    handleLeaveChannel = (channel: string) => {
        const {actions} = this.props;
        const result = actions.leaveChannelNew(channel);
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
        const { result_leave, uploadImage, img_url, data} = this.state;

        let uploadError;
        if(this.state.uploadError){
            uploadError = (
                <div className='col-md-12'>
                    <label className='text-danger small'>{this.state.uploadError}</label>
                </div>
            );
        }

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
            buttonJoin = (<button type='button' onClick={() => {this.leaveGroup(channelId)}} className='btn buttonBgGreen text-white float-end btn-sm mt-4'>Joined</button>);
        }
        
        let upload;
        if (uploadImage){
            upload = (
                <div className='col-md-12 chat-box mtop-10'>
                    <div className='row mt-2 crypter-section-profile-desktop'>
                        <div className='col-md-12'>
                            <label className='text-secondary small'>Upload Group Cover Photo</label>
                        </div>
                        <div className='col-md-8'>
                            <input type='file' className='form-control float-start' onChange={this.handelChange} required />
                        </div>
                        <div className='col-md-4'>
                            <button className='btn buttonBgGreen text-white float-end btn-sm' type='button' onClick={() => {this.setState({uploadImage: false})}}>Cancel</button>
                            <button className='btn buttonBgGreen text-white float-end btn-sm mr-2' type='button' onClick={this.handleSubmit}>Upload</button>
                        </div>
                        {uploadError}
                    </div>
                    <div id='post-mobile'>
                        <div className='mt-2'>
                            <div className='col-md-12'>
                                <label className='text-secondary small mt-2'>Upload Group Cover Photo</label>
                            </div>
                            <div className='d-flex'>
                                <div className='col-md-8'>
                                    <input type='file' className='form-control float-start' onChange={this.handelChange} required />
                                </div>
                                <div className='col-md-4'>
                                    <button className='btn buttonBgGreen text-white float-end btn-sm' type='button' onClick={() => {this.setState({uploadImage: false})}}>Cancel</button>
                                    <button className='btn buttonBgGreen text-white float-end btn-sm mr-2' type='button' onClick={this.handleSubmit}>Upload</button>
                                </div>
                            </div>
                            {uploadError}
                        </div>
                    </div>
                </div>
            );
        }

        let buttonAction;
        if (data.roles === 'channel_user channel_admin') {
            buttonAction = (
                <div>
                    <a href='#' onClick={() => {this.setState({uploadImage: true})}} className='float-end btn-sm mt-4 ml-2' title='Upload Group cover photo'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--text-primary)" className="bi bi-images" viewBox="0 0 16 16">
                        <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                        <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"/>
                    </svg></a>
                    {buttonJoin}
                </div>
            );
        }
        else {
            buttonAction = (
                <div>
                    {buttonJoin}
                </div>);
        }

        return (
            <div>
                <div className='crypter-section-profile-desktop'>
                    <div className='col-md-12 group-cover-box mtop-10 p-0'>
                        {cover}
                        <div className='col-md-12'>
                            <div className='float-start'>
                                <h5 className='text-primary'>{channelDisplayName}</h5>
                                <h6 className='text-secondary'><GroupDetails channelId={channelId}/></h6>
                            </div>
                            {buttonAction}
                        </div>
                    </div>
                    {upload}
                </div>
                <div id='post-mobile'>
                    <div className='row'>
                        <div className='box-middle-pannel mt-13'>
                            <div className='col-md-12 group-cover-box'>
                                {cover}
                                <div className='d-flex'>
                                    <div className='col-md-7 width-100'>
                                        <h5 className='text-primary'>{channelDisplayName}</h5>
                                        <h6 className='text-secondary'><GroupDetails channelId={channelId}/></h6>
                                    </div>
                                    <div className='col-md-5 width-100'>
                                        {buttonAction}
                                    </div>
                                </div>
                            </div>
                            {upload}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
