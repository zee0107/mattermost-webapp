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
};

export default class LaunchpadViewPool extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: ''}

    constructor(props: Props) {
        super(props);
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light',};
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    render= (): JSX.Element => {
        return (
            <>
                <section id='crypter-section' className='crypter-section-desktop'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div className='launchpad-view-pool-body mt-2'>
                                <div className='row'>
                                    <div className='col-1 text-center'>
                                        <img className='rounded-circle border-info mt-2' width='40' src='assets/images/sample-user-primary-picture-7.png'/>
                                    </div>
                                    <div className='col-6 text-start'>
                                        <small className='ml-2'>NFT Fashion Presale</small>
                                        <br/>
                                        <img width='17' className='float-start ml-2 mt-2' src='assets/images/icon-global2.png' alt=''/>
                                        <img width='17' className='float-start ml-2 mt-2' src='assets/images/icon-smm-facebook.png' alt=''/>
                                        <img width='17' className='float-start ml-2 mt-2' src='assets/images/icon-smm-twitter.png' alt=''/>
                                        <img width='17' className='float-start ml-2 mt-2' src='assets/images/icon-arrow-submit.png' alt=''/>
                                        <img width='17' className='float-start ml-2 mt-2' src='assets/images/icon-smm-instagram.png' alt=''/>
                                    </div>
                                    <div className='col-5'>
                                        <a className='float-end onSalelive'><i className='bi-dot bi-dot-sale-live'></i> Sale live</a>
                                        <a className='float-end onAudit'>Audit</a>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='col-1'></div>
                                    <div className='col-11'>
                                        <p className='ml-2'>Disclaimer: The information provided shall not in any way constitute a recommendation as to whether you should invest in any product discussed. We accept no liability for any loss occasioned to any person acting or refraining from action as a result of any material provided or published.</p>
                                    </div>
                                </div>
                            </div>

                            <div className='launchpad-view-pool-body mt-2 mb-2'>
                                <div className='row'>
                                    <div className='col-4 mt-1 mb-1'><strong><small>Presale Address</small></strong></div>
                                    <div className='col-8 text-end mt-1 mb-1'><strong className='text-success'><small>0x04f7794FeF90E83d195CaEdF810e9632bf6</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Token Name</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><small>lorem Ipsum</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Token Symbol</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><small>LEP</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Token Decimal</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><small>18</small></strong></div>

                                    <div className='col-4 mt-1'><strong><small>Token Address</small></strong></div>
                                    <div className='col-8 text-end mt-1'><strong className='text-success'><small>0x04f7794FeF90E83d195CaEdF810e9632bf6</small></strong></div>

                                    <div className='col-6'><strong><small></small></strong></div>
                                    <div className='col-6 text-end'><small>(Do not send BNB to the token address)</small></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Total Supply</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>100,000,000,000 NFTF</small></strong></div>

                                    <div className='col-6'><strong><small>Tokens For Presale</small></strong></div>
                                    <div className='col-6 text-end'><strong className=''><small>30,000,000,000 NFTF</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Tokens For Liquidity</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>19,500,000,000 NFTF</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Presale Rate</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>1 BNB = 60,000,000,000 NFTF</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Listing Rate</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>1 BNB = 60,000,000,000 NFTF</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Initial Market Cap (estimate)</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>$322,291</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Soft Cap</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>250 BNB</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Hard Cap</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>500 BNB</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Unsold Tokens</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>Burn</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Presale Start Time</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>2022.01.29 13:00 (UTC)</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Presale End Time</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>2022.01.29 13:00 (UTC)</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Listing On</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className='text-success'><small>Pancakeswap</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Liquidity Percent</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>65%</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Liquidity Lockup Time</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>730 days after pool ends</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Total Team Vesting Tokens</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>15,000,000,000 NFTF</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>First Release After Listing (days)</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>14 days</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>First Release AFor Team</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>20%</small></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><small>Tokens Release each cycle</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><small>20% each 30 day</small></strong></div>
                                    <br/>
                                    <br/>
                                    <hr/>

                                    <div className='col-6'><strong><small>Team Vesting info (Estimate from end time)</small></strong></div>
                                    <div className='col-6 text-end'>

                                        <a className='onTokenreleasearrowdown' data-bs-toggle='collapse' href='#collapseTokensrelease' role='button' aria-expanded='true' aria-controls='collapseTokensrelease'><i className='bi-arrow-up-circle-fill'></i></a>
                                        <a className='onTokenreleasearrowup' data-bs-toggle='collapse' href='#collapseTokensrelease' role='button' aria-expanded='true' aria-controls='collapseTokensrelease'><i className='bi-arrow-down-circle-fill'></i></a>

                                    </div>

                                    <div className='col-12'>
                                        <div className='collapse show' id='collapseTokensrelease'>
                                            <div className='row'>
                                                <div className='col-4 text-center'><strong><small>Unlock #</small></strong></div>
                                                <div className='col-4 text-center'><strong><small>Time (UTC)</small></strong></div>
                                                <div className='col-4 text-center'><strong><small>Unlocked Tokens</small></strong></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><small>1</small></strong></div>
                                                <div className='col-4 text-center'><small>2022.02.16 13:00</small></div>
                                                <div className='col-4 text-center'><small>3,000,000 (20%)</small></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><small>2</small></strong></div>
                                                <div className='col-4 text-center'><small>2022.02.16 13:00</small></div>
                                                <div className='col-4 text-center'><small>3,000,000 (20%)</small></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><small>3</small></strong></div>
                                                <div className='col-4 text-center'><small>2022.02.16 13:00</small></div>
                                                <div className='col-4 text-center'><small>3,000,000 (20%)</small></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><small>4</small></strong></div>
                                                <div className='col-4 text-center'><small>2022.02.16 13:00</small></div>
                                                <div className='col-4 text-center'><small>3,000,000 (20%)</small></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><small>5</small></strong></div>
                                                <div className='col-4 text-center'><small>2022.02.16 13:00</small></div>
                                                <div className='col-4 text-center'><small>3,000,000 (20%)</small></div>
                                            </div>
                                            <hr/>
                                            <div className='row mt-3'>
                                                <div className='col-12 text-center'>
                                                    <p>
                                                        <a className='pagination-left-arrow'><i className='bi-caret-left-fill'></i></a> 
                                                        <label className='pagination-count'>1</label> 
                                                        <a className='pagination-right-arrow'><i className='bi-caret-right-fill'></i></a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='launchpad-view-pool-body mt-2 mb-2'>
                                <strong><large>Tokens Matrics</large></strong>
                                <hr/>
                                <div className='row mt-4 mb-3'>
                                    <div className='col-5'><img className='img-fluid' src='assets/images/pie-chart.png' alt=''/></div>
                                    <div className='col-7'>
                                        <div className='col-lg-12'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-presale'></i> Presale</a>
                                            <a className='float-end text-percent-presale'>30%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-liquidity'></i> Liquidity</a>
                                            <a className='float-end text-percent-liquidity'>40%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-team-vesting'></i> Team Vesting</a>
                                            <a className='float-end text-percent-team-vesting'>20%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-locked'></i> Locked</a>
                                            <a className='float-end text-percent-locked'>10%</a>
                                        </div>
                                        <br/>

                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-unlocked'></i> UnLocked</a>
                                            <a className='float-end text-percent-unlocked'>0%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-burnt'></i> Burnt</a>
                                            <a className='float-end text-percent-burnt'>0%</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-11 mx-auto text-center mt-4 mb-4'>
                                    <small>Disclaimer: The information provided shall not in any way constitute a recommendation as to whether you should invest in any product discussed. We accept no liability for any loss occasioned to any person acting or refraining from action as a result of any material provided or published.</small>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className='position-sticky float-right-panel'>
                                <div className='box-right-panel'>
                                    <div className='row'>
                                        <small className='text-center'>Presale Ends In</small>
                                    </div>
                                    <div className='row'>
                                        <div className='col-3 p-0'><div className='d-grid p-2'><a className='btn onLockbuttonumbers'><small>327</small></a></div></div>
                                        <div className='col-3 p-0'><div className='d-grid p-2'><a className='btn onLockbuttonumbers'><small>28</small></a></div></div>
                                        <div className='col-3 p-0'><div className='d-grid p-2'><a className='btn onLockbuttonumbers'><small>268</small></a></div></div>
                                        <div className='col-3 p-0'><div className='d-grid p-2'><a className='btn onLockbuttonumbers'><small>15</small></a></div></div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-11 mx-auto'>
                                            <div className='progress mt-2'>
                                                <div className='progress-bar progress-bar-striped progress-bar-animated w-75' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div>
                                            </div>
                                        </div>
                                        <div className='col-6 mt-2'><small className='ml-3 text-muted'>11.915311 BNB</small></div>
                                        <div className='col-6 mt-2'><small className='float-end me-3 text-muted'>500 BNB</small></div>
                                    </div>

                                    <div className='row mt-2'>
                                        <form>
                                            <div className='row'>

                                            <div className='col-12'>
                                                <label htmlFor='formGroupExampleInput' className='form-label'><small>* Amount (max: 2.9 BNB)</small></label>
                                                <div className='input-group mb-2'>
                                                <input type='text' className='form-control input-create-new-group-amount-max' placeholder='' aria-label='' aria-describedby=''/>
                                                <span className='input-group-text input-create-new-group-amount-max text-success' id=''>MAX</span>
                                                </div>
                                            </div>

                                            <div className='col-12 text-center'>
                                                <a className='btn onBuyamounts mt-2'><small>BUY</small></a>
                                            </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className='launchpad-view-pool-body mt-2 mb-2'>
                                    <div className='row'>
                                        <div className='col-3 mt-1 mb-1'><strong><small>Status</small></strong></div>
                                        <div className='col-9 text-end mt-1 mb-1'><strong className='text-success'><small>Inprogress</small></strong></div>

                                        <div className='col-6 mt-1 mb-1'><strong><small>Minimum Buy</small></strong></div>
                                        <div className='col-6 text-end mt-1 mb-1'><strong><small>0.1 BNB</small></strong></div>

                                        <div className='col-6 mt-1 mb-1'><strong><small>Maximum Buy</small></strong></div>
                                        <div className='col-6 text-end mt-1 mb-1'><strong><small>3 BNB</small></strong></div>

                                        <div className='col-9 mt-1 mb-1'><strong><small>Your purchased</small></strong></div>
                                        <div className='col-3 text-end mt-1 mb-1'><strong><small>0 BNB</small></strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id='crypter-section' className='crypter-section-mobile'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='box-middle-panel-products-mobile'>
                                <div className='launchpad-view-pool-body'>
                                    <div className='row'>
                                        <div className='col-1 text-center'>
                                            <img className='rounded-circle border-info mt-2' width='40' src='assets/images/sample-user-primary-picture-7.png'/>
                                        </div>
                                        <div className='col-6 text-start'>
                                            <small className='ml-4'>NFT Fashion..</small>
                                            <br/>
                                            <img width='17' className='float-start ml-4 mt-2' src='assets/images/icon-global2.png' alt='' />
                                            <img width='17' className='float-start ml-0 mt-2' src='assets/images/icon-smm-facebook.png' alt='' />
                                            <img width='17' className='float-start ml-0 mt-2' src='assets/images/icon-smm-twitter.png' alt=''/>
                                            <img width='17' className='float-start ml-0 mt-2' src='assets/images/icon-arrow-submit.png' alt=''/>
                                            <img width='17' className='float-start ml-0 mt-2' src='assets/images/icon-smm-instagram.png' alt=''/>
                                        </div>
                                        <div className='col-5'>
                                            <a className='float-end onAuditmobile'>Audit</a>
                                            <a className='float-end onSalelivemobile'><i className='bi-dot bi-dot-sale-live'></i>Sale live</a>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='box-right-panel'>
                                <div className='row'>
                                    <small className='text-center'>Presale Ends In</small>
                                </div>

                                <div className='row'>
                                    <div className='col-3 p-0'><div className='d-grid p-3'><a className='btn onLockbuttonumbers'><small>327</small></a></div></div>
                                    <div className='col-3 p-0'><div className='d-grid p-3'><a className='btn onLockbuttonumbers'><small>28</small></a></div></div>
                                    <div className='col-3 p-0'><div className='d-grid p-3'><a className='btn onLockbuttonumbers'><small>268</small></a></div></div>
                                    <div className='col-3 p-0'><div className='d-grid p-3'><a className='btn onLockbuttonumbers'><small>15</small></a></div></div>
                                </div>

                                <div className='row'>
                                    <div className='col-11 mx-auto'>
                                        <div className='progress mt-1'>
                                            <div className='progress-bar progress-bar-striped progress-bar-animated w-75' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div>
                                        </div>
                                    </div>
                                    <div className='col-6 mt-2'><small className='ml-3 text-muted'>11.915311 BNB</small></div>
                                    <div className='col-6 mt-2'><small className='float-end mr-3 text-muted'>500 BNB</small></div>
                                </div>

                                <div className='row mt-2'>
                                    <form>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <label htmlFor='formGroupExampleInput' className='form-label'><small>* Amount (max: 2.9 BNB)</small></label>
                                                <div className='input-group mb-2'>
                                                    <input type='text' className='form-control input-create-new-group-amount-max' placeholder='' aria-label='' aria-describedby=''/>
                                                    <span className='input-group-text input-create-new-group-amount-max text-success' id=''>MAX</span>
                                                </div>
                                            </div>
                                            <div className='col-12 text-center'>
                                                <a className='btn onBuyamounts mt-2'><small>BUY</small></a>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className='launchpad-view-pool-body mt-2 mb-2'>
                                <div className='row'>
                                    <div className='col-3 mt-1 mb-1'><strong><small>Status</small></strong></div>
                                    <div className='col-9 text-end mt-1 mb-1'><strong className='text-success'><small>Inprogress</small></strong></div>
                                    <div className='col-6 mt-1 mb-1'><strong><small>Minimum Buy</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><small>0.1 BNB</small></strong></div>
                                    <div className='col-6 mt-1 mb-1'><strong><small>Maximum Buy</small></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><small>3 BNB</small></strong></div>
                                    <div className='col-9 mt-1 mb-1'><strong><small>Your purchased</small></strong></div>
                                    <div className='col-3 text-end mt-1 mb-1'><strong><small>0 BNB</small></strong></div>
                                </div>
                            </div>
                            <div className='launchpad-view-pool-body-mobile mt-2 mb-2'>
                                <div className='row'>
                                    <div className='col-lg-3 mt-1 mb-1'><strong className='text-muted'><small>Presale Address</small></strong></div>
                                    <div className='col-lg-9 text-start mt-1 mb-1'><strong className='text-success'><small>0x04f7794FeF90E83d1...</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Token Name</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>lorem Ipsum</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Token Symbol</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>LEP</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Token Decimal</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>18</small></strong></div>

                                    <div className='col-lg-3 mt-1 mb-1'><strong className='text-muted'><small>Token Address</small></strong></div>
                                    <div className='col-lg-9 text-start mt-1 mb-1'><strong className='text-success'><small>0x04f7794FeF90E83d1...</small></strong></div>

                                    <div className='col-lg-6'><strong><small></small></strong></div>
                                    <div className='col-lg-6 text-start'><small>(Do not send BNB to the token address)</small></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Total Supply</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>100,000,000,000 NFTF</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Tokens For Presale</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>30,000,000,000 NFTF</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong><small>Tokens For Liquidity</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>19,500,000,000 NFTF</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Presale Rate</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>1 BNB = 60,000,000,000 NFTF</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Listing Rate</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>1 BNB = 60,000,000,000 NFTF</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Initial Market Cap (estimate)</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>$322,291</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Soft Cap</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>250 BNB</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Hard Cap</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>500 BNB</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Unsold Tokens</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>Burn</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Presale Start Time</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>2022.01.29 13:00 (UTC)</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Presale End Time</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>2022.01.29 13:00 (UTC)</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Listing On</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>Pancakeswap</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Liquidity Percent</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>65%</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Liquidity Lockup Time</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>730 days after pool ends</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Total Team Vesting Tokens</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>15,000,000,000 NFTF</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>First Release After Listing (days)</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>14 days</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>First Release AFor Team</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>20%</small></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><small>Tokens Release each cycle</small></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><small>20% each 30 day</small></strong></div>
                                </div>
                            </div>
                            <div className='row p-2'>
                                <div className='col-10'><strong><small>Team Vesting info (Estimate from end time)</small></strong></div>
                                <div className='col-2 text-end'>
                                    <a className='onTokenreleasearrowdown' data-bs-toggle='collapse' href='#collapseTokensreleasemobile' role='button' aria-expanded='true' aria-controls='collapseTokensreleasemobile'><i className='bi-arrow-up-circle-fill'></i></a>
                                    <a className='onTokenreleasearrowup' data-bs-toggle='collapse' href='#collapseTokensreleasemobile' role='button' aria-expanded='true' aria-controls='collapseTokensreleasemobile'><i className='bi-arrow-down-circle-fill'></i></a>
                                </div>
                            </div>
                            <div className='collapse show' id='collapseTokensreleasemobile'>
                                <div className='launchpad-team-vesting-body-mobile mt-2 mb-2'>
                                    <div className='row'>
                                        <div className='col-6'><small className='text-muted mt-0'>Unlock #</small></div>
                                        <div className='col-6'><small className='mt-0'><strong>1</strong></small></div>

                                        <div className='col-6'><small className='text-muted mt-0'>Unlocked tokens</small></div>
                                        <div className='col-6'><small className='mt-0'><strong>3,000,000,000 (20%)</strong></small></div>

                                        <div className='col-6'><small className='text-muted mt-0'>Time (UTC)</small></div>
                                        <div className='col-6'><small className='mt-0'><strong>2022.02.16 13:00</strong></small></div>
                                    </div>
                                </div>

                                <div className='launchpad-team-vesting-body-mobile mt-2 mb-2'>
                                    <div className='row'>
                                        <div className='col-6'><small className='text-muted mt-0'>Unlock #</small></div>
                                        <div className='col-6'><small className='mt-0'><strong>1</strong></small></div>

                                        <div className='col-6'><small className='text-muted mt-0'>Unlocked tokens</small></div>
                                        <div className='col-6'><small className='mt-0'><strong>3,000,000,000 (20%)</strong></small></div>

                                        <div className='col-6'><small className='text-muted mt-0'>Time (UTC)</small></div>
                                        <div className='col-6'><small className='mt-0'><strong>2022.02.16 13:00</strong></small></div>
                                    </div>
                                </div>

                                <div className='launchpad-team-vesting-body-mobile mt-2 mb-2'>
                                    <div className='row'>
                                        <div className='col-6'><small className='text-muted mt-0'>Unlock #</small></div>
                                        <div className='col-6'><small className='mt-0'><strong>3</strong></small></div>

                                        <div className='col-6'><small className='text-muted mt-0'>Unlocked tokens</small></div>
                                        <div className='col-6'><small className='mt-0'><strong>3,000,000,000 (20%)</strong></small></div>

                                        <div className='col-6'><small className='text-muted mt-0'>Time (UTC)</small></div>
                                        <div className='col-6'><small className='mt-0'><strong>2022.02.16 13:00</strong></small></div>
                                    </div>
                                </div>
                                
                                <div className='row mt-3'>
                                    <div className='col-12 text-center'>
                                        <p>
                                            <a className='pagination-left-arrow'><i className='bi-caret-left-fill'></i></a> 
                                            <medium className='pagination-count'>1</medium> 
                                            <a className='pagination-right-arrow'><i className='bi-caret-right-fill'></i></a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='launchpad-view-pool-body mt-2 mb-2'>
                                <strong><large>Tokens Matrics</large></strong>
                                <hr/>
                                <div className='row mt-4 mb-3'>
                                    <div className='col-lg-5 text-center'><img className='img-fluid' src='assets/images/pie-chart.png' alt='' /></div>
                                    <div className='col-lg-7'>
                                        <div className='col-lg-12'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-presale'></i> Presale</a>
                                            <a className='float-end text-percent-presale'>30%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-liquidity'></i> Liquidity</a>
                                            <a className='float-end text-percent-liquidity'>40%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-team-vesting'></i> Team Vesting</a>
                                            <a className='float-end text-percent-team-vesting'>20%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-locked'></i> Locked</a>
                                            <a className='float-end text-percent-locked'>10%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-unlocked'></i> UnLocked</a>
                                            <a className='float-end text-percent-unlocked'>0%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-3'>
                                            <a className='float-start'><i className='bi-dot bi-dot-style-burnt'></i> Burnt</a>
                                            <a className='float-end text-percent-burnt'>0%</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-11 mx-auto text-center mt-4 mb-4'>
                                    <small>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
