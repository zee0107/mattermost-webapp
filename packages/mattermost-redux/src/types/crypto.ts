import { GroupedOptionsType } from 'react-select';
import {Audit} from './audits';
import {Channel} from './channels';
import {Group} from './groups';
import {PostType} from './posts';
import {Session} from './sessions';
import {Team} from './teams';
import {IDMappedObjects, RelationOneToMany, RelationOneToManyUnique, RelationOneToOne} from './utilities';

export type AllListing = {
    id: string,
    symbol: string,
    name: string,
    slug: string,
    cmc_rank: string,
    num_market_pairs: string,
    total_supply: string,
    last_updated: string,
    date_added: string,
    tags: string[],
    platform: string,
    price: string,
    volume_24h: string,
    volume_change_24h: string,
    percent_change_1h: string,
    percent_change_24h: string,
    percent_change_7d: string,
    market_cap: string,
    market_cap_dominance: string,
    fully_diluted_market_cap: string,
    last_updated_price: string,
    circulating_supply: string,
    max_supply: string,
}

export type GainerListing = {
    id: string,
    symbol: string,
    name: string,
    slug: string,
    cmc_rank: string,
    num_market_pairs: string,
    total_supply: string,
    last_updated: string,
    date_added: string,
    tags: string[],
    platform: string,
    price: string,
    volume_24h: string,
    volume_change_24h: string,
    percent_change_1h: string,
    percent_change_24h: string,
    percent_change_7d: string,
    market_cap: string,
    market_cap_dominance: string,
    fully_diluted_market_cap: string,
    last_updated_price: string,
    circulating_supply: string,
    max_supply: string,
}

export type TrendListing = {
    id: string,
    symbol: string,
    name: string,
    slug: string,
    cmc_rank: string,
    num_market_pairs: string,
    total_supply: string,
    last_updated: string,
    date_added: string,
    tags: string[],
    platform: string,
    price: string,
    volume_24h: string,
    volume_change_24h: string,
    percent_change_1h: string,
    percent_change_24h: string,
    percent_change_7d: string,
    market_cap: string,
    market_cap_dominance: string,
    fully_diluted_market_cap: string,
    last_updated_price: string,
    circulating_supply: string,
    max_supply: string,
}

export type NewListing = {
    id: string,
    symbol: string,
    name: string,
    slug: string,
    cmc_rank: string,
    num_market_pairs: string,
    total_supply: string,
    last_updated: string,
    date_added: string,
    tags: string[],
    platform: string,
    price: string,
    volume_24h: string,
    volume_change_24h: string,
    percent_change_1h: string,
    percent_change_24h: string,
    percent_change_7d: string,
    market_cap: string,
    market_cap_dominance: string,
    fully_diluted_market_cap: string,
    last_updated_price: string,
    circulating_supply: string,
    max_supply: string,
}

export type Coins = {
    id: string,
    name: string,
    slug: string,
    symbol: string,
}

export type ProjectList = {
    id: string,
    project_name: string,
    description: string,
    status: string,
    coin: Coins,
    start_date: string,
    end_date: string,
    total_prize: string,
    winner_count: string,
    link: string,
}

export type CoinsUpcoming = {
    id: string,
    name: string,
    slug: string,
    symbol: string,
}

export type ProjectsUpcomingList = {
    id: string,
    project_name: string,
    description: string,
    status: string,
    coin: CoinsUpcoming,
    start_date: string,
    end_date: string,
    total_prize: string,
    winner_count: string,
    link: string,
}

export type CoinsEnded = {
    id: string,
    name: string,
    slug: string,
    symbol: string,
}

export type ProjectsEndedList = {
    id: string,
    project_name: string,
    description: string,
    status: string,
    coin: CoinsEnded,
    start_date: string,
    end_date: string,
    total_prize: string,
    winner_count: string,
    link: string,
}

export type CoinsAll = {
    id: string,
    name: string,
    slug: string,
    symbol: string,
}

export type ProjectsAllList = {
    id: string,
    project_name: string,
    description: string,
    status: string,
    coin: CoinsAll,
    start_date: string,
    end_date: string,
    total_prize: string,
    winner_count: string,
    link: string,
}

export type RequestList = {
    id: string;
    user_id: string;
    friend_id: string;
    status: string;
    date_request: string;
    date_confirmed: string;
}

export type SocialCount = {
    followingCount: number;
    followersCount: number;
}