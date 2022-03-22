// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import classNames from 'classnames';
import React from 'react';

import {FormattedMessage} from 'react-intl';

import {Channel} from 'mattermost-redux/types/channels';
import {UserProfile} from 'mattermost-redux/types/users';

import {MobileChannelHeaderDropdown} from 'components/channel_header_dropdown';
import MobileChannelHeaderPlug from 'plugins/mobile_channel_header_plug';

import CollapseLhsButton from './collapse_lhs_button';
import CollapseRhsButton from './collapse_rhs_button';
import ChannelInfoButton from './channel_info_button';
import ShowSearchButton from './show_search_button';
import UnmuteChannelButton from './unmute_channel_button';
import Logo from 'images/logoLight.png';
import Logowhite from 'images/logoWhite.png';
import Logoblack from 'images/logoBlack.png';

type Props = {
    channel?: Channel;

    /**
     * Relative url for the team, used to redirect if a link in the channel header is clicked
     */
    currentRelativeTeamUrl?: string;
    isDark: string;
    inGlobalThreads?: boolean;
    isMobileView: boolean;
    isMuted?: boolean;
    isReadOnly?: boolean;
    isRHSOpen?: boolean;
    user: UserProfile;
    actions: {
        closeLhs: () => void;
        closeRhs: () => void;
        closeRhsMenu: () => void;
    };
    classes: string;
}

export default class ChannelHeaderMobile extends React.PureComponent<Props> {
    componentDidMount() {
        document.querySelector('.inner-wrap')?.addEventListener('click', this.hideSidebars);
    }

    componentWillUnmount() {
        document.querySelector('.inner-wrap')?.removeEventListener('click', this.hideSidebars);
    }

    hideSidebars = (e: Event) => {
        if (this.props.isMobileView) {
            this.props.actions.closeRhs();

            const target = e.target as HTMLElement | undefined;

            if (target && target.className !== 'navbar-toggle' && target.className !== 'icon-bar') {
                this.props.actions.closeLhs();
                this.props.actions.closeRhsMenu();
            }
        }
    }

    render() {
        const {classes,user, channel, isMuted, isReadOnly, isRHSOpen, currentRelativeTeamUrl, inGlobalThreads,isDark} = this.props;

        let heading;
        if (inGlobalThreads) {
            heading = (
                <FormattedMessage
                    id='globalThreads.heading'
                    defaultMessage='Followed threads'
                />
            );
        } else if (channel) {
            heading = (
                <>
                    <MobileChannelHeaderDropdown/>
                    {isMuted && (
                        <UnmuteChannelButton
                            user={user}
                            channel={channel}
                        />
                    )}
                </>
            );
        }

        return (
            <nav
                id='navbar'
                className={'navbar navbar-default navbar-fixed-top ' + `${this.props.classes}`}
                role='navigation'
            >
                <div className='container-fluid theme'>
                    <div className={'navbar-header ' + `${this.props.classes}`}>
                        <CollapseLhsButton/>
                        <div className='spacer'/>
                        <div className={classNames('navbar-brand text-center', {GlobalThreads___title: inGlobalThreads})}>
                            <a href='/'>
                                {isDark === 'dark' ? <img src={Logowhite} className='logo-width-nav' alt='Crypter.io' /> : <img src={Logoblack} className='logo-width-nav' alt='Crypter.io' />}
                            </a>
                        </div>
                        {/*channel && (
                            <ChannelInfoButton
                                channel={channel}
                                isReadOnly={isReadOnly}
                                isRHSOpen={isRHSOpen}
                                currentRelativeTeamUrl={currentRelativeTeamUrl}
                            />
                        )*/}
                        <ShowSearchButton/>
                        {/*channel && (
                            <MobileChannelHeaderPlug
                                channel={channel}
                                isDropdown={false}
                            />
                        )*/}
                        <CollapseRhsButton/>
                    </div>
                </div>
            </nav>
        );
    }
}
