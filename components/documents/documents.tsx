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
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-3'>
                                <div className='position-sticky float-right-panel'>
                                    <div className='box-left-panel-introduction'>
                                        <strong className='ml-3'><large className='text-success'>Introduction</large></strong>
                                        <hr/>
                                        <ul className='list-group'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-introducing.html' className='active-docs fw-bold'><medium>Introducing</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-token-metrics.html'><medium>Token Metrics</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-token-utility.html'><medium>Token Utility</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-anti-rug-system.html'><medium>Anti-Rug System</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-partnership.html'><medium>Partnership</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-roadmap.html'><medium>Roadmap</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-service-fees.html'><medium>Service Fees</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Important</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-contact-us.html'><medium>Contact Us</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-social-links.html'><medium>Social Links</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-kyc-and-audit-at-crypter-sale.html'><medium>KYC &#38; Audit at CrypterSale</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-crypter-sale-calculator.html'><medium>CrypterSale Calculator</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-youtube-tutorial.html'><medium>YouTube Tutorials</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-contact-developers.html'><medium>Contact Developers</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-presale-support.html'><medium>Presale Support</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-brand-assets.html'><medium>Brand Assets</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Tokens</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-a-standard-token.html'><medium>Create a Standard Token</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-a-liquidity-generator-token.html'><medium>Create a Liquidity Generator Token</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-a-baby-token.html'><medium>Create a Baby Token</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-a-buyback-baby-token.html'><medium>Create a Buyback baby Token</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Launchpads</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-a-launchpad.html'><medium>Create a Launchpad</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-update-a-launchpad.html'><medium>Update a Launchpad</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-finalize-a-launchpad.html'><medium>Finalize a Launchpad</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-add-remove-whitelist.html'><medium>Add/Remove Whitelists</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-a-presale-using-stablecoin.html'><medium>Create a Presale Using Stablecoin</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Presale Vesting</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-team-vesting-guide.html'><medium>Team Vesting Guide</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-presale-vesting-guide.html'><medium>Presale Vesting Guide</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Investing</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-how-to-buy-a-presale.html'><medium>How to Buy a Presale</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-how-to-claim-tokens.html'><medium>How to Claim Tokens</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-how-to-widthdraw-your-contribution.html'><medium>How to Widthdraw Your Contribution</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-emergency-withdraw.html'><medium>Emergency Withdraw</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Fair Lunch</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-a-fair-launch.html'><medium>Create a Fair Launch</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-update-a-fair-launch.html'><medium>Update a Fair Launch</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-finalize-a-fair-launch.html'><medium>Finalize a Fair Launch</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-a-fair-launch-using-stablecoin.html'><medium>Create a Fair Launch Using Stablecoin</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Crypterpad</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-crypterpad.html'><medium>Create CrypterPad</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-update-crypterpad.html'><medium>Update CrypterPad</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-finalize-crypterpad.html'><medium>Finalize CrypterPad</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Crypter Airdrop</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-create-an-airdrop.html'><medium>Create an Airdrop</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Common Errors</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-exclude-fees-dividends-max-tx-on-bscs-scan.html'><medium>Exlude Fees, Dividends, Max TX on BSCScan</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-presale-cancellation.html'><medium>Presale Cancellation</medium></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><large className='text-success'>Crypter Anti-bot</large></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-crypter-anti-bot-introducing.html'><medium>Introducing</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-crypter-anti-bot-guide.html'><medium>Crypter anti-bot guide</medium></a></li>
                                            <li className='list-group-item border-0'><a href='launchpad-docs-exclusive-to-integrate-crypter-anti-bot-for-custom-contract.html'><medium>How to integrate Crypter anti-bot for custom contract</medium></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                    
                            <div className='col-md-6'>
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
                                        <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ml-2'>Introducing</large></strong></p>
                                    </div>
                                </a>
                                </div>
                    
                                <div className='col-md-6'>
                                <a href='launchpad-docs-token-metrics.html' className='onNextkycaudit'>
                                    <div className='launchpad-token-body-kyc-audit'>
                                    <p className='text-end'><small className='mr-4'>Next</small></p>
                                    <p className='kyc-previews text-end'>
                                        <strong><large className='ml-2'>Token Metrics</large></strong>
                                        <i className='bi-arrow-right bi-arrow-right-previews-style text-success'></i>
                                    </p>
                                    </div>
                                </a>
                                </div>
                    
                            </div>
                            </div>
                            </div>
                    
                            <div className='col-md-3'>
                            <div className='position-sticky float-right-panel'>
                    
                                <strong>
                                <a href='javascript:;' className='onCopyurl' onclick='Copy();'><i className='bi-link bi-link-style'></i> Copy LINK</a>
                                </strong>
                                <div className='box-left-panel-introduction'>
                                    <strong className='ml-3'><large className='text-success'>Contents</large></strong>
                                    <hr/>
                                    {/*<ul className='list-group-contents'>
                                        <li className='list-group-item border-0'><medium>Dolor sit amet</medium></li>
                                        <li className='list-group-item border-0'><medium>Odio vulpulate</medium></li>
                                        <li className='list-group-item border-0'><medium>Leo purus diam</medium></li>
                                        <li className='list-group-item border-0'><medium>Carcus neque</medium></li>
                                        <li className='list-group-item border-0'><medium>Ac iacudis</medium></li>
                                        <li className='list-group-item border-0'><medium>Lacus neque</medium></li>
                                        <li className='list-group-item border-0'><medium>Odio vulpulate</medium></li>
                                        <li className='list-group-item border-0'><medium>Dolor sit amet</medium></li>
                                        <li className='list-group-item border-0'><medium>Odio vulpulate</medium></li>
                                        <li className='list-group-item border-0'><medium>Leo purus diam</medium></li>
                                        <li className='list-group-item border-0'><medium>Carcus neque</medium></li>
                                        <li className='list-group-item border-0'><medium>Ac iacudis</medium></li>
                                        <li className='list-group-item border-0'><medium>Lacus neque</medium></li>
                                        <li className='list-group-item border-0'><medium>Odio vulpulate</medium></li>
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
                                            <strong className='ml-3'><large className='text-success'>Introduction</large></strong>
                                            <hr/>
                                            <ul className='list-group'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-introducing.html' className='active-docs fw-bold'><medium>Introducing</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-token-metrics.html'><medium>Token Metrics</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-token-utility.html'><medium>Token Utility</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-anti-rug-system.html'><medium>Anti-Rug System</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-partnership.html'><medium>Partnership</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-roadmap.html'><medium>Roadmap</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-service-fees.html'><medium>Service Fees</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Important</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-contact-us.html'><medium>Contact Us</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-social-links.html'><medium>Social Links</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-kyc-and-audit-at-crypter-sale.html'><medium>KYC & Audit at CrypterSale</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-crypter-sale-calculator.html'><medium>CrypterSale Calculator</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-youtube-tutorial.html'><medium>YouTube Tutorials</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-contact-developers.html'><medium>Contact Developers</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-presale-support.html'><medium>Presale Support</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-brand-assets.html'><medium>Brand Assets</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Tokens</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-a-standard-token.html'><medium>Create a Standard Token</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-a-liquidity-generator-token.html'><medium>Create a Liquidity Generator Token</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-a-baby-token.html'><medium>Create a Baby Token</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-a-buyback-baby-token.html'><medium>Create a Buyback baby Token</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Launchpads</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-a-launchpad.html'><medium>Create a Launchpad</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-update-a-launchpad.html'><medium>Update a Launchpad</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-finalize-a-launchpad.html'><medium>Finalize a Launchpad</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-add-remove-whitelist.html'><medium>Add/Remove Whitelists</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-a-presale-using-stablecoin.html'><medium>Create a Presale Using Stablecoin</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Presale Vesting</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-team-vesting-guide.html'><medium>Team Vesting Guide</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-presale-vesting-guide.html'><medium>Presale Vesting Guide</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Investing</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-how-to-buy-a-presale.html'><medium>How to Buy a Presale</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-how-to-claim-tokens.html'><medium>How to Claim Tokens</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-how-to-widthdraw-your-contribution.html'><medium>How to Widthdraw Your Contribution</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-emergency-withdraw.html'><medium>Emergency Withdraw</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Fair Lunch</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-a-fair-launch.html'><medium>Create a Fair Launch</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-update-a-fair-launch.html'><medium>Update a Fair Launch</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-finalize-a-fair-launch.html'><medium>Finalize a Fair Launch</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-a-fair-launch-using-stablecoin.html'><medium>Create a Fair Launch Using Stablecoin</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Crypterpad</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-crypterpad.html'><medium>Create CrypterPad</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-update-crypterpad.html'><medium>Update CrypterPad</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-finalize-crypterpad.html'><medium>Finalize CrypterPad</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Crypter Airdrop</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-create-an-airdrop.html'><medium>Create an Airdrop</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Common Errors</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-exclude-fees-dividends-max-tx-on-bscs-scan.html'><medium>Exlude Fees, Dividends, Max TX on BSCScan</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-presale-cancellation.html'><medium>Presale Cancellation</medium></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><large className='text-success'>Crypter Anti-bot</large></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-crypter-anti-bot-introducing.html'><medium>Introducing</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-crypter-anti-bot-guide.html'><medium>Crypter anti-bot guide</medium></a></li>
                                                <li className='list-group-item border-0'><a href='launchpad-docs-exclusive-to-integrate-crypter-anti-bot-for-custom-contract.html'><medium>How to integrate Crypter anti-bot for custom contract</medium></a></li>
                                            </ul>
                                        </div>
                        
                                        {/*<div className='box-left-panel-introduction'>
                                            <strong className='ml-3'><large className='text-success'>Content</large></strong>
                                            <hr/>
                                            <ul className='list-group list-group-mobile'>
                                                <li className='list-group-item border-0'><medium>Dolor sit amet</medium></li>
                                                <li className='list-group-item border-0'><medium>Odio vulpulate</medium></li>
                                                <li className='list-group-item border-0'><medium>Leo purus diam</medium></li>
                                                <li className='list-group-item border-0'><medium>Carcus neque</medium></li>
                                                <li className='list-group-item border-0'><medium>Ac iacudis</medium></li>
                                                <li className='list-group-item border-0'><medium>Lacus neque</medium></li>
                                                <li className='list-group-item border-0'><medium>Odio vulpulate</medium></li>
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
                                                    <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ml-2'>Introducing</large></strong></p>
                                                </div>
                                            </a>
                                        </div>
                                        <div className='col-lg-6 mt-2'>
                                            <a href='launchpad-docs-crypter-anti-bot-guide.html' className='onNextkycaudit'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='mr-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                    <strong><large className='ml-2'>Crypter Anti-Bot Guide</large></strong>
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
