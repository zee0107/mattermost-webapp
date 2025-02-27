// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

import {mountWithIntl} from 'tests/helpers/intl-test-helper';
import {ModalIdentifiers} from 'utils/constants';
import ToggleModalButtonStyle from 'components/toggle_modal_button_style/toggle_modal_button_style.jsx';

class TestModal extends React.PureComponent {
    render() {
        return (
            <Modal
                show={true}
            >
                <Modal.Header closeButton={true}/>
                <Modal.Body/>
            </Modal>
        );
    }
}

describe('components/ToggleModalButtonRedux', () => {
    test('component should match snapshot', () => {
        const wrapper = mountWithIntl(
            <ToggleModalButtonStyle
                ariaLabel={'Delete Channel'}
                id='channelDelete'
                role='menuitem'
                modalId={ModalIdentifiers.DELETE_CHANNEL}
                dialogType={TestModal}
                actions={{openModal: () => true}}
            >
                <FormattedMessage
                    id='channel_header.delete'
                    defaultMessage='Delete Channel'
                />
            </ToggleModalButtonStyle>,
        );

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('button span').first().html()).toBe('<span>Delete Channel</span>');
    });
});
