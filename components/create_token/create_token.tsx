// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import fillImage from 'images/fill.svg';

import CronosImg from 'images/launchpad/network/ic-cronos.5a2dbab3.svg';
import FantomImg from 'images/launchpad/network/ic-fantom.306f76f9.svg';
import AvaxImg from 'images/launchpad/network/ic-avax.234db155.svg';
import KucoinImg from 'images/launchpad/network/KuCoin.png';
import MaticImg from 'images/launchpad/network/ic-matic.910e1faf.png';
import BscImg from 'images/launchpad/network/ic-bsc.419dfaf2.png';
import EthImg from 'images/launchpad/network/ic-eth.9270fc02.svg';
import MetamaskImg from 'images/launchpad/connect/Install-Metamask.svg';
import TrustwalletImg from 'images/launchpad/connect/trustwallet.eb75d105.svg';
import WalletConnectImg from 'images/launchpad/connect/walletconnect.dfa25e47.svg';
import CoinbaseImg from 'images/launchpad/connect/coinbase.069f6c82.png';
import SafepalImg from 'images/launchpad/connect/safepal.d0c33979.svg';
import TokenpocketImg from 'images/launchpad/connect/tokenpocket.png';
import MathwalletImg from 'images/launchpad/connect/math-wallet.png';


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
    tokenType: string;
};

export default class CreateToken extends React.PureComponent<Props, State> {
    
