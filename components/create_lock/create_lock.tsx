// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import classNames from 'classnames';
import CurrencyIcons from 'components/currency_icons';
import TrendingListComp from 'components/trending_crypto';
import SelectWalletModal from "components/create_token/Modal";
import ButtonConnect from "components/create_token/button_connect";
import NetworkModal from "components/create_token/network_modal";

import Web3 from 'web3';

import homeImage from 'images/homeFeed.png';
import CronosImg from 'images/launchpad/network/ic-cronos.5a2dbab3.svg';
import FantomImg from 'images/launchpad/network/ic-fantom.306f76f9.svg';
import AvaxImg from 'images/launchpad/network/ic-avax.234db155.svg';
import KucoinImg from 'images/launchpad/network/KuCoin.png';
import MaticImg from 'images/launchpad/network/ic-matic.910e1faf.png';
import BscImg from 'images/launchpad/network/ic-bsc.419dfaf2.png';
import EthImg from 'images/launchpad/network/ic-eth.9270fc02.svg';

import {ModalData} from 'types/actions';
import ChannelHeaderMobile from 'components/channel_header_mobile';

import SidebarRightMenu from 'components/sidebar_right_menu';
import { AllListing, GainerListing, NewListing, TrendListing } from 'mattermost-redux/types/crypto';

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
    network: string;
    tokenType: string;
    symbol: string;
    account: string;
    rpcUrls: string;
    balance: float;
};

