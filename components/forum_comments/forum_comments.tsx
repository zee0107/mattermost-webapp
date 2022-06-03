// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import { ForumTopic } from 'mattermost-redux/types/crypto';


type Props = {
    userId: string;
    profilePicture: string;
    userData: UserProfile;
    currentUser: UserProfile;
    view: string;
    forumId: string;
    post: any;
    postType: string;
    handleFullWidth: any;
    fullWidth: boolean;
}

type State = {
    isDark: string;
    post: any;
    editComment: string;
    baseUri: string;
};

export default class ForumComments extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light',editComment: false, baseUri: 'https://crypterfighter.polywickstudio.ph/api/crypter/'};
        
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.post !== undefined && this.props.post !== null){
            Promise.resolve(this.props.post).then((value) => { this.setState({post: value}); });
        }
    }

    handleArchive = (id: string) => {
        const {baseUri} = this.state;
        const uri = new URL(baseUri + 'archivecomment');
        const params = {comment_id: id};
        uri.search = new URLSearchParams(params);

        fetch(uri, {
            method: 'POST',
        }).then((response) => response.json()).then((data)=>{    
            if(data === 'NotFound'){
                this.setState({textError: 'Data not found.'});
            }
            this.setState({post: data});
        }).catch(error => this.setState({textError: error}));
    }

    handleEditComment = (value: boolean) => {
        this.setState({editComment: value});
    }

    onFullWidth = () => {
        this.props.handleFullWidth(true);
    }

    onHalfWidth = () => {
        this.props.handleFullWidth(false);
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
        const {currentUser, userData, view, postType, fullWidth} = this.props;
        const {post, editComment} = this.state;
        let name;
        if(currentUser){
            name = currentUser.username;
        }

        let postDesc;
        let postId;
        let renderView;
        let widthBtn;
        if(postType === 'post'){

            if(post){
                postDesc = post.post_text;
                postId = post.id;
            }

            if(fullWidth){
                widthBtn = (
                    <a className='position-absolute top-0 end-0 onInsetreversebackmobile' onClick={() => this.onHalfWidth()}>
                        <i className='bi-layout-sidebar-inset bi-layout-sidebar-inset-reverse-style'></i>
                    </a>
                );
            }
            else{
                widthBtn = (
                    <a className='position-absolute top-0 end-0 onInsetreversemobile' onClick={() => this.onFullWidth()}>
                        <i className='bi-layout-sidebar-inset-reverse bi-layout-sidebar-inset-reverse-style'></i>
                    </a>
                );
            }

            if(view === 'desktop'){
                renderView = (
                    <div className='box-middle-panel mt-6'>
                        <div className='position-relative'>
                        {widthBtn}
                        </div>
                        {this.renderProfilePicture('fxl')}
                        <strong className='mt-2 ms-2 float-start'>@{name}</strong>
                        <br/>
                        <p className='mb-0 p-3 ms-2'>
                            {postDesc}
                        </p>
                    </div>
                );
            }else{
                renderView = (
                    <div className='box-middle-panel mt-6'>
                        <div className='position-relative'>
                            {widthBtn}
                        </div>
                        {this.renderProfilePicture('fxl')}
                        <strong className='mt-2 ms-2 float-start'>@{name}</strong>
                        <br/>
                        <p className='mb-0 p-3 ms-2'>
                            {postDesc}
                        </p>
                    </div>
                );
            }
        }
        else{
            let editCommentValue;
            let postArchive;
            let postUser;
            if(post){
                postDesc = post.comment;
                postId = post.id;
                postArchive = post.archive;
                postUser = post.post_user;
            }

            let dropdown;
            if(currentUser.id === postUser){
                dropdown = (
                    <div className='position-relative'>
                        <div className='dropdown'>
                            <a className='position-absolute top-0 end-0 onActioncomment text-dark' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                <i className='bi-three-dots-vertical bi-layout-sidebar-inset-reverse-style'></i>
                            </a>
                            <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                <li><a className='dropdown-item onDeletecomment' onClick={() => this.handleArchive(postId)}>Delete</a></li>
                                <li><a className='dropdown-item onEditcomments' onClick={() => this.handleEditComment(true)}>Edit comment</a></li>
                            </ul>
                        </div>
                    </div>
                    
                );
            }

            if(editComment){
                editCommentValue = (
                    <form className='p-2 editcomments'>
                        <div className='form-floating'>
                            <textarea className='form-control' placeholder='Edit comment' id='floatingTextarea2' style={{height: '100px',}}></textarea>
                            <label htmlFor='floatingTextarea2'>
                                Edit comment
                            </label>
                        </div>
                        <button type='button' className='mt-2 p-2 me-2 mb-0 text-white'>
                            Update
                        </button>
                        <button type='button' className='mt-2 p-2 me-2 mb-0 text-white onCanceledit' onClick={() => this.handleEditComment(false)}>
                            Cancel
                        </button>
                        <button type='button' className='mt-2 p-2 mb-0 text-white onDeletecomment' onClick={() => this.handleArchive(postId)}>
                            <i className='bi-trash-fill bi-trash-fill-style'></i>
                        </button>
                    </form>
                );
            }
            if(postArchive !== 1){
                if(view === 'desktop'){
                    renderView = (
                        <div className='box-middle-panel mt-7'>
                            {dropdown}
                            {this.renderProfilePicture('fxl')}
                            <strong className='mt-2 ms-2 float-start'>@{name}</strong>
                            <br/>
                            <p className='mb-0 p-3 ms-2'>
                                {postDesc}
                            </p>
                            {editCommentValue}
                        </div>
                    );
                }else{
                    renderView = (
                        <div className='box-middle-panel mt-7'>
                            {dropdown}
                            {this.renderProfilePicture('fxl')}
                            <strong className='mt-2 ms-2 float-start'>@{name}</strong>
                            <br/>
                            <p className='mb-0 p-3 ms-2'>
                                {postDesc}
                            </p>
                            {editCommentValue}
                        </div>
                    );
                }
            }
        }

        return (
            <>
                {renderView}
            </>
        );
    }
}
