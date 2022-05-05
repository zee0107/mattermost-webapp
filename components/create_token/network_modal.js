import React, { useState,useEffect} from 'react'; 
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../connectors";
import { toHex, truncateAddress } from "../wallet_utils";
import { networkParams } from "../networks";

import CronosImg from 'images/launchpad/network/ic-cronos.5a2dbab3.svg';
import FantomImg from 'images/launchpad/network/ic-fantom.306f76f9.svg';
import AvaxImg from 'images/launchpad/network/ic-avax.234db155.svg';
import KucoinImg from 'images/launchpad/network/KuCoin.png';
import MaticImg from 'images/launchpad/network/ic-matic.910e1faf.png';
import BscImg from 'images/launchpad/network/ic-bsc.419dfaf2.png';
import EthImg from 'images/launchpad/network/ic-eth.9270fc02.svg';

export default function NetworkModal (props){
    const {
        library,
        chainId,
        account,
        activate,
        deactivate,
        active
    } = useWeb3React();

    const [network, setNetwork] = useState(undefined);
    const [error, setError] = useState("");
    /*const handleNetwork = (e) => {
        const id = e.target.value;
        setNetwork(Number(id));
    };*/

    const switchNetwork = async (chainId: string) => {
        const id = chainId;
        setNetwork(Number(id));
        try {
          await library.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: toHex(network) }]
          });
          props.changeNetwork(id);
          window.localStorage.setItem('chainNetwork',id);
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
                await library.provider.request({
                    method: "wallet_addEthereumChain",
                    params: [networkParams[toHex(network)]]
                });
                props.changeNetwork(id);
                window.localStorage.setItem('chainNetwork',id);
            } catch (error) {
              setError(error);
            }
          }
        }
    };

    return(
        <>
            <div className='d-flex'>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() =>  switchNetwork('1')}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='40' src={EthImg} alt=''/>
                    <p className='mt-3 text-white'>Ethereum</p>
                    </div>
                </div>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => switchNetwork('56')}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='40' src={BscImg} alt=''/>
                    <p className='mt-3 text-white'>BNB Smart Chain</p>
                    </div>
                </div>
            </div>
            <div className='d-flex'>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => switchNetwork('137')}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='40' src={MaticImg} alt=''/>
                    <p className='mt-3 text-white'>Matic(Polygon)</p>
                    </div>
                </div>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => switchNetwork('321')}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='40' src={KucoinImg} alt=''/>
                    <p className='mt-3 text-white'>KuCoin</p>
                    </div>
                </div>
            </div>
            <div className='d-flex'>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => switchNetwork('43114')}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='40' src={AvaxImg} alt=''/>
                    <p className='mt-3 text-white'>Avalanche</p>
                    </div>
                </div>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => switchNetwork('250')}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='31' src={FantomImg} alt=''/>
                    <p className='mt-3 text-white'>Fantom Opera</p>
                    </div>
                </div>
            </div>
            <div className='d-flex'>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => switchNetwork('25')}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='40' src={CronosImg} alt=''/>
                    <p className='mt-3 text-white'>Cronos</p>
                    </div>
                </div>
                <div className='col-md-6 text-center'>
                </div>
            </div>
            <div className='row pl-5 mt-2 mb-2'>
            <small>TESTNET</small>
            </div>
            <div className='d-flex'>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => switchNetwork('97')}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='40' src={BscImg} alt=''/>
                    <p className='mt-3 text-white'>BNB Smart Chain</p>
                    </div>
                </div>
                <div className='col-md-6 text-center' data-dismiss='modal' onClick={() => switchNetwork('80001')}>
                    <div className='box-choose-network'>
                    <img className='img-fluid' width='40' src={MaticImg} alt=''/>
                    <p className='mt-3 text-white'>Matic Mumbai</p>
                    </div>
                </div>
            </div>
        </>
    );
}