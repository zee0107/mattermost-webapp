// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';

import {isDesktopApp} from 'utils/user_agent';

import HistoryButtons from './history_buttons';
import ProductMenu from './product_menu';
import Logo from 'images/logoLight.png';

const LeftControlsContainer = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
    flex-shrink: 0;
    margin-left: 20%;
    > * + * {
        margin-left: 12px;
    }
`;

const LeftControlsStyle = (): JSX.Element => (
    <LeftControlsContainer>
        <a href='/'><img src={Logo} className='logo-width-nav' alt='Crypter.io' /></a>
        {/*<ProductMenu/>
        {isDesktopApp() && <HistoryButtons/>}*/}
    </LeftControlsContainer>
);

export default LeftControlsStyle;
