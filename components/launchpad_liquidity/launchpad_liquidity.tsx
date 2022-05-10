// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import RightDetails from 'components/right_details';
import CurrencyIcon from 'components/currency_icons';
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

import Sidebar from 'components/sidebar';
import SidebarRight from 'components/sidebar_right';
import SidebarRightMenu from 'components/sidebar_right_menu';
import { AllListing, GainerListing, NewListing, TrendListing } from 'mattermost-redux/types/crypto';
import RSDetails from 'components/right_side_details/right_side_details';
import { StringLiteralLike } from 'typescript';

type Props = {
    status?: string;
    userId: string;
    profilePicture: string;
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
    lhsOpen: boolean;
    rhsOpen: boolean;
    rhsMenuOpen: boolean;
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
    middleView: string;
    network: string;
    tokenType: string;
    symbol: string;
    account: string;
    rpcUrls: string;
    balance: float;
    filter: string;
};

export default class LaunchpadLiquidity extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '', allCrypto: [],trendCrypto: [],newCrypto: [],gainerCrypto: []}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light',img_path: homeImage,logo_url: [], data: [],tokenType:'standard_token',symbol: 'ETH',filter: 'all'};

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

    handleAccount = (data) => {
        this.setState({account: data});
    }

    handleRpcUrls = (data) => {
        this.setState({rpcUrls: data});
    }

    handleNetworkChange = (data) => {
        this.setState({network: data});
    }

    handleSymbolChange = (data) => {
        this.setState({symbol: data});
    }

    changeTokenType(event) {
        this.setState({tokenType: event.target.value});
    }

    setDocumentTitle = (siteName: string) => {
        if (siteName) {
            document.title = 'Crypter';
        }
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {return null;}
        return (<Avatar size={size} url={this.props.profilePicture} />);
    }

    renderHandler = (view: string) => {
        this.setState({middleView: view});
    }

    sideBoxRender = (code: string) => {
        return (
            <div>
                <RightDetails symbol={code} />
            </div>
        );
    }

    render= (): JSX.Element => {
        const {tokenType,network, filter} = this.state;
        let liquidityViewDesktop;
        let liquidityViewMobile;
        if(filter === 'all'){
            liquidityViewDesktop = (
                <div className='launchpad-token-all'>
                    <hr/>
                    <div className='row'>
                        <div className='col-md-11 mx-auto'>
                            <input type='text' className='form-control input-create-create-lock-text' placeholder='Search by Token Address' aria-label='Search by Token Address'/>
                        </div>
                    </div>
                    <hr/>
                    <div className='row p-3'>
                        <div className='col-md-5'><strong><small>Token</small></strong></div>
                        <div className='col-md-4'><strong><small>Amount</small></strong></div>
                        <div className='col-md-3'></div>
                    </div>
                    <div className='row p-2'>
                        <div className='col-md-5'>
                        <p>
                            <img className='img-fluid float-start rounded-circle border-info' width='45' src={EthImg}/>
                            <img className='img-fluid float-start rounded-circle border-info style-img-liquidity' width='45' src={BscImg}/>
                            <a className='float-start ml-2 onViewtext'><strong>Poly Moon</strong></a>
                            <br/>
                            <a href='#' className='ml-2'><small className='text-muted'>LEP / EHP</small></a>
                        </p>
                        </div>
                        <div className='col-md-4'><small>900.5320 LEP</small></div>
                        <div className='col-md-3 text-center'><a className='onViewtext'>View</a></div>
                    </div>
                    <div className='row p-2'>
                        <div className='col-md-5'>
                        <p>
                            <img className='img-fluid float-start rounded-circle border-info' width='45' src={BscImg}/>
                            <img className='img-fluid float-start rounded-circle border-info style-img-liquidity' width='45' src={EthImg}/>
                            <a className='float-start ml-2 onViewtext'><strong>Test Moon</strong></a>
                            <br/>
                            <a href='#' className='ml-2'><small className='text-muted'>LEP / EHP</small></a>
                        </p>
                        </div>
                        <div className='col-md-4'><small>900.5320 LEP</small></div>
                        <div className='col-md-3 text-center'><a className='onViewtext'>View</a></div>
                    </div>
                    <div className='row p-2'>
                        <div className='col-md-5'>
                        <p>
                            <img className='img-fluid float-start rounded-circle border-info' width='45' src={BscImg}/>
                            <img className='img-fluid float-start rounded-circle border-info style-img-liquidity' width='45' src={EthImg}/>
                            <a className='float-start ml-2 onViewtext'><strong>Haze Token</strong></a>
                            <br/>
                            <a href='#' className='ml-2'><small className='text-muted'>LEP / EHP</small></a>
                        </p>
                        </div>
                        <div className='col-md-4'><small>900.5320 LEP</small></div>
                        <div className='col-md-3 text-center'><a className='onViewtext'>View</a></div>
                    </div>
                    <div className='row p-2'>
                        <div className='col-md-5'>
                        <p>
                            <img className='img-fluid float-start rounded-circle border-info' width='45' src={EthImg}/>
                            <img className='img-fluid float-start rounded-circle border-info style-img-liquidity' width='45' src={BscImg}/>
                            <a className='float-start ml-2 onViewtext'><strong>Energy Token</strong></a>
                            <br/>
                            <a href='#' className='ml-2'><small className='text-muted'>LEP / EHP</small></a>
                        </p>
                        </div>
                        <div className='col-md-4'><small>900.5320 LEP</small></div>
                        <div className='col-md-3 text-center'><a className='onViewtext'>View</a></div>
                    </div>
                </div>
            );
        }else{
            liquidityViewDesktop = (
                <div className='launchpad-my-lock'>
                    <hr/>
                    <div className='row'>
                        <div className='col-md-11 mx-auto'>
                            <input type='text' className='form-control input-create-create-lock-text' placeholder='Search by Token Address' aria-label='Search by Token Address'/>
                        </div>
                    </div>
                    <hr/>
                    <div className='row p-3'>
                        <div className='col-md-5'><strong><small>Token</small></strong></div>
                        <div className='col-md-4'><strong><small>Amount</small></strong></div>
                        <div className='col-md-3'></div>
                    </div>
                    <div className='row p-2'>
                        <div className='col-md-5'>
                            <p>
                                <img className='img-fluid float-start rounded-circle border-info' width='45' src={EthImg}/>
                                <img className='img-fluid float-start rounded-circle border-info style-img-liquidity' width='45' src={BscImg}/>
                                <a className='float-start ml-2 onViewtext'><strong>Marker One</strong></a>
                                <br/>
                                <a href='#' className='ml-2'><small className='text-muted'>LEP / EHP</small></a>
                            </p>
                        </div>
                        <div className='col-md-4'><small>900.5320 LEP</small></div>
                        <div className='col-md-3 text-center'><a className='onViewtext'>View</a></div>
                    </div>
                    <div className='row p-2'>
                        <div className='col-md-5'>
                            <p>
                                <img className='img-fluid float-start rounded-circle border-info' width='45' src={EthImg}/>
                                <img className='img-fluid float-start rounded-circle border-info style-img-liquidity' width='45' src={BscImg}/>
                                <a className='float-start ml-2 onViewtext'><strong>Heroine Token</strong></a>
                                <br/>
                                <a href='#' className='ml-2'><small className='text-muted'>LEP / EHP</small></a>
                            </p>
                        </div>
                        <div className='col-md-4'><small>900.5320 LEP</small></div>
                        <div className='col-md-3 text-center'><a className='onViewtext'>View</a></div>
                    </div>
                    <div className='row p-2'>
                        <div className='col-md-5'>
                            <p>
                                <img className='img-fluid float-start rounded-circle border-info' width='45' src={BscImg}/>
                                <img className='img-fluid float-start rounded-circle border-info style-img-liquidity' width='45' src={EthImg}/>
                                <a className='float-start ml-2 onViewtext'><strong>Iplorem Token</strong></a>
                                <br/>
                                <a href='#' className='ml-2'><small className='text-muted'>LEP / EHP</small></a>
                            </p>
                        </div>
                        <div className='col-md-4'><small>900.5320 LEP</small></div>
                        <div className='col-md-3 text-center'><a className='onViewtext'>View</a></div>
                    </div>
                </div>
            );
        }
        let networkButton;
        let poolFee;
        let createFee;
        if(network === '137'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small><img width='16' src={MaticImg}/>&nbsp;MATIC MAINNET</small></a>
            );
            poolFee = 100;
            createFee = 30;
        }else if(network === '80001'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small><img width='16' src={MaticImg}/>&nbsp;MUMBAI</small></a>
            );
            poolFee = 100;
            createFee = 0.01;
        }else if(network === '56'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small><img width='16' src={BscImg}/>&nbsp;BSC MAINNET</small></a>
            );
            poolFee = 1;
            createFee = 0.2;
        }else if(network === '97'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small><img width='16' className='img-fluid' src={BscImg}/>&nbsp;BSC TESTNET</small></a>
            );
            poolFee = 0.01;
            createFee = 0.01;
        }else if(network === '321'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small><img width='16' src={KucoinImg}/>&nbsp;KCC MAINNET</small></a>
            );
            poolFee = 35;
            createFee = 10;
        }else if(network === '43114'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small><img width='16' src={AvaxImg}/>&nbsp;AVAX</small></a>
            );
            poolFee = 10;
            createFee = 1;
        }else if(network === '250'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small><img width='16' height='16' src={FantomImg}/>&nbsp;Fantom</small></a>
            );
            poolFee = 150;
            createFee = 30;
        }else if(network === '25'){
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small><img width='16' height='16' src={CronosImg}/>&nbsp;Cronos</small></a>
            );
            poolFee = 1000;
            createFee = 100;
        }else{
            networkButton = (
                <a className='onLockbuttoncreatenormal float-end mr-1 ml-1' data-toggle='modal' data-target='#staticBackdropNetwork'><small><img width='16' src={EthImg}/>&nbsp;ETH MAINNET</small></a>
            );
            poolFee = 0.2;
            createFee = 0.1;
        }

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

        let btcContent;
        let ltcContent;
        let ethContent;
        let bnbContent;

        btcContent = this.sideBoxRender("BTC");
        ltcContent = this.sideBoxRender("LTC");
        ethContent = this.sideBoxRender("ETH");
        bnbContent = this.sideBoxRender("BNB");
        return (
            <>
                <div className='div-bg'>
                    <div className='col-lg-12 bodyBgElipseLaunchpad bgGrey'>
                        <div className='crypter-section-desktop'>
                            <div className='col-lg-12 removePadding'>
                                <div className='row'>
                                    <div className='col-sm-9'>
                                        <div className='margin-top-20'>
                                            <div className='col-md-12 removePadding'>
                                                <ButtonConnect account={this.handleAccount} balance={`${this.state.balance} ${this.state.symbol}`}/>
                                                {networkButton}
                                                <a className="onLockbuttoncreate float-end ml-1" data-toggle='modal' data-target='#staticBackdropCreateToken'><small>Create</small></a>
                                            </div>
                                            <br/>
                                            <br/>
                                            <div id='create-lock' className='col-md-12 create-token-box'>
                                            <div className='launchpad-token'>
                                                <div className='row'>
                                                    <div className='col-md-5'><h6 className='float-start mt-4'>Liquidity Token</h6></div>
                                                    <div className='col-md-7'>
                                                    <a className='float-end onMylocktoken mt-4 onViewtext' onClick={() => {this.setState({filter: 'mylock'});}}><strong>My Lock</strong></a>
                                                    <a className='float-end onAlltoken mr-2 mt-4 onViewtext' onClick={() => {this.setState({filter: 'all'});}}><strong>All</strong></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='launchpad-token-body'>
                                                {liquidityViewDesktop}
                                            </div>
                                            <div className='launchpad-token-footer'>
                                                <div className='row'></div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div className='token-pagination float-end'>
                                                    <a className='float-start'>1 of 4</a>
                                                    <a className='float-end onPaginationnext'><i className='bi-arrow-right text-success'></i></a>
                                                    <a className='float-end onPaginationprev'><i className='bi-arrow-left mr-2'></i></a>
                                                </div>
                                            </div>
                                        </div>
                                            <div className='col-lg-12 text-center margin-top-30-responsive'>
                                                <label className='text-secondary small'>Disclaimer: The information provided shall not in any way constitute a recommendation as to whether you should invest in any product discussed. We accept no liability for any loss occasioned to any person acting or refraining from action as a result of any material provided or published.</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-3 removePaddingRight' id="side_menu_right">
                                        {btcContent}
                                        {ltcContent}
                                        {ethContent}
                                        {bnbContent}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='crypter-section-mobile'>
                            
                        </div>
                    </div>
                </div>
                <div className='modal createtoken' id='staticBackdropCreateToken' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content shadow-lg'>

                            <div className='modal-header'>
                            <h4 className='modal-title' id='staticBackdropLabel'>Create token</h4>
                            <a className='onClosecreatetokens shadow float-end'  data-dismiss='modal'><i className='bi-x'></i></a>
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
                                    <small>Fee: {createFee} {this.state.symbol}</small>
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
                                <a className='onClosechoosenetwork shadow float-end' data-dismiss='modal'><i className='bi-x'></i></a>
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
                                <a className='onCloseconnectoawallet shadow float-end' data-dismiss='modal'><i className='bi-x'></i></a>
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
