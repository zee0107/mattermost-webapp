import React, { useEffect } from 'react';
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../connectors";
import { toHex, truncateAddress } from "../wallet_utils";

export default function ButtonConnect(props){
    props.account(account);
    const {
        library,
        chainId,
        account,
        getBalance,
        activate,
        deactivate,
        active
    } = useWeb3React();

    const refreshState = () => {
        window.localStorage.setItem("provider", undefined);
    };

    const disconnect = () => {
        refreshState();
        deactivate();
    };

    useEffect(() => {
        const provider = window.localStorage.getItem("provider");
        if (provider) {activate(connectors[provider]);}
      }, []);

    return (
        <>
            {!active ? (
                <a className='onLockbuttoncreate float-end mr-1' data-toggle='modal' data-target='#staticBackdropConnect'><small>Connect</small></a>
            ) : (
                <a onClick={disconnect} className='onLockbuttoncreate float-end mr-1'><small><i className='bi bi-person-fill' title={account}></i>{truncateAddress(account)}</small></a>
            )}
        </>
    );
}