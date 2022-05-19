// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {setStatus, unsetCustomStatus} from 'mattermost-redux/actions/users';
import {Client4} from 'mattermost-redux/client';

import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';


import {makeGetCustomStatus, isCustomStatusEnabled, showStatusDropdownPulsatingDot, isCustomStatusExpired} from 'selectors/views/custom_status';
import {isStatusDropdownOpen} from 'selectors/views/status_dropdown';
import {GlobalState} from 'types/store';

import RightSideView from './right_side_view'

function makeMapStateToProps() {
    const getCustomStatus = makeGetCustomStatus();

    return function mapStateToProps(state: GlobalState) {
        const currentUser = getCurrentUser(state);
        const socialCount = Client4.getSocialCount(currentUser.id);
        const getPostList = Client4.getPosts('kqe4sihhdid47gprhk6dwbuc4o');
        //const getPostList = Client4.getPosts('dodurztr1fbupnpenjgxqjso3a');
        const userId = currentUser?.id;
        return {
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            socialCount,
            getPostList,
            currentUser,
        };
    };
}


export default connect(makeMapStateToProps)(RightSideView);
