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

export default class DocumentsKyc extends React.PureComponent<Props, State> {
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
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/intro' className='text-dark'><label>Introducing</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/token-metrics' className='text-dark'><label>Token Metrics</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/token-utility' className='text-dark'><label>Token Utility</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/anti-rug-system' className='text-dark'><label>Anti-Rug System</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/partnership' className='text-dark'><label>Partnership</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/roadmap' className='text-dark'><label>Roadmap</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/service-fees' className='text-dark'><label>Service Fees</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Important</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/contact-us'  className='text-dark'><label>Contact Us</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/social-links'  className='text-dark'><label>Social Links</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/docments/kyc' className='active-docs fw-bold text-dark'><label>KYC &#38; Audit at CrypterSale</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/crypter-sale-calculator'  className='text-dark'><label>CrypterSale Calculator</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/youtube-tutorial'  className='text-dark'><label>YouTube Tutorials</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/contact-developers'  className='text-dark'><label>Contact Developers</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/presale-support'  className='text-dark'><label>Presale Support</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/brand-assets'  className='text-dark'><label>Brand Assets</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Tokens</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-standard-token'  className='text-dark'><label>Create a Standard Token</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-liquidity-generator-token'  className='text-dark'><label>Create a Liquidity Generator Token</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-baby-token'  className='text-dark'><label>Create a Baby Token</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-buyback-baby-token'  className='text-dark'><label>Create a Buyback baby Token</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Launchpads</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-launchpad'  className='text-dark'><label>Create a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/update-a-launchpad'  className='text-dark'><label>Update a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-launchpad'  className='text-dark'><label>Finalize a Launchpad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/add-remove-whitelist'  className='text-dark'><label>Add/Remove Whitelists</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-presale-using-stablecoin'  className='text-dark'><label>Create a Presale Using Stablecoin</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Presale Vesting</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/team-vesting-guide'  className='text-dark'><label>Team Vesting Guide</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/presale-vesting-guide'  className='text-dark'><label>Presale Vesting Guide</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Investing</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-buy-a-presale'  className='text-dark'><label>How to Buy a Presale</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-claim-tokens'  className='text-dark'><label>How to Claim Tokens</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-widthdraw-your-contribution'  className='text-dark'><label>How to Widthdraw Your Contribution</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/emergency-withdraw'  className='text-dark'><label>Emergency Withdraw</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Fair Lunch</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-fair-launch'  className='text-dark'><label>Create a Fair Launch</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/update-a-fair-launch'  className='text-dark'><label>Update a Fair Launch</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-fair-launch'  className='text-dark'><label>Finalize a Fair Launch</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-fair-launch-using-stablecoin'  className='text-dark'><label>Create a Fair Launch Using Stablecoin</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Crypterpad</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-crypterpad'  className='text-dark'><label>Create CrypterPad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/update-crypterpad'  className='text-dark'><label>Update CrypterPad</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-crypterpad'  className='text-dark'><label>Finalize CrypterPad</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Crypter Airdrop</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/create-an-airdrop'  className='text-dark'><label>Create an Airdrop</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Common Errors</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/exclude-fees-dividends-max-tx-on-bscs-scan'  className='text-dark'><label>Exlude Fees, Dividends, Max TX on BSCScan</label></a></li>
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/presale-cancellation'  className='text-dark'><label>Presale Cancellation</label></a></li>
                                        </ul>
                                        <br/>
                                        <strong className='ml-3'><label className='text-success'>Crypter Anti-bot</label></strong>
                                        <ul className='list-group mt-2'>
                                            <li className='list-group-item border-0'><a href='/documents/crypter-anti-bot-introducing'  className='text-dark'><label>Introducing</label></a></li>
                                            <li className='list-group-item border-0'><a href='/documents/crypter-anti-bot-guide'  className='text-dark'><label>Crypter anti-bot guide</label></a></li>
                                            <li className='list-group-item border-0'><a href='/documents/exclusive-to-integrate-crypter-anti-bot-for-custom-contract'  className='text-dark'><label>How to integrate Crypter anti-bot for custom contract</label></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                    
                            <div className='col-md-8'>
                                <div className='position-sticky float-right-panel'>
                                    <div className='launchpad-token-lock-info'>
                                        <div className='row'>
                                            <div className='col-8'><h6 className='float-start mt-3'>KYC & Audit at CrypterSale</h6></div>
                                            <div className='col-4'></div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-body'>
                                        <hr/>
                                        <div className='launchpad-kyc-audit'>  
                                            <div className='row p-2'>
                                            <div className='col-12 mt-0 mb-1'>
                                                <p className='mt-2 mb-2' id='kycisonlyforprojectowners'>
                                                <strong>KYC is only for Project Owners</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                As you know, at CrypterSale we take the safety of our investors very seriously. We hate scams and rugpulls and, because of that, we have built many features and tools for you to be able to make informed decisions as to whether a presale is worth investing in or not. Scrolling through the list of current and past presales, you might have noticed that several projects have a KYC badge next to their names. This brief article is designed to explain what that means and what it entails for all stakeholders.
                                                </p>
                                                <p className='mt-2 mb-2' id='kycexplained'>
                                                <strong>KYC Explained</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                At CrypterSale, Know Your Customer, or KYC is the process of identity verification to ascertain that the person speaking to us is really who she/he says they are. How does it work? The identities of the project owner are determined by submitting ID documentation (Passport, National ID) to an automated platform. This is similar to the KYC process needed when opening up a trading account on a major exchange like Binance, for example.
                                                </p>
                                                <p className='mt-2 mb-2' id='whatdoesitmeanforyou'>
                                                <strong>What Does it Mean For You?</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                The KYC process aims to rid our platform of scams and rugpulls by acting as a deterrent for dubious devs. If any of the KYCed project’s team members scams investors: 
                                                <br/>
                                                <br/>
                                                <i className='bi-dot'></i> We will reveal their identities. 
                                                <br/>
                                                <i className='bi-dot'></i> We will make this information public for those wanting to file criminal charges.
                                                <br/>
                                                <br/>
                                                <strong>To investors:</strong> If you have serious reservations about a project, and you have proofs that the project is a scam, please contact us ASAP, supplying as much evidence as possible. We will go through the claim and let you know the result of our investigation. 
                                                <br/>
                                                <br/>
                                                <strong>To project owners:</strong> If you want investors to trust you, we highly recommend that you approach our KYC Manager on Crypter and apply for KYC verification. This will bring legitimacy to your project. KYC may take 24 - 48 hours so please contact us asap. 
                                                <br/>
                                                <br/>
                                                The KYC service on CrypterSale is another of the great features making our platform the best launchpad available. It will also help further in cleaning up the crypto industry, making people realize that they are accountable for their actions, even in a decentralized world. 
                                                </p>
                                                <p className='mt-2 mb-2' id='contactforkyc'>
                                                <strong>Contact for KYC</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                Please contact @babycrypter on Telegram for the KYC badge on CtypterSale.
                                                <br/>
                                                <br/>
                                                <strong>Important Disclaimer</strong>
                                                <br/>
                                                <br/>
                                                A project receiving the KYC badge does not mean in any way that we approve or recommend that project, even if we host an AMA with them. Please always DYOR before investing, remembering that CrypterSale is a decentralized platform.
                                                </p>
                                                <p className='mt-2 mb-2' id='auditpartners'>
                                                <strong>Audit Partners</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                If you're looking for an audit service, please contact one of the following services:
                                                <br/>
                                                <br/>
                                                <strong>Normal Price</strong>
                                                <br/>
                                                <br/>
                                                <a><i className='bi-dot'></i> @harrykedelman - ContractChecker</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @interfiaudits, @interfisupport, @thecryptoblonde - InterFi</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @Joe_SpyWolf - SpyWolf</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @FreddyCryptos - AnalytixAudit</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @FreshCoinsTG - FreshCoins</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @William_SafuAudit, @Dan_SafuAudit - SafuAudit</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @ContractwolfInquiries - ContractWolf</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @TechAudit1 - Tech Audit</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @auditratealex - Audit Rate Tech</a>
                                                <br/>
                                                <br/>
                                                <strong>High Price</strong>
                                                <br/>
                                                <a><i className='bi-dot'></i> @conordb - Certik</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @solid_1 - SolidGroup</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @marco0x00 - HashEx</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @chainsulting - Chainsulting</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @preetam_quillhash - QuillAudits</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @TonyLi2021 - FairyProof</a>
                                                </p>
                                                <p className='mt-2 mb-2' id='auditbadge'>
                                                <strong>Audit badge</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                    Please contact @babycrypter on Telegram for adding audit badge. It may take up to 24 - 48 hours so please contact us ASAP.
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
                                            <a href='/documents/social-links' className='onPreviewskycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p><small className='ms-4'>Previous</small></p>
                                                <p className='kyc-previews'>
                                                <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ms-2'>Social Links</large></strong></p>
                                            </div>
                                            </a>
                                        </div>
                                        <div className='col-6'>
                                            <a href='/documents/crypter-sale-calculator' className='onNextkycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='me-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                <strong><large className='ms-2'>CrypterSale Calculator</large></strong>
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
                                            <a href='#kycisonlyforprojectowners' className='text-dark'><medium>KYC is only for project owners</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#kycexplained' className='text-dark'><medium>KYC explained</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#whatdoesitmeanforyou' className='text-dark'><medium>What does it mean for you?</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#contactforkyc' className='text-dark'><medium>Contact for KYC</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#auditpartners' className='text-dark'><medium>Audit partners</medium></a>
                                            </li>
                                            <li className='list-group-item border-0'>
                                            <a href='#auditbadge' className='text-dark'><medium>Audit badge</medium></a>
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
                                            <strong className='ml-3'><label className='text-success'>Introduction</label></strong>
                                            <hr/>
                                            <ul className='list-group'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/intro'><label>Introducing</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/token-metrics'  className='text-dark'><label>Token Metrics</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/token-utility'  className='text-dark'><label>Token Utility</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/anti-rug-system'  className='text-dark'><label>Anti-Rug System</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/partnership'  className='text-dark'><label>Partnership</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/roadmap'  className='text-dark'><label>Roadmap</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/service-fees'  className='text-dark'><label>Service Fees</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Important</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/contact-us'  className='text-dark'><label>Contact Us</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/social-links'  className='text-dark'><label>Social Links</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/docments/kyc' className='active-docs fw-bold text-dark'><label>KYC & Audit at CrypterSale</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/crypter-sale-calculator'  className='text-dark'><label>CrypterSale Calculator</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/youtube-tutorial'  className='text-dark'><label>YouTube Tutorials</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/contact-developers'  className='text-dark'><label>Contact Developers</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/presale-support'  className='text-dark'><label>Presale Support</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/brand-assets'  className='text-dark'><label>Brand Assets</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Tokens</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-standard-token'  className='text-dark'><label>Create a Standard Token</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-liquidity-generator-token'  className='text-dark'><label>Create a Liquidity Generator Token</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-baby-token'  className='text-dark'><label>Create a Baby Token</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-buyback-baby-token'  className='text-dark'><label>Create a Buyback baby Token</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Launchpads</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-launchpad'  className='text-dark'><label>Create a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/update-a-launchpad'  className='text-dark'><label>Update a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-launchpad'  className='text-dark'><label>Finalize a Launchpad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/add-remove-whitelist'  className='text-dark'><label>Add/Remove Whitelists</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-presale-using-stablecoin'  className='text-dark'><label>Create a Presale Using Stablecoin</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Presale Vesting</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/team-vesting-guide'  className='text-dark'><label>Team Vesting Guide</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/presale-vesting-guide'  className='text-dark'><label>Presale Vesting Guide</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Investing</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-buy-a-presale'  className='text-dark'><label>How to Buy a Presale</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-claim-tokens'  className='text-dark'><label>How to Claim Tokens</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-widthdraw-your-contribution'  className='text-dark'><label>How to Widthdraw Your Contribution</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/emergency-withdraw'  className='text-dark'><label>Emergency Withdraw</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Fair Lunch</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-fair-launch'  className='text-dark'><label>Create a Fair Launch</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/update-a-fair-launch'  className='text-dark'><label>Update a Fair Launch</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-fair-launch'  className='text-dark'><label>Finalize a Fair Launch</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-a-fair-launch-using-stablecoin'  className='text-dark'><label>Create a Fair Launch Using Stablecoin</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Crypterpad</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-crypterpad'  className='text-dark'><label>Create CrypterPad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/update-crypterpad'  className='text-dark'><label>Update CrypterPad</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-crypterpad'  className='text-dark'><label>Finalize CrypterPad</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Crypter Airdrop</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/create-an-airdrop'  className='text-dark'><label>Create an Airdrop</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Common Errors</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/exclude-fees-dividends-max-tx-on-bscs-scan'  className='text-dark'><label>Exlude Fees, Dividends, Max TX on BSCScan</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/presale-cancellation'  className='text-dark'><label>Presale Cancellation</label></a></li>
                                            </ul>
                                            <br/>
                                            <strong className='ml-3'><label className='text-success'>Crypter Anti-bot</label></strong>
                                            <ul className='list-group mt-2'>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/crypter-anti-bot-introducing'  className='text-dark'><label>Introducing</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/crypter-anti-bot-guide'  className='text-dark'><label>Crypter anti-bot guide</label></a></li>
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/exclusive-to-integrate-crypter-anti-bot-for-custom-contract'  className='text-dark'><label>How to integrate Crypter anti-bot for custom contract</label></a></li>
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
                                            <div className='col-12'><h6 className='float-start mt-3'>KYC & Audit at CrypterSale</h6></div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-body'>
                                        <hr/>
                                        <div className='launchpad-kyc-audit'>  
                                            <div className='row p-2'>
                                                <p className='mt-2 mb-2' id='kycisonlyforprojectowners'>
                                                <strong>KYC is only for Project Owners</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                As you know, at CrypterSale we take the safety of our investors very seriously. We hate scams and rugpulls and, because of that, we have built many features and tools for you to be able to make informed decisions as to whether a presale is worth investing in or not. Scrolling through the list of current and past presales, you might have noticed that several projects have a KYC badge next to their names. This brief article is designed to explain what that means and what it entails for all stakeholders.
                                                </p>
                                                <p className='mt-2 mb-2' id='kycexplained'>
                                                <strong>KYC Explained</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                At CrypterSale, Know Your Customer, or KYC is the process of identity verification to ascertain that the person speaking to us is really who she/he says they are. How does it work? The identities of the project owner are determined by submitting ID documentation (Passport, National ID) to an automated platform. This is similar to the KYC process needed when opening up a trading account on a major exchange like Binance, for example.
                                                </p>
                                                <p className='mt-2 mb-2' id='whatdoesitmeanforyou'>
                                                <strong>What Does it Mean For You?</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                The KYC process aims to rid our platform of scams and rugpulls by acting as a deterrent for dubious devs. If any of the KYCed project’s team members scams investors: 
                                                <br/>
                                                <br/>
                                                <i className='bi-dot'></i> We will reveal their identities. 
                                                <br/>
                                                <i className='bi-dot'></i> We will make this information public for those wanting to file criminal charges.
                                                <br/>
                                                <br/>
                                                <strong>To investors:</strong> If you have serious reservations about a project, and you have proofs that the project is a scam, please contact us ASAP, supplying as much evidence as possible. We will go through the claim and let you know the result of our investigation. 
                                                <br/>
                                                <br/>
                                                <strong>To project owners:</strong> If you want investors to trust you, we highly recommend that you approach our KYC Manager on Crypter and apply for KYC verification. This will bring legitimacy to your project. KYC may take 24 - 48 hours so please contact us asap. 
                                                <br/>
                                                <br/>
                                                The KYC service on CrypterSale is another of the great features making our platform the best launchpad available. It will also help further in cleaning up the crypto industry, making people realize that they are accountable for their actions, even in a decentralized world. 
                                                </p>
                                                <p className='mt-2 mb-2' id='contactforkyc'>
                                                <strong>Contact for KYC</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                Please contact @babyCrypter on Telegram for the KYC badge on CrypterSale.
                                                <br/>
                                                <br/>
                                                <strong>Important Disclaimer</strong>
                                                <br/>
                                                <br/>
                                                A project receiving the KYC badge does not mean in any way that we approve or recommend that project, even if we host an AMA with them. Please always DYOR before investing, remembering that CrypterSale is a decentralized platform.
                                                </p>
                                                <p className='mt-2 mb-2' id='auditpartners'>
                                                <strong>Audit Partners</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                If you're looking for an audit service, please contact one of the following services:
                                                <br/>
                                                <br/>
                                                <strong>Normal Price</strong>
                                                <br/>
                                                <br/>
                                                <a><i className='bi-dot'></i> @harrykedelman - ContractChecker</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @interfiaudits, @interfisupport, @thecryptoblonde - InterFi</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @Joe_SpyWolf - SpyWolf</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @FreddyCryptos - AnalytixAudit</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @FreshCoinsTG - FreshCoins</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @William_SafuAudit, @Dan_SafuAudit - SafuAudit</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @ContractwolfInquiries - ContractWolf</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @TechAudit1 - Tech Audit</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @auditratealex - Audit Rate Tech</a>
                                                <br/>
                                                <br/>
                                                <strong>High Price</strong>
                                                <br/>
                                                <a><i className='bi-dot'></i> @conordb - Certik</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @solid_1 - SolidGroup</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @marco0x00 - HashEx</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @chainsulting - Chainsulting</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @preetam_quillhash - QuillAudits</a>
                                                <br/>
                                                <a><i className='bi-dot'></i> @TonyLi2021 - FairyProof</a>
                                                </p>
                                                <p className='mt-2 mb-2' id='auditbadge'>
                                                <strong>Audit badge</strong>
                                                </p>
                                                <p className='mt-2 mb-2'>
                                                    Please contact @babyCrypter on Telegram for adding audit badge. It may take up to 24 - 48 hours so please contact us ASAP.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-footer'>
                                        <div className='row'></div>
                                    </div>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-lg-6'>
                                            <a href='/documents/social-links' className='onPreviewskycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p><small className='ms-4'>Previous</small></p>
                                                <p className='kyc-previews'>
                                                <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ms-2'>Social Links</large></strong></p>
                                            </div>
                                            </a>
                                        </div>
                                        <div className='col-lg-6 mt-2'>
                                            <a href='/documents/crypter-sale-calculator'  className='onNextkycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='me-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                <strong><large className='ms-2'>CrypterSale Calculator</large></strong>
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
