// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import Post from 'components/post_view_all/post';
import LatestPostReader from 'components/post_view_all/post_list_virtualized/latest_post_reader';
import { PostList } from 'mattermost-redux/types/posts';

type Props = {
    channelId: string;
    filter: string;
    userId: string;
    profilePicture: string;
    currentUser: UserProfile;
    posts?: Promise<PostList>;
    actions: {
        loadPosts: () => any;
        loadUnreads: () => any;
        loadPostsAround: () => any;
        syncPostsInChannel: () => any;
        loadLatestPosts: () => any;
    };
}

type State = {
    isDark: string;
    posts: PostList;
};

export default class ForumMessages extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light', };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.posts){
            Promise.resolve(this.props.posts).then((value) => { this.setState({posts: value});});
        }

        this.postsOnLoad(this.props.channelId);
    }
    
    postsOnLoad = async (channelId) => {
        const {focusedPostId, actions} = this.props;
        if (focusedPostId) {
            await actions.loadPostsAround(channelId, this.props.focusedPostId);
        } else {
            await actions.loadLatestPosts(channelId);
        }
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
                text={'story'}
            />
        );
    }


    render= (): JSX.Element => {
        const {currentUser} = this.props;
        const {posts} = this.state;

        let postsView;
        if (posts) {
            postsView = (
                <>
                    <LatestPostReader postIds={posts.order}/>
                    {posts && posts.order.map((item,index) => {
                        return (
                            <Post postId={item} post={posts.posts[item]} userId={currentUser.id} filter={this.props.filter} key={`${item}`}/>
                        );
                    })}
                </>
            );
        } else {
            postsView = (
                <>
                    <h3 className='text-muted text-center'><i className='bi bi-file-earmark-x'></i> No Posts to show.</h3>
                </>
            );
        }

        return (
            <>
                {postsView}
            </>
        );
    }
}
