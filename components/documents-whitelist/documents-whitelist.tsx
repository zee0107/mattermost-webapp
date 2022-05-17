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
import removeButton from 'images/docs/whitelist/remove-whitelist.png';
import removeUser from 'images/docs/whitelist/remove-whitelist-from-whitelist.png';
import howToAdd from 'images/docs/whitelist/How-to-add-whitelists.png';
import disableButton from 'images/docs/whitelist/disabled-whitelist-button.png';
import addUser from 'images/docs/whitelist/add-users-to-whitelist.png';
import finistEdit from 'images/docs/whitelist/4-finish-edit.png';


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

export default class DocumentsWhitelist extends React.PureComponent<Props, State> {
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
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-launchpad' className='text-dark'><label>Finalize a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/add-remove-whitelist' className='active-docs fw-bold text-dark'><label>Add/Remove Whitelists</label></a></li>
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
                                            <div className='col-8'><h4 className='float-start mt-3'>Add/Remove Whitelist</h4></div>
                                            <div className='col-4'></div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-body'>
                                        <hr/>
                                        <div className='launchpad-kyc-audit'>
                                            <div className='row p-2'>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>How to Add Whitelists for a Presale: <a className='text-primary'>https://www.youtube.com/watch?v=NCCgMTHUnSE</a></p>
                                                    <p>Whitelist on CrypterSale is list of administrator-approved addresses whereby, only these addresses can participate in the presale. The goal of having a whitelist is to protect a presale from bot attacks and having real investors. You can enable/disable the whitelist  function when you create a Launchpad, or at any time before the presale begins.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1' id='enablewhitelist'>
                                                    <h6>Enable Whitelist</h6>
                                                    <p>When creating the launchpad, at step 2 - DeFi Launchpad Info, you can choose to enable/disable whitelist here by clicking on “Disable” or “Enable” in “Whitelist” section:</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={disableButton} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>When submitting your launchpad, you can see “Sale method: Whitelist Only”.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={finistEdit} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>In case you forgot to enable whitelist when creating your launchpad, you can also enable it when you update your launchpad by clicking on “Enable whitelist” button in the Owner Zone.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={howToAdd} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                </div>
                                                <hr/>
                                                <div className='col-12 mt-0 mb-1' id='disablewhitelist'>
                                                    <h6>Disable Whitelist</h6>
                                                    <p>If you wish to disable the whitelist, you can do so by clicking on “Disable whitelist” in the Owner Zone of your launchpad.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={disableButton} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                    <p>Note: You can “Disable whitelist” during the presale for the sale become a public sale instead of a whitelisted presale.</p>
                                                </div>
                                                <hr/>
                                                <div className='col-12 mt-0 mb-1' id='howatoaddwhitelists'>
                                                    <h6>How to Add Whitelists</h6>
                                                    <p>You can add wallet addresses of presale participants anytime, before or even during the presale. You can do it by clicking on “Add users to whitelist” in the Owner Zone of your launchpad.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={howToAdd} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>After clicking on “Add users to whitelist”, you will see a pop-up box. Here, you can add addresses to your whitelist. Addresses are separated by a new line and no comma, the below list can be used as an example:</p>
                                                    <p>0x34E7f6A4d0BB1fa7aFe548582c47Df337FC337E6</p>
                                                    <p>0xd8Ebc66f0E3D638156D6F5eFAe9f43B1eBc113B1</p>
                                                    <p>0x968136BB860D9534aF1563a7c7BdDa02B1A979C2</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={addUser} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>Click on “Add users” when you are done inputting the addresses, then, MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                    <p>Note: You can add up to 800 addresses to your whitelist each time.</p>
                                                </div>
                                                <hr/>
                                                <div className='col-12 mt-0 mb-1' id='howtoremovewhitelists'>
                                                    <h6>How to Remove Whitelists</h6>
                                                    <p>You can remove wallet addresses of presale participants by clicking on “Add users to whitelist” in the Owner Zone of your launchpad.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={removeButton} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>After clicking on “Add users to whitelist”, you will see a pop-up box. Here, you can remove any unwanted addresses but remember, addresses are separated by a new line and no comma. For example:</p>
                                                    <p>0x34E7f6A4d0BB1fa7aFe548582c47Df337FC337E6</p>
                                                    <p>0xd8Ebc66f0E3D638156D6F5eFAe9f43B1eBc113B1</p>
                                                    <p>0x968136BB860D9534aF1563a7c7BdDa02B1A979C2</p>
                                                    <p>Paste the above addresses into the pop-up box and click on “Remove users”</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={removeUser} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-footer'>
                                        <div className='row'></div>
                                    </div>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-6'>
                                            <a href='/documents/finalize-a-launchpad' className='onPreviewskycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p><small className='ms-4'>Previous</small></p>
                                                <p className='kyc-previews'>
                                                <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ms-2'>Finalize a Launchpad</large></strong></p>
                                            </div>
                                            </a>
                                        </div>
                                        <div className='col-6'>
                                            <a href='/documents/create-a-presale-using-stablecoin' className='onNextkycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='me-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                <strong><large className='ms-2'>Create a Presale Using Stablecoin</large></strong>
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
                                        <strong className='ms-3'><large className='text-success'>Contents</large></strong>
                                        <hr/>
                                        <ul className='list-group-contents'>
                                            <li className='list-group-item border-0'>
                                                <a href='#enablewhitelist'><medium>Enable Whitelist</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                                <a href='#disablewhitelist'><medium>Disable Whitelist</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                                <a href='#howatoaddwhitelists'><medium>How to Add Whitelists</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                                <a href='#howtoremovewhitelists'><medium>How to Remove Whitelists</medium></a>
                                            </li>
                                        </ul>
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
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-launchpad' className='text-dark'><label>Finalize a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/add-remove-whitelist' className='active-docs text-dark'><label>Add/Remove Whitelists</label></a></li>
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
                                            <div className='col-12'><h6 className='float-start mt-3'>Add/Remove Whitelist</h6></div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-body'>
                                        <hr/>
                                        <div className='launchpad-kyc-audit'>
                                            <div className='row p-2'>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>How to Add Whitelists for a Presale: <a className='text-primary'>https://www.youtube.com/watch?v=NCCgMTHUnSE</a></p>
                                                    <p>Whitelist on CrypterSale is list of administrator-approved addresses whereby, only these addresses can participate in the presale. The goal of having a whitelist is to protect a presale from bot attacks and having real investors. You can enable/disable the whitelist  function when you create a Launchpad, or at any time before the presale begins.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1' id='enablewhitelist'>
                                                    <h6>Enable Whitelist</h6>
                                                    <p>When creating the launchpad, at step 2 - DeFi Launchpad Info, you can choose to enable/disable whitelist here by clicking on “Disable” or “Enable” in “Whitelist” section:</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={disableButton} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>When submitting your launchpad, you can see “Sale method: Whitelist Only”.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={finistEdit} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>In case you forgot to enable whitelist when creating your launchpad, you can also enable it when you update your launchpad by clicking on “Enable whitelist” button in the Owner Zone.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={howToAdd} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                </div>
                                                <hr/>
                                                <div className='col-12 mt-0 mb-1' id='disablewhitelist'>
                                                    <h6>Disable Whitelist</h6>
                                                    <p>If you wish to disable the whitelist, you can do so by clicking on “Disable whitelist” in the Owner Zone of your launchpad.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={disableButton} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                    <p>Note: You can “Disable whitelist” during the presale for the sale become a public sale instead of a whitelisted presale.</p>
                                                </div>
                                                <hr/>
                                                <div className='col-12 mt-0 mb-1' id='howatoaddwhitelists'>
                                                    <h6>How to Add Whitelists</h6>
                                                    <p>You can add wallet addresses of presale participants anytime, before or even during the presale. You can do it by clicking on “Add users to whitelist” in the Owner Zone of your launchpad.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={howToAdd} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>After clicking on “Add users to whitelist”, you will see a pop-up box. Here, you can add addresses to your whitelist. Addresses are separated by a new line and no comma, the below list can be used as an example:</p>
                                                    <p>0x34E7f6A4d0BB1fa7aFe548582c47Df337FC337E6</p>
                                                    <p>0xd8Ebc66f0E3D638156D6F5eFAe9f43B1eBc113B1</p>
                                                    <p>0x968136BB860D9534aF1563a7c7BdDa02B1A979C2</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={addUser} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>Click on “Add users” when you are done inputting the addresses, then, MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                    <p>Note: You can add up to 800 addresses to your whitelist each time.</p>
                                                </div>
                                                <hr/>
                                                <div className='col-12 mt-0 mb-1' id='howtoremovewhitelists'>
                                                    <h6>How to Remove Whitelists</h6>
                                                    <p>You can remove wallet addresses of presale participants by clicking on “Add users to whitelist” in the Owner Zone of your launchpad.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={removeButton} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>After clicking on “Add users to whitelist”, you will see a pop-up box. Here, you can remove any unwanted addresses but remember, addresses are separated by a new line and no comma. For example:</p>
                                                    <p>0x34E7f6A4d0BB1fa7aFe548582c47Df337FC337E6</p>
                                                    <p>0xd8Ebc66f0E3D638156D6F5eFAe9f43B1eBc113B1</p>
                                                    <p>0x968136BB860D9534aF1563a7c7BdDa02B1A979C2</p>
                                                    <p>Paste the above addresses into the pop-up box and click on “Remove users”</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={removeUser} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-footer'>
                                        <div className='row'></div>
                                    </div>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-lg-6'>
                                            <a href='/documents/finalize-a-launchpad' className='onPreviewskycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p><small className='ms-4'>Previous</small></p>
                                                <p className='kyc-previews'>
                                                <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ms-2'>Finalize a Launchpad</large></strong></p>
                                            </div>
                                            </a>
                                        </div>
                                        <div className='col-lg-6 mt-2'>
                                            <a href='/documents/create-a-presale-using-stablecoin' className='onNextkycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='me-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                <strong><large className='ms-2'>Create a Presale Using Stablecoin</large></strong>
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
