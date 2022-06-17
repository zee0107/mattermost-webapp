// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {Client4} from 'mattermost-redux/client';
import {getCurrentUser, getOhterUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';
import {
    loadPosts,
    loadUnreads,
    loadPostsAround,
    syncPostsInChannel,
    loadLatestPosts,
} from 'actions/views/channel';

import PostListALL from './post_list_all'


type ownProps = {
    channelId: string;
}
function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState, ownProps: ownProps) {      
        const currentUser = getCurrentUser(state);
        const userId = currentUser.id;
        const posts = Client4.getPosts(ownProps.channelId);
        return {
            userId,
            posts,
            profilePicture: Client4.getProfilePictureUrl(userId, currentUser?.last_picture_update),
            currentUser,
        };
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc|GenericAction>, Actions>({
            loadPosts,
            loadUnreads,
            loadPostsAround,
            syncPostsInChannel,
            loadLatestPosts,
        }, dispatch),
    };
}
export default connect(makeMapStateToProps, mapDispatchToProps)(PostListALL);
