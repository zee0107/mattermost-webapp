// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import fillImage from 'images/fill.svg';

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
            <div className='crypter-section-desktop' id="crypter-section" >
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <a className='btn onLockbuttoncreate float-end ms-1'><small>Connect</small></a>
                            <a className='btn onLockbuttoncreatenormal float-end ms-1 me-1'><small>BSC Mainnet</small></a>
                            <a className="btn onLockbuttoncreate float-end me-1"><small>Create</small></a>
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-1 mt-3'><span className='count-steps rounded-circle text-white'>1</span></div>
                        <div className='col-11'>
                            <h6 className='mt-2 mb-3'>Verify Token</h6>
                            <p>Enter the token address and verify</p>
                        </div>
                    </div>
                    <div className='launchpad-create-lock'>
                        <div className='row'>
                            <form>
                                <div className='row'>
                                    <div className='col-12 mt-2 mb-2'>
                                        <label htmlFor='formGroupExampleInput2' className='form-label'><small>* Token Address</small></label>
                                        <input type='text' className='form-control input-create-create-lock-text' id='' placeholder='Ex: PinkMoon' value='Ex: PinkMoon'/>
                                    </div>
                                </div>

                                <div className='row mt-2'>
                                <div className='col-12'>
                                    <small className='float-start mt-1'>Create pool fee: 1 BNB</small>
                                    <button type='button' className='btn btn-sm btn-create-token float-end onCreatetokens'>Create token</button>
                                </div>
                                </div>

                                <div className='row mt-3'>
                                <div className='col-12'>
                                    <p><strong>Currency</strong></p>
                                    <div className='form-check'>
                                    <input className='form-check-input onBnbcurrency' type='radio' name='flexRadioDefault' id='flexRadioDefault1' checked/>
                                    <label className='form-check-label ms-1' htmlFor='flexRadioDefault1'>
                                        BNB
                                    </label>
                                    </div>
                                    <div className='form-check'>
                                    <input className='form-check-input onBusdcurrency' type='radio' name='flexRadioDefault' id='flexRadioDefault2'/>
                                    <label className='form-check-label ms-1' htmlFor='flexRadioDefault2'>
                                        BUSD
                                    </label>
                                    </div>
                                    <div className='form-check'>
                                    <input className='form-check-input onUsdtcurrency' type='radio' name='flexRadioDefault' id='flexRadioDefault3'/>
                                    <label className='form-check-label ms-1' htmlFor='flexRadioDefault3'>
                                        USDT
                                    </label>
                                    </div>
                                    <p>
                                    <small>Users will pay with 
                                        <span className='currencytypebnb'>BNB</span> 
                                        <span className='currencytypebusd'>BUSD</span> 
                                        <span className='currencytypeusdt'>USDT</span>
                                        for your token</small>
                                    </p>
                                </div>
                                </div>

                                <div className='row mt-3'>
                                <div className='col-lg-12 text-center'>
                                    <button type='button' className='btn btn-sm btn-create-token' disabled>Next</button>
                                </div>
                                </div>
                                
                                <div className='row busd-info mt-4'>
                                <div className='col-12'>
                                    <div className='alert alert-warning text-center' role='alert'>
                                        <div className='position-absolute top-0 start-100 translate-middle'>
                                        <a className='float-end onClosebusdinfo shadow'><i className='bi-x'></i></a>
                                        </div>

                                        <small className='text-center'>
                                        <i className='bi-exclamation-circle-fill'></i> Do not use this currency for auto liquidity tokens, or tokens that depend on WETH pair. It will lead to error when finalizing the pool or transfering the tokens (for example Liquidity Generator Token, Baby Token, Buyback Baby Token).Contact Pinksale for more information.</small>
                                    </div>
                                </div>
                                </div>
                            
                            </form>  
                        </div>
                    </div>

                    <div className='row mt-4'>
                    <div className='col-1 mt-3'><span className='count-steps-defaults border border-1 rounded-circle text-dark'>2</span></div>
                    <div className='col-11'>
                        <h6 className='mt-2 mb-3'>Defi Launchpad Info</h6>
                        <p>Enter the launchpad information that you want to raise , that should be enter all details about your presale</p></div>
                    </div>

                    <div className='row mt-4'>
                    <div className='col-1 mt-3'><span className='count-steps-defaults border border-1 rounded-circle text-dark'>3</span></div>
                    <div className='col-11'>
                        <h6 className='mt-2 mb-3'>Additional Info</h6>
                        <p>Let people know who you are</p></div>
                    </div>

                    <div className='row mt-4'>
                    <div className='col-1 mt-3'><span className='count-steps-defaults border border-1 rounded-circle text-dark'>4</span></div>
                    <div className='col-11'>
                        <h6 className='mt-2 mb-3'>Finish</h6>
                        <p>Review your information</p></div>
                    </div>

                    <div className='row'>
                        <div className='col-11 mx-auto text-center mt-4 mb-4'>
                            <small>Disclaimer: The information provided shall not in any way constitute a recommendation as to whether you should invest in any product discussed. We accept no liability for any loss occasioned to any person acting or refraining from action as a result of any material provided or published.</small>
                        </div>
                    </div>

                    </div>
                </div>
                
        );
    }
}
