// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import Reaction from 'components/post_view_all/reaction/reaction';

describe('components/post_view_all/Reaction', () => {
    const post = {id: 'post_id_1'};
    const reactions = [{user_id: 'user_id_2'}, {user_id: 'user_id_3'}];
    const emojiName = 'smile';
    const actions = {
        addReaction: jest.fn(),
        getMissingProfilesByIds: jest.fn(),
        removeReaction: jest.fn(),
    };
    const currentUserId = 'user_id_1';

    const baseProps = {
        canAddReactions: true,
        canRemoveReactions: true,
        currentUserId,
        post,
        currentUserReacted: false,
        emojiName,
        reactionCount: 2,
        reactions,
        emojiImageUrl: 'emoji_image_url',
        actions,
    };

    test('should match snapshot', () => {
        const wrapper = shallow(<Reaction {...baseProps}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot when a current user reacted to a post', () => {
        const newReactions = [{user_id: 'user_id_1'}, {user_id: 'user_id_2'}];
        const props = {
            ...baseProps,
            currentUserReacted: true,
            reactions: newReactions,
        };
        const wrapper = shallow(<Reaction {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should return null/empty if no emojiImageUrl', () => {
        const props = {...baseProps, emojiImageUrl: ''};
        const wrapper = shallow(<Reaction {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should apply read-only class if user does not have permission to add reaction', () => {
        const props = {...baseProps, canAddReactions: false};
        const wrapper = shallow(<Reaction {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should apply read-only class if user does not have permission to remove reaction', () => {
        const newCurrentUserId = 'user_id_2';
        const props = {
            ...baseProps,
            canRemoveReactions: false,
            currentUserId: newCurrentUserId,
            currentUserReacted: true,
        };
        const wrapper = shallow(<Reaction {...props}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should have called actions.getMissingProfilesByIds when loadMissingProfiles is called', () => {
        const wrapper = shallow(<Reaction {...baseProps}/>);
        wrapper.instance().loadMissingProfiles();

        expect(actions.getMissingProfilesByIds).toHaveBeenCalledTimes(1);
        expect(actions.getMissingProfilesByIds).toHaveBeenCalledWith([reactions[0].user_id, reactions[1].user_id]);
    });
});
