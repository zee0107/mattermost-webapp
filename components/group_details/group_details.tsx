// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import {Client4} from 'mattermost-redux/client';

type Props = {
    channelId:string;
}

type State = {
    isDark: string;
    data: ChannelStats;
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
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
        const uri = new URL(`/api/v4/channels/${this.props.channelId}/stats`);
        const config = {
            method: "GET"
        }

        fetch(uri,config).then(response => response.json()).then(response => {
            console.log(response.data)
            this.setState({data: response.data})
        }).catch(function(error) {console.log(error);});  
    }

    render= (): JSX.Element => {
        const {channelId} = this.props;
        console.log(this.state.data);
        return (
            <label className='text-count-members'>
                {this.state.data.member_count}
                {/*this.state.data.map((item, index) => {
                   return item.member_count 
            })*/}
            Members</label>
        );
    }
}
