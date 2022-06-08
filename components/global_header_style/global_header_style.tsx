// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import styled from 'styled-components';

import CenterControls from './center_controls/center_controls_style';
import LeftControls from './left_controls/left_controls_Style';
import RightControls from './right_controls/right_controls_style';

import {useCurrentProductId, useIsLoggedIn, useProducts,currentUser,currentChannel} from './hooks';

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

const GlobalHeaderStyle = (): JSX.Element | null => {
    const isLoggedIn = useIsLoggedIn();
    const products = useProducts();
    const currentProductID = useCurrentProductId(products);
    const user = currentUser();
    const channel = currentChannel();

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
                //channelId={channel.id}
            />
        </GlobalHeaderContainer>
    );
};

export default GlobalHeaderStyle;
