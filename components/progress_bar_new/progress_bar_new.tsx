// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, HTMLAttributes, useEffect} from 'react';
import classNames from 'classnames';
import { registerPluginTranslationsSource } from 'actions/views/root';
import { typeOf } from 'react-is';

type Props = {
    min?: string;
    max?: string;
    completed: string;
};

export default class Icon extends React.PureComponent<Props>{
    constructor(props: Props) {
        super(props);
        this.state = {code:'',logo_url: '',};
    }

    render(): React.ReactNode {
        const {
            completed,min,max
        } = this.props;

        return(
            <div className='containter-bar'>
                <div className='filler-bar'>
                <span
                    role="progressbar"
                    aria-valuenow={completed}
                    aria-valuemin={min}
                    aria-valuemax={max} >
                </span>
                </div>
            </div>
        )
    }
}
