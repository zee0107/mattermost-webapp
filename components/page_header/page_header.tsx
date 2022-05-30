// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import PageDetails from 'components/page_details';
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
    isMounted: boolean;
}

type State = {
    isDark: string;
    result_leave: boolean;
    uploadImage: boolean;
    uploadProfile: boolean;
    selectedFile: any;
    file_name: string;
    img_url: string;
    profile_url: string;
    id: string;
    uploadError: string;
    isMounted: boolean;
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
            uploadProfile: false,
            img_url: 'unavailable',
            id: '',
            isMounted: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitProfile = this.handleSubmitProfile.bind(this);
    }

    componentDidMount = () =>{
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.channelRole != null){
            Promise.resolve(this.props.channelRole).then(value => {this.setState({data: value});})
        }

        
        if(this.props.isMounted && this.props.isMounted !== undefined && this.props.isMounted !== null){
            this.setState({isMounted: this.props.isMounted});
            this.getImage(this.props.channelId);
            this.getProfileImage(this.props.channelId);
        }
        else{
            this.setState({isMounted: false});
        }
    }

    handelChange = (e) => {
        this.setState({selectedFile: e.target.files[0],
            file_name: e.target.files[0].name});
    }

    handleSubmit = () => {
        'use strict';
        const uri = new URL('https://crypterfighter.polywickstudio.ph/api/crypter/uploadpagecover?');
        const params = {page_id: this.props.channelId, file_id: this.state.file_name};
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

    handleSubmitProfile = () => {
        'use strict';
        const uri = new URL('https://crypterfighter.polywickstudio.ph/api/crypter/uploadpageprofile?');
        const params = {page_id: this.props.channelId, file_id: this.state.file_name};
        uri.search = new URLSearchParams(params);

        fetch(uri, {
            method: 'POST',
            body: this.state.selectedFile,
        }).then((response) => response.json()).then((data)=>{
                if (data === 'Uploaded'){
                    this.setState({uploadProfile: false});
                    this.getProfileImage(this.props.channelId);
                }

                if (data === 'Not exist'){
                    this.setState({uploadError: 'Please select a file to upload.'});
                }
            }).catch(error => this.setState({error, isLoading: false}));
    }

    getImage = async (channel: string) => {
        try{
            const response = await fetch(`https://crypterfighter.polywickstudio.ph/api/crypter/pagecoverimg?id=${channel}`);
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
        catch(error){
            conosle.log(error);
        }
    }

    getProfileImage = async (channel: string) => {
        try{
            const response = await fetch(`https://crypterfighter.polywickstudio.ph/api/crypter/pageprofileimg?id=${channel}`);
            const imageBlob = await response.blob();
            const textBlob = await imageBlob.text();
            if (textBlob.toString() === '\"unavailable\"' || textBlob.toString() === 'unavailable')
            {
                this.setState({profile_url: 'unavailable'});
            }
            else
            {
                const imageObjectURL = URL.createObjectURL(imageBlob);
                this.setState({profile_url: imageObjectURL});
            }
        }
        catch(error){
            conosle.log(error);
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
        const { result_leave, uploadImage, uploadProfile, img_url, profile_url, data} = this.state;

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
            cover = (<img width='100%' height='300' src={GroupLogo} alt=''/>);
        }
        else{
            cover = (<img width='100%' height='300' src={this.state.img_url} alt=''/>);
        }

        let coverUrl;
        if(img_url === 'unavailable'){
            coverUrl = (
                <div className='mypageheaderpreviews' style={{backgroundImage: `url(${GroupLogo})`, backgroundPosition: 'center bottom', backgroundSize: 'cover'}}>
                    <h3 className='text-center text-white'></h3>
                </div>
            );
        }else{
            coverUrl = (
                <div className='mypageheaderpreviews' style={{backgroundImage: `url(${this.state.img_url})`, backgroundPosition: 'center bottom', backgroundSize: 'cover'}}>
                    <h3 className='text-center text-white'></h3>
                </div>
            );
        }
        let buttonJoin;
        if(result_leave){
            /*browserHistory.push(`${teamUrl}/channels/town-square`);*/
            window.location.href = '/mygroups';
        }
        else{
            buttonJoin = (<button type='button' onClick={() => {this.leaveGroup(channelId)}} className='buttonBgGreen p-2 text-white float-end mt-4'>Liked</button>);
        }
        
        let buttonSubmit;
        if(uploadImage){
            buttonSubmit = (
                <button className='btn-br text-white float-end small p-2 mr-2' type='button' onClick={this.handleSubmit}>Upload</button>
            );
        }else{
            buttonSubmit = (
                <button className='btn-br text-white float-end small p-2  mr-2' type='button' onClick={this.handleSubmitProfile}>Upload</button>
            );
        }
        let upload;
        if (uploadImage || uploadProfile){
            upload = (
                <div className='col-md-12 chat-box mtop-10'>
                    <div className='row mt-2 crypter-section-profile-desktop'>
                        <div className='col-md-12'>
                            <label className='text-secondary small'>Upload Group Cover Photo</label>
                        </div>
                        <div className='col-md-10'>
                            <input type='file' className='form-control float-start' onChange={this.handelChange} required />
                        </div>
                        <div className='col-md-2'>
                            <button className='btn-br text-white float-end small p-2' type='button' onClick={() => {this.setState({uploadImage: false,uploadProfile: false})}}>Cancel</button>
                            {buttonSubmit}
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
                                    <button className='btn-br text-white float-end small p-2' type='button' onClick={() => {this.setState({uploadImage: false,uploadProfile: false})}}>Cancel</button>
                                    {buttonSubmit}
                                </div>
                            </div>
                            {uploadError}
                        </div>
                    </div>
                </div>
            );
        }

        let buttonAction;
        let buttonActionMobile;
        if (data.roles === 'channel_user channel_admin') {
            buttonAction = (
                <div className='mt-5 pt-5'>
                    <div className='dropdown'>
                        <a className='float-end onClicksubmenu shadow' id='dropdownSubmenu' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-three-dots'></i></a>
                        <ul className='dropdown-menu' aria-labelledby='dropdownSubmenu'>
                            <li key='upload-profile'><a className='dropdown-item' href="#" onClick={() => {this.setState({uploadProfile: true})}}><i className='bi-upload download-style'></i> Upload Page Profile Photo</a></li>
                            <li key='upload-cover'><a className='dropdown-item' href="#" onClick={() => {this.setState({uploadImage: true})}}><i className='bi-upload download-style'></i> Upload Page Cover Photo</a></li>
                        </ul>
                    </div>
                </div>
            );

            buttonActionMobile = (
                <div className='dropdown'>
                    <a className='float-end onClicksubmenu shadow' id='dropdownSubmenu' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-three-dots'></i></a>
                    <ul className='dropdown-menu' aria-labelledby='dropdownSubmenu'>
                        <li key='upload-profile'><a className='dropdown-item' href="#" onClick={() => {this.setState({uploadProfile: true})}}><i className='bi-upload download-style'></i> Upload Page Profile Photo</a></li>
                        <li key='upload-cover'><a className='dropdown-item' href="#" onClick={() => {this.setState({uploadImage: true})}}><i className='bi-upload download-style'></i> Upload Page Cover Photo</a></li>
                    </ul>
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
            <div className='group-cover-box'>
                {coverUrl}

                <div className='mypagepreviews-desktop'>
                    <div className='mypageheadingpreviews'>
                    <div className='row'>
                        <div className='col-lg-2 text-center'>
                            <img className='rounded-circle rounded-circle-photo border border-5' src={profile_url} />
                        </div>
                        <div className='col-lg-8 pt-5'>
                            <h1 className='mt-5'>{channelDisplayName}</h1>
                            <PageDetails channelId={channelId}/>
                        </div>
                        <div className='col-lg-2'>
                            {buttonAction}
                        </div>
                    </div>
                    </div>
                </div>

                <div className='mypagepreviews-mobile'>
                    <div className='mypageheadingmobilepreviews' style={{backgroundImage: `url(${img_url !== 'unavailable' ? GroupLogo : img_url})`, backgroundPosition: 'center bottom'}}>
                        <div className='row'>
                            <div className='col-lg-12 text-center'>
                                {buttonActionMobile}
                            </div>
                            <div className='col-12 text-center'>
                                <div className='col-5 mx-auto'>
                                    <img className='img-fluid rounded-circle rounded-circle-photo border border-5'style={{height: '140'}} src={profile_url}/>
                                </div>
                            </div>
                            <div className='col-lg-12 text-center'>
                                <h4 className='mt-3'>{channelDisplayName}</h4>
                                <PageDetails channelId={channelId}/>
                            </div>
                        </div>
                    </div>
                </div>
                {upload}
            </div>
        );
    }
}
