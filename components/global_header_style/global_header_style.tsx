// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState, useEffect} from 'react';

import styled from 'styled-components';

import CenterControls from './center_controls/center_controls_style';
import LeftControls from './left_controls/left_controls_Style';
import RightControls from './right_controls/right_controls_style';

import {useCurrentProductId, useIsLoggedIn, useProducts,currentUser,defaultChannel, defaultTeam} from './hooks';
import { string } from 'yargs';
import async from 'react-select/async';
import { Client4 } from 'mattermost-redux/client';

const GlobalHeaderContainer = styled.header`
    position: fixed;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    background: var(--bgDiv);
    color: var(--text-primary);
    z-index: 100;
    width: 100%;

    > * + * {
        margin-left: 12px;
    }

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

async function getTeamId(){
    return (
        async () => {
            return await defaultTeam();
        }
    );
}

const GlobalHeaderStyle = (): JSX.Element | null => {
    const [teamId, setTeamId] = useState();
    const [channel, setChannel] = useState();

    userEffect (
        () => {
            async function getTeamId(){
                const data = await Client4.getTeamByName('crypter');
                return data.id;
            }

            async function getChannel(id){
                const data = await Client4.getChannelByName(id,'town-square');
                return data;
            }

            getTeamId().then((value) => { setTeamId(value) });
            getChannel(teamId).then((value) => { setChannel(value) });

        },[]);
    const isLoggedIn = useIsLoggedIn();
    const products = useProducts();
    const currentProductID = useCurrentProductId(products);
    const user = currentUser();

    if (!isLoggedIn) {
        return null;
    }
    return (
        <GlobalHeaderContainer id='global-header'>
            <LeftControls/>
            <CenterControls productId={currentProductID}/>
            <RightControls 
                    productId={currentProductID} 
                    currentUser={user}
                    channelId={channel.id}
            />
        </GlobalHeaderContainer>
    );
};

export default GlobalHeaderStyle;
