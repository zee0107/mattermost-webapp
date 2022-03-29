// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch, ActionCreatorsMapObject} from 'redux';

import Permissions from 'mattermost-redux/constants/permissions';
import {haveICurrentChannelPermission} from 'mattermost-redux/selectors/entities/roles';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {Action} from 'mattermost-redux/types/actions';
import {createChannel} from 'mattermost-redux/actions/channels';
import {GlobalState} from 'mattermost-redux/types/store';
import {Client4} from 'mattermost-redux/client';

import {switchToChannel} from 'actions/views/channel';
import {closeModal} from 'actions/views/modals';

import NewChannelFlow, {Props} from './new_channel_flow';


function mapStateToProps(state: GlobalState) {
    let currentTeam = Client4.getTeam('5meubtskybn1bg7iyfx7x4cm9c');
    /*if (currentTeam === undefined){
        let team = Client4.getTeam('5meubtskybn1bg7iyfx7x4cm9c');
        if(team != null){
            Promise.resolve(team).then(value => { currentTeam = value; })
        }
    }*/
    let canCreatePublicChannel = true;
    let canCreatePrivateChannel = true;

    if (currentTeam) {
        canCreatePublicChannel = haveICurrentChannelPermission(state, Permissions.CREATE_PUBLIC_CHANNEL);
        canCreatePrivateChannel = haveICurrentChannelPermission(state, Permissions.CREATE_PRIVATE_CHANNEL);
    }

    return {
        currentTeamId: currentTeam.id,
        canCreatePrivateChannel,
        canCreatePublicChannel,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<Action>, Props['actions']>({
            createChannel,
            switchToChannel,
            closeModal,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewChannelFlow);
