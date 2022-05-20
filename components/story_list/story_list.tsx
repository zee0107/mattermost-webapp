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
}

type State = {
    isDark: string;
    currentUser: UserProfile;
};

export default class RequestLists extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {
            isDark: 'dark',
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
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
        const { currentUser } = this.props;
        
        let name;
        let renderView;
        if(currentUser !== undefined && currentUser !== null){
            if(currentUser.first_name !== ''){
                if(currentUser.first_name.includes(' ')){
                    name = (<>{currentUser.first_name.split(' ')[0]}</>);
                }
                else{
                    name = (<>{currentUser.first_name}</>);
                }
               
            }
            else{
                name = (<>{currentUser.user_name}</>);
            }

            
            renderView = (
                <div className='col-md-1 mtop-10'>
                    <div className='position-absolute'>
                        <a href="#" className='onClickstory'>
                            {this.renderProfilePicture('xl')}
                        </a>
                    </div>
                    <div className="badges-offline-plus rounded-circle position-relative"></div>
                    <small className="firstname-title-story mt-5">{name}</small>
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
