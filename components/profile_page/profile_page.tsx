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
import SplitIcon from 'images/profiles/menu-icon.svg';
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
                                                    <a href='#'><img src={SplitIcon}></img></a>
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
                        <br />
                    </div>
                    <div className="inner-wrap-knowmore">
                        <div className="col-lg-12 marginTopBottom">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className='col-lg-12'>
                                        <div className='row'>
                                            <div className='col-md-6 removePaddingRight'>
                                                <div className='d-flex'>
                                                    <div className='col-sm-2 removePadding'>
                                                        <img src={profPic} className='chat-img'></img>
                                                    </div>
                                                    <div className='col-sm-7 removePadding'>
                                                        <input className='form-control' placeholder='Whats going on, Evan?' />
                                                    </div>
                                                    <div className='col-sm-3 removePadding'>
                                                        <h6><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M13.7555 4.41165H11.7685L10.6215 3.15802H6.86061V4.41165H10.0699L11.217 5.66527H13.7555V13.187H3.72656V7.54571H2.47293V13.187C2.47293 13.8765 3.03706 14.4406 3.72656 14.4406H13.7555C14.445 14.4406 15.0092 13.8765 15.0092 13.187V5.66527C15.0092 4.97578 14.445 4.41165 13.7555 4.41165ZM5.60699 9.42614C5.60699 11.1561 7.01105 12.5602 8.74105 12.5602C10.4711 12.5602 11.8751 11.1561 11.8751 9.42614C11.8751 7.69614 10.4711 6.29208 8.74105 6.29208C7.01105 6.29208 5.60699 7.69614 5.60699 9.42614ZM8.74105 7.54571C9.77529 7.54571 10.6215 8.3919 10.6215 9.42614C10.6215 10.4604 9.77529 11.3066 8.74105 11.3066C7.70681 11.3066 6.86061 10.4604 6.86061 9.42614C6.86061 8.3919 7.70681 7.54571 8.74105 7.54571ZM3.72656 4.41165H5.60699V3.15802H3.72656V1.27759H2.47293V3.15802H0.592499V4.41165H2.47293V6.29208H3.72656V4.41165Z" fill="var(--text-primary)"/>
                                                            </svg></h6>
                                                        <h6></h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-3removePaddingRight'>
                                                <select className='form-control'>
                                                    <option value='Everyone'><i class="bi bi-globe"></i> Everyone</option>
                                                    <option value='Friends'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-people" viewBox="0 0 16 16">
                                                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                                                    </svg> Friends Only</option>
                                                    <option value='Private'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-person" viewBox="0 0 16 16">
                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                                    </svg> Private</option>
                                                </select>
                                            </div>
                                            <div className='col-md-3 removePaddingRight'>
                                                <a href='#' className='btn buttonBgWhite btn-margin-right'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-camera-video" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
                                                </svg> Live</a>
                                                <a href='#' className='btn buttonBgGreen'>Share</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-12'>
                                        <h1>No Post</h1>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className='col-lg-12'>
                                            
                                    </div>
                                    <br />
                                    <div className='col-lg-12 chat-box removePadding'>
                                        <div className='d-flex'>
                                            <div className='col-lg-4'>
                                                <div className='d-flex'>
                                                    <div className='col-sm-3'>
                                                        <h4>
                                                            <a href='#' title='Personal Chat'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-person" viewBox="0 0 16 16">
                                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                                            </svg></a>
                                                        </h4>
                                                    </div>
                                                    <div className='col-sm-3'>
                                                        <h4>
                                                            <a href='#' title='Group Chat'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-people" viewBox="0 0 16 16">
                                                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                                                            </svg></a>
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-4 text-center'>
                                                <h4 className='getStartPrimaryText'>Chat</h4>
                                            </div>
                                            <div className='col-lg-4 chat-setting'>
                                                <h4><a href='#' title='Settings'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-gear" viewBox="0 0 16 16">
                                                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                                </svg></a>
                                                </h4>
                                            </div>
                                        </div>
                                        <br />
                                        <div className='col-lg-12 chat-hover removePadding'>
                                            <div className='d-flex'>
                                                <div className='col-lg-3 marginTopImg'>
                                                    <img src={profPic} className='chat-img'></img>
                                                </div>
                                                <div className='col-lg-9 removePaddingLeft'>
                                                    <div className='d-flex'>
                                                        <div className='col-sm-6 removePaddingLeft'>
                                                            <h6>Allysa Kate</h6>
                                                        </div>
                                                        <div className='col-sm-6 removePaddingLeft text-end small'>
                                                            <h6>Today, 12:04</h6>
                                                        </div>
                                                    </div>
                                                    <h6>A Facebook-like platform...</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-12 chat-hover removePadding'>
                                            <div className='d-flex'>
                                                <div className='col-lg-3 marginTopImg'>
                                                    <img src={profPic} className='chat-img'></img>
                                                </div>
                                                <div className='col-lg-9 removePaddingLeft'>
                                                    <div className='d-flex'>
                                                        <div className='col-sm-6 removePaddingLeft'>
                                                            <h6>Mark Olympus</h6>
                                                        </div>
                                                        <div className='col-sm-6 removePaddingLeft text-end small'>
                                                            <h6>Today, 12:04</h6>
                                                        </div>
                                                    </div>
                                                    <h6>A Facebook-like platform...</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-12 chat-hover removePadding'>
                                            <div className='d-flex'>
                                                <div className='col-lg-3 marginTopImg'>
                                                    <img src={profPic} className='chat-img'></img>
                                                </div>
                                                <div className='col-lg-9 removePaddingLeft'>
                                                    <div className='d-flex'>
                                                        <div className='col-sm-6 removePaddingLeft'>
                                                            <h6>Janine Tenoso</h6>
                                                        </div>
                                                        <div className='col-sm-6 removePaddingLeft text-end small'>
                                                            <h6>Today, 12:04</h6>
                                                        </div>
                                                    </div>
                                                    <h6>A Facebook-like platform...</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
