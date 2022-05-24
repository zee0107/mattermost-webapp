// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';

type Props = {
    userId: string;
    profilePicture: string;
    userData: UserProfile;
    currentUser: UserProfile;
    onTriggerUnmute: any;
    actions: {
        unmuteUser: (user_id: string, friend_id: string) => void;
    };
}

type State = {
    isDark: string;
    currentUser: UserProfile;
};

export default class MutedStoryList extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {
            isDark: 'dark',
        };
        this.handleUnmuteStory = this.handleUnmuteStory.bind(this);
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
    }

    handleUnmuteStory = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        const {actions, currentUser, userData} = this.props;
        actions.unmuteUser(userData.id,currentUser.id);
        this.props.onTriggerUnmute(true);
    }


    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
                text={'muted'}
            />
        );
    }

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        
        let name;
        let renderView;
        if(currentUser !== undefined && currentUser !== null){
            if(currentUser.first_name !== ''){
                name = (<>{`${currentUser.first_name} ${currentUser.last_name}`}</>);
            }
            else{
                name = (<>{currentUser.user_name}</>);
            }

            
            renderView = (
                <div className='row border border-1 mt-1'>
                    <div className='col-8 text-left mb-3'>
                        <p>{this.renderProfilePicture('lg')}
                            <small className='text-firstnames float-start'><strong>{name}</strong></small>
                        </p>
                        </div>
                        <div className='col-4 text-center mt-4'>
                        <a className='onClickunmute' onClick={this.handleUnmuteStory}>Unmute</a>
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
