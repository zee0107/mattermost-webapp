// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import { any } from 'prop-types';

type Props = {
    userId: string;
    profilePicture: string;
    userData: UserProfile;
    currentUser: UserProfile;
    view: string;
    onChangeSelected: any;
}

type State = {
    isDark: string;
    currentUser: UserProfile;
};

export default class StoryListView extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {
            isDark: 'dark',
        };
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
    }

    onChangeValue = (id: string) => {
        this.props.onChangeSelected(id);
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
            />
        );
    }

    render= (): JSX.Element => {
        const { currentUser, view } = this.props;
        
        let name;
        let renderView;
        if(currentUser !== undefined && currentUser !== null){
            if(currentUser.first_name !== ''){
                name = (<>{`${currentUser.first_name} ${currentUser.last_name}` }</>);
            }
            else{
                name = (<>{currentUser.user_name}</>);
            }

            if(view === 'desktop'){
                renderView = (
                    <a className='onViewsfriendstories text-dark'  onClick={() => this.onChangeValue(currentUser.id)}>
                        <div className='padding-view-firends-style mt-2'>
                            {this.renderProfilePicture('lg')}
                            <small className='mt-1 text-muted'><strong>{name}</strong></small>
                            <br/>
                            {/*<div className='yourstoryminutes'><small className='ml-12'>8m</small></div>*/}
                        </div>
                    </a>
                );
            }
            else{
                name = (<>{`${currentUser.first_name.split(' ')[0]}` }</>);
                renderView = (
                    <div className='col-2 text-center' onClick={() => this.onChangeValue(currentUser.id)}>
                        <a className='onViewsfriendstories'>
                            {this.renderProfilePicture('lg')}
                            <p className='text-dark'><small>{name} <br/> <strong>8m</strong></small></p>
                        </a>
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
