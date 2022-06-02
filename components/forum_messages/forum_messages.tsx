// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import { ForumReply, ForumTopic } from 'mattermost-redux/types/crypto';
import { start } from 'repl';
import { diff } from 'semver';


type Props = {
    userId: string;
    profilePicture: string;
    userData: UserProfile;
    currentUser: UserProfile;
    view: string;
    commentId: string;
    comments: Promise<ForumReply>;
}

type State = {
    isDark: string;
    post: ForumTopic;
    comments: ForumReply;
};

export default class ForumMessages extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light'};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.comments !== undefined && this.props.comments !== null){
            Promise.resolve(this.props.comments).then((value) => { this.setState({comments: value}); });
        }
    }

    handleRedirect = (id: string) => {
        const uri = new URL('https://localhost:44312/api/crypter/addviewcount');
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
        const {comments} = this.state;

        let renderView;
        let commentText;
        let timePast;
        if(comments){
            commentText = comments.comment.substring(0, 50) + '...';
            var today = new Date();
            var startTime = new Date(comments.date);
            console.log(startTime);
            var diffMs = (today - startTime); // milliseconds between now & startTime
            var diffDays = Math.floor(diffMs / 86400000); // days
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

            if(diffDays > 0){
                timePast = diffDays+ ' day(s)';
            }
            if(diffHrs > 0 && diffDays <= 0){
                timePast = diffHrs+ ' hour(s)';
            }
            if(diffMins > 0 && diffHrs <= 0){
                timePast = diffMins + ' minute(s)';
            }
        }

        let userName;
        if(currentUser){
            userName = '@' + currentUser.username;
        }
        if(view === 'desktop'){
            renderView = (
                <div className='box-middle-panel-forums'>
                    <div className='box-middle-panel-select-forum'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                                <div className='col-5 mt-2 mb-2'>
                                {this.renderProfilePicture('lg')}
                                {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt='' />*/}
                                <p><label><strong>{userName}</strong></label><br/><small>{commentText}</small></p>
                                </div>
                                <div className='col-3 text-left mt-3 mb-2'><small>{timePast} ago</small></div>
                                <div className='col-2 text-center mt-3 mb-2'><strong><i className='bi-bookmark bi-bookmark-style'></i></strong></div>
                                <div className='col-2 text-center mt-3 mb-2'><strong><i className='bi-trash bi-trash-style'></i></strong></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else{
            renderView = (
                <div className='box-middle-panel-forums'>
                    <div className='box-middle-panel-select-forum'>
                        <div className='col-12 mx-auto'>
                            <div className='row'>
                                <div className='col-8 mt-2 mb-1'>
                                {this.renderProfilePicture('lg')}
                                <p><label><strong>{userName}</strong></label><br/><small>{commentText}</small></p>
                                </div>
                                <div className='col-4 text-center mt-2 mb-1'>
                                <i className='bi-bookmark bi-bookmark-style'></i>
                                <i className='bi-trash bi-trash-style'></i>
                                <br/>
                                <small>{timePast} ago</small></div>
                            </div>
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
