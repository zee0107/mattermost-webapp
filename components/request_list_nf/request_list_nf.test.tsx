// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {shallow} from 'enzyme';
import React from 'react';
import {MemoryRouter} from 'react-router';

import {mountWithIntl} from 'tests/helpers/intl-test-helper';

import ProfilPage from './landing_./landing_page

describe('components/landing_page', () => {
    const baseProps = {
        actions: {
            sendPasswordResetEmail: jest.fn().mockResolvedValue({data: true}),
        },
    };

    it('should match snapshot', () => {
        const wrapper = shallow(<PasswordResetSendLink {...baseProps}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('should calls sendPasswordResetEmail() action on submit', () => {
        const props = {...baseProps};

        const wrapper = mountWithIntl(
            <MemoryRouter>
                <PasswordResetSendLink {...props}/>
            </MemoryRouter>,
        ).children().children();

        (wrapper.instance() as PasswordResetSendLink).emailInput.current!.value = 'test@example.com';
        wrapper.find('form').simulate('submit', {preventDefault: () => {}});

        expect(props.actions.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });
});
