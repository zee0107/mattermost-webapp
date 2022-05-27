// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import { Client4 } from 'mattermost-redux/client';

type Props = {
    channelId:string;
}

type State = {
    isDark: string;
};

export default class PageDetails extends React.PureComponent<Props, State> {
    
    static defaultProps = {
        userId: '',
        profilePicture: '',
        /*status: UserStatuses.OFFLINE,*/
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            isDark:'light',
            likeCount: 0,
            data: []
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
        this.getStats();
    }

    getStats = () => {
        const response = Client4.getLikeCount(this.props.channelId);
        Promise.resolve(response).then(value => {this.setState({likeCount: value});})
    }


    render= (): JSX.Element => {
        const {channelId} = this.props;
        const { likeCount } = this.state;
        const value = likeCount;
        return (
            <label className='text-count-members'>
                {value}&nbsp;Likes</label>
        );
    }
}
