// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';

import {GlobalState} from 'types/store/index.js';
import {Client4} from 'mattermost-redux/client';

import {Post, PostDetailed} from 'mattermost-redux/types/posts.js';

import {FileInfo} from 'mattermost-redux/types/files.js';

import {ActionResult} from 'mattermost-redux/types/actions.js';

import {CommandArgs} from 'mattermost-redux/types/integrations.js';

import {PostDraft} from 'types/store/rhs.js';

import {ModalData} from 'types/actions.js';

import {getConfig, getLicense} from 'mattermost-redux/selectors/entities/general';
import {getCurrentTeamId, getTeamByName} from 'mattermost-redux/selectors/entities/teams';
import {UserProfile} from 'mattermost-redux/types/users';

import {getCurrentChannel, getCurrentChannelStats, getChannelMemberCountsByGroup as selectChannelMemberCountsByGroup, getChannelByName} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentUserId, getStatusForUserId, getUser, getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {haveICurrentChannelPermission} from 'mattermost-redux/selectors/entities/roles';
import {getChannelTimezones, getChannelMemberCountsByGroup} from 'mattermost-redux/actions/channels';
import {get, getInt, getBool} from 'mattermost-redux/selectors/entities/preferences';
import {PreferenceType} from 'mattermost-redux/types/preferences';
import {savePreferences} from 'mattermost-redux/actions/preferences';
import {
    getCurrentUsersLatestPost,
    getLatestReplyablePostId,
    makeGetMessageInHistoryItem,
} from 'mattermost-redux/selectors/entities/posts';
import {getAssociatedGroupsForReferenceByMention} from 'mattermost-redux/selectors/entities/groups';
import {
    addMessageIntoHistory,
    createPostDetailed,
    moveHistoryIndexBack,
    moveHistoryIndexForward,
    removeReaction,
} from 'mattermost-redux/actions/posts';
import {Permissions, Posts, Preferences as PreferencesRedux} from 'mattermost-redux/constants';

import {connectionErrorCount} from 'selectors/views/system';

import {addReaction, createPost, setEditingPost, emitShortcutReactToLastPostFrom} from 'actions/post_actions.jsx';
import {scrollPostListToBottom} from 'actions/views/channel';
import {selectPostFromRightHandSideSearchByPostId} from 'actions/views/rhs';
import {setShowPreviewOnCreatePost} from 'actions/views/textbox';
import {executeCommand} from 'actions/command';
import {runMessageWillBePostedHooks, runSlashCommandWillBePostedHooks} from 'actions/hooks';
import {getPostDraft, getIsRhsExpanded} from 'selectors/rhs';
import {showPreviewOnCreatePost} from 'selectors/views/textbox';
import {getCurrentLocale} from 'selectors/i18n';
import {getEmojiMap, getShortcutReactToLastPostEmittedFrom} from 'selectors/emojis';
import {setGlobalItem, actionOnGlobalItemsWithPrefix} from 'actions/storage';
import {openModal} from 'actions/views/modals';
import {Constants, Preferences, StoragePrefixes, TutorialSteps, UserStatuses} from 'utils/constants';
import {canUploadFiles} from 'utils/file_utils';
import {isFeatureEnabled} from 'utils/utils';

