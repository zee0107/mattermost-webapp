// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {uploadFile, handleFileUploadEnd} from 'actions/file_actions.jsx';
import {getCurrentLocale} from 'selectors/i18n';
import {canUploadFiles} from 'utils/file_utils';

import FileUploadNew from './file_upload_new.jsx';

function mapStateToProps(state) {
    const config = getConfig(state);
    const maxFileSize = parseInt(config.MaxFileSize, 10);

    return {
        maxFileSize,
        canUploadFiles: canUploadFiles(config),
        locale: getCurrentLocale(state),
        pluginFileUploadMethods: state.plugins.components.FileUploadMethod,
        pluginFilesWillUploadHooks: state.plugins.components.FilesWillUploadHook,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            uploadFile,
            handleFileUploadEnd,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(FileUploadNew);
