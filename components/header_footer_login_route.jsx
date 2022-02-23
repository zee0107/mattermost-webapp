// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Route} from 'react-router-dom';
import CompassThemeProvider from 'components/compass_theme_provider/compass_theme_provider';
import GlobalHeader from 'components/global_header/global_header';

const HeaderFooterTemplate = React.lazy(() => import('components/header_footer_login'));
const LoggedIn = React.lazy(() => import('components/logged_in'));

export const HFTRouteLog = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={(props) => (
            <React.Suspense fallback={null}>
                <HeaderFooterTemplate {...props}>
                    <Component {...props}/>
                </HeaderFooterTemplate>
            </React.Suspense>
        )}
    />
);

export const LoginHFTRoute = ({component: Component, ...rest}) => (
    <CompassThemeProvider theme={this.props.theme}>
        <GlobalHeader />
         <Route
            {...rest}
            render={(props) => (
                <React.Suspense fallback={null}>
                    <LoggedIn {...props}>
                        <React.Suspense fallback={null}>
                            <HeaderFooterTemplate {...props}>
                                <Component {...props}/>
                            </HeaderFooterTemplate>
                        </React.Suspense>
                    </LoggedIn>
                </React.Suspense>
            )}
        />
    </CompassThemeProvider>
   
);
