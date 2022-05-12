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
        this.state = {openUp: false, width: 0, isStatusSet: false, isDark:'light', img_path: homeImage};
    }

    componentDidMount = async () =>{
        const ThemeValue = window.localStorage.getItem("theme");
        this.setState({isDark: ThemeValue});
    }

    render= (): JSX.Element => {
        return (
            <>
                <section id='crypter-section' className='crypter-section-desktop'>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-md-2'>
                                <div className='position-sticky float-right-panel'>
                                    <div className='box-left-panel-introduction'>
                                        <strong className='ml-3'><label className='text-success'>Introduction</label></strong>
                                        <hr/>
                                        <ul className='list-group'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/intro' className='active-docs fw-bold'><label>Introducing</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-token-metrics.html'><label>Token Metrics</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-token-utility.html'><label>Token Utility</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-anti-rug-system.html'><label>Anti-Rug System</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-partnership.html'><label>Partnership</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-roadmap.html'><label>Roadmap</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-service-fees.html'><label>Service Fees</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Important</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-contact-us.html'><label>Contact Us</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-social-links.html'><label>Social Links</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/kyc'><label>KYC &#38; Audit at CrypterSale</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-crypter-sale-calculator.html'><label>CrypterSale Calculator</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-youtube-tutorial.html'><label>YouTube Tutorials</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-contact-developers.html'><label>Contact Developers</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-presale-support.html'><label>Presale Support</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-brand-assets.html'><label>Brand Assets</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Tokens</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-standard-token.html'><label>Create a Standard Token</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-liquidity-generator-token.html'><label>Create a Liquidity Generator Token</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-baby-token.html'><label>Create a Baby Token</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-buyback-baby-token.html'><label>Create a Buyback baby Token</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Launchpads</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-launchpad.html'><label>Create a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-update-a-launchpad.html'><label>Update a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-finalize-a-launchpad.html'><label>Finalize a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-add-remove-whitelist.html'><label>Add/Remove Whitelists</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-presale-using-stablecoin.html'><label>Create a Presale Using Stablecoin</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Presale Vesting</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-team-vesting-guide.html'><label>Team Vesting Guide</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-presale-vesting-guide.html'><label>Presale Vesting Guide</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Investing</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-how-to-buy-a-presale.html'><label>How to Buy a Presale</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-how-to-claim-tokens.html'><label>How to Claim Tokens</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-how-to-widthdraw-your-contribution.html'><label>How to Widthdraw Your Contribution</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-emergency-withdraw.html'><label>Emergency Withdraw</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Fair Lunch</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-fair-launch.html'><label>Create a Fair Launch</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-update-a-fair-launch.html'><label>Update a Fair Launch</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-finalize-a-fair-launch.html'><label>Finalize a Fair Launch</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-fair-launch-using-stablecoin.html'><label>Create a Fair Launch Using Stablecoin</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Crypterpad</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-crypterpad.html'><label>Create CrypterPad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-update-crypterpad.html'><label>Update CrypterPad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-finalize-crypterpad.html'><label>Finalize CrypterPad</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Crypter Airdrop</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-an-airdrop.html'><label>Create an Airdrop</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Common Errors</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-exclude-fees-dividends-max-tx-on-bscs-scan.html'><label>Exlude Fees, Dividends, Max TX on BSCScan</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-presale-cancellation.html'><label>Presale Cancellation</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Crypter Anti-bot</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-crypter-anti-bot-introducing.html'><label>Introducing</label></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-crypter-anti-bot-guide.html'><label>Crypter anti-bot guide</label></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-exclusive-to-integrate-crypter-anti-bot-for-custom-contract.html'><label>How to integrate Crypter anti-bot for custom contract</label></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                    
                            <div className='col-md-8'>
                                <div className='position-sticky float-right-panel'>
                                    <div className='launchpad-token-lock-info'>
                                        <div className='row'>
                                            <div className='col-md-9'><h6 className='float-start mt-3'>Introducing</h6></div>
                                            <div className='col-md-3'></div>
                                        </div>
                                    </div>

                                    <div className='launchpad-token-body'>
                                    <hr/>
                                    <div className='launchpad-kyc-audit'>  
                                        <div className='row p-2'>
                        
                                            <div className='col-md-12 mt-0 mb-1'>
                                                <p><strong>Key features</strong></p>
                                                <p><i className='bi-dot'></i> Prevent bots from inflating the price when the token has just been listed on the exchange.</p>
                                                <p><i className='bi-dot'></i> Prevent multiple swaps in the same transaction by adding a delay between transactions.</p>
                                                <p><i className='bi-dot'></i> Control the amount of tradable tokens per trade.</p>
                                                <p><i className='bi-dot'></i> Change the amount of tradable tokens over time.</p>
                                                <p><i className='bi-dot'></i> Add any bot addresses to a blacklist.</p>
                                            </div>
                        
                                            <div className='col-md-12 mt-0 mb-1'>
                                                <p><strong>Mechanism</strong></p>
                                                <p><i className='bi-dot'></i> When creating tokens on CrypterSale, you have the option to implement or disable the Crypter Anti-Bot.</p>
                                                <p><i className='bi-dot'></i> Prevents traders from transacting during the first block at listing time. Traders will only be able to trade from the second block onwards.</p>
                                                <p><i className='bi-dot'></i> The limited amount of tradable tokens per trade will increase gradually, proportional to the number of blocks that have passed since the genesis block. After a number of blocks, depending on the setting, the Anti-Bot will automatically stop working.</p>
                                                <p><i className='bi-dot'></i> The limited amount of tradable tokens per trade can be customized differently for each token. Only the creator has the right to edit this parameter.</p>
                                                <p><i className='bi-dot'></i> Time limit per trade can be customized differently for each token. After a number of blocks, depending on the setting, time limit per trade will become zero. Only the creator has the right to edit this parameter.</p>
                                                <p><i className='bi-dot'></i> You can manually add to or remove any addresses from the blacklist. The wallets in the blacklist will not be able to trade.</p>
                                            </div>
                        
                                            <div className='col-md-12 mt-0 mb-1'>
                                                <p><strong>Implementation Procedure</strong></p>
                                                <p><i className='bi-dot'></i> Add Anti-Bot code to the contract.</p>
                                                <p><i className='bi-dot'></i> Deploy token contract.</p>
                                                <p><i className='bi-dot'></i> Set owner rights for Anti-Bot.</p>
                                                <p><i className='bi-dot'></i> Configure Anti-Bot.</p>
                                                <p><i className='bi-dot'></i> Enable Anti-Bot.</p>
                                            </div>
                        
                                        </div>
                                    </div>
                                </div>
                                <div className='launchpad-token-footer'>
                                    <div className='row'></div>
                                </div>
                                <div className='row mt-2 mb-2'>

                                    <div className='col-md-6'>
                                    <a href='launchpad-docs-introducing.html' className='onPreviewskycaudit'>
                                        <div className='launchpad-token-body-kyc-audit'>
                                        <p><small className='ml-4'>Previous</small></p>
                                        <p className='kyc-previews'>
                                            <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><label className='ml-2'>Introducing</label></strong></p>
                                        </div>
                                    </a>
                                    </div>
                        
                                    <div className='col-md-6'>
                                    <a href='launchpad-docs-token-metrics.html' className='onNextkycaudit'>
                                        <div className='launchpad-token-body-kyc-audit'>
                                        <p className='text-end'><small className='mr-4'>Next</small></p>
                                        <p className='kyc-previews text-end'>
                                            <strong><label className='ml-2'>Token Metrics</label></strong>
                                            <i className='bi-arrow-right bi-arrow-right-previews-style text-success'></i>
                                        </p>
                                        </div>
                                    </a>
                                    </div>
                        
                                </div>
                            </div>
                            </div>
                    
                            <div className='col-md-2'>
                                <div className='position-sticky float-right-panel'>
                        
                                    <strong>
                                    <a href='javascript:;' className='onCopyurl' onclick='Copy();'><i className='bi-link bi-link-style'></i> Copy LINK</a>
                                    </strong>
                                    <div className='box-left-panel-introduction'>
                                        <strong className='ml-3'><label className='text-success'>Contents</label></strong>
                                        <hr/>
                                        {/*<ul className='list-group-contents'>
                                            <li className='list-group-item border-0'><label>Dolor sit amet</label></li>
                                            <li className='list-group-item border-0'><label>Odio vulpulate</label></li>
                                            <li className='list-group-item border-0'><label>Leo purus diam</label></li>
                                            <li className='list-group-item border-0'><label>Carcus neque</label></li>
                                            <li className='list-group-item border-0'><label>Ac iacudis</label></li>
                                            <li className='list-group-item border-0'><label>Lacus neque</label></li>
                                            <li className='list-group-item border-0'><label>Odio vulpulate</label></li>
                                            <li className='list-group-item border-0'><label>Dolor sit amet</label></li>
                                            <li className='list-group-item border-0'><label>Odio vulpulate</label></li>
                                            <li className='list-group-item border-0'><label>Leo purus diam</label></li>
                                            <li className='list-group-item border-0'><label>Carcus neque</label></li>
                                            <li className='list-group-item border-0'><label>Ac iacudis</label></li>
                                            <li className='list-group-item border-0'><label>Lacus neque</label></li>
                                            <li className='list-group-item border-0'><label>Odio vulpulate</label></li>
                                        </ul>*/}
                                    </div>            
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id='crypter-section' className='crypter-section-mobile'>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='col-md-12 text-center reload-loading'>
                                    <div className='spinner-border' role='status'>
                                        <span className='visually-hidden'>Loading...</span>
                                    </div>
                                </div>
                                <div className='box-middle-panel-products-mobile'>
                                    <div className='position-sticky float-kys-menu-panel'>
                                        <div className='position-relative'>
                                            <div className='position-absolute top-0 end-0'>
                                                <a className='onKycmenu shadow-lg' data-toggle='collapse' href='#collapseKycmenu' role='button' aria-expanded='true' aria-controls='collapseKycmenu'><i className='bi-menu-app'></i></a>
                                                <a className='onKycmenuclose shadow-sm' data-bs-toggle='collapse' href='#collapseKycmenu' role='button' aria-expanded='true' aria-controls='collapseKycmenu'><i className='bi-arrow-up-circle-fill'></i></a>
                                            </div>
                                        </div>
                                    </div>
                        
                                    <div className='collapse' id='collapseKycmenu'>
                                        <div className='box-left-panel-introduction'>
                                            <strong className='ml-3'><label className='text-success'>Introduction</label></strong>
                                            <hr/>
                                            <ul className='list-group'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/intro' className='active-docs fw-bold'><label>Introducing</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-token-metrics.html'><label>Token Metrics</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-token-utility.html'><label>Token Utility</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-anti-rug-system.html'><label>Anti-Rug System</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-partnership.html'><label>Partnership</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-roadmap.html'><label>Roadmap</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-service-fees.html'><label>Service Fees</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Important</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-contact-us.html'><label>Contact Us</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-social-links.html'><label>Social Links</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/kyc'><label>KYC & Audit at CrypterSale</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-crypter-sale-calculator.html'><label>CrypterSale Calculator</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-youtube-tutorial.html'><label>YouTube Tutorials</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-contact-developers.html'><label>Contact Developers</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-presale-support.html'><label>Presale Support</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-brand-assets.html'><label>Brand Assets</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Tokens</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-standard-token.html'><label>Create a Standard Token</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-liquidity-generator-token.html'><label>Create a Liquidity Generator Token</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-baby-token.html'><label>Create a Baby Token</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-buyback-baby-token.html'><label>Create a Buyback baby Token</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Launchpads</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-launchpad.html'><label>Create a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-update-a-launchpad.html'><label>Update a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-finalize-a-launchpad.html'><label>Finalize a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-add-remove-whitelist.html'><label>Add/Remove Whitelists</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-presale-using-stablecoin.html'><label>Create a Presale Using Stablecoin</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Presale Vesting</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-team-vesting-guide.html'><label>Team Vesting Guide</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-presale-vesting-guide.html'><label>Presale Vesting Guide</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Investing</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-how-to-buy-a-presale.html'><label>How to Buy a Presale</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-how-to-claim-tokens.html'><label>How to Claim Tokens</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-how-to-widthdraw-your-contribution.html'><label>How to Widthdraw Your Contribution</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-emergency-withdraw.html'><label>Emergency Withdraw</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Fair Lunch</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-fair-launch.html'><label>Create a Fair Launch</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-update-a-fair-launch.html'><label>Update a Fair Launch</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-finalize-a-fair-launch.html'><label>Finalize a Fair Launch</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-a-fair-launch-using-stablecoin.html'><label>Create a Fair Launch Using Stablecoin</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Crypterpad</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-crypterpad.html'><label>Create CrypterPad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-update-crypterpad.html'><label>Update CrypterPad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-finalize-crypterpad.html'><label>Finalize CrypterPad</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Crypter Airdrop</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-create-an-airdrop.html'><label>Create an Airdrop</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Common Errors</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-exclude-fees-dividends-max-tx-on-bscs-scan.html'><label>Exlude Fees, Dividends, Max TX on BSCScan</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-presale-cancellation.html'><label>Presale Cancellation</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Crypter Anti-bot</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-crypter-anti-bot-introducing.html'><label>Introducing</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-crypter-anti-bot-guide.html'><label>Crypter anti-bot guide</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='launchpad-docs-exclusive-to-integrate-crypter-anti-bot-for-custom-contract.html'><label>How to integrate Crypter anti-bot for custom contract</label></a></li>
                                            </ul>
                                        </div>
                        
                                        {/*<div className='box-left-panel-introduction'>
                                            <strong className='ml-3'><label className='text-success'>Content</label></strong>
                                            <hr/>
                                            <ul className='list-group list-group-mobile'>
                                                <li className='list-group-item border-0'><label>Dolor sit amet</label></li>
                                                <li className='list-group-item border-0'><label>Odio vulpulate</label></li>
                                                <li className='list-group-item border-0'><label>Leo purus diam</label></li>
                                                <li className='list-group-item border-0'><label>Carcus neque</label></li>
                                                <li className='list-group-item border-0'><label>Ac iacudis</label></li>
                                                <li className='list-group-item border-0'><label>Lacus neque</label></li>
                                                <li className='list-group-item border-0'><label>Odio vulpulate</label></li>
                                            </ul>
                                            <br/>
                                        </div>*/}
                                    </div>

                                    <div className='launchpad-token-lock-info'>
                                        <div className='row'>
                                            <div className='col-md-12'><h6 className='float-start mt-3'>Introducing</h6></div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-body'>
                                        <hr/>
                                        <div className='launchpad-kyc-audit'>  
                                            <div className='row p-2'>
                            
                                                <div className='col-md-12 mt-0 mb-1'>
                                                    <p><strong>Key features</strong></p>
                                                    <p><i className='bi-dot'></i> Prevent bots from inflating the price when the token has just been listed on the exchange.</p>
                                                    <p><i className='bi-dot'></i> Prevent multiple swaps in the same transaction by adding a delay between transactions.</p>
                                                    <p><i className='bi-dot'></i> Control the amount of tradable tokens per trade.</p>
                                                    <p><i className='bi-dot'></i> Change the amount of tradable tokens over time.</p>
                                                    <p><i className='bi-dot'></i> Add any bot addresses to a blacklist.</p>
                                                </div>
                            
                                                <div className='col-md-12 mt-0 mb-1'>
                                                    <p><strong>Mechanism</strong></p>
                                                    <p><i className='bi-dot'></i> When creating tokens on CrypterSale, you have the option to implement or disable the Crypter Anti-Bot.</p>
                                                    <p><i className='bi-dot'></i> Prevents traders from transacting during the first block at listing time. Traders will only be able to trade from the second block onwards.</p>
                                                    <p><i className='bi-dot'></i> The limited amount of tradable tokens per trade will increase gradually, proportional to the number of blocks that have passed since the genesis block. After a number of blocks, depending on the setting, the Anti-Bot will automatically stop working.</p>
                                                    <p><i className='bi-dot'></i> The limited amount of tradable tokens per trade can be customized differently for each token. Only the creator has the right to edit this parameter.</p>
                                                    <p><i className='bi-dot'></i> Time limit per trade can be customized differently for each token. After a number of blocks, depending on the setting, time limit per trade will become zero. Only the creator has the right to edit this parameter.</p>
                                                    <p><i className='bi-dot'></i> You can manually add to or remove any addresses from the blacklist. The wallets in the blacklist will not be able to trade.</p>
                                                </div>
                            
                                                <div className='col-md-12 mt-0 mb-1'>
                                                    <p><strong>Implementation Procedure</strong></p>
                                                    <p><i className='bi-dot'></i> Add Anti-Bot code to the contract.</p>
                                                    <p><i className='bi-dot'></i> Deploy token contract.</p>
                                                    <p><i className='bi-dot'></i> Set owner rights for Anti-Bot.</p>
                                                    <p><i className='bi-dot'></i> Configure Anti-Bot.</p>
                                                    <p><i className='bi-dot'></i> Enable Anti-Bot.</p>
                                                </div>
                            
                                            </div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-footer'>
                                        <div className='row'></div>
                                    </div>
                                    <div className='row mt-2 mb-2'>
                            
                                        <div className='col-lg-6'>
                                            <a href='launchpad-docs-introducing.html' className='onPreviewskycaudit'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p><small className='ml-4'>Previous</small></p>
                                                <p className='kyc-previews'>
                                                    <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><label className='ml-2'>Introducing</label></strong></p>
                                                </div>
                                            </a>
                                        </div>
                                        <div className='col-lg-6 mt-2'>
                                            <a href='launchpad-docs-crypter-anti-bot-guide.html' className='onNextkycaudit'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='mr-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                    <strong><label className='ml-2'>Crypter Anti-Bot Guide</label></strong>
                                                    <i className='bi-arrow-right bi-arrow-right-previews-style text-success'></i>
                                                </p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
