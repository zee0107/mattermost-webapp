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
        const myThreads = Client4.myThreadList(userId);
        const myMessages = Client4.myCommentList(userId);
        const allThreads = Client4.allThreads();
        const forumMembers = Client4.forumMembers();

        return {
            userId,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
            myThreads,
            myMessages,
            allThreads,
            forumMembers,
        };
    };
}

export default connect(makeMapStateToProps)(Forums);
