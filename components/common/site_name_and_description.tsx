// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage} from 'react-intl';

type Props = {
    customDescriptionText?: string;
    siteName: string;
}

export default class SiteNameAndDescription extends React.PureComponent<Props> {
    public static defaultProps: Partial<Props> = {
        siteName: 'Mattermost',
    }

    public render(): JSX.Element {
        const {
            customDescriptionText,
            siteName,
        } = this.props;
        let description = null;
        if (customDescriptionText) {
            description = customDescriptionText;
        } else {
            description = (
                <FormattedMessage
                    id='web.root.signup_info'
                    defaultMessage='All team communication in one place, searchable and accessible anywhere'
                />
            );
        }

        return (
            <React.Fragment>
                <h2 id='site_name'>{siteName}</h2>
                <h4
                    id='site_description'
                >
                    {description}
                </h4>
            </React.Fragment>
        );
    }
}
