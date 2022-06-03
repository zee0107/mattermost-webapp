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
}

type State = {
    isDark: string;
    post: any;
};

export default class ForumComments extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light',};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.post !== undefined && this.props.post !== null){
            Promise.resolve(this.props.post).then((value) => { this.setState({post: value}); });
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
        const {currentUser, userData, view, postType} = this.props;
        const {post} = this.state;
        let name;
        if(currentUser){
            name = currentUser.username;
        }

        let postDesc;
        let postId;
        let renderView;
        if(postType === 'post'){

            if(post){
                postDesc = post.post_text;
                postId = post.id;
            }

            if(view === 'desktop'){
                renderView = (
                    <div className='box-middle-panel mt-6'>
                        <div className='position-relative'>
                            <a className='position-absolute top-0 end-0 onInsetreversemobile'>
                                <i className='bi-layout-sidebar-inset-reverse bi-layout-sidebar-inset-reverse-style'></i>
                            </a>
                            <a className='position-absolute top-0 end-0 onInsetreversebackmobile'>
                                <i className='bi-layout-sidebar-inset bi-layout-sidebar-inset-reverse-style'></i>
                            </a>
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
                            <a className='position-absolute top-0 end-0 onInsetreversemobile'>
                                <i className='bi-layout-sidebar-inset-reverse bi-layout-sidebar-inset-reverse-style'></i>
                            </a>
                            <a className='position-absolute top-0 end-0 onInsetreversebackmobile'>
                                <i className='bi-layout-sidebar-inset bi-layout-sidebar-inset-reverse-style'></i>
                            </a>
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
            let postArchive;
            if(post){
                postDesc = post.comment;
                postId = post.id;
                postArchive = post.archive;
            }

            if(postArchive !== 1){
                if(view === 'desktop'){
                    renderView = (
                        <div className='box-middle-panel mt-7'>
                            <div className='position-relative'>
                                <div className='dropdown'>
                                    <a className='position-absolute top-0 end-0 onActioncomment' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                        <i className='bi-three-dots-vertical bi-layout-sidebar-inset-reverse-style'></i>
                                    </a>
                                    <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuButton1'>
                                    <li><a className='dropdown-item onDeletecomment'>Delete</a></li>
                                    <li><a className='dropdown-item onEditcomments'>Edit comment</a></li>
                                    </ul>
                                </div>
                            </div>
                            {this.renderProfilePicture('fxl')}
                            <strong className='mt-2 ms-2 float-start'>@{name}</strong>
                            <br/>
                            <p className='mb-0 p-3 ms-2'>
                                {postDesc}
                            </p>
                            <form className='p-2 editcomments'>
                                <div className='form-floating'>
                                    <textarea className='form-control' placeholder='Edit comment' id='floatingTextarea2' style='height: 100px'></textarea>
                                    <label htmlFor='floatingTextarea2'>
                                        Edit comment
                                    </label>
                                </div>
                                <button type='button' className='btn btn-creative btn-sm mt-2 mb-0 text-white'>
                                    Update
                                </button>
                                <button type='button' className='btn btn-creative btn-sm mt-2 mb-0 text-white onCanceledit'>
                                    Cancel
                                </button>
                                <button type='button' className='btn btn-creative btn-sm mt-2 mb-0 text-white onDeletecomment'>
                                    <i className='bi-trash-fill bi-trash-fill-style'></i>
                                </button>
                            </form>
                        </div>
                    );
                }else{
                    renderView = (
                        <div className='box-middle-panel mt-7'>
                            <div className='position-relative'>
                                <div className='dropdown'>
                                    <a className='position-absolute top-0 end-0 onActioncomment' id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                        <i className='bi-three-dots-vertical bi-layout-sidebar-inset-reverse-style'></i>
                                    </a>
                                    <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='dropdownMenuButton1'>
                                    <li><a className='dropdown-item onDeletecomment'>Delete</a></li>
                                    <li><a className='dropdown-item onEditcomments'>Edit comment</a></li>
                                    </ul>
                                </div>
                            </div>
                            {this.renderProfilePicture('fxl')}
                            <strong className='mt-2 ms-2 float-start'>@{name}</strong>
                            <br/>
                            <p className='mb-0 p-3 ms-2'>
                                {postDesc}
                            </p>
                            <form className='p-2 editcomments'>
                                <div className='form-floating'>
                                    <textarea className='form-control' placeholder='Edit comment' id='floatingTextarea2' style='height: 100px'></textarea>
                                    <label htmlFor='floatingTextarea2'>
                                        Edit comment
                                    </label>
                                </div>
                                <button type='button' className='btn btn-creative btn-sm mt-2 mb-0 text-white'>
                                    Update
                                </button>
                                <button type='button' className='btn btn-creative btn-sm mt-2 mb-0 text-white onCanceledit'>
                                    Cancel
                                </button>
                                <button type='button' className='btn btn-creative btn-sm mt-2 mb-0 text-white onDeletecomment'>
                                    <i className='bi-trash-fill bi-trash-fill-style'></i>
                                </button>
                            </form>
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
