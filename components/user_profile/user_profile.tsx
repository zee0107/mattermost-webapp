// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';

import {UserProfile as UserProfileType} from 'mattermost-redux/types/users';

import {imageURLForUser, isMobile} from 'utils/utils.jsx';
import {isGuest} from 'mattermost-redux/utils/user_utils';

import OverlayTrigger, {BaseOverlayTrigger} from 'components/overlay_trigger';
import ProfilePopover from 'components/profile_popover';
import BotBadge from 'components/widgets/badges/bot_badge';
import GuestBadge from 'components/widgets/badges/guest_badge';
import SharedUserIndicator from 'components/shared_user_indicator';

export type UserProfileProps = {
    userId: string;
    displayName?: string;
    isBusy?: boolean;
    isShared?: boolean;
    overwriteName?: React.ReactNode;
    overwriteIcon?: string;
    user?: UserProfileType;
    disablePopover?: boolean;
    displayUsername?: boolean;
    hasMention?: boolean;
    hideStatus?: boolean;
    isRHS?: boolean;
    overwriteImage?: React.ReactNode;
    channelId?: string;
    location?: string;
    activity?: string;
    shareInfo?: string;
    admin?: boolean;
    pageName?: string;
    img_src?: string;
}

export default class UserProfile extends PureComponent<UserProfileProps> {
    private overlay?: BaseOverlayTrigger;

    static defaultProps: Partial<UserProfileProps> = {
        disablePopover: false,
        displayUsername: false,
        hasMention: false,
        hideStatus: false,
        isRHS: false,
        overwriteImage: '',
        overwriteName: '',
    }

    hideProfilePopover = (): void => {
        if (this.overlay) {
            this.overlay.hide();
        }
    }

    setOverlaynRef = (ref: BaseOverlayTrigger): void => {
        this.overlay = ref;
    }

    render(): React.ReactNode {
        const {
            disablePopover,
            displayName,
            displayUsername,
            isBusy,
            isRHS,
            isShared,
            hasMention,
            hideStatus,
            overwriteName,
            overwriteIcon,
            user,
            userId,
            channelId,
            location,
            activity,
            shareInfo,
            admin,
            pageName,
            img_src,
        } = this.props;

        let name: React.ReactNode;
        let placement = 'right';
        if (isRHS && !isMobile()) {
            placement = 'left';
        }

        let profileImg = '';
        const ariaName: string = typeof name === 'string' ? name.toLowerCase() : '';

        if (user) {
            profileImg = imageURLForUser(user.id, user.last_picture_update);
        }

        if(admin){
            name = pageName;
        }
        else{
            if (user && displayUsername) {
                name = `@${(user.username)}`;
            } else {
                name = overwriteName || displayName || '...';
            }

            if (disablePopover) {
                return <div className='user-popover'>{name}</div>;
            }
        }

        let sharedIcon;
        if (isShared) {
            sharedIcon = (
                <SharedUserIndicator
                    className='shared-user-icon'
                    withTooltip={true}
                />
            );
        }

        let shareInfoDetails;
        let shareInfoIcon;
        if(shareInfo !== null && shareInfo !== ''){
            if(shareInfo === 'private'){
                shareInfoIcon = (<i className='bi bi-person-fill' title='Private'></i>);
            }
            else if(shareInfo === 'friends'){
                shareInfoIcon = (<i className='bi bi-people-fill' title='Friends'></i>);
            }
            else{
                shareInfoIcon = (<i className='bi bi-globe' title='Everyone'></i>);
            }

            if(activity !== null && activity !== '' && activity){
                const activityValue = activity.toString().split('&');
                let textValue = activityValue[0];
                let icon = String.fromCodePoint(activityValue[1].substring(1, activityValue[1].length - 1));
                if(location !== null && location !== ''){
                    shareInfoDetails = (
                        <span className='small' style={{marginTop: 2}}><label className='small'>&nbsp;is feeling&nbsp;</label><label id='rsvDesktop'>{textValue}</label><label>&nbsp;{icon}</label><br></br><label className='small'>&nbsp;in&nbsp;</label><label>{location}</label></span>
                    );
                }
                else{
                    shareInfoDetails = (
                        <span className='small' style={{marginTop: 2}}><label className='small'>&nbsp;is feeling&nbsp;</label><label id='rsvDesktop'>{textValue}&nbsp;</label><label>{icon}</label></span>
                    );
                }
            }
            else if(location !== null && location !== ''){
                shareInfoDetails = (
                    <span className='small' style={{marginTop: 2}}><label className='small'>&nbsp;is in&nbsp;</label><label>{location}</label></span>
                );
            }
            else {
                shareInfoDetails = (
                    <span className='small' style={{marginTop: 2}}></span>
                );
            }
        }

        return (
            <React.Fragment>
                <OverlayTrigger
                    ref={this.setOverlaynRef}
                    trigger='click'
                    placement={placement}
                    rootClose={true}
                    overlay={
                        <ProfilePopover
                            className='user-profile-popover'
                            userId={userId}
                            channelId={channelId}
                            src={profileImg}
                            isBusy={isBusy}
                            hide={this.hideProfilePopover}
                            hideStatus={hideStatus}
                            isRHS={isRHS}
                            hasMention={hasMention}
                            overwriteName={overwriteName}
                            overwriteIcon={overwriteIcon}
                        />
                    }
                >
                    <button
                        aria-label={ariaName}
                        className='user-popover style--none'
                    >
                        {name}{shareInfoDetails}
                        <br />
                        {user && <span className='text-muted small'>{user.position}&nbsp;{shareInfoIcon}</span>}
                        {!user && <span className='text-muted small'>&nbsp;{shareInfoIcon}</span>}
                    </button>
                </OverlayTrigger>
                {sharedIcon}
                <BotBadge
                    show={Boolean(user && user.is_bot)}
                    className='badge-popoverlist'
                />
                <GuestBadge
                    show={Boolean(user && isGuest(user.roles))}
                    className='badge-popoverlist'
                />
            </React.Fragment>
        );
    }
}
