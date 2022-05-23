// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import logoDark from 'images/logoBlack.png';
import postImage from 'images/post-1.png';
import $ from 'jquery';
import { throws } from 'assert';

type Props = {
    status?: string;
    userId: string;
    autoResetPref?: string;
    actions: {
        openModal: <P>(modalData: ModalData<P>) => void;
        setStatus: (status: UserStatus) => ActionFunc;
        unsetCustomStatus: () => ActionFunc;
        setStatusDropdown: (open: boolean) => void;
    };
    customStatus?: UserCustomStatus;
    profilePicture: string;
    currentUser: UserProfile;
    isCustomStatusEnabled: boolean;
    isCustomStatusExpired: boolean;
    isMilitaryTime: boolean;
    isStatusDropdownOpen: boolean;
    showCustomStatusPulsatingDot: boolean;
    timezone?: string;
    globalHeader?: boolean;
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    photoStory: boolean;
    textStory: boolean;
    addText: boolean;
    bgColor: string;
    bgColorText: string;
    textColor: string;
    privacyValue: string;
    textValue: string;
    colorValue: string
    textError?: string;
    photoValue: string;
    photoValueName: string;
    prevName: string;
};

export default class CreateStory extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {photoValue: '',photoValueName: '',prevName: '',image: null,photoStory: false,textStory: false, openUp: false, width: 0, isStatusSet: false, isDark:'light', privacyValue: 'everyone', addText: false,bgColor: '#222222',textColor:'#ffffff',bgColorText: 'transparent'};

        
        this.selectInput = React.createRef();

        this.onChangePrivacy = this.onChangePrivacy.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    componentDidUpdate() {
        if (this.state.photoValueName === this.state.prevName) {
            this.setPicture(this.state.photoValue);
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

    onChangePrivacy = (event) => {
        this.setState({privacyValue: event.target.value});
    }

    onChangeBackground = (color: string) => {
        this.setState({bgColor: color});
    }

    onChangeBackgroundText = (color: string) => {
        this.setState({bgColorText: color});
    }

    onChangeColor = (color: string) => {
        this.setState({textColor: color});
    }

    onChangeText = (event) => {
        this.setState({textValue: event.target.value});
    }

    handleInputFile = () => {
        this.selectInput.current.value = '';
        this.selectInput.current.click();
    }
    
    updatePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            this.setState({photoValue: e.target.files[0],photoValueName: e.target.files[0].name});
            if(this.state.prevName !== this.state.photoValueName){
                this.setState({prevName: this.state.photoValueName});
            }
        } else {
            this.setState({photoValue: null});
        }
    }


    onShareTextStory = () =>{
        const { userId } = this.props;
        const {textValue, textColor, bgColor, privacyValue} = this.state;
        let textData;
        if(textValue === undefined){
            textData = '';
        }
        else{
            textData = textValue;
        }
        const uri = new URL('https://crypterfighter.polywickstudio.ph/api/crypter/CreateStories');
        const params = {user_id: userId, type: 'text', text: textData, bg_color: bgColor, text_color: textColor, privacy: privacyValue};
        uri.search = new URLSearchParams(params);

        fetch(uri, {
            method: 'POST',
        }).then((response) => response.json()).then((data)=>{
            if (data === 'Posted'){
                window.location.href = '/crypter/channels/town-square';
            }
            if (data === 'Empty'){
                this.setState({textError: 'Please add message to your story.'});
            }
            if (data === 'Failed'){
                this.setState({textError: 'Please try again later.'});
            }
        }).catch(error => this.setState({textError: error}));
    }

    onSharePhotoStory = () =>{
        const { userId } = this.props;
        const {textValue, textColor, bgColor, privacyValue} = this.state;
        let textData;
        if(textValue === undefined){
            textData = '';
        }
        else{
            textData = textValue;
        }
        const uri = new URL('https://crypterfighter.polywickstudio.ph/api/crypter/CreateStories');
        const params = {user_id: userId, type: 'text', text: textData, bg_color: bgColor, text_color: textColor, privacy: privacyValue};
        uri.search = new URLSearchParams(params);

        fetch(uri, {
            method: 'POST',
            body: this.state.photoValue,
        }).then((response) => response.json()).then((data)=>{
            if (data === 'Posted'){
                window.location.href = '/crypter/channels/town-square';
            }

            if (data === 'Not exist'){
                this.setState({textError: 'Please select photo to upload.'});
            }
        }).catch(error => this.setState({textError: error}));
    }

    setPicture = (file) => {
        if (file) {
            this.previewBlob = URL.createObjectURL(file);

            var reader = new FileReader();
            reader.onload = (e) => {
                //const orientation = FileUtils.getExifOrientation(e.target.result);
                //const orientationStyles = FileUtils.getOrientationStyles(orientation);

                this.setState({
                    image: this.previewBlob,
                });
            };
            reader.readAsArrayBuffer(file);
        }
    }

    jQueryCode = () => {
        $(document).ready(function () {
            $('#draggable').draggable();
          });

        $(document).ready(function () {
          $('#resizable').resizable();
        });
    }

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        const { photoStory, textStory,privacyValue, addText } = this.state;
        let addTextView;
        let addTextClose;
        if(addText){
            addTextView = (
                <>
                    <div className='add-text-on-photo animated fadeIn'>
                        <div id='draggable' className='ui-widget-content'>
                            <div>
                                <div className='form-floating'>
                                    <textarea style={{height: 150,backgroundColor: `${this.state.bgColorText}`,color: `${this.state.textColor}`}} className='form-control text-start-styping' placeholder='Start typing' id='floatingTextarea'></textarea>
                                    <label htmlFor='floatingTextarea'>Start typing</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );

            addTextClose = (
                <a className='onClosetexttypings shadow float-end' onClick={() => { this.setState({addText: false}); }}><i className='bi-x'></i></a>
            );
        }
        let sidePhotoMenu;
        let sideTextMenu;
        let photoPreview;
        let textPreview;
        if(photoStory){
            sidePhotoMenu = (
                <div className='create-photo-story-box'>
                    <p><a className='onAddtextonphoto' onClick={() => { this.setState({addText: true}); }}><i className='bi-textarea-t'></i> <strong>Add Text</strong></a></p>
                    <div className='col-12 mx-auto mt-5 mb-1 border p-3 rounded'>
                        <div className='row'>
                                <p className='mb-2'><strong><label>Text color</label></strong></p>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#ffffff')}} style={{backgroundColor: '#ffffff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#222222')}} style={{backgroundColor: '#222222',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#fc0303')}} style={{backgroundColor: '#fc0303',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#ffff00')}} style={{backgroundColor: '#ffff00',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#bfff00')}} style={{backgroundColor: '#bfff00',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#7bff00')}} style={{backgroundColor: '#7bff00',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#2fff00')}} style={{backgroundColor: '#2fff00',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#15b02a')}} style={{backgroundColor: '#15b02a',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#0ccc56')}} style={{backgroundColor: '#0ccc56',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#00fcb5')}} style={{backgroundColor: '#00fcb5',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#00ffff')}} style={{backgroundColor: '#00ffff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#00a2ff')}} style={{backgroundColor: '#00a2ff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#006eff')}} style={{backgroundColor: '#006eff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#0040ff')}} style={{backgroundColor: '#0040ff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#9608fc')}} style={{backgroundColor: '#9608fc',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#dd07f5')}} style={{backgroundColor: '#dd07f5',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#cf08c1')}} style={{backgroundColor: '#cf08c1',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#eb0989')}} style={{backgroundColor: '#eb0989',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#eb0967')}} style={{backgroundColor: '#eb0967',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#0f1270')}} style={{backgroundColor: '#0f1270',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#a3ab0c')}} style={{backgroundColor: '#a3ab0c',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#cf8151')}} style={{backgroundColor: '#cf8151',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#87160e')}} style={{backgroundColor: '#87160e',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#0e8781')}} style={{backgroundColor: '#0e8781',}}></div>
                        </div>
                    </div>
                    <div className='col-12 mx-auto mt-5 mb-1 border p-3 rounded'>
                        <div className='row'>
                                <p className='mb-2'><strong><label>Backgrounds</label></strong></p>
                                <div className='col-1 border border-3 text-center text-dark pe-4 pt-1 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('transparent')}} style={{backgroundColor: '#transparent',}}><i class="bi bi-slash-lg"></i></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#ffffff')}} style={{backgroundColor: '#ffffff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#fc0303')}} style={{backgroundColor: '#fc0303',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#ffff00')}} style={{backgroundColor: '#ffff00',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#bfff00')}} style={{backgroundColor: '#bfff00',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#7bff00')}} style={{backgroundColor: '#7bff00',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#2fff00')}} style={{backgroundColor: '#2fff00',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#15b02a')}} style={{backgroundColor: '#15b02a',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#0ccc56')}} style={{backgroundColor: '#0ccc56',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#00fcb5')}} style={{backgroundColor: '#00fcb5',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#00ffff')}} style={{backgroundColor: '#00ffff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#00a2ff')}} style={{backgroundColor: '#00a2ff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#006eff')}} style={{backgroundColor: '#006eff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#0040ff')}} style={{backgroundColor: '#0040ff',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#9608fc')}} style={{backgroundColor: '#9608fc',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#dd07f5')}} style={{backgroundColor: '#dd07f5',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#cf08c1')}} style={{backgroundColor: '#cf08c1',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#eb0989')}} style={{backgroundColor: '#eb0989',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#eb0967')}} style={{backgroundColor: '#eb0967',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#0f1270')}} style={{backgroundColor: '#0f1270',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#a3ab0c')}} style={{backgroundColor: '#a3ab0c',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#cf8151')}} style={{backgroundColor: '#cf8151',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#87160e')}} style={{backgroundColor: '#87160e',}}></div>
                                <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackgroundText('#0e8781')}} style={{backgroundColor: '#0e8781',}}></div>
                        </div>
                    </div>
                    <div className='row mt-4'>
                        <div className='btn-group gap-1' role='group' aria-label='Button discard and share to story'>
                        <a className='btn btn-primary btn-discard onClickdiscardphotostory' onClick={() => { this.setState({photoStory: false,textStory: false});}}>Discard</a>
                        <a className='btn btn-primary btn-share-to-story'>Share to story</a>
                    </div>
                </div>
            </div>
            );

            photoPreview = (
                <>
                    {/*Previews Create photo story*/}
                    <div className='create-photo-story-previews'>
                        <strong><label>Previews</label></strong>
                        {addTextClose}
                        <div className='previews-photo-content mt-6 mb-1'>
                            <div className='col-lg-12'>
                                <div style={{ background: `url(${this.state.image}) no-repeat top center`,}} className='photo-story-uploaded rounded' id='resizable'>
                                    {addTextView}
                                </div>
                            </div>
                        </div>
                        <span>
                            <input
                            data-testid='uploadPicture'
                            ref={this.selectInput}
                            className='hidden'
                            accept='image/*'
                            type='file'
                            onChange={this.updatePhoto}
                            //disabled={this.props.loadingPicture}
                            aria-hidden={true}
                            tabIndex='-1'/>
                        </span>
                        
                        <p className='text-center' onClick={this.handleInputFile}><strong>Browse photo</strong></p>
                    </div>
                    {this.state.textError && <span className='small text-center text-danger'>{this.state.textError}</span>}
                    {/*Previews Create photo story*/}
                </>
            )
        }

        if(textStory){
            sideTextMenu = (
                <div className='create-text-story-box'>
                    <div className='form-floating'>
                        <textarea style={{height: 180,}} className='form-control' onChange={this.onChangeText} value={this.state.textValue} placeholder='Start typing'></textarea>
                        <label htmlFor='floatingTextarea'>Start typing</label>
                        {this.state.textError && <span className='small text-danger'>{this.state.textError}</span>}
                        
                        </div>
                        <div className='col-12 mx-auto mt-5 mb-1 border p-3 rounded'>
                            <div className='row'>
                                    <p className='mb-2'><strong><label>Text color</label></strong></p>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#ffffff')}} style={{backgroundColor: '#ffffff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#222222')}} style={{backgroundColor: '#222222',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#fc0303')}} style={{backgroundColor: '#fc0303',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#ffff00')}} style={{backgroundColor: '#ffff00',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#bfff00')}} style={{backgroundColor: '#bfff00',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#7bff00')}} style={{backgroundColor: '#7bff00',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#2fff00')}} style={{backgroundColor: '#2fff00',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#15b02a')}} style={{backgroundColor: '#15b02a',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#0ccc56')}} style={{backgroundColor: '#0ccc56',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#00fcb5')}} style={{backgroundColor: '#00fcb5',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#00ffff')}} style={{backgroundColor: '#00ffff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#00a2ff')}} style={{backgroundColor: '#00a2ff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#006eff')}} style={{backgroundColor: '#006eff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#0040ff')}} style={{backgroundColor: '#0040ff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#9608fc')}} style={{backgroundColor: '#9608fc',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#dd07f5')}} style={{backgroundColor: '#dd07f5',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#cf08c1')}} style={{backgroundColor: '#cf08c1',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#eb0989')}} style={{backgroundColor: '#eb0989',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#eb0967')}} style={{backgroundColor: '#eb0967',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#0f1270')}} style={{backgroundColor: '#0f1270',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#a3ab0c')}} style={{backgroundColor: '#a3ab0c',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#cf8151')}} style={{backgroundColor: '#cf8151',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#87160e')}} style={{backgroundColor: '#87160e',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeColor('#0e8781')}} style={{backgroundColor: '#0e8781',}}></div>
                            </div>
                        </div>
                        <div className='col-12 mx-auto mt-5 mb-1 border p-3 rounded'>
                            <div className='row'>
                                    <p className='mb-2'><strong><label>Backgrounds</label></strong></p>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#222222')}} style={{backgroundColor: '#222222',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#ffffff')}} style={{backgroundColor: '#ffffff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#fc0303')}} style={{backgroundColor: '#fc0303',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#ffff00')}} style={{backgroundColor: '#ffff00',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#bfff00')}} style={{backgroundColor: '#bfff00',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#7bff00')}} style={{backgroundColor: '#7bff00',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#2fff00')}} style={{backgroundColor: '#2fff00',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#15b02a')}} style={{backgroundColor: '#15b02a',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#0ccc56')}} style={{backgroundColor: '#0ccc56',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#00fcb5')}} style={{backgroundColor: '#00fcb5',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#00ffff')}} style={{backgroundColor: '#00ffff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#00a2ff')}} style={{backgroundColor: '#00a2ff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#006eff')}} style={{backgroundColor: '#006eff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#0040ff')}} style={{backgroundColor: '#0040ff',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#9608fc')}} style={{backgroundColor: '#9608fc',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#dd07f5')}} style={{backgroundColor: '#dd07f5',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#cf08c1')}} style={{backgroundColor: '#cf08c1',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#eb0989')}} style={{backgroundColor: '#eb0989',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#eb0967')}} style={{backgroundColor: '#eb0967',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#0f1270')}} style={{backgroundColor: '#0f1270',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#a3ab0c')}} style={{backgroundColor: '#a3ab0c',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#cf8151')}} style={{backgroundColor: '#cf8151',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#87160e')}} style={{backgroundColor: '#87160e',}}></div>
                                    <div className='col-1 border border-3 text-center text-white p-3 rounded-circle mt-1 ml-1' onClick={() => { this.onChangeBackground('#0e8781')}} style={{backgroundColor: '#0e8781',}}></div>
                            </div>
                        </div>

                        <div className='row mt-3'>
                            <div className='btn-group gap-1' role='group' aria-label='Button discard and share to story'>
                            <a className='btn btn-primary btn-discard onClickdiscard' onClick={() => { this.setState({photoStory: false,textStory: false});}}>Discard</a>
                            <a className='btn btn-primary btn-share-to-story' onClick={() => this.onShareTextStory()}>Share to story</a>
                            </div>
                        </div>
                </div>
            );

            textPreview = (
                <>
                    {/*Previews Create text story*/}
                    <div className='create-text-story-previews'>
                        <strong><label>Previews</label></strong>

                        <div className='previews-content mt-3 mb-3 text-center' style={{backgroundColor: `${this.state.bgColor}`}}>
                            <div className='container'>
                                <h3><strong className='text-center' style={{overflowWrap: 'break-word',color: `${this.state.textColor}`}}>{this.state.textValue}</strong></h3>
                            </div>
                        </div>

                    </div>
                    {/*Previews Create text story*/}
                </>
            );
        }

        let rightNav;
        if(!photoStory && !textStory){
            rightNav = (
                <div className='row gx-5'>
                    <div className='col' onClick={() => { this.setState({photoStory: true,textStory: false});}}>
                        <div className='p-3 border bg-light text-center create-photo-story onCreatephotostory'><p className='text-white'><i className='bi-image text-white'></i><br/>Create a photo story</p></div>
                    </div>
                    <div className='col' onClick={() => { this.setState({photoStory: false,textStory: true});}}>
                        <div className='p-3 border bg-light text-center create-text-story onCreatetextstory'><p className='text-white'><i className='bi-textarea-t text-white'></i><br/>Create a text story</p></div>
                    </div>
                </div>
            );
        }

        let privacyDetails;
        if(privacyValue === 'private'){
            privacyDetails = (
                <a className='storyprivacyonlymeviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Private is selected go to your story privacy to change your privacy'><i className='bi-person'></i> Private</a>
            );
        }else if(privacyValue === 'friends'){
            privacyDetails = (
                <a className='storyprivacyfriendsviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Friends is selected go to your story privacy to change your privacy'><i className='bi-people-fill'></i> Friends</a>
            );
        }else{
            privacyDetails = (
                <a className='storyprivacyeveryoneviews' data-bs-toggle='tooltip' data-bs-placement='bottom' title='Everyone is selected go to your story privacy to change your privacy'><i className='bi-globe'></i> Everyone</a>
            );
        }

        return (
            <>
                <div className='slidebarStory'>
                    <div className='col-md-12'>
                        <form>
                            <div className='row'>
                    
                                <div className='col-lg-2 border-end p-4'>
                                <p><img className='img-fluid mt-2' src={logoDark} alt='logo' title='logo'/><a href='/crypter/towm-square' className='float-end mt-1 onClickclosestory'><i className='bi-x-circle-fill'></i></a></p>
                                <div>
                                    <h2 className='mt-4'>Your Story <a className='onStoryprivacy float-end' data-bs-toggle='tooltip' data-bs-placement='top' title='Story privacy'><i className='bi-gear' data-bs-toggle='modal' data-bs-target='#staticBackdropPrivacy'></i></a></h2>
                                </div>
                                <div className='mt-5'>
                                    {this.renderProfilePicture('xl')}
                                    {/*<img className='img-fluid circle-rounded mr-2 mt-3' src='assets/images/sample-user-primary-picture-6.png'/>*/}
                                    <label className='mt-2' style={{verticalAlign: 'middle',}}>
                                        <strong style={{fontSize: 12}}>{currentUser.first_name}</strong>
                                        <div className='yourstoryprivacytext'>
                                            {privacyDetails}
                                        </div>
                                    </label>
                                </div>
                                <hr/>
                                {sidePhotoMenu}
                                {sideTextMenu}
                                </div>
                                <div className='col-lg-10 right-nav-story'>
                                    <div className='position-absolute top-0 end-0 mt-4 mr-4'>
                                        {/*<a className='onStorynotifications' data-bs-toggle='offcanvas' data-bs-target='#offcanvasRightnotificationdesktop' aria-controls='offcanvasRightnotificationdesktop'><i className='bi-bell-fill'></i></a>
                                        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>39+</span>
                                        <br/>
                                        <br/>
                                        <div className='mb-1'></div>*/}
                    
                                        <div className='d-flex'>
                                        <a className='onStoryprofilesettings' id='defaultDropdown' id='dropdownMenuOffset' data-bs-toggle='dropdown' aria-expanded='false' data-bs-offset='10,20'><i className='bi-chevron-compact-down'></i></a>
                    
                                        <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuOffset'>
                                            <li><a className='dropdown-item text-dark' href='profile.html'><i className='bi-person'></i> Profile</a></li>
                                            {/*<li><a className='dropdown-item onGivefeedback'><i className='bi-exclamation-square'></i> Give Feedback</a></li>
                                            <li><a className='dropdown-item onHelpsupport'><i className='bi-question-diamond'></i> Help & Support</a></li>*/}
                                            <li><a className='dropdown-item onSettingsandprivacy text-dark'><i className='bi-gear-wide'></i> Sign out</a></li>
                                        </ul>
                    
                                        </div>
                                    </div>

                                    <div className='container px-4'>
                                        {rightNav}
                                        <div className='row'>
                                            {textPreview}
                                            {photoPreview}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='modal selectstoryprivacy' id='staticBackdropPrivacy' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content shadow-lg'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>Story privacy</h6>
                                <a className='onClosestoryprivacy shadow float-end' data-bs-dismiss='modal'><i className='bi-x'></i></a>
                            </div>
                            <div className='modal-body'>
                                <div className='row'>
                                    <p><label><strong>Who can see your story?</strong></label><br/><small>Your story will be visible 24 hours on Crypter and Crypter Msg</small></p>
                                    <div className='col-10'><p><i className='bi-globe'></i> <strong>Everyone</strong> <br/> <small>Everyone on Crypter</small></p></div>
                                    <div className='col-2'>
                                        <div className='form-check float-end'>
                                            <input className='form-check-input onEveryonestoryprivacy' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='everyone' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'everyone'} id='flexRadioEveryonestoryprivacy'/>
                                            <label className='form-check-label' htmlFor='flexRadioEveryonestoryprivacy'></label>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-10'><p><i className='bi-people-fill'></i> <strong>Friends</strong> <br/><small>Only your Crypter friends</small></p></div>
                                    <div className='col-2'>
                                        <div className='form-check float-end'>
                                                <input className='form-check-input onFriendstoryprivacy' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='friends' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'friends'}  id='flexRadioFriendstoryprivacy'/>
                                                <label className='form-check-label' htmlFor='flexRadioFriendstoryprivacy'></label>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-10'><p><i className='bi-person'></i> <strong>Private</strong> <br/><small>Only you see your Story</small></p></div>
                                    <div className='col-2'>
                                        <div className='form-check float-end'>
                                                <input className='form-check-input onOnlymestoryprivacy' type='radio' data-bs-dismiss='modal' name='flexRadioDefault' value='private' onChange={this.onChangePrivacy} checked={this.state.privacyValue === 'private'} id='flexRadioOnlymestoryprivacy'/>
                                                <label className='form-check-label' htmlFor='flexRadioOnlymestoryprivacy'></label>
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
