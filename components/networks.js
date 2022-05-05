import { toHex } from './wallet_utils';
const polygon = toHex('137');
const mumbai = toHex('80001');
const bnbMAin = toHex('56');
const bnbTest = toHex('97');
const kuCoin = toHex('321');
const avax = toHex('43114');
const fantom = toHex('250');
const cronos = toHex('25');

export const networkParams = {
    '0x63564c40': {
      chainId: '0x63564c40',
      rpcUrls: ['https://api.harmony.one'],
      chainName: 'Harmony Mainnet',
      nativeCurrency: { name: 'ONE', decimals: 18, symbol: 'ONE' },
      blockExplorerUrls: ['https://explorer.harmony.one'],
      iconUrls: ['https://harmonynews.one/wp-content/uploads/2019/11/slfdjs.png']
    },
    '0xa4ec': {
      chainId: '0xa4ec',
      rpcUrls: ['https://forno.celo.org'],
      chainName: 'Celo Mainnet',
      nativeCurrency: { name: 'CELO', decimals: 18, symbol: 'CELO' },
      blockExplorerUrl: ['https://explorer.celo.org'],
      iconUrls: [
        'https://celo.org/images/marketplace-icons/icon-celo-CELO-color-f.svg'
      ]
    },
    polygon: {
      chainId: polygon,
      rpcUrls: ['https://polygon-rpc.com/'],
      chainName: 'Matic(Polygon)',
      nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
      blockExplorerUrl: ['https://polygonscan.com/'],
      iconUrls: [
        'https://polygonscan.com/images/svg/brands/polygon.svg'
      ]
    },
    mumbai: {
      chainId: mumbai,
      rpcUrls: ['https://rpc-mumbai.matic.today'],
      chainName: 'Matic Mumbai',
      nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
      blockExplorerUrl: ['https://explorer-mumbai.maticvigil.com/'],
      iconUrls: [
        'https://polygonscan.com/images/svg/brands/polygon.svg'
      ]
    },
    bnbMAin: {
      chainId: bnbMAin,
      rpcUrls: ['https://bsc-dataseed1.ninicoin.io'],
      chainName: 'BNB Smart Chain',
      nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
      blockExplorerUrl: ['https://bscscan.com'],
      iconUrls: [
        'https://bscscan.com/images/svg/brands/bnb-1.svg?v=1.3'
      ]
    },
    bnbTest: {
      chainId: bnbTest,
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
      chainName: 'BNB Smart Chain',
      nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
      blockExplorerUrl: ['https://testnet.bscscan.com'],
      iconUrls: [
        'https://testnet.bscscan.com/images/svg/brands/bnb-1.svg?v=1.3'
      ]
    },
    kuCoin: {
      chainId: kuCoin,
      rpcUrls: ['https://rpc-mainnet.kcc.network'],
      chainName: 'KuCoin',
      nativeCurrency: { name: 'KCS', decimals: 18, symbol: 'KCS' },
      blockExplorerUrl: ['https://explorer.kcc.io/en'],
      iconUrls: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADj0lEQVR4XuWbu4vUUBSHVwXBJ2Ip62Nys1gsPjoFsVVr/wDR0kLQ2mZALFTcmWTdQrCYYquBmWRZFR+VYiV2NmqzighabqHYrOPJuHcm/nImycljXveDr0nu+Z2bOBvznJkZUyzPeaQ8pxPW9us3cNzUoVYWbNxw8CfWTA+dzhZmg1mxdPKpVrfiRiaJEcVBkwn+NXBxWSjPfYYbl1q/fgnzMkOBHyMNPOczjisSyl9jeoqkA+YS5oo4sPpwJ4ai9lN3L9blhXLXsU9WrbbzCvNTg2GDxLo8UN4G5hfgJ+yTCBU9YYIGuYb1WWByC9Py3KvYLxYMSBLrpWBeGdpevYZ9B4LFSWK9BKr/g3kl+hr7szCFsWJ9WjBnSH7DeURgimLF+iRUa/EMZgzb7nnNIHBwklgfB42/hvVS7ZY7a/nOFVwu9YhX24fz64IDk8T6QdDYBtZKnW8u7dZ5tCNO43qpc379VHiOXXBQkljPQaenb7BOKmYGWKvOIRwnFTML3wE05ivWSMXMMLRz7+J4qUdX7uzpBzID4gzNJQKdhFzH8VIxk4Muni5jndTg17QZFl0ZJ8ylh+07yzhWKmbGUWm7J7BeajcIFyYJ8+hCy9/jOKmYmYbgyI45Qt/m3gG4XqrtOS8wUwrl/MbctIo3oNe12dyG6+TWb4W2IxeU9yWan2ymHVBpPTiMy6VabfcibkRelO88xj5JineAajsXIsuEznm1kzj5osBecVZ896yooAhnmwv7cdJFQ32+Y1/GfxdKzIrybDs3Ya6lQf38SP++L8MDcWUp2n79fGh+6aCruOPP7+2iX82OrHepg6dJdLD9oYL7j3SMwPXD2QH+/YPYNw7LXzym+JsnGzg2N0yTIhVPmMmIaHvuOazLDIYX6Dr2SmK+Wd3O5LBibWYwuCDfYZ80UN0vJou37d7G+kxEgvPbwB5pYbLiFP95sTDBeW1gj7QwWXGO7Q4INPpPQGv0QVAr/pkyGREn5b/BvgafCPU0+1RYa/LFkHbyL4dNvyESNDH6llivm8k3RaFxZIzEyb0tHkKZ/GBEY/SjMY3RD0c1yuTH4xqjX5DQKJNfkdEok1+S0hj9mlwYzBmSo39RMozib3KU5Xi9KqvBvDKUvixt9uvyARgySKzLgxqXDyYCgvtuTNh/TvUnMxoK+oDByoSPpiKY+tncSBmrDydHhdGfzm5i9sfTIYb1+fxfsoeUcSUQ3cwAAAAASUVORK5CYII='
      ]
    },
    avax: {
      chainId: avax,
      rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
      chainName: 'KuCoin',
      nativeCurrency: { name: 'AVAX', decimals: 18, symbol: 'AVAX' },
      blockExplorerUrl: ['https://cchain.explorer.avax.network/'],
      iconUrls: [
        'https://snowtrace.io/images/svg/brands/mainbrand-1.svg?v=22.4.4.0'
      ]
    },
    fantom: {
      chainId: fantom,
      rpcUrls: ['https://rpc.ftm.tools'],
      chainName: 'KuCoin',
      nativeCurrency: { name: 'FTM', decimals: 18, symbol: 'FTM' },
      blockExplorerUrl: ['https://ftmscan.com'],
      iconUrls: [
        'https://ftmscan.com/images/svg/brands/fantom.svg?v=1.3'
      ]
    },
    cronos: {
      chainId: cronos,
      rpcUrls: ['https://evm-cronos.crypto.org'],
      chainName: 'KuCoin',
      nativeCurrency: { name: 'CRO', decimals: 18, symbol: 'CRO' },
      blockExplorerUrl: ['https://cronoscan.com'],
      iconUrls: [
        'https://cronoscan.com/images/svg/brands/mainbrand-1.svg?v=22.4.4.0'
      ]
    }
  };
  