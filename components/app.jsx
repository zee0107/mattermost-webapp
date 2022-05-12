// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {hot} from 'react-hot-loader/root';
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/src/jquery';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap.bundle.min.js';
import '../scripts';
import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route} from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";

import {browserHistory} from 'utils/browser_history';
import store from 'stores/redux_store.jsx';

import {makeAsyncComponent} from 'components/async_load';

import CRTPostsChannelResetWatcher from 'components/threading/channel_threads/posts_channel_reset_watcher';
const LazyRoot = React.lazy(() => import('components/root'));

const Root = makeAsyncComponent('Root', LazyRoot);

class App extends React.PureComponent {
    importScript = () =>{
        const externalJS = "https://cryptowidgets.blocksera.com/js/script";
        const script = document.createElement("script");
        script.src = externalJS;
        document.body.appendChild(script);
    }

    getLibrary(provider) {
        return new Web3Provider(provider);
    }

    render() {
        return (
            <Provider store={store}>
                <Web3ReactProvider getLibrary={this.getLibrary}>
                    {this.importScript()}
                    <CRTPostsChannelResetWatcher/>
                    <Router history={browserHistory}>
                        <Route
                            path='/'
                            component={Root}
                        />
                    </Router>
                </Web3ReactProvider>
            </Provider>);
    }
}

export default hot(App);
