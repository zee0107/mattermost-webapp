// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import GroupDetails from 'components/group_details';
import GroupLogo from 'images/groupcover.png';

type Props = {
    channelId:string;
    channelDisplayName: string;
    actions: {
        leaveChannelNew: (channelId: string) => Promise<ActionResult>;
    }
}

type State = {
    isDark: string;
    result_leave: boolean;
};

export default class GroupsHeader extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: '',
        profilePicture: '',
        /*status: UserStatuses.OFFLINE,*/
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            isDark:'light',
            memberCount: '',
            data: [],
            result_leave: false,
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
    }

    
    handleLeaveChannel = (channel: string) => {
        const {actions} = this.props;
        const result = actions.leaveChannelNew(channel);
        console.log(result);
        if (result.error) {
            this.setState({serverError: result.error.message});
        } else {
            this.setState({result_leave: true});
        }
    }

    leaveGroup(channel){
        this.handleLeaveChannel(channel);
    }

    render= (): JSX.Element => {
        const {channelId, channelDisplayName} = this.props;
        const { result_leave } = this.state;
        
        let buttonJoin;
        if(result_leave){
            /*browserHistory.push(`${teamUrl}/channels/town-square`);*/
            window.location.href = '/mygroups';
        }
        else{
            buttonJoin = (<button type='button' onClick={() => {this.leaveGroup(channelId)}} className='btn btn-success float-end btn-sm mt-4'>Joined</button>);
        }

        return (
            <div className='col-md-12 group-cover-box mtop-10 p-0'>
                <img width='100%' className='img-fluid' height='300' src={GroupLogo} alt=''/>
                <div className='col-md-12'>
                    <div className='float-start'>
                        <h5 className='text-primary'>{channelDisplayName}</h5>
                        <h6 className='text-secondary'><GroupDetails channelId={channelId}/></h6>
                    </div>
                    {buttonJoin}
                </div>
            </div>
        );
    }
}
