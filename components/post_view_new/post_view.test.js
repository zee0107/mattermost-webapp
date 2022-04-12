// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import PostList from './post_list';
import PostViewNew from './post_view_new.jsx';

describe('components/post_view_new/post_view_new', () => {
    const baseProps = {
        lastViewedAt: 12345678,
        isFirstLoad: false,
        channelLoading: false,
        channelId: '1234',
        focusedPostId: '12345',
    };
    jest.useFakeTimers();

    beforeEach(() => {
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 16));
    });

    afterEach(() => {
        window.requestAnimationFrame.mockRestore();
    });

    test('should match snapshot for channel loading', () => {
        const wrapper = shallow(<PostViewNew {...{...baseProps, channelLoading: true}}/>);
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot for loaderForChangeOfPostsChunk', () => {
        const wrapper = shallow(<PostViewNew {...baseProps}/>);
        wrapper.setState({loaderForChangeOfPostsChunk: true});
        expect(wrapper).toMatchSnapshot();
    });

    test('unreadChunkTimeStamp should be set for first load of channel', () => {
        const wrapper = shallow(<PostViewNew {...{...baseProps, isFirstLoad: true}}/>);
        expect(wrapper.state('unreadChunkTimeStamp')).toEqual(baseProps.lastViewedAt);
    });

    test('changeUnreadChunkTimeStamp', () => {
        const wrapper = shallow(<PostViewNew {...{...baseProps, isFirstLoad: true}}/>);
        expect(wrapper.state('unreadChunkTimeStamp')).toEqual(baseProps.lastViewedAt);
        wrapper.find(PostList).prop('changeUnreadChunkTimeStamp')(1234678);
        expect(wrapper.state('unreadChunkTimeStamp')).toEqual(1234678);
        expect(wrapper.state('loaderForChangeOfPostsChunk')).toEqual(true);
        jest.runOnlyPendingTimers();
        expect(wrapper.state('loaderForChangeOfPostsChunk')).toEqual(false);
    });
});
