// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import {Client4} from 'mattermost-redux/client';

type Props = {
    channelId:string;
}

type State = {
    isDark: string;
};

export default class GroupsDetails extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
        /*status: UserStatuses.OFFLINE,*/
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            isDark:'light',
            data: [],
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        this.setState({data: Client4.getChannelStats(this.props.channelId)})
    }

    render= (): JSX.Element => {
        const {channelId} = this.props;
        return (
            <label className='text-count-members'>
                {this.state.data.map((item, index) => {
                   return item.member_count 
            })}
            Members</label>
        );
    }
}
