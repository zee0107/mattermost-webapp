// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {UserProfile} from 'mattermost-redux/types/users';
import logoDark from 'images/logoBlack.png';
import { Album, UploadBlob } from 'mattermost-redux/types/crypto';
import { toInteger } from 'lodash';
import { runInThisContext } from 'vm';

type Props = {
    userId: string;
    currentUser: UserProfile;
    album: Promise<Album>
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    privacyValue: string;
    photoValue: string[];
    photoValueName: string[];
    prevName: string;
    albumName: string;
    image: UploadBlob[];
    textError: string;
    album: Album;
};

export default class UpdateAlbum extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {album: { id: '', user_id: '', privacy: '', date: '', files_names: '',album_name: '', img_count: 0},photoValueName: [],photoValue: [],image: [],openUp: false, width: 0, isStatusSet: false, isDark:'light', privacyValue: 'everyone',};

        this.selectInput = React.createRef();
        this.onChangePrivacy = this.onChangePrivacy.bind(this);
        this.handleAlbumNameInput = this.handleAlbumNameInput.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.album !== undefined && this.props.album !== null){
            Promise.resolve(this.props.album).then((value) => { this.setState({album: value}); })
        }
    }

    componentDidUpdate(_,prevState) {
        const {photoValue} = this.state;
        if (photoValue !== prevState.photoValue) {
            this.setPicture(photoValue);
        }

        if(this.state.album !== prevState.album){
            this.setState({
                albumName: this.state.album.album_name,
                privacyValue: this.state.album.privacy,
            });
        }
    }

    onChangePrivacy = (event) => {
        this.setState({privacyValue: event.target.value});
    }

    handleAlbumNameInput = (event) =>{
        this.setState({albumName: event.target.value});
    }

    handleInputFile = () => {
        this.selectInput.current.value = '';
        this.selectInput.current.click();
    }

    updatePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if(e.target.files.length > 0 ){
                for(var i = 0; i < e.target.files.length; i++){
                    const file = e.target.files[i];
                    console.log(file);
                    if(file.type.includes('svg') || file.type.includes('xml')){
                        alert('*.svg files are not allowed.');
                    }
                    else{
                        if(file.type.includes('image') || file.type.includes('video')){
                            this.setState((prevState) => ({
                                photoValue: [...prevState.photoValue, file],
                                photoValueName: [...prevState.photoValueName, file.name],
                            }));
                        }
                        else{
                            alert('Only photo and videos are allowed.');
                        }
                    }
                    
                }
            }
        } else {
            this.setState({photoValue: null});
        }
    }

    setPicture = (parameter) => {
        if (parameter.length > 0) {
            this.setState({image: []}); 
            for (let i = 0; i < parameter.length; i++) {
                if (parameter[i]) {
                    const previewBlob = URL.createObjectURL(parameter[i]);
                    const value = parameter[i];
                    const typeValue = value.type.includes('image') ? 'image' : 'video';
                    var reader = new FileReader();
                    reader.onloadend = (e) => {
                        this.setState((prevState) => ({
                            image: [...prevState.image, {
                                blob: previewBlob,
                                type: typeValue,
                                name: value.name,
                            }],
                        }));
                    };
                    reader.readAsArrayBuffer(parameter[i]);
                }
            }
        }else{
            this.setState({image: []});
        }
    }

    removeItem = (name: string) => {
        const {photoValue} = this.state;
        Object.keys(photoValue).map((item) => {
            const index = toInteger(item);
            if (photoValue[index].name === name) {
                this.setState((prevState) => ({
                    photoValue: [...prevState.photoValue.slice(0, index), ...prevState.photoValue.slice(index + 1)]
                }));
            }
        });
    }

    onUpdateAlbum = () =>{
        const { userId } = this.props;
        const { photoValue, privacyValue, albumName, album} = this.state;
        if(album){
            const uri = new URL('https://localhost:44312/api/crypter/updatealbum');
            const params = {album_id: album.id,user_id: userId, album_name: albumName, privacy: privacyValue};
            uri.search = new URLSearchParams(params);

            const data = new FormData();
            for (let i = 0; i < photoValue.length; i++) {
                data.append('file', photoValue[i]);
            }

            fetch(uri, {
                method: 'POST',
                body: data,
            }).then((response) => response.json()).then((data)=>{
                if (data === 'Posted'){
                    window.location.href = '/albums/myalbums';
                }

                if(data === 'NameError'){
                    this.setState({textError: 'Please add an album name.'});
                }

                if (data === 'No File'){
                    this.setState({textError: 'Please select photo to upload.'});
                }

                if (data === 'Already Exist'){
                    this.setState({textError: 'Album name already exist.'});
                }

                if (data === 'Failed'){
                    this.setState({textError: 'Please try again.'});
                }
            }).catch(error => this.setState({textError: error}));
        }
    }

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        const { privacyValue, image, albumName, album } = this.state;

        let privacyView;
        if(privacyValue === 'private'){
            privacyView = (
                <a className='ms-0 storyprivacyonlymeviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Only you is selected go to your photos and albums'><i className='bi-person'></i> Private</a>
            );
        }
        else if(privacyValue === 'friends'){
            privacyView = (
                <a className='ms-0 storyprivacyfriendsviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Friends is selected go to your photos and albums'><i className='bi-people-fill'></i> Friends</a>
            );
        }
        else{
            privacyView = (
                <a className='ms-0 storyprivacyeveryoneviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Everyone is selected go to your photos and albums'><i className='bi-globe'></i> Everyone</a>
            );
        }

        let nameValue;
        if (albumName) {
            nameValue = (
                <p>
                    <i className='bi-images'></i>
                    <br/>
                    <strong><label>{albumName}</label></strong>
                </p>
            );
        }
        else{
            nameValue = (
                <p>
                    <i className='bi-images'></i>
                    <br/>
                    <strong><label>Ready to add something?</label></strong>
                </p>
            );
        }
        return (
            <>
                <div className='createyourPhotosandyouralbums'>
                    <div className='container'>
                        <form encType='multipart/form-data'>
                            <div className='row'>
                                <div className='col-lg-3 border-end p-4'>
                                    <p><img className='img-fluid mt-2' src={logoDark} alt='logo' title='logo' />
                                        <a className='float-end mt-1 onClickcloseyourphotosandalbums yourphotosandalbums-desktop text-dark' href='/crypter/channels/town-square'><i className='bi-x-circle-fill'></i></a>
                                        <a className='float-end mt-1 onClickcloseyourphotosandalbumsmobile yourphotosandalbums-mobile text-dark' href='/crypter/channels/town-square'><i className='bi-x-circle-fill'></i></a>
                                    </p>
                                    <div>
                                        <h3 className='mt-4 mb-4'>Create album 
                                            <a className='onSelectphotosandalbums float-end' data-bs-toggle='modal' data-bs-target='#staticBackdropAudience'><i className='bi-gear' data-bs-toggle='tooltip' data-bs-placement='top' title='Photos or Albums Setting'></i></a>
                                        </h3>
                                    </div>
                                    <div className='mt-4 mb-4'>
                                        <div className='createalbumsandphotosprivacy'>
                                            {privacyView}
                                        </div>
                                    </div>
                                <div>
                                    <div>
                                        <div className='row g-1'>
                                            <div className='col-12'>
                                            <input type='text' className='form-control' placeholder='Album name' onChange={this.handleAlbumNameInput} value={this.state.albumName} aria-label='Album name'/>
                                            </div>
                                        </div>
                                        {/*<div className='row g-1 mt-1'>
                                            <div className='col-6'>
                                            <input type='text' className='form-control' placeholder='Date' aria-label='Date'/>
                                            </div>
                                            <div className='col-6'>
                                            <input type='text' className='form-control' placeholder='Time' aria-label='Time'/>
                                            </div>
                                        </div>*/}
                                        <div className='row g-1 mt-1'>
                                            <div className='col-12'>
                                            <div className='d-grid gap-2'>
                                            <span>
                                                <input
                                                data-testid='uploadPicture'
                                                ref={this.selectInput}
                                                className='hidden'
                                                type='file'
                                                onChange={this.updatePhoto}
                                                //disabled={this.props.loadingPicture}
                                                aria-hidden={true}
                                                accept='images/*,videos/*'
                                                tabIndex='-1'
                                                multiple/>
                                            </span>
                                                <button type='button' onClick={this.handleInputFile} className='btn-primary p-2' style={{borderRadius: 8,}}><i className='bi-file-earmark-image'></i> Add photos or videos to album</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <hr/>
                                    <div>
                                        <div className='col-12'>
                                            <div className='d-grid gap-2'>
                                                <button type='button' className='btn-primary p-2' style={{borderRadius: 8,}} onClick={() => this.onCreateAlbum()}>Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div className='col-lg-9 right-nav-story'>
                                    <div className='col-12 text-center p-5 uploaded-photos-or-video-goes-here'>
                                        {nameValue}
                                    </div>
                                   <div className='col-12'>
                                        <div className='row'>
                                            {image && image.map((item,index) => {
                                                let render;
                                                let options;
                                                if(item.type === 'image'){
                                                    render = (
                                                        <img className='img-fluid rounded border border-2' src={item.blob} alt=''/>
                                                    );

                                                    options = (
                                                        <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton2'>
                                                            <li><a className='dropdown-item' onClick={() => this.removeItem(item.name)}><i className='bi-x-square-fill x-square-fill-style'></i> Delete photo</a></li>
                                                            {/*<li><a className='dropdown-item' href={item.blob} download={item.name}><i className='bi-download download-style'></i> Download</a></li>
                                                            <li><a className='dropdown-item'><i className='bi-card-image card-image-style'></i> Make profile picture</a></li>
                                                            <li><a className='dropdown-item'><i className='bi-image-alt image-alt-style'></i> Make cover photo</a></li>*/}
                                                        </ul>
                                                    );
                                                }
                                                else{
                                                    render = (
                                                        <video className='img-fluid rounded border border-2' width='400' height='290' controls>
                                                            <source src={item.blob} type='video/ogg' />
                                                        </video>
                                                    );

                                                    options = (
                                                        <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton2'>
                                                            <li><a className='dropdown-item' onClick={() => this.removeItem(item.name)}><i className='bi-x-square-fill x-square-fill-style'></i> Delete Video</a></li>
                                                            {/*<li><a className='dropdown-item' href={item.blob} download={item.name}><i className='bi-download download-style'></i> Download</a></li>*/}
                                                        </ul>
                                                    );
                                                }
                                                return (
                                                    <div className='col-3 text-center mt-1 mb-1' key={`${item}-${index}`}>
                                                        <div className='position-relative'>
                                                            {render}
                                                            <div className='dropdown' style={{zIndex: 99,}}>
                                                                <span className='position-absolute top-0 start-100 translate-middle border-2 border-light rounded-circle padding-actions-photo'>
                                                                    <a className='onEachphotoactions' id='dropdownMenuButton2' data-bs-toggle='dropdown' aria-expanded='true'><i className='bi-pencil-fill text-white'></i></a>
                                                                    {options}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className='photo-and-albums-menu-desktop'>
                                        <div className='position-absolute top-0 end-0 mt-4 me-4'>
                                            {/*<a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                            <br/>
                                            <br/>
                                            <div className='mb-2'></div>
                                            <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                            <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                            <div className='mb-4'></div>*/}
                                            <div className='d-flex'>
                                                <a className='onStoryprofilesettings' id='defaultDropdown' id='dropdownMenuOffset' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                                                <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuOffset'>
                                                <li><a className='dropdown-item' href='profile.html'><i className='bi-person'></i> Profile</a></li>
                                                <li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                                <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>
                                                <li><a className='dropdown-item onSettingsandprivacy'><i className='bi-gear-wide'></i> Settings & Privacy</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='photo-and-albums-menu-mobile'>
                                        {/*<div className='position-absolute top-0 start-50 translate-middle-x mt-3'>
                                            <a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                        </div>
                                        <div className='position-absolute top-0 start-50 translate-middle-x mt-3' style={{margin:'0px 0px 0px 61px',}}>
                                            <a className='onStorymessages' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightLabelchatdesktop' aria-controls='offcanvasRightLabelchatdesktop'><i className='bi-chat-left-text-fill'></i></a>
                                            <span className='position-absolute right-0 start-100 translate-middle badge rounded-pill bg-danger'>14+</span>
                                        </div>*/}
                                        <div className='position-absolute top-0 start-50 translate-middle-x mt-1' style={{margin:'0px 0px 0px -61px',}}>
                                            <div className='d-flex'>
                                                <a className='onStoryprofilesettings' id='defaultDropdown' id='dropdownMenuOffset' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                                                <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuOffset'>
                                                <li><a className='dropdown-item' href='profile.html'><i className='bi-person'></i> Profile</a></li>
                                                <li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                                <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>
                                                <li><a className='dropdown-item onSettingsandprivacy'><i className='bi-gear-wide'></i> Settings & Privacy</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='modal selectaudience' id='staticBackdropAudience' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content shadow-lg'>
                            <div className='modal-header'>
                                <h3 className='modal-title text-story-privacy-title' id='staticBackdropLabel'><i className='bi-lock'></i> Select audience</h3>
                                <a className='onClosephotosandalbumsselectaudience shadow float-end' data-bs-dismiss='modal'><i className='bi-x'></i></a>
                            </div>
                            <div className='modal-body'>
                                <div className='story-privacy-content'>
                                    <div className='row'>
                                        <p><label><strong>Who can see your photos and albums?</strong></label><br/><small>Your photos and albums will be visible 24 hours on Crypter.</small></p>
                                        <div className='col-10'><p><i className='bi-globe'></i> <strong>Everyone</strong> <br/> <small>Everyone on Crypter</small></p></div>
                                            <div className='col-2'>
                                                <div className='form-check float-end'>
                                                    <input className='form-check-input onEveryonestoryprivacy' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='everyone' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'everyone'} name='flexRadioDefault' id='flexRadioEveryonestoryprivacy'/>
                                                    <label className='form-check-label' htmlFor='flexRadioEveryonestoryprivacy'></label>
                                                </div>
                                            </div>
                                        </div>

                                    <div className='row mt-2'>
                                        <div className='col-10'><p><i className='bi-people-fill'></i> <strong>Friends</strong> <br/><small>Only your Crypter friends</small></p></div>
                                        <div className='col-2'>
                                            <div className='form-check float-end'>
                                                    <input className='form-check-input onFriendstoryprivacy' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='friends' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'friends'} name='flexRadioDefault' id='flexRadioFriendstoryprivacy'/>
                                                    <label className='form-check-label' htmlFor='flexRadioFriendstoryprivacy'></label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row mt-2'>
                                        <div className='col-10'><p><i className='bi-person'></i> <strong>Private</strong> <br/><small>Only you see your Story</small></p></div>
                                        <div className='col-2'>
                                            <div className='form-check float-end'>
                                                    <input className='form-check-input onOnlymestoryprivacy' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='private' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'private'} name='flexRadioDefault' id='flexRadioOnlymestoryprivacy'/>
                                                    <label className='form-check-label' htmlFor='flexRadioOnlymestoryprivacy'></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
