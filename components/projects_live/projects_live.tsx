// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import fillImage from 'images/fill.svg';
import CurrencyIcons from 'components/currency_icons';
import ProgressBar from 'components/progress_bar_new';

import homeImage from 'images/homeFeed.png';

import {ModalData} from 'types/actions';
import { AllListing, ProjectList } from 'mattermost-redux/types/crypto';

type Props = {
    status?: string;
    userId: string;
    autoResetPref?: string;
    projects: Promise<ProjectList[]>;
    currencies: Promise<AllListing[]>;
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
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage,data: [],listing: []};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.projects != null){
            Promise.resolve(this.props.projects).then(value => {this.setState({data: value});})
        }

        if(this.props.currencies != null){
            Promise.resolve(this.props.currencies).then(value => {this.setState({listing: value});})
        }
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

        const value = days.padStart(2, '0') + ":" + hours.padStart(2, '0')  + ":" + minutes.padStart(2, '0')  + ":" + seconds.padStart(2, '0');

        return (
            <div>
                <p className='text-secondary small'>Sale starts in:</p>
                <label className='text-primary'>{value}</label>
            </div>
        );
    } 

    projectList = () =>{
        return (
            <div className='col-md-12'>
                <div className='row'>
                    {this.state.data.map((item,key) => {
                        return(
                            <div className='col-md-4'>
                                <div className='col-md-12 project-item-box'>
                                    <div className='d-flex'>
                                        <div className='col-md-2'>
                                            <CurrencyIcons code={item.coin.symbol.toString()}></CurrencyIcons>
                                        </div>
                                        <div className='col-md-10'>
                                            
                                        </div>
                                    </div>
                                    <h5 className='text-primary' key={key + item.coin.symbol + '-name'}>{item.project_name}</h5>
                                    {this.state.listing.filter(dataMap => dataMap.symbol === item.coin.symbol).map((value,index) => {
                                        return(
                                            <div>
                                                <label className='text-secondary small'key={index + value.symbol + '-range'}>1 {value.symbol} - {parseFloat(value.price).toFixed(15)} USD</label>
                                            </div>
                                        );
                                    })}
                                    <br></br>
                                    <p className='small text-secondary'>
                                        Soft Cap/Hard Cap
                                    </p>
                                    <label className='text-percent' key={key + item.coin.symbol + '-prize'}>1 {item.coin.symbol} - {item.total_prize} {item.coin.symbol}</label>
                                    <br></br>
                                    <br></br>
                                    <p className='small text-secondary'>Progress (0.00%)</p>
                                    <ProgressBar completed='50' min='1' max={item.total_prize.toString()}></ProgressBar>
                                    <br></br>
                                    <div className='d-flex'>
                                        <div className='col-md-6'><p className='small text-secondary' key={key + item.coin.symbol + '-start'}>0 {item.coin.symbol}</p></div>
                                        <div className='col-md-6 text-end'><p className='small text-secondary' key={key + item.coin.symbol + '-end'}>{item.total_prize} {item.coin.symbol}</p></div>
                                    </div>
                                    <div className='d-flex'>
                                        <div className='col-md-6'><label className='small text-primary' >Liquidity %:</label></div>
                                        <div className='col-md-6 text-end'><label className='small text-primary' >51%</label></div>
                                    </div>
                                    <div className='d-flex'>
                                        <div className='col-md-6'><label className='small text-primary' >Lockup Time</label></div>
                                        <div className='col-md-6 text-end'><label className='small text-primary' >180 days</label></div>
                                    </div>
                                    <hr></hr>
                                    <div className='d-flex'>
                                        <div className='col-md-6'>{this.renderTime(item.start_date)}</div>
                                        <div className='col-md-6 text-end'><button type='button' className='btn buttonBgGreen'>View Pool</button></div>
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
        return (
            <div className='margin-top-20'>
                <div className='col-md-12'>
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
                            <div className='col-md-7'>
                                <input id='seachInput' type='text' className='form-control search-filter-input' placeholder='Enter Token Name or Token Symbol'></input>
                            </div>
                            <div className='col-md-2'>
                            <label className='small text-secondary'>filter By</label>
                                <select id='fitlerInput' className='form-control custom-token-input'>
                                    <option value='live'>Live</option>
                                    <option value='ended' >Sale Ended</option>
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
                {this.projectList()}
            </div>
        );
    }
}
