// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

import {ServerError} from 'mattermost-redux/types/errors';
import {isEmail} from 'mattermost-redux/utils/helpers';
import logoImage from 'images/logoWhite.png';
import homeImage from 'images/homeFeed.png';
import homedarkImage from 'images/homeFeed-dark.png';
import coverImage from 'images/cover-photo.png';
import profPic from 'images/profiles/user-profile-1.png'
import ImgIcon from 'images/profiles/image.svg';
import LayoutIcon from 'images/profiles/columns-gap.svg';
import MusicIcon from 'images/profiles/music-note-beamed.svg';
import VideoIcon from 'images/profiles/camera-video.svg';
import GeoIcon from 'images/profiles/geo-alt.svg';
import AttachIcon from 'images/profiles/paperclip.svg';
import buildImage from 'images/icons/get-started-icon-3.png';
import profilesImage from 'images/profiles.svg';


import BackButton from 'components/common/back_button';
import LocalizedInput from 'components/localized_input/localized_input';
import Carousel from 'components/carousel/carousel'

import {t} from 'utils/i18n.jsx';
import { ThemeConsumer } from 'styled-components';

interface Props {
    actions: {
        sendPasswordResetEmail: (email: string) => Promise<{data: any; error: ServerError}>;
    };
}

interface State {
    error: React.ReactNode;
    updateText: React.ReactNode;
    isDark: string;
    img_path: string;
}

export default class ProfilPage extends React.PureComponent<Props, State> {
    state = {
        error: null,
        updateText: null,
        isDark:'light',
        img_path: homeImage,
    };

    resetForm = React.createRef<HTMLFormElement>();
    emailInput = React.createRef<HTMLInputElement>();

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    componentDidUpdate(){
        if(this.props.mode === 'dark'){
            this.setState({img_path: homedarkImage});
        }
        else{
            this.setState({img_path: homeImage});
        }
    }

    handleSendLink = async (e: React.FormEvent) => {
        e.preventDefault();

        const email = this.emailInput.current!.value.trim().toLowerCase();
        if (!email || !isEmail(email)) {
            this.setState({
                error: (
                    <FormattedMessage
                        id='password_send.error'
                        defaultMessage='Please enter a valid email address.'
                    />
                ),
            });
            return;
        }

        // End of error checking clear error
        this.setState({error: null});

        const {data, error} = await this.props.actions.sendPasswordResetEmail(email);
        if (data) {
            this.setState({
                error: null,
                updateText: (
                    <div
                        id='passwordResetEmailSent'
                        className='reset-form alert alert-success'
                    >
                        <FormattedMessage
                            id='password_send.link'
                            defaultMessage='If the account exists, a password reset email will be sent to:'
                        />
                        <div>
                            <b>{email}</b>
                        </div>
                        <br/>
                        <FormattedMessage
                            id='password_send.checkInbox'
                            defaultMessage='Please check your inbox.'
                        />
                    </div>
                ),
            });
            if (this.resetForm.current) {
                this.resetForm.current.hidden = true;
            }
        } else if (error) {
            this.setState({
                error: error.message,
                updateText: null,
            });
        }
    };
    

    render() {
        let error = null;

        /*if(this.props.mode === 'dark'){
            imgFeed = (
                <img src={homedarkImage}></img>
            );
        }else{
            imgFeed = (
                <img src={homeImage}></img>
            );
        }*/

        if (this.state.error) {
            error = (
                <div className='form-group has-error'>
                    <label className='control-label'>{this.state.error}</label>
                </div>
            );
        }

        let formClass = 'form-group';
        if (error) {
            formClass += ' has-error';
        }

        return (
            <div>
                <div className='col-sm-12 bodyBgElipseProfile bgGrey removePadding'>
                    <div className="inner-wrap-section">
                        <div className='d-flex'>
                            <div className="col-lg-12">
                                <img className='img-cover' src={coverImage}></img>
                            </div>
                            <div className='col-lg-6 profile-div'>
                                <div className='row'>
                                    <div className='col-lg-4 profile-details-box'>
                                        <div className='row'>
                                            <div className='col-lg-4 profile-img-div'>
                                                <img src={profPic} className='profile-img-box'></img>
                                            </div>
                                            
                                            <div className='col-lg-8'>
                                                <h3>Evan Yates</h3>
                                                <h5>@evanyates</h5>
                                                <h5>New york City, Ny</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-1'></div>
                                    <div className='col-lg-7'>
                                        <div className='col-lg-12 profile-count-box'>
                                            <div className='d-flex'>
                                                <div className='col-lg-3'>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <h5>Post</h5>
                                                    <h4>2.0k</h4>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <h5>Following</h5>
                                                    <h4>2.0k</h4>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <h5>Followers</h5>
                                                    <h4>2.0k</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-12 profile-menu-box'>
                                            <div className='d-flex'>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={LayoutIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={ImgIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={ImgIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={VideoIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={MusicIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={AttachIcon}></img></a>
                                                </div>
                                                <div className='col-lg-2 profile-menu-icon'>
                                                    <a href='#'><img src={GeoIcon}></img></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className='inner-wrap-knowmore'>
                        <div className='row'>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
