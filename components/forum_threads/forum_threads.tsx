// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import { Comment, ForumTopic } from 'mattermost-redux/types/crypto';


type Props = {
    userId: string;
    profilePicture: string;
    userData: UserProfile;
    currentUser: UserProfile;
    view: string;
    forumId: string;
    post: Promise<ForumTopic>;
    commentCount: Promise<number>;
}

type State = {
    isDark: string;
    post: ForumTopic;
    commentCount: number;
};

export default class ForumThread extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light'};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.post !== undefined && this.props.post !== null){
            Promise.resolve(this.props.post).then((value) => { this.setState({post: value}); });
        }

        if(this.props.commentCount !== undefined && this.props.commentCount !== null){
            Promise.resolve(this.props.commentCount).then((value) => { this.setState({commentCount: value}); });
        }
    }

    handleRedirect = (id: string) => {
        const uri = new URL('https://crypterfighter.polywickstudio.ph/api/crypter/addviewcount');
        const params = {forum_id: id};
        uri.search = new URLSearchParams(params);

        fetch(uri, {
            method: 'POST',
        }).then((response) => response.json()).then((data)=>{    
            if(data === 'Proceed'){
                window.location.href = '/threads/discusion?u=' + id;
            }
        }).catch(error => this.setState({textError: error}));
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
        const {currentUser, profilePicture, userData, view} = this.props;
        const {post, commentCount} = this.state;

        let postTitle;
        let postDesc;
        let postId;
        let viewCount;
        let likeCount;
        if(post){
            postId = post.id;
            postTitle = post.post_title;
            postDesc = post.post_text.substring(0,50).toString() + '...';
            viewCount = post.view_count;
            likeCount = post.like_count;
        }

        let renderView;
        if(view === 'desktop'){
            renderView = (
                <div className='box-middle-panel-forums'>
                    <div className='box-middle-panel-select-forum'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                                <div className='col-4 mt-2 mb-2'>
                                {this.renderProfilePicture('lg')}
                                {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt=''/>*/}
                                <p><a href='#' onClick={() => this.handleRedirect(postId)}><label><strong>{postTitle}</strong></label></a><br/><small>{postDesc}</small></p>
                                </div>
                                <div className='col-2 text-center mt-3 mb-2'><strong>0</strong></div>
                                <div className='col-2 text-center mt-3 mb-2'><strong>{viewCount}</strong></div>
                                <div className='col-2 text-center mt-3 mb-2'><strong>{likeCount}</strong></div>
                                <div className='col-2 text-center mt-3 mb-2'><strong>{commentCount}</strong></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else{
            renderView = (
                <div className='box-middle-panel-select-forum'>
                    <div className='col-12 mx-auto'>
                        <div className='row'>
                            <div className='col-lg-12 mt-2 mb-2'>
                                {this.renderProfilePicture('lg')}
                                {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt=''/>*/}
                                <p><a href='#' onClick={() => this.handleRedirect(postId)}><label><strong>{postTitle}</strong></label></a><br/><small>{postDesc}</small></p>
                            </div>
                            <hr/>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Posts</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>{viewCount}</strong><br/><small className='text-muted'>Views</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>{likeCount}</strong><br/><small className='text-muted'>Likes</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>{commentCount}</strong><br/><small className='text-muted'>Comments</small></div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <>
                {renderView}
            </>
        );
    }
}
