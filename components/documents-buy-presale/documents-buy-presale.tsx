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
import launchpad from 'images/docs/buypresale/view-pool-my-launchpad.png';
import viewPool from 'images/docs/buypresale/view-pool.png';
import presaleEnd from 'images/docs/buypresale/presale-ends-in.png';
import confirmMeta from 'images/docs/buypresale/confirm-meta-mask-3.png';

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

export default class DocumentsBuyPresale extends React.PureComponent<Props, State> {
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
                                            <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-buy-a-presale' className='active-docs fw-bold text-dark'><label>How to Buy a Presale</label></a></li>
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
                                            <div className='col-8'><h4 className='float-start mt-3'>How to buy a presale</h4></div>
                                            <div className='col-4'></div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-body'>
                                        <hr/>
                                        <div className='launchpad-kyc-audit'>
                                            <div className='row p-2'>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>How to Participate a Presale on CrypterSale: <a className='text-primary'>https://www.youtube.com/watch?v=rtgNAQZSSs0</a></p>
                                                    <p>1. Go to the following link: <a className='text-primary'>https://www.cryptersale.finance/#/launchpad</a> - All Launchpads.</p>
                                                    <p>2. There are 3 types of presale statuses: Upcoming, Live Sale, Sale Ended. You only can buy a presale with the “Live Sale” status. For example, “BlackCrypter” presale is live at the moment. Hover over it and click on “View Pool”.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={launchpad} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>3. After clicking on “View Pool”, you can see all the information related to that presale. You should check everything carefully before buying.</p>
                                                    <p>4. To buy the presale, insert the amount of BNB (or FTM, MATIC or ETH, depending on the pool) that you want to use to buy in the “Amount” section. The corresponding amount of presale tokens will be calculated automatically below the BNB amount. Finally, click on the “Buy” button.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={viewPool} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>5. MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={confirmMeta} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>6. After buying, you will see the changes in the “Amount” and “Your purchase” sections. For this pool, the maximum buy is 3 BNB, I purchased 0.1 BNB so the amount has changed to 2.9 BNB (= 3 – 0.1).</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={presaleEnd} /></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-footer'>
                                        <div className='row'></div>
                                    </div>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-6'>
                                            <a href='/documents/presale-vesting-guide' className='onPreviewskycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p><small className='ms-4'>Previous</small></p>
                                                <p className='kyc-previews'>
                                                <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ms-2'>Presale Vesting Guide</large></strong></p>
                                            </div>
                                            </a>
                                        </div>
                                        <div className='col-6'>
                                            <a href='/documents/how-to-claim-tokens' className='onNextkycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='me-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                <strong><large className='ms-2'>How to Claim Tokens</large></strong>
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
                                                <a href='#howtoclaim'><medium>How to claim</medium></a>
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
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/finalize-a-launchpad' className='text-dark'><label>Finalize a Launchpad</label></a></li>
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
                                                <li className='list-group-item border-0 mb-0'><a href='/documents/how-to-buy-a-presale' className='active-docs text-dark'><label>How to Buy a Presale</label></a></li>
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
                                            <div className='col-12'><h6 className='float-start mt-3'>How to buy a presale</h6></div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-body'>
                                        <hr/>
                                        <div className='launchpad-kyc-audit'>
                                            <div className='row p-2'>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>How to Participate a Presale on CrypterSale: <a className='text-primary'>https://www.youtube.com/watch?v=rtgNAQZSSs0</a></p>
                                                    <p>1. Go to the following link: <a className='text-primary'>https://www.cryptersale.finance/#/launchpad</a> - All Launchpads.</p>
                                                    <p>2. There are 3 types of presale statuses: Upcoming, Live Sale, Sale Ended. You only can buy a presale with the “Live Sale” status. For example, “BlackCrypter” presale is live at the moment. Hover over it and click on “View Pool”.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={launchpad} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>3. After clicking on “View Pool”, you can see all the information related to that presale. You should check everything carefully before buying.</p>
                                                    <p>4. To buy the presale, insert the amount of BNB (or FTM, MATIC or ETH, depending on the pool) that you want to use to buy in the “Amount” section. The corresponding amount of presale tokens will be calculated automatically below the BNB amount. Finally, click on the “Buy” button.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={viewPool} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>5. MetaMask will now ask you to confirm the transaction. It will also show you the fee that you are required to pay for that transaction. If you agree, then click on the “Confirm” button to finish the process.</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={confirmMeta} /></p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1'>
                                                    <p>6. After buying, you will see the changes in the “Amount” and “Your purchase” sections. For this pool, the maximum buy is 3 BNB, I purchased 0.1 BNB so the amount has changed to 2.9 BNB (= 3 – 0.1).</p>
                                                </div>
                                                <div className='col-12 mt-0 mb-1 text-center'>
                                                    <p><img className='img-fluid' src={presaleEnd} /></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='launchpad-token-footer'>
                                        <div className='row'></div>
                                    </div>
                                    <div className='row mt-2 mb-2'>
                                        <div className='col-lg-6'>
                                            <a href='/documents/presale-vesting-guide' className='onPreviewskycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p><small className='ms-4'>Previous</small></p>
                                                <p className='kyc-previews'>
                                                <i className='bi-arrow-left bi-arrow-left-previews-style'></i><strong><large className='ms-2'>Presale Vesting Guide</large></strong></p>
                                            </div>
                                            </a>
                                        </div>
                                        <div className='col-lg-6 mt-2'>
                                            <a href='/documents/how-to-claim-tokens' className='onNextkycaudit text-dark'>
                                                <div className='launchpad-token-body-kyc-audit'>
                                                <p className='text-end'><small className='me-4'>Next</small></p>
                                                <p className='kyc-previews text-end'>
                                                <strong><large className='ms-2'>How to Claim Tokens</large></strong>
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
