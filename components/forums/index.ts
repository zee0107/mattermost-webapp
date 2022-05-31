// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import Forums from './forums'


function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState) {
        const currentUser = getCurrentUser(state);
        const userId = currentUser?.id;

        return {
            userId,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
        };
    };
}

export default connect(makeMapStateToProps)(Forums);
