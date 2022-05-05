import { toHex } from './wallet_utils';
const polygon = toHex("137");
const mumbai = toHex("80001");
export const networkParams = {
    "0x63564c40": {
      chainId: "0x63564c40",
      rpcUrls: ["https://api.harmony.one"],
      chainName: "Harmony Mainnet",
      nativeCurrency: { name: "ONE", decimals: 18, symbol: "ONE" },
      blockExplorerUrls: ["https://explorer.harmony.one"],
      iconUrls: ["https://harmonynews.one/wp-content/uploads/2019/11/slfdjs.png"]
    },
    "0xa4ec": {
      chainId: "0xa4ec",
      rpcUrls: ["https://forno.celo.org"],
      chainName: "Celo Mainnet",
      nativeCurrency: { name: "CELO", decimals: 18, symbol: "CELO" },
      blockExplorerUrl: ["https://explorer.celo.org"],
      iconUrls: [
        "https://celo.org/images/marketplace-icons/icon-celo-CELO-color-f.svg"
      ]
    },
    polygon: {
      chainId: polygon,
      rpcUrls: ["https://polygon-rpc.com/"],
      chainName: "Matic(Polygon)",
      nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
      blockExplorerUrl: ["https://polygonscan.com/"],
      iconUrls: [
        "https://polygonscan.com/images/svg/brands/polygon.svg"
      ]
    }
    ,
    mumbai: {
      chainId: mumbai,
      rpcUrls: ["https://rpc-mumbai.matic.today"],
      chainName: "Matic Mumbai",
      nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
      blockExplorerUrl: ["https://explorer-mumbai.maticvigil.com/"],
      iconUrls: [
        "https://polygonscan.com/images/svg/brands/polygon.svg"
      ]
    }
  };
  