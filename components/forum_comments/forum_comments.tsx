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
        this.state = {isDark:'light', post: []};
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
                console.log(post);
                postDesc = post.post_text;
                postId = post.id;
            }

            if(view === 'desktop'){
                renderView = (
                    <div className='box-middle-panel mt-6'>
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
            if(post){
                postDesc = post.comment;
                postId = post.id;
            }

            if(view === 'desktop'){
                renderView = (
                    <div className='box-middle-panel mt-7'>
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
                    <div className='box-middle-panel mt-7'>
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

        return (
            <>
                {renderView}
            </>
        );
    }
}
