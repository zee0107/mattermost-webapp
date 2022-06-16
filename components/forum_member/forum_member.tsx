// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile} from 'mattermost-redux/types/users';

import { ForumUser } from 'mattermost-redux/types/crypto';

type Props = {
    userId: string;
    profilePicture: string;
    userData: UserProfile;
    currentUser: UserProfile;
    view: string;
    userJoinedCount: Promise<number>;
    userPostcount: Promise<number>;
    forumUserData: Promise<ForumUser>;
}

type State = {
    isDark: string;
    userJoinedCount: number;
    userPostcount: number;
    forumUserData: ForumUser;
};

export default class ProfilPage extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {isDark:'light'};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        if(this.props.userJoinedCount !== undefined && this.props.userJoinedCount !== null){
            Promise.resolve(this.props.userJoinedCount).then((value) => {this.setState({userJoinedCount: value});});
        }

        if(this.props.userPostcount !== undefined && this.props.userPostcount !== null){
            Promise.resolve(this.props.userPostcount).then((value) => {this.setState({userPostcount: value});});
        }

        if(this.props.forumUserData !== undefined && this.props.forumUserData !== null){
            Promise.resolve(this.props.forumUserData).then((value) => {this.setState({forumUserData: value});});
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
        const {userJoinedCount, userPostcount, forumUserData} = this.state;
        let name;
        let position;
        if(currentUser){
            if(currentUser.first_name !== ''){
                name = currentUser.first_name + ' ' + currentUser.last_name;
            }
            else{
                name = currentUser.username;
            }

            if(currentUser.position !== '' && currentUser.position){
                position = currentUser.position;
            }
        }

        let last_visit;
        if(forumUserData){
            var today = new Date();
            var startTime = new Date(forumUserData.last_visit + 'Z');
            var diffMs = (today - startTime); // milliseconds between now & startTime
            var diffDays = Math.floor(diffMs / 86400000); // days
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

            if(diffDays > 0){
                last_visit = diffDays+ ' day(s)';
            }
            if(diffHrs > 0 && diffDays <= 0){
                last_visit = diffHrs+ ' hour(s)';
            }
            if(diffMins > 0 && diffHrs <= 0){
                last_visit = diffMins + ' minute(s)';
            }
        }

        let renderView;
        if(view === 'desktop'){
            renderView = (
                <div className='box-middle-panel mt-3'>
                    <div className='col-12 mx-auto'>
                        <div className='row'>
                            <div className='col-4 mt-2 mb-2'>
                                {this.renderProfilePicture('lg')}
                                {/*<img className='img-fluid float-start me-2' src='assets/images/sample-user-primary-picture-6.png' alt='' />*/}
                                <p><label><strong>{name}</strong></label><br/><small>{position}</small></p>
                            </div>
                            <div className='col-2 mt-3 mb-2 text-center'><strong>{userJoinedCount}</strong></div>
                            <div className='col-2 text-center mt-3 mb-2'><strong>{last_visit}</strong></div>
                            <div className='col-2 text-center mt-3 mb-2'><strong>{userPostcount}</strong></div>
                            <div className='col-2 text-center mt-3 mb-2'><strong>0</strong></div>
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
                                <p><label><strong>{name}</strong></label><br/><small>{position}</small></p>
                            </div>
                            <hr/>
                            <div className='col-3 text-center mt-0 mb-2'><strong>{userJoinedCount}</strong><br/><small className='text-muted'>Joined</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>{last_visit}</strong><br/><small className='text-muted'>Last Visit</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>{userPostcount}</strong><br/><small className='text-muted'>Post Count</small></div>
                            <div className='col-3 text-center mt-0 mb-2'><strong>0</strong><br/><small className='text-muted'>Referrals</small></div>
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
