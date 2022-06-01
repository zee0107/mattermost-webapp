// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import ForumDiscussion from './forum-discussion'

type ownProps = {
    forumId: string;
}
function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState, ownProps: ownProps) {
        const searchParam = ownProps.location.search.replace('?u=','');
        const currentUser = getCurrentUser(state);
        const userId = currentUser?.id;
        const post = Client4.getThread(searchParam);
        const comments = Client4.listComments(searchParam);
        const isMember = Client4.getThreadMeber(searchParam,userId);
        const memberCount = Client4.getThreadMeberCount(searchParam);
        return {
            userId,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
            post,
            comments,
            isMember,
            memberCount,
        };
    };
}

export default connect(makeMapStateToProps)(ForumDiscussion);