export default class LaunchPad extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '', allCrypto: [],trendCrypto: [],newCrypto: [],gainerCrypto: []}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage,tokenType:'standard_token',symbol:'ETH'};

        this.handleNetworkChange = this.handleNetworkChange.bind(this);
        this.changeTokenType = this.changeTokenType.bind(this);
        this.handleSymbolChange = this.handleSymbolChange.bind(this);
        this.handleAccount = this.handleAccount.bind(this);
        this.handleRpcUrls = this.handleRpcUrls.bind(this);
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        const savedNetwork = window.localStorage.getItem('chainNetwork');
        if(savedNetwork !== undefined && savedNetwork !== null && savedNetwork !== '')
        {
            this.setState({network: savedNetwork});
        }
        else{
            this.setState({network: '1'});
        }

        const savedSymbol = window.localStorage.getItem('chainSymbol');
        if(savedSymbol !== undefined && savedSymbol !== null && savedSymbol !== '')
        {
            this.setState({symbol: savedSymbol});
        }
        else{
            this.setState({symbol: 'ETH'});
        }

        
        if (typeof window.ethereum !== 'undefined') {
            const web3Info = await new Web3(window.ethereum);
            if (this.state.account !== undefined && this.state.account !== null && this.state.account !== '')
            {
                const balance = await web3Info.eth.getBalance(this.state.account);
                if(balance !== undefined && balance !== null){
                    const covertedBal = web3Info.utils.fromWei(balance, 'ether');
                    this.setState({balance: covertedBal});
                }
                else{
                    this.setState({balance: 0});
                }
            }
        }
    }

    componentDidUpdate = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const web3Info = await new Web3(window.ethereum);
            if (this.state.account !== undefined && this.state.account !== null && this.state.account !== '')
            {
                const balance = await web3Info.eth.getBalance(this.state.account);
                if(balance !== undefined && balance !== null){
                    const covertedBal = web3Info.utils.fromWei(balance, 'ether');
                    this.setState({balance: covertedBal});
                }
            }
        }
    }

    handleSymbolChange = (data) => {
        this.setState({symbol: data});
    }

    handleNetworkChange = (data) => {
        this.setState({network: data});
    }

    changeTokenType(event) {
        this.setState({tokenType: event.target.value});
    }

    handleAccount = (data) => {
        this.setState({account: data});
    }

    handleRpcUrls = (data) => {
        this.setState({rpcUrls: data});
    }


    render= (): JSX.Element => {
        const {tokenType,network} = this.state;
        let networkButton;
        let poolFee;
        let createFee;
        if(network === '137'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-bs-toggle='modal' data-bs-target='#staticBackdropNetwork'><small><img width='16' src={MaticImg}/>&nbsp;MATIC MAINNET</small></a>
            );
            poolFee = 100;
            createFee = 30;
        }else if(network === '80001'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-bs-toggle='modal' data-bs-target='#staticBackdropNetwork'><small><img width='16' src={MaticImg}/>&nbsp;MUMBAI</small></a>
            );
            poolFee = 100;
            createFee = 0.01;
        }else if(network === '56'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-bs-toggle='modal' data-bs-target='#staticBackdropNetwork'><small><img width='16' src={BscImg}/>&nbsp;BSC MAINNET</small></a>
            );
            poolFee = 1;
            createFee = 0.2;
        }else if(network === '97'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-bs-toggle='modal' data-bs-target='#staticBackdropNetwork'><small><img width='16' className='img-fluid' src={BscImg}/>&nbsp;BSC TESTNET</small></a>
            );
            poolFee = 0.01;
            createFee = 0.01;
        }else if(network === '321'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-bs-toggle='modal' data-bs-target='#staticBackdropNetwork'><small><img width='16' src={KucoinImg}/>&nbsp;KCC MAINNET</small></a>
            );
            poolFee = 35;
            createFee = 10;
        }else if(network === '43114'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-bs-toggle='modal' data-bs-target='#staticBackdropNetwork'><small><img width='16' src={AvaxImg}/>&nbsp;AVAX</small></a>
            );
            poolFee = 10;
            createFee = 1;
        }else if(network === '250'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-bs-toggle='modal' data-bs-target='#staticBackdropNetwork'><small><img width='16' height='16' src={FantomImg}/>&nbsp;Fantom</small></a>
            );
            poolFee = 150;
            createFee = 30;
        }else if(network === '25'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-bs-toggle='modal' data-bs-target='#staticBackdropNetwork'><small><img width='16' height='16' src={CronosImg}/>&nbsp;Cronos</small></a>
            );
            poolFee = 1000;
            createFee = 100;
        }else{
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-bs-toggle='modal' data-bs-target='#staticBackdropNetwork'><small><img width='16' src={EthImg}/>&nbsp;ETH MAINNET</small></a>
            );
            poolFee = 0.2;
            createFee = 0.1;
        }

        let antiBotInfo;
        if(antiBot){
            antiBotInfo = (<p className='mt-2 implementpinkinformation'>Please visit <a className='text-success' target='_self'><strong>https://www.crypter.com/#antibot</strong></a> to active Pink Anti-Bot after creating the token. Check out the tutorial here: <a className='text-success' target='_self'><strong>https://www.crypter.com/pink-anti-bot/pink-anti-bot-guide</strong></a></p>);
        }

        let createTokenInfo;
        if(tokenType === 'LiquidityGeneratorToken'){
            createTokenInfo = (<div className='liquidity-generator-token'>
            <div className='mb-3'>
                <label htmlFor='formGroupExampleInput' className='form-label'><p>Router*</p></label>
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
                <label htmlFor='inputEmail4' className='form-label'><p>Transaction fee to generate yield (%)</p></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 1'/>
            </div>
            <div className='col-md-6'>
                <label htmlFor='inputPassword4' className='form-label'><p>Transaction fee to generate liquidity (%)</p></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 1'/>
            </div>
            </div>

            <div className='row'>
            <div className='col-md-12'>
                <label htmlFor='inputEmail4' className='form-label'><p>Charity/Marketing address</p></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 0x....'/>
            </div>
            </div>

            <div className='row'>
            <div className='col-md-12'>
                <label htmlFor='inputEmail4' className='form-label'><p>Charity/Marketing percent (%)</p></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex - 25'/>
            </div>
            </div>
        </div>);
        }else if(tokenType === 'babytoken'){
            createTokenInfo = (
                <div className='baby-token'>
                    <div className='mb-3'>
                        <label htmlFor='formGroupExampleInput' className='form-label'><p>Router*</p></label>
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
                        <label htmlFor='inputEmail4' className='form-label'><p>Reward token*</p></label>
                        <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 0x...'/>
                        <small data-bs-toggle='tooltip' data-bs-placement='top' title='If you want to reward DOGE Please enter 0xba2ae424d960c26247dd6c32edc70b295c744c43.'><i className='bi-info-circle-fill'></i></small>
                    </div>
                    <div className='col-md-7'>
                        <label htmlFor='inputPassword4' className='form-label'><p>Minimum token balance for dividends *</p></label>
                        <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 100000000000'/>
                        <small data-bs-toggle='tooltip' data-bs-placement='top' title='Min hold each wallet must be over $50 to receive rewards.'><i className='bi-info-circle-fill'></i></small>
                    </div>
                    </div>
                    <div className='row mt-3'>
                    <div className='col-md-5'>
                        <label htmlFor='inputEmail4' className='form-label'><p>Marketing fee (%)*</p></label>
                        <input type='text' className='form-control form-control-sm' id='' placeholder='0 - 100'/>
                    </div>
                    <div className='col-md-7'>
                        <label htmlFor='inputPassword4' className='form-label'><p>Marketing wallet*</p></label>
                        <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 0x...'/>
                    </div>
                    </div>
                </div>
            );
        }else if(tokenType === 'BuybackBabyToken'){
            createTokenInfo = (<div className='buy-back-baby-token'>
            <div className='mb-3'>
                <label htmlFor='formGroupExampleInput' className='form-label'><p>Router*</p></label>
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
                <label htmlFor='inputDoge4' className='form-label'><p>Reward token*</p></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='Ex: 0x...'/>
                <small data-bs-toggle='tooltip' data-bs-placement='top' title='If you want to reward DOGE Please enter 0xba2ae424d960c26247dd6c32edc70b295c744c43.'><i className='bi-info-circle-fill'></i></small>
            </div>
            <div className='col-md-7'>
                <label htmlFor='inputPassword4' className='form-label'><p>Liquidity Fee (%)</p></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='0 - 100'/>
            </div>
            </div>

            <div className='row mt-3'>
            <div className='col-md-5'>
                <label htmlFor='inputEmail4' className='form-label'><p>Buyback Fee (%)</p></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='3'/>
            </div>
            <div className='col-md-7'>
                <label htmlFor='inputPassword4' className='form-label'><p>Reflection Fee (%)</p></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='8'/>
            </div>
            </div>

            <div className='row mt-3'>
            <div className='col-md-12'>
                <label htmlFor='inputEmail4' className='form-label'><p>Marketing fee (%)*</p></label>
                <input type='text' className='form-control form-control-sm' id='' placeholder='0 - 100'/>
            </div>
            </div>

        </div>);
        }else{

        }

        return (
            <>
                <div className='margin-top-20'>
                    <div className='col-md-12 removePadding'>
                        <ButtonConnect account={this.handleAccount} balance={`${this.state.balance} ${this.state.symbol}`}/>
                        {networkButton}
                        <a className="onLockbuttoncreate float-end ml-1" data-bs-toggle='modal' data-bs-target='#staticBackdropCreateToken'><small>Create</small></a>
                    </div>
                    <br></br>
                    <br></br>
                    <div id='create-lock' className='col-md-12 create-token-box'>
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
                    </div>
                </div>
                <div className='modal createtoken' id='staticBackdropCreateToken' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content shadow-lg'>

                            <div className='modal-header'>
                            <h4 className='modal-title' id='staticBackdropLabel'>Create token</h4>
                            <a className='onClosecreatetokens shadow float-end'  data-bs-dismiss='modal'><i className='bi-x'></i></a>
                            </div>

                            <div className='modal-body'>
                                <form>
                                <div className='mb-3'>
                                    <label htmlFor='inputState' className='form-label form-control-sm'><small>(*) is required field.</small><br/><p>Token Type*</p></label>
                                    <select id='tokentypes' onChange={this.changeTokenType} value={this.state.tokenType} className='form-control'>
                                        <option value='standard_token'>Standard Token</option>
                                        <option value='LiquidityGeneratorToken'>Liquidity Generator Token</option>
                                        <option value='babytoken'>Baby Token</option>
                                        <option value='BuybackBabyToken'>Buyback Baby Token</option>
                                    </select>
                                    <small>Fee: {createFee} {this.state.symbol}</small>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='formGroupExampleInput' className='form-label'><p>Name*</p></label>
                                    <input type='text' className='form-control form-control-sm' id='formGroupExampleInput' placeholder='Ex: Ethereum'/>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='formGroupExampleInput' className='form-label'><p>Symbol*</p></label>
                                    <input type='text' className='form-control form-control-sm' id='formGroupExampleInput' placeholder='Ex: RTH'/>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='formGroupExampleInput' className='form-label'><p>Decimals*</p></label>
                                    <input type='text' className='form-control form-control-sm' id='formGroupExampleInput' placeholder='Ex: 18'/>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='formGroupExampleInput' className='form-label'><p>Total supply*</p></label>
                                    <input type='text' className='form-control form-control-sm' id='formGroupExampleInput' placeholder='Ex: 1000000000000'/>
                                </div>

                                {createTokenInfo}

                                <div className='mt-3'>
                                    <input className='form-check-input onImplementpinkantisystem' value={antiBot} onChange={this.handleChangeAntiBot} type='checkbox' id='antiBot'/>
                                    <label className='form-check-label ml-2' htmlFor='antiBot'>
                                        <p>Implement Pink Anti-Bot System?</p>
                                    </label>
                                    {antiBotInfo}
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
                                <a className='onClosechoosenetwork shadow float-end' data-bs-dismiss='modal'><i className='bi-x'></i></a>
                            </div>
                            <div className='modal-body'>
                            <NetworkModal changeNetwork={this.handleNetworkChange} symbolChange={this.handleSymbolChange} rpcUrls={this.handleRpcUrls}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='modal connecttowallet' id='staticBackdropConnect' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content shadow-lg'>
                            <div className='modal-header'>
                                <h6 className='modal-title' id='staticBackdropLabel'>Connect to a wallet</h6>
                                <a className='onCloseconnectoawallet shadow float-end' data-bs-dismiss='modal'><i className='bi-x'></i></a>
                            </div>
                            <div className='modal-body'>
                                <SelectWalletModal />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
