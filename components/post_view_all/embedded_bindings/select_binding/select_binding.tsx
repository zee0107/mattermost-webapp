// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {injectIntl, IntlShape} from 'react-intl';

import {ActionResult} from 'mattermost-redux/types/actions';

import {Post} from 'mattermost-redux/types/posts';

import {AppBinding, AppCallRequest, AppForm} from 'mattermost-redux/types/apps';
import {Channel} from 'mattermost-redux/types/channels';

import {AppBindingLocations, AppCallResponseTypes, AppCallTypes, AppExpandLevels} from 'mattermost-redux/constants/apps';

import {DoAppCall, PostEphemeralCallResponseForPost} from 'types/apps';

import MenuActionProvider from 'components/suggestion/menu_action_provider';
import AutocompleteSelector from 'components/autocomplete_selector';
import PostContext from 'components/post_view_all/post_context';
import {createCallContext, createCallRequest} from 'utils/apps';

type Option = {
    text: string;
    value: string;
};

type Props = {
    intl: IntlShape;
    post: Post;
    binding: AppBinding;
    actions: {
        doAppCall: DoAppCall;
        getChannel: (channelId: string) => Promise<ActionResult>;
        postEphemeralCallResponseForPost: PostEphemeralCallResponseForPost;
        openAppsModal: (form: AppForm, call: AppCallRequest) => void;
    };
};

type State = {
    selected?: Option;
};

export class SelectBinding extends React.PureComponent<Props, State> {
    private providers: MenuActionProvider[];
    private nOptions = 0;
    constructor(props: Props) {
        super(props);

        const binding = props.binding;
        this.providers = [];
        if (binding.bindings) {
            const options: Array<{text: string; value: string}> = [];
            const usedLabels: {[label: string]: boolean} = {};
            const usedValues: {[label: string]: boolean} = {};
            binding.bindings.forEach((b) => {
                const label = b.label || b.location;
                if (!label) {
                    return;
                }

                if (!b.location) {
                    return;
                }

                if (usedLabels[label]) {
                    return;
                }

                if (usedValues[b.location]) {
                    return;
                }

                usedLabels[label] = true;
                usedValues[b.location] = true;

                options.push({text: label, value: b.location});
            });

            this.nOptions = options.length;
            this.providers = [new MenuActionProvider(options)];
        }

        this.state = {};
    }

    handleSelected = async (selected: Option) => {
        if (!selected) {
            return;
        }

        this.setState({selected});
        const binding = this.props.binding.bindings?.find((b) => b.location === selected.value);
        if (!binding) {
            console.debug('Trying to select element not present in binding.'); //eslint-disable-line no-console
            return;
        }

        const call = binding.form?.call || binding.call;
        if (!call) {
            return;
        }

        const {post, intl} = this.props;

        let teamID = '';
        const {data} = await this.props.actions.getChannel(post.channel_id) as {data?: any; error?: any};
        if (data) {
            const channel = data as Channel;
            teamID = channel.team_id;
        }

        const context = createCallContext(
            binding.app_id,
            AppBindingLocations.IN_POST + '/' + binding.location,
            post.channel_id,
            teamID,
            post.id,
            post.root_id,
        );
        const callRequest = createCallRequest(
            call,
            context,
            {post: AppExpandLevels.EXPAND_ALL},
        );

        if (binding.form) {
            this.props.actions.openAppsModal(binding.form, callRequest);
            return;
        }

        const res = await this.props.actions.doAppCall(callRequest, AppCallTypes.SUBMIT, intl);

        if (res.error) {
            const errorResponse = res.error;
            const errorMessage = errorResponse.error || intl.formatMessage({
                id: 'apps.error.unknown',
                defaultMessage: 'Unknown error occurred.',
            });
            this.props.actions.postEphemeralCallResponseForPost(errorResponse, errorMessage, post);
            return;
        }

        const callResp = res.data!;
        switch (callResp.type) {
        case AppCallResponseTypes.OK:
            if (callResp.markdown) {
                this.props.actions.postEphemeralCallResponseForPost(callResp, callResp.markdown, post);
            }
            break;
        case AppCallResponseTypes.NAVIGATE:
            break;
        case AppCallResponseTypes.FORM:
            if (callResp.form) {
                this.props.actions.openAppsModal(callResp.form, callRequest);
            }
            break;
        default: {
            const errorMessage = this.props.intl.formatMessage({
                id: 'apps.error.responses.unknown_type',
                defaultMessage: 'App response type not supported. Response type: {type}.',
            }, {
                type: callResp.type,
            });
            this.props.actions.postEphemeralCallResponseForPost(callResp, errorMessage, post);
        }
        }
    }

    render() {
        if (!this.nOptions) {
            return null;
        }

        const {binding} = this.props;
        const label = binding.label || binding.location;
        if (!label) {
            return null;
        }

        return (
            <PostContext.Consumer>
                {({handlePopupOpened}) => (
                    <AutocompleteSelector
                        providers={this.providers}
                        onSelected={this.handleSelected}
                        placeholder={label}
                        inputClassName='post-attachment-dropdown'
                        value={this.state.selected?.text}
                        toggleFocus={handlePopupOpened}
                    />
                )}
            </PostContext.Consumer>
        );
    }
}

export default injectIntl(SelectBinding);
