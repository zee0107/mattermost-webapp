// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode, ReactPropTypes} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import classNames from 'classnames';
import CurrencyIcons from 'components/currency_icons';

import homeImage from 'images/homeFeed.png';
import rocketImage from 'images/rocket.svg';
import fillImage from 'images/fill.svg';
import trendImage from 'images/trending-up.svg';
import trenddownImage from 'images/trending-down.svg';
import fireImage from 'images/fire.png';
import clockImage from 'images/clock.svg';
import digiImage from 'images/currency-icons/digibyte.svg';
import btcImage from 'images/currency-icons/btc.svg';
import ltcImage from 'images/currency-icons/ltc.svg';
import bnbImage from 'images/currency-icons/bnb.svg';
import ethImage from 'images/currency-icons/eth.svg';
import graphImage from 'images/graph-up.svg';
import graphdownImage from 'images/graph-down.svg';
import triangleupImage from 'images/caret-up.svg';
import triangledownImage from 'images/caret-down.svg';
import lccImage from 'images/currency-icons/litecoin.svg';


import ToggleModalButtonRedux from 'components/toggle_modal_button_style';
import UserSettingsModal from 'components/user_settings/modal_profile';
import {ModalData} from 'types/actions';
import {ModalIdentifiers} from 'utils/constants';
import ChannelHeaderMobile from 'components/channel_header_mobile';

import Sidebar from 'components/sidebar';
import SidebarRight from 'components/sidebar_right';
import SidebarRightMenu from 'components/sidebar_right_menu';
import { ButtonGroup } from 'react-bootstrap';
import { filter } from 'lodash';
import { TrendListing } from 'mattermost-redux/types/crypto';
import ConfirmLicenseRemovalModal from 'components/admin_console/license_settings/modals/confirm_license_removal_modal';

type Props = {
    trendCrypto: Promise<TrendListing[]>;
}

type State = {
    isDark: string;
};

export default class TrendingCrypto extends React.PureComponent<Props, State> {
    static defaultProps = {trendCrypto: []}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light', trendListing: []};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});

        if(this.props.trendCrypto != null){
            Promise.resolve(this.props.trendCrypto).then(value => {this.setState({trendListing: value});})
        }
    }

    setDocumentTitle = (siteName: string) => {
        if (siteName) {
            document.title = 'Crypter';
        }
    }

    trend_render = () => {
        var trend = this.state.trendListing.map((filtered,i)=> {
            return (
                <div className='d-flex'>
                    <div className='col-sm-2 removePadding'>
                        <CurrencyIcons code={filtered.symbol.toString()}></CurrencyIcons>
                    </div>
                    <div className='col-sm-5'>
                        <label className='text-primary' key={i+"trend-name"}>{filtered.name}</label>
                        <p className='text-secondary small-font' key={i+"trend-symbol"}>{filtered.symbol}</p>
                    </div>
                    <div className='col-sm-5 removePadding text-end'>
                        <br></br>
                        {this.render_percent(filtered.percent_change_24h.toString())}
                    </div>
                </div>
            )
        });
        return trend;
    }

    render_percent = (percent) =>{
        if(parseFloat(percent) > 0){
            return (<label className='currency-value-text currency-percent-change' key={percent+"-trend-percent"}><img src={triangleupImage}></img>&nbsp;{parseFloat(percent).toFixed(2)}%</label>);
        }
        else{
            return (<label className='text-percent-down currency-percent-change' key={percent+"-trend-percent"}><img src={triangledownImage}></img>&nbsp;{parseFloat(percent).toFixed(2) * (-1)}%</label>);
        }
    }

    render= (): JSX.Element => {
        let trend;
        trend = this.trend_render();

        return (
            <div className='row'>
                {this.state.trendListing.map((item,key) => {
                    return(
                        <div className='col-md-4'>
                            <div className='d-flex'>
                                <div className='col-md-4'>
                                </div>
                                <div className='col-md-6'>
                                    <label className='text-primary' key={key+"trend-name"}>{item.name}</label>
                                    <p className='text-secondary small-font' key={key+"trend-symbol"}>{item.symbol}</p>
                                </div>
                            </div>
                            <hr></hr>
                            <p className='text-secondary'>Price: ${item.price}</p>
                            <p className='text-secondary'>Percentage Change 24h: {this.render_percent(item.percent_change_24h.toString())}</p>
                            <p className='text-secondary'>Percentage Change 7D: {this.render_percent(item.percent_change_7d.toString())}</p>
                        </div>
                    );
                })}
            </div>
        );
    }
}
