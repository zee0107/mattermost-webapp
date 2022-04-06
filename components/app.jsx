// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {hot} from 'react-hot-loader/root';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/src/jquery';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import React from 'react';
import '../scripts.js';
import {Provider} from 'react-redux';
import {Router, Route} from 'react-router-dom';

import {browserHistory} from 'utils/browser_history';
import store from 'stores/redux_store.jsx';

import {makeAsyncComponent} from 'components/async_load';

import CRTPostsChannelResetWatcher from 'components/threading/channel_threads/posts_channel_reset_watcher';
const LazyRoot = React.lazy(() => import('components/root'));

const Root = makeAsyncComponent('Root', LazyRoot);

class App extends React.PureComponent {
    render() {
        return (
            <Provider store={store}>
                <CRTPostsChannelResetWatcher/>
                <Router history={browserHistory}>
                    <Route
                        path='/'
                        component={Root}
                    />
                </Router>
            </Provider>);
    }
}

export default hot(App);
