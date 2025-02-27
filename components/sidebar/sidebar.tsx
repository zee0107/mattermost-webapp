// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import classNames from 'classnames';

import {trackEvent} from 'actions/telemetry_actions';
import EditCategoryModal from 'components/edit_category_modal';
import MoreDirectChannels from 'components/more_direct_channels';
import DataPrefetch from 'components/data_prefetch';
import MoreChannels from 'components/more_channels';
import NewChannelFlow from 'components/new_channel_flow';
import InvitationModal from 'components/invitation_modal';
import UserSettingsModal from 'components/user_settings/modal';
import CurrencyIcons from 'components/currency_icons';

import fireImage from 'images/fire.png';
import clockImage from 'images/clock.svg';
import trendImage from 'images/trending-up.svg';
import rocketImage from 'images/rocket.svg';
import triangleupImage from 'images/caret-up.svg';
import triangledownImage from 'images/caret-down.svg';

import Pluggable from 'plugins/pluggable';

import {ModalData} from 'types/actions';

import Constants, {ModalIdentifiers} from 'utils/constants';
import * as Utils from 'utils/utils';

import KeyboardShortcutsModal from '../keyboard_shortcuts/keyboard_shortcuts_modal/keyboard_shortcuts_modal';

import ChannelNavigator from './channel_navigator';
import SidebarChannelList from './sidebar_channel_list';
import SidebarHeader from './sidebar_header';
import MobileSidebarHeader from './mobile_sidebar_header';
import SidebarNextSteps from './sidebar_next_steps';

type Props = {
    isOpen: boolean;
    isMobileView: boolean;
    trendCrypto: Promise<TrendListing[]>;
    newCrypto: Promise<NewListing[]>;
    gainerCrypto: Promise<GainerListing[]>;
};

type State = {
    showDirectChannelsModal: boolean;
    isDragging: boolean;
    isCollapsed: boolean;
    isCollapsedSub: boolean;
};

