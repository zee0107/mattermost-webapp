// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {ActionFunc} from 'mattermost-redux/types/actions';
import {UserCustomStatus, UserProfile, UserStatus} from 'mattermost-redux/types/users';
import { ProjectList } from 'mattermost-redux/types/crypto';
import CurrencyIcons from 'components/currency_icons';

import chart from 'images/launchpad/viewpool/pie-chart.png';
import fb from 'images/launchpad/viewpool/icon-smm-facebook.png';
import twitter from 'images/launchpad/viewpool/icon-smm-twitter.png';
import instagram from 'images/launchpad/viewpool/icon-smm-instagram.png';
import global from 'images/launchpad/viewpool/icon-global2.png';
import share from 'images/launchpad/viewpool/icon-arrow-submit.png';

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
    project: Promise<ProjectList>;
}

type State = {
    openUp: boolean;
    width: number;
    isStatusSet: boolean;
    isDark: string;
    img_path: string;
    project: ProjectList;
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

        if(this.props.project !== undefined && this.props.project !== null){
            Promise.resolve(this.props.project).then(value => { this.setState({project: value}); });
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

        return (
            <div className='row'>
                <div className='col-3 p-0'><div className='d-grid p-2'><a className='onLockbuttonumbers text-center'><label>{days.toString().padStart(2,"0")}</label></a></div></div>
                <div className='col-3 p-0'><div className='d-grid p-2'><a className='onLockbuttonumbers text-center'><label>{hours.toString().padStart(2,"0")}</label></a></div></div>
                <div className='col-3 p-0'><div className='d-grid p-2'><a className='onLockbuttonumbers text-center'><label>{minutes.toString().padStart(2,"0")}</label></a></div></div>
                <div className='col-3 p-0'><div className='d-grid p-2'><a className='onLockbuttonumbers text-center'><label>{parseFloat(seconds.toString().padStart(2,"0")).toFixed(0)}</label></a></div></div>
            </div>
        );
    } 

    render= (): JSX.Element => {
        const { project } = this.state;
        
        let statusBoxDesktop;
        let statusBoxMobile;
        let projectName;
        let projectDesc;
        let projectImg;
        let tokenName;
        let tokenSymbol;
        let timeRender;
        let rangeRender;
        if(project !== undefined && project !== null && project !== ''){
            console.log(project.coin.symbol);
            if(project.status === 'UPCOMING'){
                statusBoxDesktop = (
                    <a className='float-end onSaleUpcoming'><i className='bi-dot bi-dot-sale-live'></i> Upcoming</a>
                ); 
                statusBoxMobile = (
                    <a className='float-end onSaleUpcomingmobile'><i className='bi-dot bi-dot-sale-live'></i> Upcoming</a>
                );
                timeRender = this.renderTime(project.start_date)
            }
            else if(project.status === 'ENDED'){
                statusBoxDesktop = (
                    <a className='float-end onSaleEnded'><i className='bi-dot bi-dot-sale-live'></i> Sale Ended</a>
                ); 
                statusBoxMobile = (
                    <a className='float-end onSaleEndedmobile'><i className='bi-dot bi-dot-sale-live'></i>Sale Ended</a>
                );
            }
            else{
                statusBoxDesktop = (
                    <a className='float-end onSalelive'><i className='bi-dot bi-dot-sale-live'></i> Sale live</a>
                ); 
                statusBoxMobile = (
                    <a className='float-end onSalelivemobile'><i className='bi-dot bi-dot-sale-live'></i>Sale live</a>
                );
                timeRender = this.renderTime(project.end_date)
            }

            projectName = project.project_name;
            projectDesc = project.description;
            projectImg = (<CurrencyIcons code={project.coin.symbol} size="sm" />);
            tokenName = project.coin.name;
            tokenSymbol = project.coin.symbol;
            rangeRender = (
                <>
                    <div className='col-6 mt-2'><label className='ml-3 text-muted'>1 {project.coin.symbol}</label></div>
                    <div className='col-6 mt-2'><label className='float-end me-3 text-muted'>{project.total_prize} {project.coin.symbol}</label></div>
                </>
            )
        }

        
        
        return (
            <>
                <section id='crypter-section' className='crypter-section-desktop'>
                    <div className='row'>
                        <div className='col-md-9'>
                            <div className='launchpad-view-pool-body mt-2'>
                                <div className='row'>
                                    <div className='col-1 text-center'>
                                        {projectImg}
                                        {/*<img className='rounded-circle border-info mt-2' width='40' src='assets/images/sample-user-primary-picture-7.png'/>*/}
                                    </div>
                                    <div className='col-6 text-start'>
                                        <label className='ml-2'>{projectName}</label>
                                        <br/>
                                        <img width='17' className='float-start ml-2 mt-2' src={global} alt=''/>
                                        <img width='17' className='float-start ml-2 mt-2' src={fb} alt=''/>
                                        <img width='17' className='float-start ml-2 mt-2' src={twitter} alt=''/>
                                        <img width='17' className='float-start ml-2 mt-2' src={share} alt=''/>
                                        <img width='17' className='float-start ml-2 mt-2' src={instagram} alt=''/>
                                    </div>
                                    <div className='col-5'>
                                        {statusBoxDesktop}
                                        <a className='float-end onAudit'>Audit</a>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='col-1'></div>
                                    <div className='col-11'>
                                        <p className='ml-2'>{projectDesc}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='launchpad-view-pool-body mt-2 mb-2'>
                                <div className='row'>
                                    <div className='col-4 mt-1 mb-1'><strong><label>Presale Address</label></strong></div>
                                    <div className='col-8 text-end mt-1 mb-1'><strong className='text-success'><label>0x04f7794FeF90E83d195CaEdF810e9632bf6</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Token Name</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><label>{tokenName}</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Token Symbol</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><label>{tokenSymbol}</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Token Decimal</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><label>18</label></strong></div>

                                    <div className='col-4 mt-1'><strong><label>Token Address</label></strong></div>
                                    <div className='col-8 text-end mt-1'><strong className='text-success'><label>0x04f7794FeF90E83d195CaEdF810e9632bf6</label></strong></div>

                                    <div className='col-6'><strong><label></label></strong></div>
                                    <div className='col-6 text-end'><label>(Do not send BNB to the token address)</label></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Total Supply</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>100,000,000,000 NFTF</label></strong></div>

                                    <div className='col-6'><strong><label>Tokens For Presale</label></strong></div>
                                    <div className='col-6 text-end'><strong className=''><label>30,000,000,000 NFTF</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Tokens For Liquidity</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>19,500,000,000 NFTF</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Presale Rate</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>1 BNB = 60,000,000,000 NFTF</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Listing Rate</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>1 BNB = 60,000,000,000 NFTF</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Initial Market Cap (estimate)</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>$322,291</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Soft Cap</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>250 BNB</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Hard Cap</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>500 BNB</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Unsold Tokens</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>Burn</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Presale Start Time</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>2022.01.29 13:00 (UTC)</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Presale End Time</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>2022.01.29 13:00 (UTC)</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Listing On</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className='text-success'><label>Pancakeswap</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Liquidity Percent</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>65%</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Liquidity Lockup Time</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>730 days after pool ends</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Total Team Vesting Tokens</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>15,000,000,000 NFTF</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>First Release After Listing (days)</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>14 days</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>First Release AFor Team</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>20%</label></strong></div>

                                    <div className='col-6 mt-1 mb-1'><strong><label>Tokens Release each cycle</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong className=''><label>20% each 30 day</label></strong></div>
                                    <br/>
                                    <br/>
                                    <hr/>

                                    <div className='col-6'><strong><label>Team Vesting info (Estimate from end time)</label></strong></div>
                                    <div className='col-6 text-end'>

                                        <a className='onTokenreleasearrowdown' data-bs-toggle='collapse' href='#collapseTokensrelease' role='button' aria-expanded='true' aria-controls='collapseTokensrelease'><i className='bi-arrow-up-circle-fill'></i></a>
                                        <a className='onTokenreleasearrowup' data-bs-toggle='collapse' href='#collapseTokensrelease' role='button' aria-expanded='true' aria-controls='collapseTokensrelease'><i className='bi-arrow-down-circle-fill'></i></a>

                                    </div>

                                    <div className='col-12'>
                                        <div className='collapse show' id='collapseTokensrelease'>
                                            <div className='row'>
                                                <div className='col-4 text-center'><strong><label>Unlock #</label></strong></div>
                                                <div className='col-4 text-center'><strong><label>Time (UTC)</label></strong></div>
                                                <div className='col-4 text-center'><strong><label>Unlocked Tokens</label></strong></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><label>1</label></strong></div>
                                                <div className='col-4 text-center'><label>2022.02.16 13:00</label></div>
                                                <div className='col-4 text-center'><label>3,000,000 (20%)</label></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><label>2</label></strong></div>
                                                <div className='col-4 text-center'><label>2022.02.16 13:00</label></div>
                                                <div className='col-4 text-center'><label>3,000,000 (20%)</label></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><label>3</label></strong></div>
                                                <div className='col-4 text-center'><label>2022.02.16 13:00</label></div>
                                                <div className='col-4 text-center'><label>3,000,000 (20%)</label></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><label>4</label></strong></div>
                                                <div className='col-4 text-center'><label>2022.02.16 13:00</label></div>
                                                <div className='col-4 text-center'><label>3,000,000 (20%)</label></div>
                                                </div>
                                                <div className='row mt-2'>
                                                <div className='col-4 text-center'><strong><label>5</label></strong></div>
                                                <div className='col-4 text-center'><label>2022.02.16 13:00</label></div>
                                                <div className='col-4 text-center'><label>3,000,000 (20%)</label></div>
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
                                <strong><label>Tokens Matrics</label></strong>
                                <hr/>
                                <div className='row mt-4 mb-3'>
                                    <div className='col-6 text-center'><img width='60%' src={chart} alt=''/></div>
                                    <div className='col-6'>
                                        <div className='col-lg-12'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-presale'></i> Presale</a>
                                            <a className='float-end text-percent-presale'>30%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-liquidity'></i> Liquidity</a>
                                            <a className='float-end text-percent-liquidity'>40%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-team-vesting'></i> Team Vesting</a>
                                            <a className='float-end text-percent-team-vesting'>20%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-locked'></i> Locked</a>
                                            <a className='float-end text-percent-locked'>10%</a>
                                        </div>
                                        <br/>

                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-unlocked'></i> UnLocked</a>
                                            <a className='float-end text-percent-unlocked'>0%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-burnt'></i> Burnt</a>
                                            <a className='float-end text-percent-burnt'>0%</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-11 mx-auto text-center mt-4 mb-4'>
                                    <label>Disclaimer: The information provided shall not in any way constitute a recommendation as to whether you should invest in any product discussed. We accept no liability for any loss occasioned to any person acting or refraining from action as a result of any material provided or published.</label>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className='position-sticky float-right-panel'>
                                <div className='box-right-panel'>
                                    <div className='row'>
                                        <label className='text-center'>Presale Ends In</label>
                                    </div>
                                    {timeRender}
                                    {/*<div className='row'>
                                        <div className='col-3 p-0'><div className='d-grid p-2'><a className='onLockbuttonumbers text-center'><label>327</label></a></div></div>
                                        <div className='col-3 p-0'><div className='d-grid p-2'><a className='onLockbuttonumbers text-center'><label>28</label></a></div></div>
                                        <div className='col-3 p-0'><div className='d-grid p-2'><a className='onLockbuttonumbers text-center'><label>268</label></a></div></div>
                                        <div className='col-3 p-0'><div className='d-grid p-2'><a className='onLockbuttonumbers text-center'><label>15</label></a></div></div>
                                    </div>*/}

                                    <div className='row'>
                                        <div className='col-11 mx-auto'>
                                            <div className='progress mt-2'>
                                                <div className='progress-bar progress-bar-striped progress-bar-animated w-75' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div>
                                            </div>
                                        </div>
                                        {rangeRender}
                                        {/*<div className='col-6 mt-2'><label className='ml-3 text-muted'>11.915311 BNB</label></div>
                                        <div className='col-6 mt-2'><label className='float-end me-3 text-muted'>500 BNB</label></div>*/}
                                    </div>

                                    <div className='row mt-2'>
                                        <form>
                                            <div className='row'>

                                            <div className='col-12'>
                                                <label htmlFor='formGroupExampleInput' className='form-label'><label>* Amount (max: 2.9 BNB)</label></label>
                                                <div className='input-group mb-2'>
                                                <input type='text' className='form-control input-create-new-group-amount-max' placeholder='' aria-label='' aria-describedby=''/>
                                                <span className='input-group-text input-create-new-group-amount-max text-success' id=''>MAX</span>
                                                </div>
                                            </div>

                                            <div className='col-12 text-center'>
                                                <a className='onBuyamounts mt-2'><label>BUY</label></a>
                                            </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className='launchpad-view-pool-body mt-2 mb-2'>
                                    <div className='row'>
                                        <div className='col-3 mt-1 mb-1'><strong><label>Status</label></strong></div>
                                        <div className='col-9 text-end mt-1 mb-1'><strong className='text-success'><label>Inprogress</label></strong></div>

                                        <div className='col-6 mt-1 mb-1'><strong><label>Minimum Buy</label></strong></div>
                                        <div className='col-6 text-end mt-1 mb-1'><strong><label>0.1 BNB</label></strong></div>

                                        <div className='col-6 mt-1 mb-1'><strong><label>Maximum Buy</label></strong></div>
                                        <div className='col-6 text-end mt-1 mb-1'><strong><label>3 BNB</label></strong></div>

                                        <div className='col-9 mt-1 mb-1'><strong><label>Your purchased</label></strong></div>
                                        <div className='col-3 text-end mt-1 mb-1'><strong><label>0 BNB</label></strong></div>
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
                                            {projectImg}
                                        </div>
                                        <div className='col-6 text-start'>
                                            <label className='ml-4'>{projectName}</label>
                                            <br/>
                                            <img width='17' className='float-start ml-4 mt-2' src={global} alt=''/>
                                            <img width='17' className='float-start ml-2 mt-2' src={fb} alt=''/>
                                            <img width='17' className='float-start ml-2 mt-2' src={twitter} alt=''/>
                                            <img width='17' className='float-start ml-2 mt-2' src={share} alt=''/>
                                            <img width='17' className='float-start ml-2 mt-2' src={instagram} alt=''/>
                                        </div>
                                        <div className='col-5'>
                                            <a className='float-end onAuditmobile'>Audit</a>
                                            {statusBoxMobile}
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <p>{projectDesc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='box-right-panel'>
                                <div className='row'>
                                    <label className='text-center'>Presale Ends In</label>
                                </div>

                                {timeRender}

                                <div className='row'>
                                    <div className='col-11 mx-auto'>
                                        <div className='progress mt-1'>
                                            <div className='progress-bar progress-bar-striped progress-bar-animated w-75' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div>
                                        </div>
                                    </div>
                                    {rangeRender}
                                </div>

                                <div className='row mt-2'>
                                    <form>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <label htmlFor='formGroupExampleInput' className='form-label'><label>* Amount (max: 2.9 BNB)</label></label>
                                                <div className='input-group mb-2'>
                                                    <input type='text' className='form-control input-create-new-group-amount-max' placeholder='' aria-label='' aria-describedby=''/>
                                                    <span className='input-group-text input-create-new-group-amount-max' id=''>MAX</span>
                                                </div>
                                            </div>
                                            <div className='col-12 text-center'>
                                                <a className='onBuyamounts mt-2'><label>BUY</label></a>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className='launchpad-view-pool-body mt-2 mb-2'>
                                <div className='row'>
                                    <div className='col-3 mt-1 mb-1'><strong><label>Status</label></strong></div>
                                    <div className='col-9 text-end mt-1 mb-1'><strong className='text-success'><label>Inprogress</label></strong></div>
                                    <div className='col-6 mt-1 mb-1'><strong><label>Minimum Buy</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><label>0.1 BNB</label></strong></div>
                                    <div className='col-6 mt-1 mb-1'><strong><label>Maximum Buy</label></strong></div>
                                    <div className='col-6 text-end mt-1 mb-1'><strong><label>3 BNB</label></strong></div>
                                    <div className='col-9 mt-1 mb-1'><strong><label>Your purchased</label></strong></div>
                                    <div className='col-3 text-end mt-1 mb-1'><strong><label>0 BNB</label></strong></div>
                                </div>
                            </div>
                            <div className='launchpad-view-pool-body-mobile mt-2 mb-2'>
                                <div className='row'>
                                    <div className='col-lg-3 mt-1 mb-1'><strong className='text-muted'><label>Presale Address</label></strong></div>
                                    <div className='col-lg-9 text-start mt-1 mb-1'><strong className='text-success'><label>0x04f7794FeF90E83d1...</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Token Name</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>{tokenName}</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Token Symbol</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>{tokenSymbol}</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Token Decimal</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>18</label></strong></div>

                                    <div className='col-lg-3 mt-1 mb-1'><strong className='text-muted'><label>Token Address</label></strong></div>
                                    <div className='col-lg-9 text-start mt-1 mb-1'><strong className='text-success'><label>0x04f7794FeF90E83d1...</label></strong></div>

                                    <div className='col-lg-6'><strong><label></label></strong></div>
                                    <div className='col-lg-6 text-start'><label>(Do not send BNB to the token address)</label></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Total Supply</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>100,000,000,000 NFTF</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Tokens For Presale</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>30,000,000,000 NFTF</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong><label>Tokens For Liquidity</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>19,500,000,000 NFTF</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Presale Rate</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>1 BNB = 60,000,000,000 NFTF</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Listing Rate</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>1 BNB = 60,000,000,000 NFTF</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Initial Market Cap (estimate)</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>$322,291</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Soft Cap</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>250 BNB</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Hard Cap</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>500 BNB</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Unsold Tokens</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>Burn</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Presale Start Time</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>2022.01.29 13:00 (UTC)</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Presale End Time</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>2022.01.29 13:00 (UTC)</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Listing On</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>Pancakeswap</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Liquidity Percent</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>65%</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Liquidity Lockup Time</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>730 days after pool ends</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Total Team Vesting Tokens</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>15,000,000,000 NFTF</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>First Release After Listing (days)</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>14 days</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>First Release AFor Team</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>20%</label></strong></div>

                                    <div className='col-lg-6 mt-1 mb-1'><strong className='text-muted'><label>Tokens Release each cycle</label></strong></div>
                                    <div className='col-lg-6 text-start mt-1 mb-1'><strong><label>20% each 30 day</label></strong></div>
                                </div>
                            </div>
                            <div className='row p-2'>
                                <div className='col-10'><strong><label>Team Vesting info (Estimate from end time)</label></strong></div>
                                <div className='col-2 text-end'>
                                    <a className='onTokenreleasearrowdown' data-bs-toggle='collapse' href='#collapseTokensreleasemobile' role='button' aria-expanded='true' aria-controls='collapseTokensreleasemobile'><i className='bi-arrow-up-circle-fill'></i></a>
                                    <a className='onTokenreleasearrowup' data-bs-toggle='collapse' href='#collapseTokensreleasemobile' role='button' aria-expanded='true' aria-controls='collapseTokensreleasemobile'><i className='bi-arrow-down-circle-fill'></i></a>
                                </div>
                            </div>
                            <div className='collapse show' id='collapseTokensreleasemobile'>
                                <div className='launchpad-team-vesting-body-mobile mt-2 mb-2'>
                                    <div className='row'>
                                        <div className='col-6'><label className='text-muted mt-0'>Unlock #</label></div>
                                        <div className='col-6'><label className='mt-0'><strong>1</strong></label></div>

                                        <div className='col-6'><label className='text-muted mt-0'>Unlocked tokens</label></div>
                                        <div className='col-6'><label className='mt-0'><strong>3,000,000,000 (20%)</strong></label></div>

                                        <div className='col-6'><label className='text-muted mt-0'>Time (UTC)</label></div>
                                        <div className='col-6'><label className='mt-0'><strong>2022.02.16 13:00</strong></label></div>
                                    </div>
                                </div>

                                <div className='launchpad-team-vesting-body-mobile mt-2 mb-2'>
                                    <div className='row'>
                                        <div className='col-6'><label className='text-muted mt-0'>Unlock #</label></div>
                                        <div className='col-6'><label className='mt-0'><strong>1</strong></label></div>

                                        <div className='col-6'><label className='text-muted mt-0'>Unlocked tokens</label></div>
                                        <div className='col-6'><label className='mt-0'><strong>3,000,000,000 (20%)</strong></label></div>

                                        <div className='col-6'><label className='text-muted mt-0'>Time (UTC)</label></div>
                                        <div className='col-6'><label className='mt-0'><strong>2022.02.16 13:00</strong></label></div>
                                    </div>
                                </div>

                                <div className='launchpad-team-vesting-body-mobile mt-2 mb-2'>
                                    <div className='row'>
                                        <div className='col-6'><label className='text-muted mt-0'>Unlock #</label></div>
                                        <div className='col-6'><label className='mt-0'><strong>3</strong></label></div>

                                        <div className='col-6'><label className='text-muted mt-0'>Unlocked tokens</label></div>
                                        <div className='col-6'><label className='mt-0'><strong>3,000,000,000 (20%)</strong></label></div>

                                        <div className='col-6'><label className='text-muted mt-0'>Time (UTC)</label></div>
                                        <div className='col-6'><label className='mt-0'><strong>2022.02.16 13:00</strong></label></div>
                                    </div>
                                </div>
                                
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

                            <div className='launchpad-view-pool-body mt-2 mb-2'>
                                <strong><label>Tokens Matrics</label></strong>
                                <hr/>
                                <div className='row mt-4 mb-3'>
                                    <div className='col-lg-5 text-center'><img width='60%' src={chart} alt='' /></div>
                                    <div className='col-lg-7'>
                                        <div className='col-lg-12 text-dark'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-presale'></i> Presale</a>
                                            <a className='float-end text-percent-presale'>30%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-liquidity'></i> Liquidity</a>
                                            <a className='float-end text-percent-liquidity'>40%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-team-vesting'></i> Team Vesting</a>
                                            <a className='float-end text-percent-team-vesting'>20%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-locked'></i> Locked</a>
                                            <a className='float-end text-percent-locked'>10%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-unlocked'></i> UnLocked</a>
                                            <a className='float-end text-percent-unlocked'>0%</a>
                                        </div>
                                        <br/>
                                        <div className='col-lg-12 mt-5'>
                                            <a className='float-start text-dark'><i className='bi-dot bi-dot-style-burnt'></i> Burnt</a>
                                            <a className='float-end text-percent-burnt'>0%</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-11 mx-auto text-center mt-4 mb-4'>
                                    <label>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }
}
