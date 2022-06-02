// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import { ForumReply, ForumTopic } from 'mattermost-redux/types/crypto';

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
    textError: string;
    baseUri: string;
};

export default class ForumMessages extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light', baseUri: 'https://localhost:44312/api/crypter/',};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.comments !== undefined && this.props.comments !== null){
            Promise.resolve(this.props.comments).then((value) => { this.setState({comments: value}); });
        }
    }

    handleRedirect = (id: string, comment: string) => {
        const {baseUri} = this.state;
        const uri = new URL(baseUri + 'addviewcount');
        const params = {forum_id: id};
        uri.search = new URLSearchParams(params);

        fetch(uri, {
            method: 'POST',
        }).then((response) => response.json()).then((data)=>{    
            if(data === 'Proceed'){
                window.location.href = '/threads/discusion?u=' + id + `#${comment.replace('-','').toString()}`;
            }
        }).catch(error => this.setState({textError: error}));
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
            this.setState({comments: data});
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

        let userName;
        if(currentUser){
            userName = '@' + currentUser.username;
        }

        let renderView;
        let commentText;
        let timePast;
        let commentId;
        if(comments){
            commentText = comments.comment.substring(0, 50) + '...';
            commentId = comments.id;
            var today = new Date();
            var startTime = new Date(comments.date + 'Z');
            var diffMs = (today - startTime); // milliseconds between now & startTime
            var diffDays = Math.floor(diffMs / 86400000); // days
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

            if(diffDays > 1){
                timePast = diffDays+ 'D';
            }
            if(diffHrs > 1 && diffDays <= 0){
                timePast = diffHrs+ 'H';
            }
            if(diffMins > 1  && diffHrs <= 0){
                timePast = diffMins + 'M';
            }
            if(diffMins <= 0){
                timePast = 1 + 'M';
            }

            if(comments.archive === 0){
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
                                        <div className='col-2 text-center mt-3 mb-2'><strong><i className='bi-trash bi-trash-style' onClick={() => this.handleArchive(commentId) } style={{cursor: 'pointer'}}></i></strong></div>
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
                                        <i className='bi-trash bi-trash-style' onClick={() => this.handleArchive(commentId) } style={{cursor: 'pointer'}}></i>
                                        <br/>
                                        <small>{timePast} ago</small></div>
                                    </div>
                                </div>
                            </div>
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
