// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Location} from 'history';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {withRouter, matchPath} from 'react-router-dom';

import {createSelector} from 'reselect';

import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {
    getCurrentChannel,
    getMyCurrentChannelMembership,
} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentRelativeTeamUrl} from 'mattermost-redux/selectors/entities/teams';
import {isChannelMuted} from 'mattermost-redux/utils/channel_utils';

import {
    closeRightHandSide as closeRhs,
    closeMenu as closeRhsMenu,
} from 'actions/views/rhs';
import {close as closeLhs} from 'actions/views/lhs';

import {getIsRhsOpen} from 'selectors/rhs';
import {getIsMobileView} from 'selectors/views/browser';

import {GlobalState} from 'types/store';

import HeaderMobile from './header_mobile';

const isCurrentChannelMuted = createSelector(
    'isCurrentChannelMuted',
    getMyCurrentChannelMembership,
    (membership) => isChannelMuted(membership),
);

type OwnProps = {
    location: Location;
}

const mapStateToProps = (state: GlobalState, ownProps: OwnProps) => ({
    user: getCurrentUser(state),
    isMobileView: getIsMobileView(state),
    isMuted: isCurrentChannelMuted(state),
    isReadOnly: false,
    isRHSOpen: getIsRhsOpen(state),
    inGlobalThreads: Boolean(matchPath(ownProps.location.pathname, {path: '/:team/threads/:threadIdentifier?'})),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    actions: bindActionCreators({
        closeLhs,
        closeRhs,
        closeRhsMenu,
    }, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderMobile));
