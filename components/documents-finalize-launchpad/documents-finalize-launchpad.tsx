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
import excludeToken from 'images/docs/launchpad/Token-address-exclude.png';
import preSaleToke from 'images/docs/launchpad/presale-token-address.png';
import excludeSet from 'images/docs/launchpad/exclude-set.png';
import excludeForm from 'images/docs/launchpad/exclude-form-fee.png';
import bscScan from 'images/docs/launchpad/bscscan.png';
import metaMask from 'images/docs/standardtoken/metaMask.png';
import finalizeWithdraw from 'images/docs/launchpad/finalize-and-withdraw-bnb-only.png';


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

export default class DocumentsFinalizeLaunchpad extends React.PureComponent<Props, State> {
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
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Introduction</h4></strong>
                                        <hr/>
                                        <ul className='list-group'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/intro' className='text-dark'><label>Introducing</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/token-metrics' className='text-dark'><label>Token Metrics</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/token-utility' className='text-dark'><label>Token Utility</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/anti-rug-system' className='text-dark'><label>Anti-Rug System</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/partnership' className='text-dark'><label>Partnership</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/roadmap' className='text-dark'><label>Roadmap</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/service-fees' className='text-dark'><label>Service Fees</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Important</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/contact-us' className='text-dark'><label>Contact Us</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/social-links' className='text-dark'><label>Social Links</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/docments/kyc' className='text-dark'><label>KYC &#38; Audit at CrypterSale</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/crypter-sale-calculator' className='text-dark'><label>CrypterSale Calculator</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/youtube-tutorial' className='text-dark'><label>YouTube Tutorials</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/contact-developers' className='text-dark'><label>Contact Developers</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/presale-support' className='text-dark'><label>Presale Support</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/brand-assets' className='text-dark'><label>Brand Assets</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Tokens</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-standard-token' className='text-dark'><label>Create a Standard Token</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-liquidity-generator-token' className='text-dark'><label>Create a Liquidity Generator Token</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-baby-token' className='text-dark'><label>Create a Baby Token</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-buyback-baby-token' className='text-dark'><label>Create a Buyback baby Token</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Launchpads</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-launchpad' className='text-dark'><label>Create a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/update-a-launchpad' className='text-dark'><label>Update a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-launchpad' className='active-docs fw-bold text-dark'><label>Finalize a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/add-remove-whitelist' className='text-dark'><label>Add/Remove Whitelists</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-presale-using-stablecoin' className='text-dark'><label>Create a Presale Using Stablecoin</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Presale Vesting</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/team-vesting-guide' className='text-dark'><label>Team Vesting Guide</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/presale-vesting-guide' className='text-dark'><label>Presale Vesting Guide</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Investing</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-buy-a-presale' className='text-dark'><label>How to Buy a Presale</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-claim-tokens' className='text-dark'><label>How to Claim Tokens</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-widthdraw-your-contribution' className='text-dark'><label>How to Widthdraw Your Contribution</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/emergency-withdraw' className='text-dark'><label>Emergency Withdraw</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Fair Lunch</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-fair-launch' className='text-dark'><label>Create a Fair Launch</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/update-a-fair-launch' className='text-dark'><label>Update a Fair Launch</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-fair-launch' className='text-dark'><label>Finalize a Fair Launch</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-fair-launch-using-stablecoin' className='text-dark'><label>Create a Fair Launch Using Stablecoin</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Crypterpad</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-crypterpad' className='text-dark'><label>Create CrypterPad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/update-crypterpad' className='text-dark'><label>Update CrypterPad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-crypterpad' className='text-dark'><label>Finalize CrypterPad</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Crypter Airdrop</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-an-airdrop' className='text-dark'><label>Create an Airdrop</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Common Errors</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/exclude-fees-dividends-max-tx-on-bscs-scan' className='text-dark'><label>Exlude Fees, Dividends, Max TX on BSCScan</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/presale-cancellation' className='text-dark'><label>Presale Cancellation</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><h4 className='text-success ml-3'>Crypter Anti-bot</h4></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='/documents/crypter-anti-bot-introducing' className='text-dark'><label>Introducing</label></a></li>
                                            <li className='list-group-item border-0'><a href='/documents/crypter-anti-bot-guide' className='text-dark'><label>Crypter anti-bot guide</label></a></li>
                                            <li className='list-group-item border-0'><a href='/documents/exclusive-to-integrate-crypter-anti-bot-for-custom-contract' className='text-dark'><label>How to integrate Crypter anti-bot for custom contract</label></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                    
                            <div className='col-md-8'>
                                <div className='position-sticky float-right-panel'>
                                    <div className='launchpad-token-lock-info'>
                                        <div className='row'>
                                            <div className='col-8'><h4 className='float-start mt-3'>Finalize a Launchpad</h4></div>
                                            <div className='col-4'></div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-body'>
                                        <hr/>
                                        <div className='launchpad-kyc-audit'>
                                            <div className='row p-2'>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>If you still can't finalize the pool after following steps in the above video, please hire a trusted developer at <a href='#' className='text-success'>https://docs.crypter.finance/important/contract-developers</a> to help you check your smart contract. There must be a problem with your contract.</p>
                                                    <p>If your token has fee, reward, and max tx in the contract, you have to exclude those functions for the presale address in order to finalize the presale pool.</p>
                                                    <p>1. Before you finalize your presale, you need to access your contract address from BSCScan or you can click on the token address on your launchpad page.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src='../assets/images/Token-address-exclude.png' /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>2. Go to Contract {`->`} Write contract {`->`} Connect to Web3 to connect your wallet, you need to use owner address.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src='../assets/images/bscscan.png' /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>3. Ctrl + F, Search “exclude”, then input your presale address, then click on Write, to exclude fee, reward, max tx for the presale address.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src='../assets/images/presale-token-address.png' /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p>
                                                    <img className='img-fluid' src='../assets/images/exclude-form-fee.png' />
                                                    </p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>4. After click on the “Write” button, MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                    <p>If you see exclude (bool), please input “True”</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p>
                                                    <img className='img-fluid' src='../assets/images/exclude-set.png' />
                                                    </p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p><i>Note:</i> Sometimes the contract doesn’t have “exclude” but 'exempt' instead, search “exempt”, then input your presale address, then click on Write, to exclude fee, reward, max tx for the presale address.</p>
                                                    <p>5. In the “Pool Actions” section, you can choose to click on “Finalize” to complete the Launchpad and list your token, or you can choose to cancel it.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p>
                                                    <img className='img-fluid' src='../assets/images/finalize-and-withdraw-bnb-only.png' />
                                                    </p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>6. MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p>
                                                    <img className='img-fluid' src='../assets/images/confirm-meta-mask-11.png' />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-footer'>
                                        <div className='row'></div>
                                    </div>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-6'>
                                            <a href='/documents/update-a-launchpad' className='onPreviewskycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p><small className='ms-4'>Previous</small></p>
                                                <p className='kyc-previews'>
                                                <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ms-2'>Update a Launchpad</large></strong></p>
                                            </div>
                                            </a>
                                        </div>
                                        <div className='col-6'>
                                            <a href='/documents/add-remove-whitelist' className='onNextkycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='me-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                <strong><large className='ms-2'>Add/Remove WhiteListed</large></strong>
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
                                    {/*<div className='box-left-panel-introduction'>
                                        <strong className='ms-3'><large className='text-success'>Contents</large></strong>
                                        <hr/>
                                        <ul className='list-group-contents'>
                                            <li className='list-group-item border-0'>
                                            <a href='#kycisonlyforprojectowners'><medium>KYC is only for project owners</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#kycexplained'><medium>KYC explained</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#whatdoesitmeanforyou'><medium>What does it mean for you?</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#contactforkyc'><medium>Contact for KYC</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#auditpartners'><medium>Audit partners</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#auditbadge'><medium>Audit badge</medium></a>
                                            </li>
                                        </ul>
                                    </div>*/}
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
                                                <a className='onKycmenu shadow-lg' data-bs-toggle='collapse' href='#collapseKycmenu' role='button' aria-expanded='true' aria-controls='collapseKycmenu'><i className='bi-menu-app'></i></a>
                                                <a className='onKycmenuclose shadow-sm' data-bs-toggle='collapse' href='#collapseKycmenu' role='button' aria-expanded='true' aria-controls='collapseKycmenu'><i className='bi-arrow-up-circle-fill'></i></a>
                                            </div>
                                        </div>
                                    </div>
                        
