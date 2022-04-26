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

import homeImage from 'images/homeFeed.png';

import {ModalData} from 'types/actions';
import { AllListing, ProjectList, ProjectsEndedList } from 'mattermost-redux/types/crypto';

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
};

export default class ProjectsLive extends React.PureComponent<Props, State> {
    static defaultProps = {userId: ''}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage,data: [],filter: 'all'};

        this.changeFilter = this.changeFilter.bind(this);
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.projects != null){
            Promise.resolve(this.props.projects).then(value => {this.setState({data: value});})
        }
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
            <div className='margin-top-20'>
                <div id='desktopProjectMenu' className='col-md-12'>
                    <button type='button' className='btn button-anchor'>All Laucnhpads</button>
                    <button type='button' className='btn button-anchor'>My Contributiions</button>
                    <button type='button' className='btn buttonBgGreen create-lock-btn'>Connect</button>
                    <button type='button' className='btn buttonBgWhite create-lock-btn'>BSC Mainnet</button>
                    <button type='button' className='btn buttonBgWhite create-lock-btn'>Create</button>
                </div>
                <div id='mobileProjectFilter' className='col-md-12'>
                    <div className='d-flex'>
                        <div className='col-md-2 removePaddingRight'>
                            <div className='form-control search-filter-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-search side-menu-align" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </div>
                        </div>
                        <div className='col-md-10 removePaddingLeft'>
                            <input id='seachInput' type='text' className='form-control search-filter-input' placeholder='Enter Token Name or Token Symbol'></input>
                        </div>
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
                                    <div className='col-md-2 removePaddingRight'>
                                        <div className='form-control search-filter-icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-search" viewBox="0 0 16 16">
                                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className='col-md-10 removePaddingLeft'>
                                        <input id='seachInput' type='text' className='form-control search-filter-input' placeholder='Enter Token Name or Token Symbol'></input>
                                    </div>
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
        );
    }
}
