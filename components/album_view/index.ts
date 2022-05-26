// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {connect} from 'react-redux';
import {Client4} from 'mattermost-redux/client';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'types/store';

import AlbumView from './album_view'

type ownProps = {
    albumId: string;
}

function makeMapStateToProps() {
    return function mapStateToProps(state: GlobalState, ownProps: ownProps) {
        const currentUser = getCurrentUser(state);
        const searchParam = ownProps.location.search.replace('?a=','');
        let album;
        if (searchParam !== undefined && searchParam !== null && searchParam !== '') {
            album = Client4.getAlbum(searchParam);
        } else {
            window.location.href = '/albums/myalbums';
        }
        const userId = currentUser?.id;
        const myalbums = Client4.albumList(userId);
        return {
            userId,
            album,
            currentUser,
            myalbums,
        };
    };
}

export default connect(makeMapStateToProps)(AlbumView);
