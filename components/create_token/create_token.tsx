// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';

import homeImage from 'images/homeFeed.png';

import {ModalData} from 'types/actions';

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

export default class CreateToken extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '', allCrypto: [],trendCrypto: [],newCrypto: [],gainerCrypto: []}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    render= (): JSX.Element => {
        return (
            <div id="createToken" className='col-lg-12'>
                <div className='d-flex margin-top-30-responsive'>
                    <div className='col-lg-2'>
                        <div className='d-flex'>
                            <img src={fillImage} className='fill-img'></img>
                            <p className='fill-text'>1</p>
                        </div>
                    </div>
                    <div className='col-lg-10 removePaddingLeft'>
                        <h3 className='text-primary'>Verify Token</h3>
                        <p className='text-primary'>Please enter your verification token from your account.</p>
                    </div>
                </div>
                <div className='create-token-box'>
                    <h4 className='text-primary'>* Token Address</h4>
                    <input type='text' className='form-control custom-token-input' placeholder='Ex. PinkMoon'></input>
                    <div className='d-flex padding-top'>
                        <div className='col-md-6 width-50'>
                            <label className='currency-value-text small'>Create Pool Fee: 1 BNB</label>
                        </div>
                        <div className='col-md-6 token-buttom-div'>
                            <button type='button' className='btn buttonBgWhite'>Create Token</button>
                        </div>
                    </div>
                </div>
                <div className='d-flex margin-top-30-responsive'>
                    <div className='col-lg-2'>
                        <div className='d-flex'>
                            <img src={fillImage} className="fill-img"></img>
                            <p className='fill-text'>2</p>
                        </div>
                    </div>
                    <div className='col-lg-10 removePaddingLeft'>
                        <h3 className='text-primary'>Defi Launchpad Info</h3>
                        <p className='text-primary'>Fill in your defi launchpad information</p>
                    </div>
                </div>
                <div className='d-flex margin-top-30-responsive'>
                    <div className='col-lg-2'>
                        <div className='d-flex'>
                            <img src={fillImage} className="fill-img"></img>
                            <p className='fill-text'>3</p>
                        </div>
                    </div>
                    <div className='col-lg-10 removePaddingLeft'>
                        <h3 className='text-primary'>Additional Info</h3>
                        <p className='text-primary'>Othre information.</p>
                    </div>
                </div>
                <div className='d-flex margin-top-30-responsive'>
                    <div className='col-lg-2'>
                        <div className='d-flex'>
                            <img src={fillImage} className="fill-img"></img>
                            <p className='fill-text'>4</p>
                        </div>
                    </div>
                    <div className='col-lg-10 removePaddingLeft'>
                        <h3 className='text-primary'>Finish</h3>
                        <p className='text-primary'>Save all information to your launchpad.</p>
                    </div>
                </div>

                <div className='col-lg-12 text-center margin-top-30-responsive'>
                    <label className='text-secondary small'>Nobody likes scams and Rug Pulls. Here at Crypter, we ensure that featured projects are all completely legitimate, as their ads must undergo a vetting process; this way, we can eliminate promotions of scam projects, so nobody has to suffer the consequences.</label>
                </div>
            </div>
        );
    }
}
