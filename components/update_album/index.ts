// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';

import {Client4} from 'mattermost-redux/client';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import UpdateAlbum from './update_album'

type ownProps = {
    albumId: string;
}

function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState,ownProps: ownProps) {
        if(state.entities.teams.currentTeamId === "" || state.entities.teams.currentTeamId === null || state.entities.teams.currentTeamId === undefined){
            const stateValue = window.localStorage.getItem('GlobalState');
            state = JSON.parse(stateValue);
        }
        const searchParam = ownProps.location.search.replace('?a=','');
        let album;
        if (searchParam !== undefined && searchParam !== null && searchParam !== '') {
            album = Client4.getAlbum(searchParam);
        } else {
            window.location.href = '/albums/myalbums';
        }
        const currentUser = getCurrentUser(state);

        const userId = currentUser?.id;
        return {
            userId,
            currentUser,
            album,
        };
    };
}

export default connect(makeMapStateToProps)(UpdateAlbum);
