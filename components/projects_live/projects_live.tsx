// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import fillImage from 'images/fill.svg';
import CurrencyIcons from 'components/currency_icons';
import ProgressBar from 'components/progress_bar_new';
import CurrencyCap from 'components/currency_cap/currency_cap';
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
import { AllListing, ProjectList, ProjectsEndedList } from 'mattermost-redux/types/crypto';
import { StringLocale } from 'yup/lib/locale';

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
    filter: string;
    network: string;
    tokenType: string;
    symbol: string;
    account: string;
    rpcUrls: string;
    balance: float;
    antiBot: boolean;
};

export default class ProjectsLive extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {antiBot: false,openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage,data: [],filter: 'all',tokenType:'standard_token',symbol: 'ETH'};

        this.changeFilter = this.changeFilter.bind(this);
        this.handleNetworkChange = this.handleNetworkChange.bind(this);
        this.changeTokenType = this.changeTokenType.bind(this);
        this.handleSymbolChange = this.handleSymbolChange.bind(this);
        this.handleAccount = this.handleAccount.bind(this);
        this.handleRpcUrls = this.handleRpcUrls.bind(this);
        this.handleChangeAntiBot = this.handleChangeAntiBot.bind(this);
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.projects != null){
            Promise.resolve(this.props.projects).then(value => {this.setState({data: value});})
        }

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

    handleChangeAntiBot = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({antiBot: e.target.checked});
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

    changeFilter(event) {
        this.setState({filter: event.target.value});
    }

    renderTime = (date: string) =>{
        var dateNow = new Date();
        var dateConverted = Date.parse(date.toString());

        var delta = Math.abs(dateConverted - dateNow) / 1000;
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;

        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        var seconds = delta % 60;

        const value = days.toString().padStart(2,"0") + ":" + hours.toString().padStart(2,"0")  + ":" + minutes.toString().padStart(2,"0")  + ":" + parseFloat(seconds.toString().padStart(2,"0")).toFixed(0);

        return (
            <div>
                <p className='text-secondary small text-margin-0'>Sale starts in:</p>
                <label className='text-primary'>{value}</label>
            </div>
        );
    } 

    projectList = () =>{
        return (
            <div className='col-md-12'>
                <div className='row'>
                    {this.state.data.filter(t => t.status === 'ONGOING').map((item,key) => {
                        let projectName;
                        if (item.project_name.length > 42){
                            projectName = item.project_name.substring(0,43);
                        }
                        else{
                            projectName = item.project_name;
                        }

                        return(
                            <div className='col-md-4'>
                                <div className='col-md-12 project-item-box'>
                                    <div className='d-flex'>
                                        <div className='col-md-3 width-15'>
                                            <CurrencyIcons code={item.coin.symbol.toString()}></CurrencyIcons>
                                        </div>
                                        <div className='col-md-9 width-85 text-end'>
                                            <label className='text-percent small sale-live-box'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4FBF67" className="bi bi-dot align-svg" viewBox="0 0 16 16">
                                            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                            </svg>&nbsp;Sale Live</label>
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <h5 className='text-primary' key={key + item.coin.symbol + '-name'}>{projectName.toLowerCase()}..</h5>
                                        <CurrencyCap symbol={item.coin.symbol} />
                                        <br></br>
                                        <p className='small text-secondary'>
                                            Soft Cap/Hard Cap
                                        </p>
                                        <label className='text-percent' key={key + item.coin.symbol + '-prize'}>1 {item.coin.symbol} - {item.total_prize} {item.coin.symbol}</label>
                                        <br></br>
                                        <br></br>
                                        <p className='small text-secondary'>Progress (0.00%)</p>
                                        <ProgressBar completed='10' min='1' max={item.total_prize.toString()}></ProgressBar>
                                    </div>
                                    <div className='col-md-12 removePadding'>
                                        <br></br>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'><p className='small text-secondary' key={key + item.coin.symbol + '-start'}>0 {item.coin.symbol}</p></div>
                                            <div className='col-md-6 text-end width-50 removePaddingLeft'><p className='small text-secondary' key={key + item.coin.symbol + '-end'}>{item.total_prize} {item.coin.symbol}</p></div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'><label className='small text-primary' >Liquidity %:</label></div>
                                            <div className='col-md-6 text-end width-50'><label className='small text-primary' >51%</label></div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'><label className='small text-primary' >Lockup Time</label></div>
                                            <div className='col-md-6 text-end width-50'><label className='small text-primary' >180 days</label></div>
                                        </div>
                                        <hr></hr>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'>{this.renderTime(item.start_date)}</div>
                                            <div className='col-md-6 text-end width-50'><button type='button' className='view-pool-btn p-2'>View Pool</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    endedList = () => {
        return (
            <div className='col-md-12'>
                <div className='row'>
                    {this.state.data.filter(t => t.status === 'ENDED').map((item,key) => {
                        let projectName;
                        if (item.project_name.length > 42){
                            projectName = item.project_name.substring(0,43);
                        }
                        else{
                            projectName = item.project_name;
                        }

                        return(
                            <div className='col-md-4'>
                                <div className='col-md-12 project-item-box'>
                                    <div className='d-flex'>
                                        <div className='col-md-3 width-15'>
                                            <CurrencyIcons code={item.coin.symbol.toString()}></CurrencyIcons>
                                        </div>
                                        <div className='col-md-9 width-85 text-end'>
                                            <label className='text-ended small sale-ended-box'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#783efd" className="bi bi-dot align-svg" viewBox="0 0 16 16">
                                            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                            </svg>&nbsp;Sale Ended</label>
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <h5 className='text-primary' key={key + item.coin.symbol + '-name'}>{projectName.toLowerCase()}..</h5>
                                        <CurrencyCap symbol={item.coin.symbol} />
                                        <br></br>
                                        <p className='small text-secondary'>
                                            Soft Cap/Hard Cap
                                        </p>
                                        <label className='text-percent' key={key + item.coin.symbol + '-prize'}>1 {item.coin.symbol} - {item.total_prize} {item.coin.symbol}</label>
                                        <br></br>
                                        <br></br>
                                        <p className='small text-secondary'>Progress (0.00%)</p>
                                        <ProgressBar completed='50' min='1' max={item.total_prize.toString()}></ProgressBar>
                                    </div>
                                    <div className='col-md-12 removePadding'>
                                        <br></br>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'><p className='small text-secondary' key={key + item.coin.symbol + '-start'}>0 {item.coin.symbol}</p></div>
                                            <div className='col-md-6 text-end width-50 removePaddingLeft'><p className='small text-secondary' key={key + item.coin.symbol + '-end'}>{item.total_prize} {item.coin.symbol}</p></div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'><label className='small text-primary' >Liquidity %:</label></div>
                                            <div className='col-md-6 text-end width-50'><label className='small text-primary' >51%</label></div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'><label className='small text-primary' >Lockup Time</label></div>
                                            <div className='col-md-6 text-end width-50'><label className='small text-primary' >180 days</label></div>
                                        </div>
                                        <hr></hr>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'><p className='text-secondary small text-margin-0'>Sale starts in:</p><label className='text-primary'>00:00:00:00</label></div>
                                            <div className='col-md-6 text-end width-50'><button type='button' className='view-pool-btn p-2'>View Pool</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    renderStatus = (status: string) => {
        if(status === "ENDED"){
            return (<label className='text-ended small sale-ended-box'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#783efd" className="bi bi-dot align-svg" viewBox="0 0 16 16">
            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
            </svg>&nbsp;Sale Ended</label>);
        }
        else{
            return (<label className='text-percent small sale-live-box'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4FBF67" className="bi bi-dot align-svg" viewBox="0 0 16 16">
            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
            </svg>&nbsp;Sale Live</label>);
        }
    }

    renderDate = (status,date) =>{
        if(status === "ENDED"){
            return (<div><p className='text-secondary small text-margin-0'>Sale starts in:</p><label className='text-primary'>00:00:00:00</label></div>);
        }
        else{
            return (<div>{this.renderTime(date)}</div>);
        }
    }

    overallList = () => {
        return (
            <div className='col-md-12'>
                <div className='row'>
                    {this.state.data.map((item,key) => {
                        let projectName;
                        if (item.project_name.length > 42){
                            projectName = item.project_name.substring(0,43);
                        }
                        else{
                            projectName = item.project_name;
                        }

                        return(
                            <div className='col-md-4'>
                                <div className='col-md-12 project-item-box'>
                                    <div className='d-flex'>
                                        <div className='col-md-3 width-15'>
                                            <CurrencyIcons code={item.coin.symbol.toString()}></CurrencyIcons>
                                        </div>
                                        <div className='col-md-9 width-85 text-end'>
                                            {this.renderStatus(item.status)}
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <h5 className='text-primary' key={key + item.coin.symbol + '-name'}>{projectName.toLowerCase()}..</h5>
                                        <CurrencyCap symbol={item.coin.symbol} />
                                        <br></br>
                                        <p className='small text-secondary'>
                                            Soft Cap/Hard Cap
                                        </p>
                                        <label className='text-percent' key={key + item.coin.symbol + '-prize'}>1 {item.coin.symbol} - {item.total_prize} {item.coin.symbol}</label>
                                        <br></br>
                                        <br></br>
                                        <p className='small text-secondary'>Progress (0.00%)</p>
                                        <ProgressBar completed='50' min='1' max={item.total_prize.toString()}></ProgressBar>
                                    </div>
                                    <div className='col-md-12 removePadding'>
                                        <br></br>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'><p className='small text-secondary' key={key + item.coin.symbol + '-start'}>0 {item.coin.symbol}</p></div>
                                            <div className='col-md-6 text-end width-50 removePaddingLeft'><p className='small text-secondary' key={key + item.coin.symbol + '-end'}>{item.total_prize} {item.coin.symbol}</p></div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className='col-md-6'><label className='small text-primary' >Liquidity %:</label></div>
                                            <div className='col-md-6 text-end'><label className='small text-primary' >51%</label></div>
                                        </div>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'><label className='small text-primary' >Lockup Time</label></div>
                                            <div className='col-md-6 text-end width-50'><label className='small text-primary' >180 days</label></div>
                                        </div>
                                        <hr></hr>
                                        <div className='d-flex'>
                                            <div className='col-md-6 width-50'>{this.renderDate(item.status,item.start_date)}</div>
                                            <div className='col-md-6 text-end width-50'><button type='button' className='view-pool-btn p-2'>View Pool</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    render= (): JSX.Element => {
        const {tokenType,network, antiBot} = this.state;
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

        let list;
        if(this.state.fitler === 'filled'){
            
            list = this.endedList();
        }
        else if(this.state.filter === 'ended'){
            list = this.endedList();
        }
        else if(this.state.filter === 'all'){
            list = this.overallList();
        }
        else{
            list = this.projectList();
        }

        return (
            <>
                <div className='margin-top-20'>
                    <div id='desktopProjectMenu' className='col-md-12'>
                        <button type='button' className='btn button-anchor'>All Laucnhpads</button>
                        <button type='button' className='btn button-anchor'>My Contributiions</button>
                        <ButtonConnect account={this.handleAccount} balance={`${this.state.balance} ${this.state.symbol}`}/>
                        {networkButton}
                        <a className="onLockbuttoncreate float-end ml-1" data-bs-toggle='modal' data-bs-target='#staticBackdropCreateToken'><small>Create</small></a>
                    </div>
                    <div id='mobileProjectFilter' className='col-md-12'>
                        <div className='d-flex'>
                            <div className='search-filter-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-search side-menu-align" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </div>
                            <input id='seachInput' type='text' className='form-control search-filter-input' placeholder='Enter Token Name or Token Symbol'></input>
                        </div>
                        <br></br>
                        <div className='d-flex'>
                            <div className='col-md-6 width-50 removePaddingLeft'>
                                <label className='small text-secondary'>filter By</label>
                                <select id='fitlerInput' onChange={this.changeFilter} value={this.state.filter} className='form-control custom-token-input'>
                                    <option value='all'>All Status</option>
                                    <option value='live'>Live</option>
                                    <option value='kyc'>KYC</option>
                                    <option value='filled'>Filled</option>
                                    <option value='ended' >Ended</option>
                                </select>
                            </div>
                            <div className='col-md-6 width-50 removePaddingRight'>
                                <label className='small text-secondary'>Sort By</label>
                                <select id='sortFilter' className='form-control custom-token-input'>
                                    <option value=''>No filters</option>
                                    <option value='start'>Start Date</option>
                                    <option value='end'>End Date</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    <div id='desktopProjectFilter' className='col-md-12'>
                        <div className='search-filter-box'>
                            <div className='row'>
                                <div className='col-md-7'>
                                    <div className='d-flex'>
                                        <div className='search-filter-icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-search" viewBox="0 0 16 16">
                                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                            </svg>
                                        </div>
                                        <input id='seachInput' type='text' className='form-control search-filter-input' placeholder='Enter Token Name or Token Symbol'></input>
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <label className='small text-secondary'>filter By</label>
                                    <select id='fitlerInput' onChange={this.changeFilter} value={this.state.filter} className='form-control custom-token-input'>
                                        <option value='all'>All Status</option>
                                        <option value='live'>Live</option>
                                        <option value='kyc'>KYC</option>
                                        <option value='filled'>Filled</option>
                                        <option value='ended' >Ended</option>
                                    </select>
                                </div>
                                <div className='col-md-2'>
                                    <label className='small text-secondary'>Sort By</label>
                                    <select id='sortFilter' className='form-control custom-token-input'>
                                        <option value=''>No filters</option>
                                        <option value='start'>Start Date</option>
                                        <option value='end'>End Date</option>
                                    </select>
                                </div>
                                <div className='col-md-1'>
                                        
                                </div>
                            </div>
                        </div>
                    </div>
                    {list}
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
