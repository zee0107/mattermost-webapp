// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {Client4} from 'mattermost-redux/client';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import MyAlbums from './albums'


function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState) {
        const currentUser = getCurrentUser(state);
        const userId = currentUser?.id;
        //const teamId = 'd7cxjgejnbdm78h4n91kqeq6ow';
        return {
            userId,
            currentUser,
        };
    };
}

export default connect(makeMapStateToProps)(MyAlbums);
