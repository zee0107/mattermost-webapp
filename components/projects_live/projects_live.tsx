// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import fillImage from 'images/fill.svg';

import homeImage from 'images/homeFeed.png';

import {ModalData} from 'types/actions';
import { ProjectList } from 'mattermost-redux/types/crypto';

type Props = {
    status?: string;
    userId: string;
    autoResetPref?: string;
    projects: Promise<ProjectList[]>;
    actions: {
        openModal: <P>(modalData: ModalData<P>) => void;
        setStatus: (status: UserStatus) => ActionFunc;
        unsetCustomStatus: () => ActionFunc;
        setStatusDropdown: (open: boolean) => void;
    };
    customStatus?: UserCustomStatus;
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
    img_path: string;
};

export default class ProjectsLive extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage,data: []};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.projects != null){
            Promise.resolve(this.props.projects).then(value => {this.setState({data: value});})
        }
    }

    render= (): JSX.Element => {
        return (
            <div className='margin-top-20'>
                <div className='col-md-12 removePadding'>
                    <button type='button' className='btn button-anchor'>All Laucnhpads</button>
                    <button type='button' className='btn button-anchor'>My Contributiions</button>
                    <button type='button' className='btn buttonBgGreen create-lock-btn'>Connect</button>
                    <button type='button' className='btn buttonBgWhite create-lock-btn'>BSC Mainnet</button>
                    <button type='button' className='btn buttonBgWhite create-lock-btn'>Create</button>
                </div>
                <br></br>
                <br></br>
                <div className='col-md-12'>
                    <div className='search-filter-box'>
                        <div className='row'>
                            <input id='seachInput' type='text' className='form-control custom-token-input' placeholder='Enter Token Name or Token Symbol'></input>
                            <div>
                                <label className='small text-secondary'>filter By</label>
                                <select id='fitlerInput' className='form-control custom-token-input'>
                                    <option value='live' selected>live</option>
                                    <option value='ended' selected>Sale Ended</option>
                                </select>
                            </div>
                            <div>
                                <label className='small text-secondary'>Sort By</label>
                                <select id='sortFilter' className='form-control custom-token-input'>
                                    <option value='' selected>No filters</option>
                                    <option value='start'>Start Date</option>
                                    <option value='end'>End Date</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/*<div id='create-lock' className='col-md-12 create-token-box'>
                    <div className='col-md-12'>
                        <h4 className='text-primary'>Create Your Lock</h4>
                    </div>
                    <div className='col-md-12 removePadding border-bot-div'></div>
                    <div className='col-md-12'>
                        <div className='create-lock-input'>
                            <h5 className='text-secondary'>PinkSale is Audited by Certik</h5>
                            <input type='text' className='form-control custom-token-input' placeholder='Ex. https://leaderboard.certik.io/group/links'></input>
                        </div>
                        <div className='create-lock-input'>
                            <h5 className='text-secondary'>Token or LP Token Address</h5>
                            <input type='text' className='form-control custom-token-input' placeholder='Token or LP Token Address'></input>
                        </div>
                        <div className='create-lock-input'>
                            <h5 className='text-secondary'>* Amount</h5>
                            <input type='text' className='form-control custom-token-input' placeholder='Ex. PinkMoon'></input>
                        </div>
                        <div className='create-lock-input'>
                            <h5 className='text-secondary'>Lock Until</h5>
                            <input type='date' className='form-control custom-token-input' placeholder='Select Time'></input>
                        </div>
                        <div className='info-lock-box'>
                            <p className='small-font'>we ensure that featured projects are all completely legitimate, as their ads must undergo a vetting process.</p>
                        </div>
                        <div className='text-center create-lock-input'>
                            <label className='text-secondary'>You will pay <label className='text-percent'>0.00</label> BTC</label>
                            <br></br>
                            <button type='button' className='btn buttonBgWhite'>LOCK</button>
                        </div>
                    </div>
                </div>

                <div className='col-lg-12 text-center margin-top-30-responsive'>
                    <label className='text-secondary small'>Nobody likes scams and Rug Pulls. Here at Crypter, we ensure that featured projects are all completely legitimate, as their ads must undergo a vetting process; this way, we can eliminate promotions of scam projects, so nobody has to suffer the consequences.</label>
                </div>*/}
            </div>
        );
    }
}
