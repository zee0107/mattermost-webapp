// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import RightSideView from 'components/right_side_view';
import { UserProfile } from 'mattermost-redux/types/users';
import { Comment, ForumTopic, Thread } from 'mattermost-redux/types/crypto';
import ForumComments from 'components/forum_comments';

export type Props = {
    userId: string;
    profilePicture: string;
    currentUser: UserProfile;
    post: Promise<ForumTopic>;
    comments: Promise<Comment[]>;
    isMember: Promise<boolean>;
    memberCount: Promise<number>;
    actions: {
        forumLike: (user_id: string, forum_id: string) => Promise<ForumTopic>;
        forumdisLike: (user_id: string, forum_id: string) => Promise<ForumTopic>;
    }
}

type State = {
    isDark: string;
    selectedMenu: string;
    currentUser: UserProfile;
    joined: boolean;
    post: ForumTopic;
    comments: Comment[];
    commentText?: string;
    textError: string;
    isMember: boolean;
    memberCount: number;
};

export default class ForumDiscussion extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
    }

    constructor(props: Props) {
        super(props);

        this.state = { isDark:'light',};
        this.handleChangeComment = this.handleChangeComment.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLikeForum = this.handleLikeForum.bind(this);
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.comments !== undefined && this.props.comments !== null){
            Promise.resolve(this.props.comments).then((value) => {this.setState({comments: value});});
        }

        if(this.props.post !== undefined && this.props.post !== null){
            Promise.resolve(this.props.post).then((value) => {this.setState({post: value});});
        }

        if(this.props.isMember !== undefined && this.props.isMember !== null){
            Promise.resolve(this.props.isMember).then((value) => {this.setState({isMember: value});});
        }

        if(this.props.memberCount !== undefined && this.props.memberCount !== null){
            Promise.resolve(this.props.memberCount).then((value) => {this.setState({memberCount: value});});
        }
        this.setDefaultMember();
    }

    handleChangeComment = (e) => {
        this.setState({commentText: e.target.value});
    }

    handleLikeForum = () => {
        const {actions,userId} = this.props;
        const {post} = this.state;

        if(post){
            const data = actions.forumLike(post.id,userId).then((value => value));
            console.log(data);
        }
    }

    componentDidUpdate(_,prevState) {
        const {comments} = this.state;
        if (comments !== prevState.comments) {
            this.setState({comments: comments, commentText: ''});
        }
    }

    handleJoindThread = () => {
        const {userId} = this.props;
        const {post} = this.state;

        if(post){
            const uri = new URL('https://localhost:44312/api/crypter/jointhread');
            const params = {user_id: userId, forum_id: post.id};
            uri.search = new URLSearchParams(params);

            fetch(uri, {
                method: 'POST',
            }).then((response) => response.json()).then((data)=>{    
                this.setState({isMember: data});
            }).catch(error => this.setState({textError: error}));
        }
    }

    handleSubmit = () => {
        const {userId} = this.props;
        const {post, commentText, comments} = this.state;

        if(post){
            const uri = new URL('https://localhost:44312/api/crypter/createreply');
            const params = {user_id: userId, forum_id: post.id, comment: commentText};
            uri.search = new URLSearchParams(params);

            fetch(uri, {
                method: 'POST',
            }).then((response) => response.json()).then((data)=>{    
                if(data === 'EmptyComment'){
                    this.setState({topicError: 'Please add your comment.'});
                }else if (data === 'Failed'){
                    this.setState({textError: 'Please try again.'});
                }else{
                    this.setState(prevState => ({
                        comments: [...prevState.comments, {commentId: data.commentId, userId: data.userId}]
                      }));
                }
            }).catch(error => this.setState({textError: error}));
        }
    }

    setDefaultMember = () => {
        const {userId} = this.props;
        const {post} = this.state;

        if(post){
            if(userId === post.post_user){
                this.setState({isMember: true});
            }
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
                text={'forum'}
            />
        );
    }

    render= (): JSX.Element => {
        const {currentUser, userId} = this.props;
        const {post,comments, textError, isMember,memberCount} = this.state;

        let name;
        if(currentUser){
            name = currentUser.username;
        }

        let btnJoin;
        let inputReplyDesktop;
        if(isMember){
            btnJoin = (
                <button type='button' className='btn-add-post text-white onApproval' disabled>
                    JOINED
                </button>
            );

            inputReplyDesktop = (
                <div className='box-middle-panel mt-4 p-4'>
                    <strong>Comments</strong>
                    <div className='form-floating mt-2 mb-2'>
                        <textarea className='form-control' placeholder='Leave a comment here' onChange={this.handleChangeComment} value={this.state.commentText} id='floatingTextarea' style={{height: '100px'}}></textarea>
                        <label htmlFor='floatingTextarea'>Leave a comment here</label>
                    </div>
                    <div className='d-grid gap-2'>
                        <button className='btn-add-post text-white' onClick={() => this.handleSubmit()} type='button'>SUBMIT</button>
                    </div>
                </div>
            );
        }else{
            btnJoin = (
                <button type='button' onClick={() => this.handleJoindThread() } className='btn-add-post text-white onJoinus'>
                    JOIN DISCUSSION
                </button>
            );
        }

        let postTopic, postDetails, date, viewCount,likeCount,disLikeCount,commentCount;
        let renderPost;
        let renderComments;
        if(post){
            postTopic = post.post_title;
            postDetails = post.post_text;
            date = new Date(post.date_posted).toDateString();
            viewCount = post.view_count;
            likeCount = post.like_count;
            disLikeCount = post.dislike_count;

            renderPost = (
                <>
                    <ForumComments userId={post.post_user} forumId={post.id} postType={'post'} view={'desktop'} />
                </>
            )
        }

        if(comments){
            commentCount = comments.length;
            if(comments.length){
                renderComments = (
                    <>
                        {comments.map((item,index) => {
                            return (
                                <ForumComments userId={item.userId} forumId={item.commentId} postType={'comment'} view={'desktop'} key={`${item.commentID}--${index}`} />
                            );
                        })}
                    </>
                );
            }else{
                renderComments = (
                    <>
                        <div className='box-middle-panel mt-7 text-center'>
                            <h4 className='text-muted'><i className='bi-journal-x'></i> No comments on this thread.</h4>
                        </div>
                    </>
                );
            }
            
        }
        else{
            commentCount = 0;
        }
        return (
            <>
                <section className='crypter-section-desktop'>
                    <div className='row'>
                        <div className='col-md-9'>
                            <div className='box-middle-panel-forums-menu'>
                                <div className=''>
                                    <a className='onForum float-start'><i className='bi-chat-left-text-fill'></i></a>
                                    <div className='row'>
                                        <div className='col-lg-6 mt-2 mb-0 p-0'>
                                            <h3 className='p-0 text-start ms-2 mt-1'>
                                            {postTopic}
                                            </h3>
                                        </div>

                                        <div className='col-lg-6 mt-2 mb-0'>
                                            <div className='dropdown bg-transparent float-end'>
                                                <strong className='text-black-50'>
                                                    <small className='text-black-50'>Date Posts {date}</small> 
                                                    <i className='bi-dot'></i>
                                                    <i className='bi-eye'></i>
                                                    <small>{viewCount} views</small>
                                                    <i className='bi-dot'></i>
                                                    <i className='bi-hand-thumbs-up' onClick={() => this.handleLikeForum()}></i>
                                                    <small>{likeCount}</small>
                                                    <i className='bi-dot'></i>
                                                    <i className='bi-hand-thumbs-down'></i>
                                                    <small>{disLikeCount}</small>
                                                    <i className='bi-dot'></i>
                                                    <i className='bi-chat-left'></i>
                                                    <small>{commentCount}</small>
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='content-forums-browse'>
                                <div className='row'>
                                    <div className='col-lg-8'>
                                        {renderPost}
                                        {renderComments}
                                        {inputReplyDesktop}
                                    </div>
                                <div className='col-lg-4'>
                                    <div className='position-sticky float-right-panel'>
                                        <div className='box-middle-panel mt-3'>
                                            <div className='d-grid mt-2 mb-0 text-center'>
                                                <strong className='text-secondary'>
                                                    <small>
                                                    <i className='bi-people-fill'></i> 
                                                    People joined
                                                    <i className='bi-dot'></i> 
                                                    <a className='onShowmembers'>{memberCount}</a>
                                                    </small>
                                                </strong>
                                            </div>
                                            {/*<div className='showmembers'>
                                                <div className='d-grid mt-0 mb-0'>
                                                    <hr/>
                                                    <p>
                                                        <strong className='mb-0 float-start mt-1'>
                                                        <i className='bi-people-fill'></i>  People <i className='bi-dot'></i> 10.11K
                                                        </strong>
                                                        
                                                        <a className='onClosememberslist'>
                                                        <i className='bi-x-circle bi-x-circle-fill-style float-end'></i>
                                                        </a>
                                                    </p>
                                                    <p className='mt-0'>
                                                        <small>
                                                        New people and Pages who join this group will appear here. <a className='text-success'><strong>Learn More</strong></a>
                                                        </small>
                                                    </p>

                                                    <p className='mt-0 mb-4'>
                                                        <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-2.png' />
                                                        <strong className='ms-2 text-end'>Topic name</strong>
                                                    </p>
                                                    <p className='mt-0 mb-4'>
                                                        <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-3.png' />
                                                        <strong className='ms-2 text-end'>Topic name</strong>
                                                    </p>
                                                    <p className='mt-0 mb-4'>
                                                        <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-4.png' />
                                                        <strong className='ms-2 text-end'>Topic name</strong>
                                                    </p>
                                                    <p className='mt-0 mb-0'>
                                                        <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-5.png' />
                                                        <strong className='ms-2 text-end'>Topic name</strong>
                                                    </p>
                                                </div>
                                            </div>*/}
                                            <div className='d-grid mt-2'>
                                                {btnJoin}
                                            </div>
                                            <hr/>
                                            <strong>Related Topics</strong>
                                            <p className='mt-5 mb-4 text-muted'>
                                                <i className='bi-journal-x'></i>
                                                <strong>No Related Topic</strong>
                                            </p>
                                            {/*<p className='mt-4 mb-4'>
                                                <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-2.png' />
                                                <strong className='ms-2 text-end'>Topic name</strong>
                                                <i className='bi-dot'></i>
                                                <small>5/31/2022</small>
                                            </p>
                                            <p className='mt-4 mb-4'>
                                                <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-3.png' />
                                                <strong className='ms-2 text-end'>Topic name</strong>
                                                <i className='bi-dot'></i>
                                                <small>5/29/2022</small>
                                            </p>
                                            <p className='mt-4 mb-4'>
                                                <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-4.png' />
                                                <strong className='ms-2 text-end'>Topic name</strong>
                                                <i className='bi-dot'></i>
                                                <small>5/29/2022</small>
                                            </p>
                                            <p className='mt-4 mb-4'>
                                                <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-5.png' />
                                                <strong className='ms-2 text-end'>Topic name</strong>
                                                <i className='bi-dot'></i>
                                                <small>5/29/2022</small>
                                            </p>
                                            <p className='mt-4 mb-4'>
                                                <img className='img-fluid text-start' width='50' src='assets/images/chat-msg-picture-6.png' />
                                                <strong className='ms-2 text-end'>Topic name</strong>
                                                <i className='bi-dot'></i>
                                            <small>5/29/2022</small>
                                            </p>*/}
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3' id='rightSideView'>
                            <RightSideView/>
                        </div>
                    </div>
                </section>
                <section className='crypter-section-mobile'>
                    
                </section>
            </>
        );
    }
}
