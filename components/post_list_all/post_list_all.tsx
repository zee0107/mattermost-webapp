// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import Post from 'components/post_view_all/post';
import LatestPostReader from 'components/post_view_all/post_list_virtualized/latest_post_reader';
import { PostList } from 'mattermost-redux/types/posts';
import { Client4 } from 'mattermost-redux/client';

type Props = {
    channelId: string;
    filter: string;
    userId: string;
    focusedPostId?: string;
    profilePicture: string;
    currentUser: UserProfile;
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
    idList: string[];
    deleted: boolean;
    edited: boolean;
};

export default class PostListAll extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light', deleted: false, edited: false};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.posts){
            Promise.resolve(this.props.posts).then((value) => { this.setState({posts: value});});
        }

        /*if(this.state.posts){
            this.setState({idList: this.state.posts.order});
        }*/

        this.handleGetPosts(this.props.channelId);
        this.postsOnLoad(this.props.channelId);
    }
    

    componentDidUpdate(){        
        if(this.state.deleted){
            this.handleGetPosts(this.props.channelId);
            this.setState({edited: false});
        }

        if(this.state.edited){
            this.handleGetPosts(this.props.channelId);
            this.setState({edited: false});
        }
    }

    handleGetPosts = (channelId: string) => {
        const postList = Client4.getPosts(channelId);
        postList.then((value) => { this.setState({posts: value}); });
    }

    handleRemovePost = () => {
        this.setState({deleted: true});
    }

    handleAddPost(){

    }
    
    postsOnLoad = async (channelId: string) => {
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
        const {posts,idList} = this.state;

        let postsView;
        if (posts) {
            postsView = (
                <>
                    <LatestPostReader postIds={posts.order}/>
                    {posts && posts.order.map((item,index) => {
                        return (
                            <Post
                                postId={item}
                                handleRemovePost={this.handleRemovePost}
                                post={posts.posts[item]}
                                userId={currentUser.id}
                                filter={this.props.filter}
                                key={`${item}--${index}`}
                            />
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
