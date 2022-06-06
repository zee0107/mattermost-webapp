// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import {Client4} from 'mattermost-redux/client';

import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {GlobalState} from 'types/store';

import RightSideView from './right_side_view'
import { getChannelByName } from 'mattermost-redux/utils/channel_utils';

function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState) {
        const currentUser = getCurrentUser(state);
        const socialCount = Client4.getSocialCount(currentUser.id);
        const channel = getChannelByName(state,'town-square');
        //Local Server
        const getPostList = Client4.getPosts('kqe4sihhdid47gprhk6dwbuc4o');

        //Live Server
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
