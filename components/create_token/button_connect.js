import { useWeb3React } from "@web3-react/core";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "../wallet_utils";

export default function ButtonConnect(){
    const {
        library,
        chainId,
        account,
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

    console.log(active);
    return (
        <>
            {!active ? (
                <a className='onLockbuttoncreate float-end mr-1' data-toggle='modal' data-target='#staticBackdropConnect'><small>Connect</small></a>
            ) : (
                <a onClick={disconnect} className='onLockbuttoncreate float-end mr-1' data-toggle='modal' data-target='#staticBackdropConnect'><small><i className='bi bi-person-fill'></i>{truncateAddress(account)}</small></a>
            )}
        </>
    );
}