    static defaultProps = {userId: '', allCrypto: [],trendCrypto: [],newCrypto: [],gainerCrypto: []}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage,tokenType:'standard_token'};

        this.changeTokenType = this.changeTokenType.bind(this);
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    changeTokenType(event) {
        this.setState({tokenType: event.target.value});
        console.log(event.target.value);
    }

    render= (): JSX.Element => {
        const { tokenType } = this.state;
        let createTokenInfo;

        if(tokenType === 'LiquidityGeneratorToken'){
            createTokenInfo = (<div className='liquidity-generator-token'>
            <div className='mb-3'>
                <label htmlFor='formGroupExampleInput' className='form-label'><small>Router*</small></label>
                <select id='tokentypes' className='form-control'>
                <option selected>Select Router Exchange</option>
                <option>Pancakeswap</option>
                <option>MDex</option>
                <option>Biswap</option>
                <option>ApeSwap</option>
                <option>PinkSwap</option>
                </select>
            </div>

            <div className='row'>
            <div className='col-md-6'>
                <label htmlFor='inputEmail4' className='form-label'><small>Transaction fee to generate yield (%)</small></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 1'/>
            </div>
            <div className='col-md-6'>
                <label htmlFor='inputPassword4' className='form-label'><small>Transaction fee to generate liquidity (%)</small></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 1'/>
            </div>
            </div>

            <div className='row'>
            <div className='col-md-12'>
                <label htmlFor='inputEmail4' className='form-label'><small>Charity/Marketing address</small></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 0x....'/>
            </div>
            </div>

            <div className='row'>
            <div className='col-md-12'>
                <label htmlFor='inputEmail4' className='form-label'><small>Charity/Marketing percent (%)</small></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex - 25'/>
            </div>
            </div>
        </div>);
        }else if(tokenType === 'babytoken'){
            createTokenInfo = (
                <div className='baby-token'>
                    <div className='mb-3'>
                        <label htmlFor='formGroupExampleInput' className='form-label'><small>Router*</small></label>
                        <select id='tokentypes' className='form-control'>
                        <option selected>Select Router Exchange</option>
                        <option>Pancakeswap</option>
                        <option>MDex</option>
                        <option>Biswap</option>
                        <option>ApeSwap</option>
                        <option>PinkSwap</option>
                        </select>
                    </div>
                    <div className='row'>
                    <div className='col-md-5'>
                        <label htmlFor='inputEmail4' className='form-label'><small>Reward token*</small></label>
                        <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 0x...'/>
                        <small data-bs-toggle='tooltip' data-bs-placement='top' title='If you want to reward DOGE Please enter 0xba2ae424d960c26247dd6c32edc70b295c744c43.'><i className='bi-info-circle-fill'></i></small>
                    </div>
                    <div className='col-md-7'>
                        <label htmlFor='inputPassword4' className='form-label'><small>Minimum token balance for dividends *</small></label>
                        <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 100000000000'/>
                        <small data-bs-toggle='tooltip' data-bs-placement='top' title='Min hold each wallet must be over $50 to receive rewards.'><i className='bi-info-circle-fill'></i></small>
                    </div>
                    </div>
                    <div className='row mt-3'>
                    <div className='col-md-5'>
                        <label htmlFor='inputEmail4' className='form-label'><small>Marketing fee (%)*</small></label>
                        <input type='text' className='form-control form-control-sm' id='' placeholder='0 - 100'/>
                    </div>
                    <div className='col-md-7'>
                        <label htmlFor='inputPassword4' className='form-label'><small>Marketing wallet*</small></label>
                        <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 0x...'/>
                    </div>
                    </div>
                </div>
            );
        }else if(tokenType === 'BuybackBabyToken'){
            createTokenInfo = (<div className='buy-back-baby-token'>
            <div className='mb-3'>
                <label htmlFor='formGroupExampleInput' className='form-label'><small>Router*</small></label>
                <select className='form-control'>
                <option selected>Select Router Exchange</option>
                <option>Pancakeswap</option>
                <option>MDex</option>
                <option>Biswap</option>
                <option>ApeSwap</option>
                <option>PinkSwap</option>
                </select>
            </div>

            <div className='row mt-3'>
            <div className='col-md-5'>
                <label htmlFor='inputDoge4' className='form-label'><small>Reward token*</small></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 0x...'/>
                <small data-bs-toggle='tooltip' data-bs-placement='top' title='If you want to reward DOGE Please enter 0xba2ae424d960c26247dd6c32edc70b295c744c43.'><i className='bi-info-circle-fill'></i></small>
            </div>
            <div className='col-md-7'>
                <label htmlFor='inputPassword4' className='form-label'><small>Liquidity Fee (%)</small></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='0 - 100'/>
            </div>
            </div>

            <div className='row mt-3'>
            <div className='col-md-5'>
                <label htmlFor='inputEmail4' className='form-label'><small>Buyback Fee (%)</small></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='3'/>
            </div>
            <div className='col-md-7'>
                <label htmlFor='inputPassword4' className='form-label'><small>Reflection Fee (%)</small></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='8'/>
            </div>
            </div>

            <div className='row mt-3'>
            <div className='col-md-12'>
                <label htmlFor='inputEmail4' className='form-label'><small>Marketing fee (%)*</small></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='0 - 100'/>
            </div>
            </div>

        </div>);
        }else{

        }

        return (
            <>
                <div className='crypter-section-desktop' id="crypter-section" >
                    <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <a className='onLockbuttoncreate float-end mr-1' data-toggle='modal' data-target='#staticBackdropConnect'><small>Connect</small></a>
                            <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small>BSC Mainnet</small></a>
                            <a className="onLockbuttoncreate float-end ml-1" data-toggle='modal' data-target='#staticBackdropCreateToken'><small>Create</small></a>
                        </div>
                    </div>
                    <div className='d-flex mb-2'>
                        <div className='col-1 mt-3 mr-3'><span className='count-steps rounded-circle text-white'>1</span></div>
                        <div className='col-11'>
                            <h4 className='mt-2 mb-3'>Verify Token</h4>
                            <p>Enter the token address and verify</p>
                        </div>
                    </div>
                    <div className='launchpad-create-lock'>
                        <div className='row pr-5 pl-5'>
                            <form>
                                <div className='col-12 mt-2 mb-2'>
                                    <label htmlFor='formGroupExampleInput2' className='form-label'><small>* Token Address</small></label>
                                    <input type='text' className='form-control input-create-create-lock-text' id='' placeholder='Ex: PinkMoon' value='Ex: PinkMoon'/>
                                </div>

                                <div className='col-12 mt-2'>
                                    <small className='float-start mt-1'>Create pool fee: 0.1 BNB</small>
                                    <button type='button' className='btn-sm btn-create-token float-end onCreatetokens' data-toggle='modal' data-target='#staticBackdropCreateToken'>Create token</button>
                                </div>

                                <div className='col-12 mt-3'>
                                    <br></br>
                                    <br></br>
                                    <p><strong>Currency</strong></p>
                                    <div className='form-check'>
                                    <input className='form-check-input onBnbcurrency mr-1' type='radio' name='flexRadioDefault' id='flexRadioDefault1' checked/>
                                    <label className='form-check-label ms-1' htmlFor='flexRadioDefault1'>
                                        BNB
                                    </label>
                                    </div>
                                    <div className='form-check'>
                                    <input className='form-check-input onBusdcurrency mr-1' type='radio' name='flexRadioDefault' id='flexRadioDefault2'/>
                                    <label className='form-check-label ms-1' htmlFor='flexRadioDefault2'>
                                        BUSD
                                    </label>
                                    </div>
                                    <div className='form-check'>
                                    <input className='form-check-input onUsdtcurrency mr-1' type='radio' name='flexRadioDefault' id='flexRadioDefault3'/>
                                    <label className='form-check-label ms-1' htmlFor='flexRadioDefault3'>
                                        USDT
                                    </label>
                                    </div>
                                    <p>
                                    <small>Users will pay with 
                                        <span className='currencytypebnb'>&nbsp;BNB&nbsp;</span> 
                                        <span className='currencytypebusd'>&nbsp;BUSD&nbsp;</span> 
                                        <span className='currencytypeusdt'>&nbsp;USDT&nbsp;</span>
                                        for your token</small>
                                    </p>
                                </div>

                                <div className='col-12'>
                                    <label>Fee Options</label>
                                    <div className='form-check'>
                                        <input className='form-check-input' type='radio' name='feeOptions' id='flexRadioDefault101' checked/>
                                        <label className='form-check-label ml-1' htmlFor='flexRadioDefault101'>
                                            2% BNB raised + 2% token raised
                                        </label>
                                    </div>
                                    <div className='form-check'>
                                        <input className='form-check-input' type='radio' name='feeOptions' id='flexRadioDefault102'/>
                                        <label className='form-check-label ml-1' htmlFor='flexRadioDefault102'>
                                            5% BNB raised only
                                        </label>
                                    </div>
                                </div>

                                <div className='col-lg-12 text-center mt-3'>
                                    <button type='button' className='btn-sm btn-create-token' disabled>Next</button>
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

                    <div className='d-flex mt-4'>
                        <div className='col-1 mt-3 mr-3'>
                            <span className='count-steps-defaults border border-1 rounded-circle text-dark'>2</span>
                        </div>
                        <div className='col-11'>
                            <h4 className='mt-2 mb-3'>Defi Launchpad Info</h4>
                            <p>Enter the launchpad information that you want to raise , that should be enter all details about your presale</p>
                        </div>
                    </div>

                    <div className='launchpad-create-lock'>
                        <div className='row'>
                            <form>
                                <div className='col-md-12'>
                                    <div className='col-12 mt-2 mb-2'>
                                        <label htmlFor='formGroupExampleInput2' className='form-label'><small>Presale rate*</small></label>
                                        <input type='text' className='form-control' id='' placeholder='100' value=''/>
                                        <small>If I spend 1 BNB how many tokens will I receive?</small>
                                    </div>
                                </div>

                                <div className='col-md-12'>
                                    <div className='col-12 mt-2 mb-2'>
                                        <label htmlFor='formGroupExampleInput2' className='form-label'><small>Whitelist</small></label>
                                        <div className='form-check'>
                                            <input className='form-check-input' type='radio' name='whitelist' id='flexRadioDefaultWL1' checked/>
                                            <label className='form-check-label ml-1' htmlFor='flexRadioDefaultWL1'>
                                                Disable
                                            </label>
                                        </div>
                                        <div className='form-check'>
                                            <input className='form-check-input' type='radio' name='whitelist' id='flexRadioDefaultWL2'/>
                                            <label className='form-check-label ml-1' htmlFor='flexRadioDefaultWL2'>
                                                Enable
                                            </label>
                                        </div>
                                        <small>You can enable/disable whitelist anytime</small>
                                    </div>
                                </div>

                                <div className='col-md-12 d-flex'>
                                    <div className='col-md-6 pl-0 mt-2 mb-2'>
                                        <label htmlFor='formGroupExampleInput2' className='form-label'><small>Softcap (BNB)*</small></label>
                                        <input type='text' className='form-control' id='' placeholder='500' value=''/>
                                    </div>
                                    <div className='col-md-6 pr-0 mt-2 mb-2'>
                                        <label htmlFor='formGroupExampleInput2' className='form-label'><small>Hardcap (BNB)*</small></label>
                                        <input type='text' className='form-control' id='' placeholder='1000' value=''/>
                                    </div>
                                </div>

                                <div className='col-md-12 d-flex'>
                                    <div className='col-md-6 pl-0 mt-2 mb-2'>
                                        <label htmlFor='formGroupExampleInput2' className='form-label'><small>Minimum buy (BNB)*</small></label>
                                        <input type='text' className='form-control' id='' placeholder='0.01' value=''/>
                                    </div>
                                    <div className='col-md-6 pr-0 mt-2 mb-2'>
                                        <label htmlFor='formGroupExampleInput2' className='form-label'><small>Maximum buy (BNB)*</small></label>
                                        <input type='text' className='form-control' id='' placeholder='0.1' value=''/>
                                    </div>
                                </div>

                                <div className='col-md-12 d-flex'>
                                    <div className='col-md-6 pl-0 mt-2 mb-2'>
                                        <label htmlFor='inputState' className='form-label'><small>Refund</small></label>
                                        <select id='inputState' className='form-control form-control-sm'>
                                            <option selected>Burn</option>
                                            <option>Burn</option>
                                        </select>
                                    </div>
                                    <div className='col-md-6 pr-0 mt-2 mb-2'>
                                        <label htmlFor='inputState' className='form-label'><small>Router*</small></label>
                                        <select id='inputState' className='form-control form-control-sm'>
                                            <option selected>Pancakeswap</option>
                                            <option>Pancakeswap</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='col-md-12 d-flex'>
                                    <div className='col-md-6 pl-0 mt-2 mb-2'>
                                        <label htmlFor='inputState' className='form-label'><small>Pancakeswap liquidity (%)*</small></label>
                                        <select id='inputState' className='form-control form-control-sm'>
                                            <option selected>51</option>
                                            <option>51</option>
                                        </select>
                                    </div>
                                    <div className='col-md-6 pr-0 mt-2 mb-2'>
                                        <label htmlFor='inputState' className='form-label'><small>Pancakeswap listing rate (%)*</small></label>
                                        <select id='inputState' className='form-control form-control-sm'>
                                            <option selected>80</option>
                                            <option>80</option>
                                        </select>
                                        <small>1 BNB = 80 PST</small>
                                    </div>
                                </div>

                                <div className='col-md-12'>
                                    <div className='col-12'>
                                        <p>
                                        <small>Enter the percentage of raised funds that should be allocated to Liquidity on Pancakeswap (Min 51%. Max 100%)</small>
                                        <br/>
                                        <small>If I spend 1 BNB Pancakeswap how many tokens will I receive? Usually this amount is lower than presale rate to allow for a higher listing price on Pancakeswap</small>
                                        </p>
                                    </div>
                                </div>

                                <div className='col-md-12 d-flex'>
                                    <div className='col-md-6 pl-0 mt-2 mb-2'>
                                        <label htmlFor='inputState' className='form-label'><small>Start time (UTC)*</small></label>
                                        <select id='inputState' className='form-control form-control-sm'>
                                            <option selected>2021-09-17T19:20</option>
                                            <option>51</option>
                                        </select>
                                    </div>
                                    <div className='col-md-6 pr-0 mt-2 mb-2'>
                                        <label htmlFor='inputState' className='form-label'><small>End time (UTC)*</small></label>
                                        <select id='inputState' className='form-control form-control-sm'>
                                            <option selected>2021-09-17T19:20</option>
                                            <option>80</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='col-md-12'>
                                    <div className='col-12 mt-2 mb-2'>
                                        <label htmlFor='inputState' className='form-label'><small>Start time (UTC)*</small></label>
                                        <select id='inputState' className='form-control form-control-sm'>
                                            <option selected>30</option>
                                            <option>51</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='col-md-12 p-3'>
                                    <div className='form-check'>
                                    <input className='form-check-input' type='checkbox' value='' id='flexCheckDefault'/>
                                    <label className='form-check-label ml-1' htmlFor='flexCheckDefault'>
                                        <small>Using Vesting lockup (days)*</small>
                                    </label>
                                    </div>
                                    <div className='form-check'>
                                    <input className='form-check-input' type='checkbox' value='' id='flexCheckDefault'/>
                                    <label className='form-check-label ml-1' htmlFor='flexCheckDefault'>
                                        <small>Using Anti-Rug Systm (Team Vesting System)?</small>
                                    </label>
                                    </div>
                                </div>

                                <div className='row p-3'>
                                    <div className='col-12 text-center'>
                                        <a>Need 141,984 PST to create launchpad</a>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='col-lg-12 text-center'>
                                    <button type='button' className='btn-sm btn-create-token'>Back</button>
                                    <button type='button' className='btn-sm btn-create-token ml-2'>Next</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className='d-flex mt-4'>
                        <div className='col-1 mt-3 mr-3'><span className='count-steps-defaults border border-1 rounded-circle text-dark'>3</span></div>
                        <div className='col-11'>
                            <h4 className='mt-2 mb-3'>Additional Info</h4>
                            <p>Let people know who you are</p>
                        </div>
                    </div>

                    <div className='launchpad-create-lock'>
                        <div className='row'>
                            <form>
                                <div className='col-md-12 d-flex'>
                                    <div className='col-md-6 pl-0 mt-2 mb-0'>
                                        <div className='mb-3'>
                                            <label htmlFor='exampleFormControlInput1' className='form-label'>
                                                <small>Logo URL*</small> 
                                                <i className='bi-info-circle-fill bi-info-circle-fill-style ml-1' data-toggle='tooltip' data-placement='top' title='URL must end with a supported image extension png, jpg, jpeg, or gif'></i>
                                            </label>
                                            <div className='d-flex'>
                                                <div className='col-md-1 pr-0 pt-2 icon-border'>
                                                    <span className='input-group-text bg-white' id=''><i className='bi-image bi-image-style'></i></span>
                                                </div>
                                                <div className='col-md-11 pl-0 pr-0'>
                                                    <input type='text' className='form-control form-control-sm additional-info-input' placeholder='logo url' aria-label='logo url' aria-describedby=''/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6 pr-0 mt-2 mb-0'>
                                        <div className='mb-3'>
                                            <label htmlFor='exampleFormControlInput1' className='form-label'><small>Website</small></label>
                                            <div className='d-flex'>
                                                <div className='col-md-1 pr-0 pt-2 icon-border'>
                                                    <span className='input-group-text bg-white' id=''><i className='bi-globe2 bi-globe2-style'></i></span>
                                                </div>
                                                <div className='col-md-11 pl-0 pr-0'>
                                                    <input type='text' className='form-control form-control-sm additional-info-input' placeholder='website' aria-label='website' aria-describedby=''/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-12 d-flex'>
                                    <div className='col-md-6 pl-0 mt-0 mb-2'>
                                        <div className='mb-3'>
                                            <label htmlFor='exampleFormControlInput1' className='form-label'><small>Facebook</small></label>
                                            <div className='d-flex'>
                                                <div className='col-md-1 pr-0 pt-2 icon-border'>
                                                    <span className='input-group-text bg-white' id=''><i className='bi-facebook bi-image-style'></i></span>
                                                </div>
                                                <div className='col-md-11 pl-0 pr-0'>
                                                    <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Facebook' aria-label='Facebook' aria-describedby=''/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6 pr-0 mt-0 mb-2'>
                                        <div className='mb-3'>
                                            <label htmlFor='exampleFormControlInput1' className='form-label'><small>Twitter</small></label>
                                            <div className='d-flex'>
                                                <div className='col-md-1 pr-0 pt-2 icon-border'>
                                                    <span className='input-group-text bg-white' id=''><i className='bi-twitter bi-globe2-style'></i></span>
                                                </div>
                                                <div className='col-md-11 pl-0 pr-0'>
                                                    <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Twitter' aria-label='Twitter' aria-describedby=''/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-12 d-flex'>
                                    <div className='col-md-6 pl-0 mt-0 mb-2'>
                                        <div className='mb-3'>
                                            <label htmlFor='exampleFormControlInput1' className='form-label'><small>Github</small></label>
                                            <div className='d-flex'>
                                                <div className='col-md-1 pr-0 pt-2 icon-border'>
                                                    <span className='input-group-text bg-white' id=''><i className='bi-github bi-image-style'></i></span>
                                                </div>
                                                <div className='col-md-11 pl-0 pr-0'>
                                                    <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Github' aria-label='Github' aria-describedby=''/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6 pr-0 mt-0 mb-2'>
                                        <div className='mb-3'>
                                            <label htmlFor='exampleFormControlInput1' className='form-label'><small>Telegram</small></label>
                                            <div className='d-flex'>
                                                <div className='col-md-1 pr-0 pt-2 icon-border'>
                                                    <span className='input-group-text bg-white' id=''><i className='bi-telegram bi-globe2-style'></i></span>
                                                </div>
                                                <div className='col-md-11 pl-0 pr-0'>
                                                    <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Telegram' aria-label='Telegram' aria-describedby=''/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-12 d-flex'>
                                    <div className='col-md-6 pl-0 mt-0 mb-2'>
                                        <div className='mb-3'>
                                            <label htmlFor='exampleFormControlInput1' className='form-label'><small>Instagram</small></label>
                                            <div className='d-flex'>
                                                <div className='col-md-1 pr-0 pt-2 icon-border'>
                                                    <span className='input-group-text bg-white' id=''><i className='bi-instagram bi-image-style'></i></span>
                                                </div>
                                                <div className='col-md-11 pl-0 pr-0'>
                                                    <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Instagram' aria-label='Instagram' aria-describedby=''/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6 pr-0 mt-0 mb-2'>
                                        <div className='mb-3'>
                                            <label htmlFor='exampleFormControlInput1' className='form-label'><small>Discord</small></label>
                                            <div className='d-flex'>
                                                <div className='col-md-1 pr-0 pt-2 icon-border'>
                                                    <span className='input-group-text bg-white' id=''><i className='bi-discord bi-globe2-style'></i></span>
                                                </div>
                                                <div className='col-md-11 pl-0 pr-0'>
                                                    <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Discord' aria-label='Discord' aria-describedby=''/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-12'>
                                    <div className='mt-0 mb-2'>
                                        <div className='mb-3'>
                                            <label htmlFor='exampleFormControlInput1' className='form-label'><small>Reddit</small></label>
                                            <div className='d-flex'>
                                                <div className='col-md-1 pt-2 icon-border text-center'>
                                                    <span className='input-group-text bg-white' id=''><i className='bi-discord bi-globe2-style'></i></span>
                                                </div>
                                                <div className='col-md-11 pl-0 pr-0'>
                                                    <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Reddit' aria-label='Reddit' aria-describedby=''/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-12'>
                                    {/*<style>.bi-emoji-smile-fill, .emoji-smile-fill-style{display: none;}</style>*/}
                                    <div className='col-12 mt-0 mb-2'>
                                        <div className='mb-3'>
                                            <label htmlFor='' className='form-label'><small>Description</small></label>
                                            <textarea className='form-control' placeholder='Description' id='' rows='3'></textarea>
                                        </div>
                                    </div>
                                </div>


                                <div className='col-md-12 mt-3'>
                                    <div className='col-lg-12 text-center'>
                                    <button type='button' className='btn-sm btn-create-token'>Back</button>
                                    <button type='button' className='btn-sm btn-create-token ml-2'>Next</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className='d-flex mt-4'>
                    <div className='col-1 mt-3 mr-3'><span className='count-steps-defaults border border-1 rounded-circle text-dark'>4</span></div>
                    <div className='col-11'>
                        <h4 className='mt-2 mb-3'>Finish</h4>
                        <p>Review your information</p></div>
                    </div>

                    <div className='launchpad-create-lock'>
                        <div className='row'>
                            <ul className='list-group list-group-flush'>
                            <li className='list-group-item pt-0 border-width-bot'>
                                <small>Total token</small><small className='float-end text-danger'>141.984. PST</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Total name</small><small className='float-end text-success'>CrypterSale Test</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Total symbol</small><small className='float-end text-success'>PST</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Total decimals</small><small className='float-end text-success'>18</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Presale rate</small><small className='float-end text-success'>100 PST</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Listing rate</small><small className='float-end text-success'>80 PST</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Sale method</small><small className='float-end text-success'>Public</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Softcap</small><small className='float-end text-success'>500 BNB</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Hardcap</small><small className='float-end text-success'>1000 BNB</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Minimum buy</small><small className='float-end text-success'>0.01 BNB</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Miximum buy</small><small className='float-end text-success'>0.1 BNB</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Liquidity</small><small className='float-end text-success'>51%</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Start time</small><small className='float-end text-success'>2021-09-17T19:28 (UTC)</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>End time</small><small className='float-end text-success'>2021-09-17T19:20 (UTC)</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Liquidity lookup time</small><small className='float-end text-success'>1111 minutes</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Website</small><small className='float-end text-danger'>https://www.cryptersal.finance/</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Facebook</small><small className='float-end text-danger'>https://www.facebook.com/Crypter</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Twiiter</small><small className='float-end text-danger'>https://www.twitter.com/Crypter</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Telegram</small><small className='float-end text-danger'>https://www.t.me/Crypter</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Github</small><small className='float-end text-danger'>https://www.github.com/Crypter</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Instagram</small><small className='float-end text-danger'>https://www.instagram.com/Crypter</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Discord</small><small className='float-end text-danger'>https://www.discord.com/Crypter</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Reddit</small><small className='float-end text-danger'>https://www.reddit.com/Crypter</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Description</small><small className='float-end text-success'>CrpyerSale, the launchpad protocol for Everyone! CrypterSale helps everyone to create their own tokens and token sales in few second.</small>
                            </li>
                            <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                <small>Using Anti-Rug system (Vesting System)?</small><small className='float-end text-success'>No</small>
                            </li>
                            </ul>
                        </div>

                        <div className='row mt-4 closenitificationalertfinish'>
                            <div className='col-lg-12'>
                                <div className='alert alert-warning text-center' role='alert'>
                                    <div className='position-relative'>
                                        <div className='position-absolute top-0 start-100 translate-middle'>
                                            <a className='float-end onClosealertfinish shadow'><i className='bi-x'></i></a>
                                        </div>

                                        <small className='text-center'>
                                        <i className='bi-exclamation-circle-fill'></i> For tokens with burns, rebase or orther special transfers please ensure that you have a way to whitelist multiple addresses or turn off the special transfer events (By setting fees to 0 for example for the duration of the presale)
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='row mt-3'>
                            <div className='col-lg-12 text-center'>
                                <button type='button' className='btn btn-sm btn-create-token'>Back</button>
                                <button type='button' className='btn btn-sm btn-create-token'>Submit</button>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-11 mx-auto text-center mt-4 mb-4'>
                            <small>Disclaimer: The information provided shall not in any way constitute a recommendation as to whether you should invest in any product discussed. We accept no liability for any loss occasioned to any person acting or refraining from action as a result of any material provided or published.</small>
                        </div>
                    </div>

                    </div>
                </div>
                <div id='crypter-section-mobile' className='crypter-section-mobile'>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='box-middle-panel-products-mobile'>

                                <div className='row'>
                                    <div className='btn-group float-end' role='group' aria-label='Basic example'>
                                    <a className='onLockbuttoncreate mr-1' data-toggle='modal' data-target='#staticBackdropConnect'><small>Connect</small></a>
                                    <a className='onLockbuttoncreatenormal ml-1 mr-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small>BSC Mainnet</small></a>
                                    <a className='onLockbuttoncreate ml-1'><small>Create</small></a>
                                    </div>
                                </div>

                                <div className='d-flex mb-2 mt-4'>
                                    <div className='col-2 mt-3 mr-3'><span className='count-steps rounded-circle text-white'>1</span></div>
                                    <div className='col-10'>
                                        <h4 className='mt-2 mb-3'>Verify Token</h4>
                                        <p>Enter the token address and verify</p></div>
                                </div>

                                <div className='launchpad-create-lock-mobile'>
                                    <div className='col-md-12'>
                                        <form>
                                            <div className='row'>
                                            <div className='col-12 mt-2 mb-2'>
                                                <label htmlFor='formGroupExampleInput2' className='form-label'><small>* Token Address</small></label>
                                                <input type='text' className='form-control input-create-create-lock-text' id='' placeholder='Ex: PinkMoon' value='Ex: PinkMoon' />
                                            </div>
                                            </div>

                                            <div className='row mt-2'>
                                            <div className='col-12'>
                                                <small className='float-start mt-1'>Create pool fee: 1 BNB</small>
                                                <button type='button' data-toggle='modal' data-target='#staticBackdropCreateToken' className='btn-sm btn-create-token float-end onCreatetokens'>Create token</button>
                                            </div>
                                            </div>

                                            <div className='row mt-3'>
                                            <div className='col-12'>
                                                <p><strong>Currency</strong></p>
                                                <div className='form-check'>
                                                <input className='form-check-input onBnbcurrency mr-1' type='radio' name='flexRadioDefault' id='flexRadioDefault1' checked/>
                                                <label className='form-check-label ms-1' htmlFor='flexRadioDefault1'>
                                                    BNB
                                                </label>
                                                </div>
                                                <div className='form-check'>
                                                <input className='form-check-input onBusdcurrency mr-1' type='radio' name='flexRadioDefault' id='flexRadioDefault2'/>
                                                <label className='form-check-label ms-1' htmlFor='flexRadioDefault2'>
                                                    BUSD
                                                </label>
                                                </div>
                                                <div className='form-check'>
                                                <input className='form-check-input onUsdtcurrency mr-1' type='radio' name='flexRadioDefault' id='flexRadioDefault3'/>
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

                                            <div className='col-12'>
                                                <label>Fee Options</label>
                                                <div className='form-check'>
                                                    <input className='form-check-input' type='radio' name='feeOptions' id='flexRadioDefault101' checked/>
                                                    <label className='form-check-label ml-1' htmlFor='flexRadioDefault101'>
                                                        2% BNB raised + 2% token raised
                                                    </label>
                                                </div>
                                                <div className='form-check'>
                                                    <input className='form-check-input' type='radio' name='feeOptions' id='flexRadioDefault102'/>
                                                    <label className='form-check-label ml-1' htmlFor='flexRadioDefault102'>
                                                        5% BNB raised only
                                                    </label>
                                                </div>
                                            </div>

                                            <div className='row mt-3'>
                                            <div className='col-lg-12 text-center'>
                                                <button type='button' className='btn-sm btn-create-token' disabled>Next</button>
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

                                <div className='d-flex mt-4'>
                                    <div className='col-2 mt-3 mr-3'><span className='count-steps-defaults border border-1 rounded-circle text-dark'>2</span></div>
                                    <div className='col-10'>
                                        <h4 className='mt-2 mb-3'>Defi Launchpad Info</h4>
                                        <p>Enter the launchpad information that you want to raise , that should be enter all details about your presale</p></div>
                                </div>

                                <div className='launchpad-create-lock'>
                                    <div className='row'>
                                        <form>
                                            <div className='col-md-12'>
                                                <div className='col-12 mt-2 mb-2'>
                                                    <label htmlFor='formGroupExampleInput2' className='form-label'><small>Presale rate*</small></label>
                                                    <input type='text' className='form-control' id='' placeholder='100' value=''/>
                                                    <small>If I spend 1 BNB how many tokens will I receive?</small>
                                                </div>
                                            </div>

                                            <div className='col-md-12'>
                                                <div className='col-12 mt-2 mb-2'>
                                                    <label htmlFor='formGroupExampleInput2' className='form-label'><small>Whitelist</small></label>
                                                    <div className='form-check'>
                                                        <input className='form-check-input' type='radio' name='whitelist' id='flexRadioDefaultWL1' checked/>
                                                        <label className='form-check-label ml-1' htmlFor='flexRadioDefaultWL1'>
                                                            Disable
                                                        </label>
                                                    </div>
                                                    <div className='form-check'>
                                                        <input className='form-check-input' type='radio' name='whitelist' id='flexRadioDefaultWL2'/>
                                                        <label className='form-check-label ml-1' htmlFor='flexRadioDefaultWL2'>
                                                            Enable
                                                        </label>
                                                    </div>
                                                    <small>You can enable/disable whitelist anytime</small>
                                                </div>
                                            </div>

                                            <div className='col-md-12 d-flex'>
                                                <div className='col-md-6 width-100 pl-0 mt-2 mb-2'>
                                                    <label htmlFor='formGroupExampleInput2' className='form-label'><small>Softcap (BNB)*</small></label>
                                                    <input type='text' className='form-control' id='' placeholder='500' value=''/>
                                                </div>
                                                <div className='col-md-6 width-100 pr-0 mt-2 mb-2'>
                                                    <label htmlFor='formGroupExampleInput2' className='form-label'><small>Hardcap (BNB)*</small></label>
                                                    <input type='text' className='form-control' id='' placeholder='1000' value=''/>
                                                </div>
                                            </div>

                                            <div className='col-md-12 d-flex'>
                                                <div className='col-md-6 width-100 pl-0 mt-2 mb-2'>
                                                    <label htmlFor='formGroupExampleInput2' className='form-label'><small>Minimum buy (BNB)*</small></label>
                                                    <input type='text' className='form-control' id='' placeholder='0.01' value=''/>
                                                </div>
                                                <div className='col-md-6 width-100 pr-0 mt-2 mb-2'>
                                                    <label htmlFor='formGroupExampleInput2' className='form-label'><small>Maximum buy (BNB)*</small></label>
                                                    <input type='text' className='form-control' id='' placeholder='0.1' value=''/>
                                                </div>
                                            </div>

                                            <div className='col-md-12 d-flex'>
                                                <div className='col-md-6 width-100 pl-0 mt-2 mb-2'>
                                                    <label htmlFor='inputState' className='form-label'><small>Refund</small></label>
                                                    <select id='inputState' className='form-control form-control-sm'>
                                                        <option selected>Burn</option>
                                                        <option>Burn</option>
                                                    </select>
                                                </div>
                                                <div className='col-md-6 width-100 pr-0 mt-2 mb-2'>
                                                    <label htmlFor='inputState' className='form-label'><small>Router*</small></label>
                                                    <select id='inputState' className='form-control form-control-sm'>
                                                        <option selected>Pancakeswap</option>
                                                        <option>Pancakeswap</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='col-md-12 d-flex'>
                                                <div className='col-md-6 width-100 pl-0 mt-2 mb-2'>
                                                    <label htmlFor='inputState' className='form-label'><small>Pancakeswap liquidity (%)*</small></label>
                                                    <select id='inputState' className='form-control form-control-sm'>
                                                        <option selected>51</option>
                                                        <option>51</option>
                                                    </select>
                                                </div>
                                                <div className='col-md-6 width-100 pr-0 mt-2 mb-2'>
                                                    <label htmlFor='inputState' className='form-label'><small>Pancakeswap listing rate (%)*</small></label>
                                                    <select id='inputState' className='form-control form-control-sm'>
                                                        <option selected>80</option>
                                                        <option>80</option>
                                                    </select>
                                                    <small>1 BNB = 80 PST</small>
                                                </div>
                                            </div>

                                            <div className='col-md-12'>
                                                <div className='col-12'>
                                                    <p>
                                                    <small>Enter the percentage of raised funds that should be allocated to Liquidity on Pancakeswap (Min 51%. Max 100%)</small>
                                                    <br/>
                                                    <small>If I spend 1 BNB Pancakeswap how many tokens will I receive? Usually this amount is lower than presale rate to allow for a higher listing price on Pancakeswap</small>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='col-md-12 d-flex'>
                                                <div className='col-md-6 width-100 pl-0 mt-2 mb-2'>
                                                    <label htmlFor='inputState' className='form-label'><small>Start time (UTC)*</small></label>
                                                    <select id='inputState' className='form-control form-control-sm'>
                                                        <option selected>2021-09-17T19:20</option>
                                                        <option>51</option>
                                                    </select>
                                                </div>
                                                <div className='col-md-6 width-100 pr-0 mt-2 mb-2'>
                                                    <label htmlFor='inputState' className='form-label'><small>End time (UTC)*</small></label>
                                                    <select id='inputState' className='form-control form-control-sm'>
                                                        <option selected>2021-09-17T19:20</option>
                                                        <option>80</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='col-md-12'>
                                                <div className='col-12 mt-2 mb-2'>
                                                    <label htmlFor='inputState' className='form-label'><small>Start time (UTC)*</small></label>
                                                    <select id='inputState' className='form-control form-control-sm'>
                                                        <option selected>30</option>
                                                        <option>51</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='col-md-12 p-3'>
                                                <div className='form-check'>
                                                <input className='form-check-input' type='checkbox' value='' id='flexCheckDefault'/>
                                                <label className='form-check-label ml-1' htmlFor='flexCheckDefault'>
                                                    <small>Using Vesting lockup (days)*</small>
                                                </label>
                                                </div>
                                                <div className='form-check'>
                                                <input className='form-check-input' type='checkbox' value='' id='flexCheckDefault'/>
                                                <label className='form-check-label ml-1' htmlFor='flexCheckDefault'>
                                                    <small>Using Anti-Rug Systm (Team Vesting System)?</small>
                                                </label>
                                                </div>
                                            </div>

                                            <div className='row p-3'>
                                                <div className='col-12 text-center'>
                                                    <a>Need 141,984 PST to create launchpad</a>
                                                </div>
                                            </div>

                                            <div className='row mt-3'>
                                                <div className='col-lg-12 text-center'>
                                                <button type='button' className='btn-sm btn-create-token'>Back</button>
                                                <button type='button' className='btn-sm btn-create-token ml-2'>Next</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className='d-flex mt-4'>
                                    <div className='col-2 mt-3 mr-3'><span className='count-steps-defaults border border-1 rounded-circle text-dark'>3</span></div>
                                    <div className='col-10'>
                                        <h4 className='mt-2 mb-3'>Additional Info</h4>
                                        <p>Let people know who you are</p></div>
                                </div>

                                <div className='launchpad-create-lock'>
                                    <div className='row'>
                                        <form>
                                            <div className='col-md-12 d-flex'>
                                                <div className='col-md-6 pl-0 mt-2 mb-0'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='exampleFormControlInput1' className='form-label'>
                                                            <small>Logo URL*</small> 
                                                            <i className='bi-info-circle-fill bi-info-circle-fill-style ml-1' data-toggle='tooltip' data-placement='top' title='URL must end with a supported image extension png, jpg, jpeg, or gif'></i>
                                                        </label>
                                                        <div className='d-flex'>
                                                            <div className='col-md-1 pl-1 pr-1 pt-2 icon-border'>
                                                                <span className='input-group-text bg-white' id=''><i className='bi-image bi-image-style'></i></span>
                                                            </div>
                                                            <div className='col-md-11 pl-0 pr-0'>
                                                                <input type='text' className='form-control form-control-sm additional-info-input' placeholder='logo url' aria-label='logo url' aria-describedby=''/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-6 pr-0 mt-2 mb-0'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='exampleFormControlInput1' className='form-label'><small>Website</small></label>
                                                        <div className='d-flex'>
                                                            <div className='col-md-1 pl-1 pr-1 pt-2 icon-border'>
                                                                <span className='input-group-text bg-white' id=''><i className='bi-globe2 bi-globe2-style'></i></span>
                                                            </div>
                                                            <div className='col-md-11 pl-0 pr-0'>
                                                                <input type='text' className='form-control form-control-sm additional-info-input' placeholder='website' aria-label='website' aria-describedby=''/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-12 d-flex'>
                                                <div className='col-md-6 pl-0 mt-0 mb-2'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='exampleFormControlInput1' className='form-label'><small>Facebook</small></label>
                                                        <div className='d-flex'>
                                                            <div className='col-md-1 pl-1 pr-1 pt-2 icon-border'>
                                                                <span className='input-group-text bg-white' id=''><i className='bi-facebook bi-image-style'></i></span>
                                                            </div>
                                                            <div className='col-md-11 pl-0 pr-0'>
                                                                <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Facebook' aria-label='Facebook' aria-describedby=''/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-6 pr-0 mt-0 mb-2'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='exampleFormControlInput1' className='form-label'><small>Twitter</small></label>
                                                        <div className='d-flex'>
                                                            <div className='col-md-1 pl-1 pr-1 pt-2 icon-border'>
                                                                <span className='input-group-text bg-white' id=''><i className='bi-twitter bi-globe2-style'></i></span>
                                                            </div>
                                                            <div className='col-md-11 pl-0 pr-0'>
                                                                <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Twitter' aria-label='Twitter' aria-describedby=''/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-12 d-flex'>
                                                <div className='col-md-6 pl-0 mt-0 mb-2'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='exampleFormControlInput1' className='form-label'><small>Github</small></label>
                                                        <div className='d-flex'>
                                                            <div className='col-md-1 pl-1 pr-1 pt-2 icon-border'>
                                                                <span className='input-group-text bg-white' id=''><i className='bi-github bi-image-style'></i></span>
                                                            </div>
                                                            <div className='col-md-11 pl-0 pr-0'>
                                                                <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Github' aria-label='Github' aria-describedby=''/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-6 pr-0 mt-0 mb-2'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='exampleFormControlInput1' className='form-label'><small>Telegram</small></label>
                                                        <div className='d-flex'>
                                                            <div className='col-md-1 pl-1 pr-1 pt-2 icon-border'>
                                                                <span className='input-group-text bg-white' id=''><i className='bi-telegram bi-globe2-style'></i></span>
                                                            </div>
                                                            <div className='col-md-11 pl-0 pr-0'>
                                                                <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Telegram' aria-label='Telegram' aria-describedby=''/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-12 d-flex'>
                                                <div className='col-md-6 pl-0 mt-0 mb-2'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='exampleFormControlInput1' className='form-label'><small>Instagram</small></label>
                                                        <div className='d-flex'>
                                                            <div className='col-md-1 pl-1 pr-1 pt-2 icon-border'>
                                                                <span className='input-group-text bg-white' id=''><i className='bi-instagram bi-image-style'></i></span>
                                                            </div>
                                                            <div className='col-md-11 pl-0 pr-0'>
                                                                <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Instagram' aria-label='Instagram' aria-describedby=''/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-6 pr-0 mt-0 mb-2'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='exampleFormControlInput1' className='form-label'><small>Discord</small></label>
                                                        <div className='d-flex'>
                                                            <div className='col-md-1 pl-1 pr-1 pt-2 icon-border'>
                                                                <span className='input-group-text bg-white' id=''><i className='bi-discord bi-globe2-style'></i></span>
                                                            </div>
                                                            <div className='col-md-11 pl-0 pr-0'>
                                                                <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Discord' aria-label='Discord' aria-describedby=''/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-md-12'>
                                                <div className='mt-0 mb-2'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='exampleFormControlInput1' className='form-label'><small>Reddit</small></label>
                                                        <div className='d-flex'>
                                                            <div className='col-md-1 pt-2 icon-border text-center'>
                                                                <span className='input-group-text bg-white' id=''><i className='bi-discord bi-globe2-style'></i></span>
                                                            </div>
                                                            <div className='col-md-11 pl-0 pr-0 width-100'>
                                                                <input type='text' className='form-control form-control-sm additional-info-input' placeholder='Reddit' aria-label='Reddit' aria-describedby=''/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-md-12'>
                                                {/*<style>.bi-emoji-smile-fill, .emoji-smile-fill-style{display: none;}</style>*/}
                                                <div className='col-12 mt-0 mb-2'>
                                                    <div className='mb-3'>
                                                        <label htmlFor='' className='form-label'><small>Description</small></label>
                                                        <textarea className='form-control' placeholder='Description' id='' rows='3'></textarea>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className='col-md-12 mt-3'>
                                                <div className='col-lg-12 text-center'>
                                                <button type='button' className='btn-sm btn-create-token'>Back</button>
                                                <button type='button' className='btn-sm btn-create-token ml-2'>Next</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className='d-flex mt-4'>
                                    <div className='col-2 mt-3 mr-3'><span className='count-steps-defaults border border-1 rounded-circle text-dark'>4</span></div>
                                    <div className='col-10'>
                                        <h4 className='mt-2 mb-3'>Finish</h4>
                                        <p>Review your information</p></div>
                                </div>

                                <div className='launchpad-create-lock'>
                                    <div className='row'>
                                        <ul className='list-group list-group-flush'>
                                        <li className='list-group-item pt-0 border-width-bot'>
                                            <small>Total token</small><small className='float-end text-danger'>141.984. PST</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Total name</small><small className='float-end text-success'>CrypterSale Test</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Total symbol</small><small className='float-end text-success'>PST</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Total decimals</small><small className='float-end text-success'>18</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Presale rate</small><small className='float-end text-success'>100 PST</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Listing rate</small><small className='float-end text-success'>80 PST</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Sale method</small><small className='float-end text-success'>Public</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Softcap</small><small className='float-end text-success'>500 BNB</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Hardcap</small><small className='float-end text-success'>1000 BNB</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Minimum buy</small><small className='float-end text-success'>0.01 BNB</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Miximum buy</small><small className='float-end text-success'>0.1 BNB</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Liquidity</small><small className='float-end text-success'>51%</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Start time</small><small className='float-end text-success'>2021-09-17T19:28 (UTC)</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>End time</small><small className='float-end text-success'>2021-09-17T19:20 (UTC)</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Liquidity lookup time</small><small className='float-end text-success'>1111 minutes</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Website</small><small className='float-end text-danger'>https://www.cryptersal.finance/</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Facebook</small><small className='float-end text-danger'>https://www.facebook.com/Crypter</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Twiiter</small><small className='float-end text-danger'>https://www.twitter.com/Crypter</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Telegram</small><small className='float-end text-danger'>https://www.t.me/Crypter</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Github</small><small className='float-end text-danger'>https://www.github.com/Crypter</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Instagram</small><small className='float-end text-danger'>https://www.instagram.com/Crypter</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Discord</small><small className='float-end text-danger'>https://www.discord.com/Crypter</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Reddit</small><small className='float-end text-danger'>https://www.reddit.com/Crypter</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Description</small><small className='float-end text-success'>CrpyerSale, the launchpad protocol for Everyone! CrypterSale helps everyone to create their own tokens and token sales in few second.</small>
                                        </li>
                                        <li className='list-group-item pt-0 mt-1 border-width-bot'>
                                            <small>Using Anti-Rug system (Vesting System)?</small><small className='float-end text-success'>No</small>
                                        </li>
                                        </ul>
                                    </div>

                                    <div className='row mt-4 closenitificationalertfinish'>
                                        <div className='col-lg-12'>
                                            <div className='alert alert-warning text-center' role='alert'>
                                                <div className='position-relative'>
                                                    <div className='position-absolute top-0 start-100 translate-middle'>
                                                        <a className='float-end onClosealertfinish shadow'><i className='bi-x'></i></a>
                                                    </div>

                                                    <small className='text-center'>
                                                    <i className='bi-exclamation-circle-fill'></i> For tokens with burns, rebase or orther special transfers please ensure that you have a way to whitelist multiple addresses or turn off the special transfer events (By setting fees to 0 for example for the duration of the presale)
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row mt-3'>
                                        <div className='col-lg-12 text-center'>
                                            <button type='button' className='btn btn-sm btn-create-token'>Back</button>
                                            <button type='button' className='btn btn-sm btn-create-token'>Submit</button>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-12 mx-auto text-center mt-4 mb-4'>
                                        <small>Disclaimer: The information provided shall not in any way constitute a recommendation as to whether you should invest in any product discussed. We accept no liability for any loss occasioned to any person acting or refraining from action as a result of any material provided or published.</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='modal createtoken' id='staticBackdropCreateToken' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content shadow-lg'>

                            <div className='modal-header'>
                            <h4 className='modal-title' id='staticBackdropLabel'>Create token</h4>
                            <a className='onClosecreatetokens shadow float-end' data-dismiss='modal'><i className='bi-x'></i></a>
                            </div>

                            <div className='modal-body'>
                                <form>
                                <div className='mb-3'>
                                    <label htmlFor='inputState' className='form-label form-control-sm'><small>(*) is required field.</small><br/>Token Type*</label>
                                    <select id='tokentypes' onChange={this.changeTokenType} value={this.state.tokenType} className='form-control'>
                                        <option value='standard_token'>Standard Token</option>
                                        <option value='LiquidityGeneratorToken'>Liquidity Generator Token</option>
                                        <option value='babytoken'>Baby Token</option>
                                        <option value='BuybackBabyToken'>Buyback Baby Token</option>
                                    </select>
                                    <small>Fee: 0.2 BNB</small>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='formGroupExampleInput' className='form-label'><small>Name*</small></label>
                                    <input type='text' className='form-control form-control-sm' id='formGroupExampleInput' placeholder='Ex: Ethereum'/>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='formGroupExampleInput' className='form-label'><small>Symbol*</small></label>
                                    <input type='text' className='form-control form-control-sm' id='formGroupExampleInput' placeholder='Ex: RTH'/>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='formGroupExampleInput' className='form-label'><small>Decimals*</small></label>
                                    <input type='text' className='form-control form-control-sm' id='formGroupExampleInput' placeholder='Ex: 18'/>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='formGroupExampleInput' className='form-label'><small>Total supply*</small></label>
                                    <input type='text' className='form-control form-control-sm' id='formGroupExampleInput' placeholder='Ex: 1000000000000'/>
                                </div>

                                {createTokenInfo}

                                <div className='form-check mt-3'>
                                    <input className='form-check-input onImplementpinkantisystem' type='checkbox' value='' id='flexCheckDefault'/>
                                    <label className='form-check-label' htmlFor='flexCheckDefault'>
                                    <small>Implement Pink Anti-Bot System?</small>
                                    </label>
                                    <p className='mt-2 implementpinkinformation'>Please visit <a className='text-success' target='_self'><strong>https://www.crypter.com/#antibot</strong></a> to active Pink Anti-Bot after creating the token. Check out the tutorial here: <a className='text-success' target='_self'><strong>https://www.crypter.com/pink-anti-bot/pink-anti-bot-guide</strong></a></p>
                                </div>

                                <div className='col-lg-12 text-center mt-3'>
                                        <button type='button' className='btn-sm btn-create-token'>Create token</button>
                                </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>

                <div className='modal choosenetwork' id='staticBackdropNetwork' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content shadow-lg'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>Choose network</h6>
                                <a className='onClosechoosenetwork shadow float-end'><i className='bi-x'></i></a>
                            </div>
                            <div className='modal-body'>
                                <div className='d-flex'>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='40' src={EthImg} alt=''/>
                                        <p className='mt-3 text-white'>Ethereum</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='40' src={BscImg} alt=''/>
                                        <p className='mt-3 text-white'>BNB Smart Chain</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='40' src={MaticImg} alt=''/>
                                        <p className='mt-3 text-white'>Matic(Polygon)</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='40' src={KucoinImg} alt=''/>
                                        <p className='mt-3 text-white'>KuCoin</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='40' src={AvaxImg} alt=''/>
                                        <p className='mt-3 text-white'>Avalanche</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='31' src={FantomImg} alt=''/>
                                        <p className='mt-3 text-white'>Fantom Opera</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='40' src={CronosImg} alt=''/>
                                        <p className='mt-3 text-white'>Cronos</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-center'>
                                    </div>
                                </div>
                                <div className='row mt-2 mb-2'>
                                <small>TESTNET</small>
                                </div>
                                <div className='d-flex'>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='40' src={BscImg} alt=''/>
                                        <p className='mt-3 text-white'>Avalanche</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='40' src={FantomImg} alt=''/>
                                        <p className='mt-3 text-white'>Fantom Opera</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='modal connecttowallet' id='staticBackdropConnect' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content shadow-lg'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>Connect to a wallet</h6>
                                <a className='onCloseconnectoawallet shadow float-end'><i className='bi-x'></i></a>
                            </div>
                            <div className='modal-body'>
                                <div className='d-flex'>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='19' src={MetamaskImg} alt=''/>
                                        <p className='mt-3 text-white'>Install Metamask</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='19' src={TrustwalletImg} alt=''/>
                                        <p className='mt-3 text-white'>TrustWallet</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='19' src={WalletConnectImg} alt=''/>
                                        <p className='mt-3 text-white'>WalletConnect</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='19' src={CoinbaseImg} alt=''/>
                                        <p className='mt-3 text-white'>CoinsBase Wallet</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='19' src={SafepalImg} alt=''/>
                                        <p className='mt-3 text-white'>SafePal Wallet</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='19' src={TokenpocketImg} alt=''/>
                                        <p className='mt-3 text-white'>TokenPocket</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className='col-md-6 text-center'>
                                        <div className='box-choose-network'>
                                        <img className='img-fluid' width='19' src={MathwalletImg} alt=''/>
                                        <p className='mt-3 text-white'>Math Wallet</p>
                                        </div>
                                    </div>
                                    <div className='col-md-6 text-center'>
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
