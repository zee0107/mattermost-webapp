// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import { dislikeForum, likeForum } from 'mattermost-redux/actions/forums';

import ForumDiscussion from './forum-discussion'
import { ForumTopic } from 'mattermost-redux/types/crypto';
import { ActionFunc } from 'mattermost-redux/types/actions';
import { bindActionCreators, ActionCreatorsMapObject , Dispatch } from 'redux';

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

function forumLike(forum_id: string,user_id: string) {
    return (dispatch: Dispatch) => {
        dispatch(likeForum(forum_id, user_id) as Promise<ForumTopic>);
    };
}

function forumdisLike(forum_id: string,user_id: string) {
    return (dispatch: Dispatch) => {
        dispatch(dislikeForum(forum_id, user_id) as Promise<ForumTopic>);
    };
}

type Actions = {
    forumLike: (forum_id: string, user_id: string) => Promise<ForumTopic>;
    forumdisLike: (forum_id: string, user_id: string) => Promise<ForumTopic>;
}

function mapDispatchToProps(dispatch: Dispatch){
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<Actions>, Actions>({
            forumLike,
            forumdisLike
        }, dispatch),
    };
}
export default connect(makeMapStateToProps,mapDispatchToProps)(ForumDiscussion);
