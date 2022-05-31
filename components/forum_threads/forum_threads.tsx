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
    post: Promise<ForumTopic>;
}

type State = {
    isDark: string;
    post: ForumTopic;
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
        const {post} = this.state;

        let postTitle;
        let postDesc;
        if(post){
            postTitle = post.post_title;
            postDesc = post.post_text.substring(0,50).toString() + '...';
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
                                <p><label><strong>{postTitle}</strong></label><br/><small>{postDesc}</small></p>
                                </div>
                                <div className='col-2 text-center mt-3 mb-2'><strong>0</strong></div>
                                <div className='col-2 text-center mt-3 mb-2'><strong>0</strong></div>
                                <div className='col-2 text-center mt-3 mb-2'><strong>0</strong></div>
                                <div className='col-2 text-center mt-3 mb-2'><strong>0</strong></div>
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
                                <p><label><strong>{postTitle}</strong></label><br/><small>{postDesc}</small></p>
                            </div>
                            <hr/>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Posts</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Views</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Likes</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Comments</small></div>
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