export default class Sidebar extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showDirectChannelsModal: false,
            isDragging: false,
            isCollapsed: true,
            newListing: [],
            trendListing: [], 
            gainerListing:[],
        };

        this.handleCollapsed = this.handleCollapsed.bind(this);
        this.handleCollapsedSub = this.handleCollapsedSub.bind(this);
    }

    componentDidMount() {
        if(this.props.trendCrypto != null){
            Promise.resolve(this.props.trendCrypto).then(value => {this.setState({trendListing: value});})
        }

        if(this.props.gainerCrypto != null){
            Promise.resolve(this.props.gainerCrypto).then(value => {this.setState({gainerListing: value});})
        }

        if(this.props.newCrypto != null){
            Promise.resolve(this.props.newCrypto).then(value => {this.setState({newListing: value});})
        }
    }

    showMoreDirectChannelsModal = () => {
        this.setState({showDirectChannelsModal: true});
        trackEvent('ui', 'ui_channels_more_direct_v2');
    }

    handleCollapsed = (e) => {
        this.setState({isCollapsed: e.target.value});
    }

    handleCollapsedSub = (e) => {
        this.setState({isCollapsedSub: e.target.value});
    }

    hideMoreDirectChannelsModal = () => {
        this.setState({showDirectChannelsModal: false});
    }
    
    handleOpenMoreDirectChannelsModal = (e: Event) => {
        e.preventDefault();
        if (this.state.showDirectChannelsModal) {
            this.hideMoreDirectChannelsModal();
        } else {
            this.showMoreDirectChannelsModal();
        }
    }

    onDragStart = () => {
        this.setState({isDragging: true});
    }

    onDragEnd = () => {
        this.setState({isDragging: false});
    }

    renderModals = () => {
        let moreDirectChannelsModal;
        if (this.state.showDirectChannelsModal) {
            moreDirectChannelsModal = (
                <MoreDirectChannels
                    onModalDismissed={this.hideMoreDirectChannelsModal}
                    isExistingChannel={false}
                />
            );
        }

        return (
            <React.Fragment>
                {moreDirectChannelsModal}
            </React.Fragment>
        );
    }

    render_percent = (percent) =>{
        if(parseFloat(percent) > 0){
            return (<label className='currency-value-text currency-percent-change' key={percent+"-trend-percent"}><img src={triangleupImage}></img>&nbsp;{parseFloat(percent).toFixed(2)}%</label>);
        }
        else{
            return (<label className='text-percent-down currency-percent-change' key={percent+"-trend-percent"}><img src={triangledownImage}></img>&nbsp;{parseFloat(percent).toFixed(2) * (-1)}%</label>);
        }
    }

    gainer_render = () => {
        var gainer = this.state.gainerListing.map((filtered,i)=> (
            <div className='d-flex' key={`${filtered.symbol}-div`}>
                <div className='col-sm-2 width-icon removePadding'>
                    <CurrencyIcons code={filtered.symbol.toString()} key={`${filtered.symbol}-div-icon`}></CurrencyIcons>
                </div>
                <div className='col-sm-6 width-details removePadding currency-details'>
                    <label className='text-primary' key={`${filtered.symbol}-gainer-name`}>{filtered.name}</label>
                    <p className='text-secondary small-font' key={`${filtered.symbol}-gainer-symbol`}>{filtered.symbol}</p>
                </div>
                <div className='col-sm-4 width-percent removePadding text-end'>
                    {this.render_percent(filtered.percent_change_24h.toString())}
                </div>
            </div>
        ))
        return gainer;
    }

    new_render = () => {
        var newlist = this.state.newListing.map((filtered,i)=> (
            <div className='d-flex' key={`${filtered.symbol}-div`}>
                <div className='col-sm-2 width-icon removePadding'>
                    <CurrencyIcons code={filtered.symbol.toString()} key={`${filtered.symbol}-icons`}></CurrencyIcons>
                </div>
                <div className='col-sm-6 width-details removePadding currency-details'>
                    <label className='text-primary' key={`${filtered.symbol}-new-name`}>{filtered.name}</label>
                    <p className='text-secondary small-font' key={`${filtered.symbol}-new-symbol`}>{filtered.symbol}</p>
                </div>
                <div className='col-sm-4 width-percent removePadding text-end'>
                    {this.render_percent(filtered.percent_change_24h.toString())}                
                </div>
            </div>
        ))
        return newlist;
    }

    trend_render = () => {
        var trend = this.state.trendListing.map((filtered,i)=> {
            return (                
                <div className='d-flex' key={`${i}-div`}>
                    <div className='col-sm-2 width-icon removePadding'>
                        <CurrencyIcons code={filtered.symbol.toString()} key={`${filtered.symbol}-icon`}></CurrencyIcons>
                    </div>
                    <div className='col-sm-6 width-details removePadding currency-details'>
                        <label className='text-primary' key={`${filtered.symbol}-trend-name`}>{filtered.name}</label>
                        <p className='text-secondary small-font' key={`${filtered.symbol}-trend-symbol`}>{filtered.symbol}</p>
                    </div>
                    <div className='col-sm-4 width-percent removePadding text-end'>
                        {this.render_percent(filtered.percent_change_24h.toString())}
                    </div>
                </div>
            )
        });
        return trend;
    }

    renderWholeMenu = () => {
        let gainer = this.gainer_render();
        let newList = this.new_render();
        let trend = this.trend_render();

        return (
            <div>
                <div className='col-sm-12'>
                    <div className='sidemenuBox'>
                        <ul className='ul-collapse'>
                            <li key='news-feed' className='sidemenu-padding'><a href='/crypter/channels/town-square' className='sidemenu-item1'><svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className='side-menu-align'>
                                <path d="M3.03033 12.4859H10.4389V14.3381H3.03033V12.4859ZM3.03033 16.1902H10.4389V18.0423H3.03033V16.1902ZM3.03033 8.78166H10.4389V10.6338H3.03033V8.78166ZM3.03033 5.07739H10.4389V6.92953H3.03033V5.07739ZM17.8474 6.92953V16.1902H14.1431V6.92953H17.8474ZM19.6995 5.07739H12.291V18.0423H19.6995V5.07739Z" fill="#FF8D08"/>
                                </svg> News Feed</a>
                            </li>
                            <li key='albums' className='sidemenu-padding'><a href='/albums/myalbums' className='sidemenu-item2'>
                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className='side-menu-align'>
                                <path d="M15.5387 3.35472V12.6154H6.27804V3.35472H15.5387ZM15.5387 1.81128H6.27804C5.42914 1.81128 4.73459 2.50583 4.73459 3.35472V12.6154C4.73459 13.4643 5.42914 14.1588 6.27804 14.1588H15.5387C16.3876 14.1588 17.0821 13.4643 17.0821 12.6154V3.35472C17.0821 2.50583 16.3876 1.81128 15.5387 1.81128ZM8.97906 9.27383L10.2833 11.0179L12.1971 8.62559L14.767 11.8437H7.04976L8.97906 9.27383ZM1.64771 4.89817V15.7023C1.64771 16.5512 2.34225 17.2457 3.19115 17.2457H13.9953V15.7023H3.19115V4.89817H1.64771Z" fill="#3F8CFF"/>
                                </svg> Albums</a>
                            </li>
                            <li key='My-groups' className='sidemenu-padding'><a href='/mygroups' className='sidemenu-item3'>
                                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className='side-menu-align'>
                                <path d="M3.95634 12.8045C4.97502 12.8045 5.80848 11.971 5.80848 10.9524C5.80848 9.93368 4.97502 9.10022 3.95634 9.10022C2.93767 9.10022 2.10421 9.93368 2.10421 10.9524C2.10421 11.971 2.93767 12.8045 3.95634 12.8045ZM5.0028 13.8232C4.66015 13.7676 4.31751 13.7306 3.95634 13.7306C3.03954 13.7306 2.16903 13.925 1.38188 14.2677C1.04637 14.4111 0.760415 14.6499 0.559546 14.9545C0.358677 15.2591 0.251757 15.616 0.252076 15.9809V17.4348H4.41938V15.9439C4.41938 15.1752 4.63237 14.4529 5.0028 13.8232V13.8232ZM18.7734 12.8045C19.7921 12.8045 20.6255 11.971 20.6255 10.9524C20.6255 9.93368 19.7921 9.10022 18.7734 9.10022C17.7547 9.10022 16.9213 9.93368 16.9213 10.9524C16.9213 11.971 17.7547 12.8045 18.7734 12.8045ZM22.4777 15.9809C22.4777 15.2308 22.0332 14.564 21.3479 14.2677C20.5358 13.9133 19.6594 13.7305 18.7734 13.7306C18.4122 13.7306 18.0696 13.7676 17.727 13.8232C18.0974 14.4529 18.3104 15.1752 18.3104 15.9439V17.4348H22.4777V15.9809ZM15.2914 13.4064C14.2079 12.9249 12.8744 12.573 11.3649 12.573C9.85539 12.573 8.52185 12.9341 7.43835 13.4064C6.95036 13.6264 6.53665 13.9832 6.24736 14.4336C5.95807 14.884 5.80561 15.4086 5.80848 15.9439V17.4348H16.9213V15.9439C16.9213 14.8511 16.2915 13.8509 15.2914 13.4064V13.4064ZM7.72543 15.5827C7.80878 15.3697 7.84582 15.2215 8.56815 14.9437C9.46644 14.5918 10.411 14.4251 11.3649 14.4251C12.3187 14.4251 13.2633 14.5918 14.1616 14.9437C14.8747 15.2215 14.9117 15.3697 15.0043 15.5827H7.72543ZM11.3649 8.17415C11.8742 8.17415 12.2909 8.59088 12.2909 9.10022C12.2909 9.60956 11.8742 10.0263 11.3649 10.0263C10.8555 10.0263 10.4388 9.60956 10.4388 9.10022C10.4388 8.59088 10.8555 8.17415 11.3649 8.17415ZM11.3649 6.32202C9.82761 6.32202 8.58668 7.56295 8.58668 9.10022C8.58668 10.6375 9.82761 11.8784 11.3649 11.8784C12.9021 11.8784 14.1431 10.6375 14.1431 9.10022C14.1431 7.56295 12.9021 6.32202 11.3649 6.32202Z" fill="#2CD889"/>
                                </svg> My Groups</a>
                                </li>
                            <li key='my-pages' className='sidemenu-padding'>
                                <div className='d-flex'>
                                    <a href='/mypages' className='sidemenu-item1'>
                                    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='side-menu-align'>
                                    <path d="M3.1911 12.1623H13.891C14.0377 12.1622 14.1813 12.1204 14.305 12.0417C14.4287 11.963 14.5274 11.8506 14.5896 11.7178C14.6518 11.585 14.6749 11.4373 14.6561 11.2918C14.6374 11.1464 14.5776 11.0093 14.4837 10.8967L11.68 7.53194L14.4837 4.16724C14.5776 4.05456 14.6374 3.91748 14.6561 3.77205C14.6749 3.62662 14.6518 3.47885 14.5896 3.34605C14.5274 3.21325 14.4287 3.10092 14.305 3.02221C14.1813 2.9435 14.0377 2.90167 13.891 2.90161H3.1911V16.7926" stroke="#FF8A00" strokeWidth="1.67969" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg> My Pages</a>
                                    <a href="#" className='view-all'>View all</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='col-sm-12'>
                    <div className='menu-wrapper-collapse sidemenuBox'>
                        <input type="checkbox" id="list-item-1" onChange={this.handleCollapsed} value={this.state.isCollapsed} defaultChecked={this.state.isCollapsed}></input>
                        <label htmlFor="list-item-1" className="first collapsible-label-title"><img src={rocketImage} className="sidemenu-title-img"></img>Launchpad</label>
                            <ul className='ul-collapse'>
                                <li key='create-launchpad' className='sidemenu-padding'><div className={'list-sidemenu-a ' + `${this.state.middleView === 'create-launchpad' ? 'active-item' : ''}`}><a href="/launchpad"  onClick={() => this.setState({middleView: 'create-launchpad'})} className='side-menu-item'>Create Launchpad</a></div></li>
                                <li key='projects' className='sidemenu-padding'>
                                    <input type="checkbox" id="list-item-2"  onChange={this.handleCollapsedSub} value={this.state.isCollapsedSub} defaultChecked={this.state.isCollapsedSub}></input>
                                    <label htmlFor="list-item-2" className="first collapsible-label">Projects</label>
                                    <ul className='ul-collapse'>
                                        <li key='live'><div className={'list-sidemenu-b ' + `${this.state.middleView === 'projects-live' ? 'active-item' : ''}`}><a href="/launchpad-live" onClick={() => this.setState({middleView: 'projects-live'})} className='side-menu-item'>Live</a></div></li>
                                        <li key='upcoming'><div className={'list-sidemenu-b ' + `${this.state.middleView === 'projects-upcoming' ? 'active-item' : ''}`}><a href="/launchpad-upcoming" onClick={() => this.setState({middleView: 'projects-upcoming'})} className='side-menu-item'>Upcoming</a></div></li>
                                    </ul>
                                </li>
                                <li key='crypter-lock' className='sidemenu-padding'>
                                    <input type="checkbox" id="list-item-3"></input>
                                    <label htmlFor="list-item-3" className="first collapsible-label">Crypter Lock</label>
                                    <ul className='ul-collapse'>
                                        <li key='create-lock'><div className={'list-sidemenu-b ' + `${this.state.middleView === 'create-lock' ? 'active-item' : ''}`}><a href="/laucnhpad-create-lock" onClick={() => this.setState({middleView: 'create-lock'})} className='side-menu-item'>Create Lock</a></div></li>
                                        <li key='token'><div className='list-sidemenu-b'><a href="/launchpadtoken" className='side-menu-item'>Token</a></div></li>
                                        <li key='liquidity'><div className='list-sidemenu-b'><a href="/launchpad-liquidity" className='side-menu-item'>Liquidity</a></div></li>
                                    </ul>
                                </li>
                                <li key='kyc-audit' className='sidemenu-padding'><div className='list-sidemenu-a'><a href="/documents/kyc" className='side-menu-item'>KYC &amp; Audit</a></div></li>
                                <li key='docs' className='sidemenu-padding'><div className='list-sidemenu-a'><a href="/documents/intro" className='side-menu-item'>Docs</a></div></li>
                        </ul>
                    </div>
                </div>
                <div id='crypto-list'>
                    <div className='col-sm-12'>
                        <div className='sidemenuBox'>
                            <div className='d-flex'>
                                <label className='text-primary label-title'><img src={fireImage} className='fire-img'></img>Trending</label>
                                <a href='#' className='view-all-box'>View all</a>
                            </div>
                            <br></br>
                            {trend}
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='sidemenuBox'>
                            <div className='d-flex'>
                                <label className='text-primary label-title'><img src={trendImage} className='fire-img'></img>Biggest Gainers</label>
                                <a href='#' className='view-all-box'>View all</a>
                            </div>
                            <br></br>
                            {gainer}
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='sidemenuBox'>
                            <div className='d-flex'>
                                <label className='text-primary label-title'><img src={clockImage} className='fire-img'></img>Recently Added</label>
                                <a href='#' className='view-all-box'>View all</a>
                            </div>
                            <br></br>
                            {newList}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    render() {
        let menu = this.renderWholeMenu();
        const ariaLabel = Utils.localizeMessage('accessibility.sections.lhsNavigator', 'channel navigator region');

        return (
            <div
                id='SidebarContainer'
                className={classNames({
                    'move--right': this.props.isOpen && this.props.isMobileView,
                    dragging: this.state.isDragging,
                })}
            >
                <div className='mobile-menu'>
                    {menu}
                </div>
                 {/*<div id='side_menu_left'>
                    
                {this.props.isMobileView && menu}
                {this.props.isMobileView ? <MobileSidebarHeader/> : (
                    <SidebarHeader
                        showNewChannelModal={this.showNewChannelModal}
                        showMoreChannelsModal={this.showMoreChannelsModal}
                        invitePeopleModal={this.invitePeopleModal}
                        showCreateCategoryModal={this.showCreateCategoryModal}
                        canCreateChannel={this.props.canCreatePrivateChannel || this.props.canCreatePublicChannel}
                        canJoinPublicChannel={this.props.canJoinPublicChannel}
                        handleOpenDirectMessagesModal={this.handleOpenMoreDirectChannelsModal}
                        unreadFilterEnabled={this.props.unreadFilterEnabled}
                    />
                
                <div id='side_menu_left'>
                    
                </div>
            </div>*/}
            </div>
        );
    }
}
