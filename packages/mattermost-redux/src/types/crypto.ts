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

export type Story = {
    id: string;
    user_id: string;
    uploaded_file: string;
    text: string;
    bg_color: string;
    text_color:string;
    type: string;
    privacy: string;
    data_posted: string;
    date_expiry: string;
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

export type MutedList = {
    id: string;
    user_id: string;
    friend_id: string;
    date: string;
}

export type UserSettings = {
    user_id: string;
    story_privacy: string;
    story_archive: boolean;
    dark_mode: boolean;
}

export type UploadBlob = {
    blob: string;
    type: string;
    name: string;
}

export type Album = {
    id: string;
    user_id: string;
    album_name: string;
    files_names: string;
    privacy: string;
    img_count: number;
    date: string;
}

export type Thread = {
    forum_id: string;
    user_id: string;
}

export type Comment = {
    commentID: string;
    userId: string;
}

export type ForumTopic = {
    id: string;
    post_user: string;
    post_title: string;
    post_text: string;
    view_count: number;
    like_count: number;
    dislike_count: number;
    date_posted: string;
}

export type ForumReply = {
    id: string;
    forum_id: string;
    post_user: string;
    comment: string;
    date_posted: string;
}