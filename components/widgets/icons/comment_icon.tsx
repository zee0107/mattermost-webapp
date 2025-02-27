// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

export default function CommentIconAdd(props: React.HTMLAttributes<HTMLSpanElement>) {
    const {formatMessage} = useIntl();
    return (
        <span {...props}>
            <svg 
                width="15" 
                height="15" 
                viewBox="0 0 15 15" 
                fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.4559 7.80832C14.4559 4.03565 11.3975 0.977295 7.62484 0.977295C3.85217 0.977295 0.793816 4.03565 0.793816 7.80832C0.793816 11.581 3.85217 14.6393 7.62484 14.6393C8.44827 14.6393 9.57942 14.339 11.0183 13.7382L13.3451 14.6458L13.414 14.6682C13.7148 14.7471 14.0335 14.5897 14.1493 14.293C14.1956 14.1743 14.2042 14.0443 14.1742 13.9206L13.5254 11.2524L13.6316 10.9982C14.1811 9.65971 14.4559 8.59642 14.4559 7.80832ZM12.7611 10.6652L12.547 11.1722L13.1279 13.5614L11.0062 12.7337L10.4268 12.974C9.20476 13.4671 8.26083 13.7079 7.6246 13.7079C4.36638 13.7079 1.72507 11.0666 1.72507 7.80834C1.72507 4.55012 4.36638 1.90882 7.6246 1.90882C10.8828 1.90882 13.5241 4.55012 13.5241 7.80834C13.5241 8.45761 13.2739 9.41999 12.7611 10.6652Z" fill="#3e425080"/>
            </svg>
        </span>
    );
}