import CreatePostAlbum from './create_post_album';
type OwnProps = {
    userData?: UserProfile;
}
function makeMapStateToProps() {
    const getMessageInHistoryItem = makeGetMessageInHistoryItem(Posts.MESSAGE_TYPES.POST as any);

    return (state: GlobalState, ownProps: OwnProps) => {
        console.log(state);
        const channel = getChannelByName(state,'town-square');
        const channelId = channel?.id;
        //const channelId = 'dodurztr1fbupnpenjgxqjso3a';
        const config = getConfig(state);
        let currentUser;
        if (ownProps.userData === null || ownProps.userData === undefined){
            currentUser = getCurrentUser(state);
        }else{
            currentUser = ownProps.userData;
        }
        const license = getLicense(state);
        const currentChannel = Client4.getChannel(channelId);
        const currentChannelTeammateUsername = getUser(state,'')?.username;
        const draft = getPostDraft(state, StoragePrefixes.DRAFT, channelId);
        const latestReplyablePostId = getLatestReplyablePostId(state);
        const currentChannelMembersCount = getCurrentChannelStats(state) ? getCurrentChannelStats(state).member_count : 1;
        const tutorialStep = getInt(state, Preferences.TUTORIAL_STEP, getCurrentUserId(state), TutorialSteps.FINISHED);
        const enableEmojiPicker = config.EnableEmojiPicker === 'true';
        const enableGifPicker = config.EnableGifPicker === 'true';
        const enableConfirmNotificationsToChannel = config.EnableConfirmNotificationsToChannel === 'true';
        const currentUserId = getCurrentUserId(state);
        const userIsOutOfOffice = getStatusForUserId(state, currentUserId) === UserStatuses.OUT_OF_OFFICE;
        const badConnection = connectionErrorCount(state) > 1;
        const isTimezoneEnabled = config.ExperimentalTimezone === 'true';
        const shortcutReactToLastPostEmittedFrom = getShortcutReactToLastPostEmittedFrom(state);
        const canPost = haveICurrentChannelPermission(state, Permissions.CREATE_POST);
        const useChannelMentions = haveICurrentChannelPermission(state, Permissions.USE_CHANNEL_MENTIONS);
        const isLDAPEnabled = license?.IsLicensed === 'true' && license?.LDAPGroups === 'true';
        const useGroupMentions = isLDAPEnabled && haveICurrentChannelPermission(state, Permissions.USE_GROUP_MENTIONS);
        const channelMemberCountsByGroup = selectChannelMemberCountsByGroup(state, channelId);
        const team = getTeamByName(state,'crypter');
        const currentTeamId = team?.id;
        //const currentTeamId = 'd7cxjgejnbdm78h4n91kqeq6ow';
        const groupsWithAllowReference = useGroupMentions ? getAssociatedGroupsForReferenceByMention(state, currentTeamId, channelId) : null;
        const enableTutorial = config.EnableTutorial === 'true';
        const showTutorialTip = enableTutorial && tutorialStep === TutorialSteps.POST_POPOVER;
        
        return {
            channelId,
            currentTeamId,
            currentChannel,
            currentChannelTeammateUsername,
            currentChannelMembersCount,
            currentUserId,
            currentUser,
            codeBlockOnCtrlEnter: getBool(state, PreferencesRedux.CATEGORY_ADVANCED_SETTINGS, 'code_block_ctrl_enter', true),
            ctrlSend: getBool(state, Preferences.CATEGORY_ADVANCED_SETTINGS, 'send_on_ctrl_enter'),
            fullWidthTextBox: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.CHANNEL_DISPLAY_MODE, Preferences.CHANNEL_DISPLAY_MODE_DEFAULT) === Preferences.CHANNEL_DISPLAY_MODE_FULL_SCREEN,
            showTutorialTip,
            messageInHistoryItem: getMessageInHistoryItem(state),
            draft,
            latestReplyablePostId,
            locale: getCurrentLocale(state),
            currentUsersLatestPost: getCurrentUsersLatestPost(state, ''),
            canUploadFiles: canUploadFiles(config),
            enableEmojiPicker,
            enableGifPicker,
            enableConfirmNotificationsToChannel,
            maxPostSize: parseInt(config.MaxPostSize || '', 10) || Constants.DEFAULT_CHARACTER_LIMIT,
            userIsOutOfOffice,
            rhsExpanded: getIsRhsExpanded(state),
            emojiMap: getEmojiMap(state),
            badConnection,
            isTimezoneEnabled,
            shortcutReactToLastPostEmittedFrom,
            canPost,
            useChannelMentions,
            shouldShowPreview: showPreviewOnCreatePost(state),
            groupsWithAllowReference,
            useGroupMentions,
            channelMemberCountsByGroup,
            isLDAPEnabled,
            tutorialStep,
            markdownPreviewFeatureIsEnabled: isFeatureEnabled(Constants.PRE_RELEASE_FEATURES.MARKDOWN_PREVIEW, state),
        };
    };
}

function onSubmitPost(post: PostDetailed, fileInfos: FileInfo[]) {
    return (dispatch: Dispatch) => {
        dispatch(createPostDetailed(post, fileInfos) as any);
    };
}

type Actions = {
    setShowPreview: (showPreview: boolean) => void;
    addMessageIntoHistory: (message: string) => void;
    moveHistoryIndexBack: (index: string) => Promise<void>;
    moveHistoryIndexForward: (index: string) => Promise<void>;
    addReaction: (postId: string, emojiName: string) => void;
    onSubmitPost: (post: PostDetailed, fileInfos: FileInfo[]) => void;
    removeReaction: (postId: string, emojiName: string) => void;
    clearDraftUploads: () => void;
    runMessageWillBePostedHooks: (originalPost: Post) => ActionResult;
    runSlashCommandWillBePostedHooks: (originalMessage: string, originalArgs: CommandArgs) => ActionResult;
    setDraft: (name: string, value: PostDraft | null) => void;
    setEditingPost: (postId?: string, refocusId?: string, title?: string, isRHS?: boolean) => void;
    selectPostFromRightHandSideSearchByPostId: (postId: string) => void;
    openModal: <P>(modalData: ModalData<P>) => void;
    closeModal: (modalId: string) => void;
    executeCommand: (message: string, args: CommandArgs) => ActionResult;
    getChannelTimezones: (channelId: string) => ActionResult;
    scrollPostListToBottom: () => void;
    emitShortcutReactToLastPostFrom: (emittedFrom: string) => void;
    getChannelMemberCountsByGroup: (channelId: string, includeTimezones: boolean) => void;
    savePreferences: (userId: string, preferences: PreferenceType[]) => ActionResult;
}

// Temporarily store draft manually in localStorage since the current version of redux-persist
// we're on will not save the draft quickly enough on page unload.
function setDraft(key: string, value: PostDraft) {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.removeItem(key);
    }
    return setGlobalItem(key, value);
}

function clearDraftUploads() {
    return actionOnGlobalItemsWithPrefix(StoragePrefixes.DRAFT, (_key: string, draft: PostDraft) => {
        if (!draft || !draft.uploadsInProgress || draft.uploadsInProgress.length === 0) {
            return draft;
        }

        return {...draft, uploadsInProgress: []};
    });
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<any>, Actions>({
            addMessageIntoHistory,
            onSubmitPost,
            moveHistoryIndexBack,
            moveHistoryIndexForward,
            addReaction,
            removeReaction,
            setDraft,
            clearDraftUploads,
            selectPostFromRightHandSideSearchByPostId,
            setEditingPost,
            emitShortcutReactToLastPostFrom,
            openModal,
            executeCommand,
            getChannelTimezones,
            runMessageWillBePostedHooks,
            runSlashCommandWillBePostedHooks,
            scrollPostListToBottom,
            setShowPreview: setShowPreviewOnCreatePost,
            getChannelMemberCountsByGroup,
            savePreferences,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(CreatePostAlbum);
