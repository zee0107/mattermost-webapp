// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, HTMLAttributes} from 'react';
import classNames from 'classnames';

import './avatar.scss';

export type TAvatarSizeToken = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'mxl' | 'fxl';

type Props = {
    url?: string;
    username?: string;
    size?: TAvatarSizeToken;
    text?: string;
};

type Attrs = HTMLAttributes<HTMLElement>;

const Avatar = ({
    url,
    username,
    size = 'md',
    text,
    ...attrs
}: Props & Attrs) => {
    const classes = classNames(`Avatar Avatar-${size}`, attrs.className);

    if (text === 'plain') {
        return (
            <img
                {...attrs}
                className={classes + ' img-fluid float-start border border-2 mt-2 rounded-circle border-success'}
                tabIndex={0}
                alt={`${username || 'user'} profile image`}
                src={url}
            />
        );
    }
    else if(text === 'story'){
        return (
            <img
                {...attrs}
                className={classes + ' user-photo vertical-align-middle float-start'}
                tabIndex={0}
                alt={`${username || 'user'} profile image`}
                src={url}
            />
        );
    }
    else if(text === 'muted'){
        return (
            <img
                {...attrs}
                className={classes + ' mt-3 me-2 user-photo vertical-align-middle float-start'}
                tabIndex={0}
                alt={`${username || 'user'} profile image`}
                src={url}
            />
        );
    }
    else if(text === 'forum'){
        return (
            <img
                {...attrs}
                className={classes + ' img-position float-start'}
                tabIndex={0}
                alt={`${username || 'user'} profile image`}
                src={url}
            />
        );
    }
    else{
        return (
            <img
                {...attrs}
                className={classes + ' user-photo vertical-align-middle'}
                tabIndex={0}
                alt={`${username || 'user'} profile image`}
                src={url}
            />
        );
    }

    return (
        <img
            {...attrs}
            className={classes}
            tabIndex={0}
            alt={`${username || 'user'} profile image`}
            src={url}
        />
    );
};
export default memo(Avatar);