                                    <div className='collapse' id='collapseKycmenu'>
                                        <div className='box-left-panel-introduction'>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Introduction</h4></strong>
                                            <hr/>
                                            <ul className='list-group'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/intro' className='text-dark'><label>Introducing</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/token-metric' className='text-dark'><label>Token Metrics</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/token-utility' className='text-dark'><label>Token Utility</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/anti-rug-system' className='fw-bold text-dark'><label>Anti-Rug System</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/partnership' className='text-dark'><label>Partnership</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/roadmap' className='text-dark'><label>Roadmap</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/service-fees' className='text-dark'><label>Service Fees</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Important</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/contact-us' className='text-dark'><label>Contact Us</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/social-links' className='text-dark'><label>Social Links</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/docments/kyc' className='text-dark'><label>KYC & Audit at CrypterSale</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/crypter-sale-calculator' className='text-dark'><label>CrypterSale Calculator</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/youtube-tutorial' className='text-dark'><label>YouTube Tutorials</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/contact-developers' className='text-dark'><label>Contact Developers</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/presale-support' className='text-dark'><label>Presale Support</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/brand-assets' className='text-dark'><label>Brand Assets</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Tokens</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-standard-token' className='text-dark'><label>Create a Standard Token</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-liquidity-generator-token' className='text-dark'><label>Create a Liquidity Generator Token</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-baby-token' className='text-dark'><label>Create a Baby Token</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-buyback-baby-token' className='text-dark'><label>Create a Buyback baby Token</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Launchpads</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-launchpad' className='text-dark'><label>Create a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/update-a-launchpad' className='text-dark'><label>Update a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-launchpad' className='active-docs text-dark'><label>Finalize a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/add-remove-whitelist' className='text-dark'><label>Add/Remove Whitelists</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-presale-using-stablecoin'><label>Create a Presale Using Stablecoin</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Presale Vesting</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/team-vesting-guide' className='text-dark'><label>Team Vesting Guide</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/presale-vesting-guide' className='text-dark'><label>Presale Vesting Guide</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Investing</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-buy-a-presale' className='text-dark'><label>How to Buy a Presale</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-claim-tokens' className='text-dark'><label>How to Claim Tokens</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-widthdraw-your-contribution' className='text-dark'><label>How to Widthdraw Your Contribution</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/emergency-withdraw' className='text-dark'><label>Emergency Withdraw</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Fair Lunch</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-fair-launch' className='text-dark'><label>Create a Fair Launch</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/update-a-fair-launch' className='text-dark'><label>Update a Fair Launch</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-fair-launch' className='text-dark'><label>Finalize a Fair Launch</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-fair-launch-using-stablecoin' className='text-dark'><label>Create a Fair Launch Using Stablecoin</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Crypterpad</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-crypterpad' className='text-dark'><label>Create CrypterPad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/update-crypterpad' className='text-dark'><label>Update CrypterPad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-crypterpad' className='text-dark'><label>Finalize CrypterPad</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Crypter Airdrop</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-an-airdrop' className='text-dark'><label>Create an Airdrop</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Common Errors</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/exclude-fees-dividends-max-tx-on-bscs-scan' className='text-dark'><label>Exlude Fees, Dividends, Max TX on BSCScan</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/presale-cancellation' className='text-dark'><label>Presale Cancellation</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><h4 className='text-success ml-3'>Crypter Anti-bot</h4></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/crypter-anti-bot-introducing' className='text-dark'><label>Introducing</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/crypter-anti-bot-guide' className='text-dark'><label>Crypter anti-bot guide</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/exclusive-to-integrate-crypter-anti-bot-for-custom-contract' className='text-dark'><label>How to integrate Crypter anti-bot for custom contract</label></a></li>
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
                                            <div className='col-12'><h6 className='float-start mt-3'>Finalize a Launchpad</h6></div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-body'>
                                        <hr/>
                                        <div className='launchpad-kyc-audit'>
                                            <div className='row p-2'>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>If you still can't finalize the pool after following steps in the above video, please hire a trusted developer at <a href='#' className='text-success'>https://docs.crypter.finance/important/contract-developers</a> to help you check your smart contract. There must be a problem with your contract.</p>
                                                    <p>If your token has fee, reward, and max tx in the contract, you have to exclude those functions for the presale address in order to finalize the presale pool.</p>
                                                    <p>1. Before you finalize your presale, you need to access your contract address from BSCScan or you can click on the token address on your launchpad page.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src='../assets/images/Token-address-exclude.png' /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>2. Go to Contract {`->`} Write contract {`->`} Connect to Web3 to connect your wallet, you need to use owner address.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src='../assets/images/bscscan.png' /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>3. Ctrl + F, Search “exclude”, then input your presale address, then click on Write, to exclude fee, reward, max tx for the presale address.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src='../assets/images/presale-token-address.png' /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p>
                                                    <img className='img-fluid' src='../assets/images/exclude-form-fee.png' />
                                                    </p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>4. After click on the “Write” button, MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                    <p>If you see exclude (bool), please input “True”</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p>
                                                    <img className='img-fluid' src='../assets/images/exclude-set.png' />
                                                    </p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p><i>Note:</i> Sometimes the contract doesn’t have “exclude” but 'exempt' instead, search “exempt”, then input your presale address, then click on Write, to exclude fee, reward, max tx for the presale address.</p>
                                                    <p>5. In the “Pool Actions” section, you can choose to click on “Finalize” to complete the Launchpad and list your token, or you can choose to cancel it.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p>
                                                    <img className='img-fluid' src='../assets/images/finalize-and-withdraw-bnb-only.png' />
                                                    </p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>6. MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p>
                                                    <img className='img-fluid' src='../assets/images/confirm-meta-mask-11.png' />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-footer'>
                                        <div className='row'></div>
                                    </div>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-lg-6'>
                                            <a href='/documents/update-a-launchpad' className='onPreviewskycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p><small className='ms-4'>Previous</small></p>
                                                <p className='kyc-previews'>
                                                <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ms-2'>Update a Launchpad</large></strong></p>
                                            </div>
                                            </a>
                                        </div>
                                        <div className='col-lg-6 mt-2'>
                                            <a href='/documents/add-remove-whitelist' className='onNextkycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='me-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                <strong><large className='ms-2'>Add/Remove Whitelisted</large></strong>
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
