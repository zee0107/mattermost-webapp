import { useWeb3React } from "@web3-react/core";
import { connectors } from "../connectors";

import MetamaskImg from 'images/launchpad/connect/Install-Metamask.svg';
import TrustwalletImg from 'images/launchpad/connect/trustwallet.eb75d105.svg';
import WalletConnectImg from 'images/launchpad/connect/walletconnect.dfa25e47.svg';
import CoinbaseImg from 'images/launchpad/connect/coinbase.069f6c82.png';
import SafepalImg from 'images/launchpad/connect/safepal.d0c33979.svg';
import TokenpocketImg from 'images/launchpad/connect/tokenpocket.png';
import MathwalletImg from 'images/launchpad/connect/math-wallet.png';

export default function SelectWalletModal(){
    const { activate } = useWeb3React();

    const setProvider = (type) => {
        window.localStorage.setItem("provider", type);
    };

    return (
        <>
            <div className='d-flex'>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => { activate(connectors.injected); setProvider("injected");}}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='19' src={MetamaskImg} alt=''/>
                    <p className='mt-3 text-white'>Metamask</p>
                    </div>
                </div>
                <div className='col-md-6 text-center' data-dismiss='modal'>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='19' src={TrustwalletImg} alt=''/>
                    <p className='mt-3 text-white'>TrustWallet</p>
                    </div>
                </div>
            </div>
            <div className='d-flex'>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => { activate(connectors.walletConnect); setProvider("walletConnect");}}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='19' src={WalletConnectImg} alt=''/>
                    <p className='mt-3 text-white'>WalletConnect</p>
                    </div>
                </div>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => { activate(connectors.coinbaseWallet); setProvider("coinbaseWallet");}}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='19' src={CoinbaseImg} alt=''/>
                    <p className='mt-3 text-white'>CoinsBase Wallet</p>
                    </div>
                </div>
            </div>
            <div className='d-flex'>
                <div className='col-md-6 text-center' data-dismiss='modal'>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='19' src={SafepalImg} alt=''/>
                    <p className='mt-3 text-white'>SafePal Wallet</p>
                    </div>
                </div>
                <div className='col-md-6 text-center' data-dismiss='modal'>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='19' src={TokenpocketImg} alt=''/>
                    <p className='mt-3 text-white'>TokenPocket</p>
                    </div>
                </div>
            </div>
            <div className='d-flex'>
                <div className='col-md-6 text-center' data-dismiss='modal'>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='19' src={MathwalletImg} alt=''/>
                    <p className='mt-3 text-white'>Math Wallet</p>
                    </div>
                </div>
                <div className='col-md-6 text-center'>
                </div>
            </div>
        </>
    );
}