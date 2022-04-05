// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Modal} from 'react-bootstrap';
import {Provider} from 'react-redux';

import ReactDOM from 'react-dom';
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
    IntlShape,
} from 'react-intl';

import {UserProfile} from 'mattermost-redux/types/users';
import {StatusOK} from 'mattermost-redux/types/client4';

import store from 'stores/redux_store.jsx';

import Constants from 'utils/constants';
import * as Utils from 'utils/utils.jsx';
import {t} from 'utils/i18n';
import ConfirmModal from '../../confirm_modal';

const UserSettings = React.lazy(() => import(/* webpackPrefetch: true */ 'components/user_settings'));
const SettingsSidebar = React.lazy(() => import(/* webpackPrefetch: true */ '../../settings_sidebar'));

const holders = defineMessages({
    profile: {
        id: t('user.settings.modal.profile'),
        defaultMessage: 'Profile',
    },
    security: {
        id: t('user.settings.modal.security'),
        defaultMessage: 'Security',
    },
    notifications: {
        id: t('user.settings.modal.notifications'),
        defaultMessage: 'Notifications',
    },
    display: {
        id: t('user.settings.modal.display'),
        defaultMessage: 'Display',
    },
    sidebar: {
        id: t('user.settings.modal.sidebar'),
        defaultMessage: 'Sidebar',
    },
    advanced: {
        id: t('user.settings.modal.advanced'),
        defaultMessage: 'Advanced',
    },
    checkEmail: {
        id: 'user.settings.general.checkEmail',
        defaultMessage: 'Check your email at {email} to verify the address. Cannot find the email?',
    },
    confirmTitle: {
        id: t('user.settings.modal.confirmTitle'),
        defaultMessage: 'Discard Changes?',
    },
    confirmMsg: {
        id: t('user.settings.modal.confirmMsg'),
        defaultMessage: 'You have unsaved changes, are you sure you want to discard them?',
    },
    confirmBtns: {
        id: t('user.settings.modal.confirmBtns'),
        defaultMessage: 'Yes, Discard',
    },
});

export type Props = {
    currentUser: UserProfile;
    onExited: () => void;
    intl: IntlShape;
    isContentProductSettings: boolean;
    /*actions: {
        sendVerificationEmail: (email: string) => Promise<{
            data: StatusOK;
            error: {
                err: string;
            };
        }>;
    };*/
}

type State = {
    active_tab?: string;
    active_section: string;
    showConfirmModal: boolean;
    enforceFocus?: boolean;
    show: boolean;
    resendStatus: string;
}

class PostModal extends React.PureComponent<Props, State> {
    private requireConfirm: boolean;
    private customConfirmAction: ((handleConfirm: () => void) => void) | null;
    private modalBodyRef: React.RefObject<Modal>;
    private afterConfirm: (() => void) | null;

    constructor(props: Props) {
        super(props);

        this.state = {
            active_tab: props.isContentProductSettings ? 'notifications' : 'profile',
            active_section: '',
            showConfirmModal: false,
            enforceFocus: true,
            show: true,
            resendStatus: '',
        };

        this.requireConfirm = false;

        // Used when settings want to override the default confirm modal with their own
        // If set by a child, it will be called in place of showing the regular confirm
        // modal. It will be passed a function to call on modal confirm
        this.customConfirmAction = null;
        this.afterConfirm = null;

        this.modalBodyRef = React.createRef();
    }

    /*handleResend = (email: string) => {
        this.setState({resendStatus: 'sending'});

        this.props.actions.sendVerificationEmail(email).then(({data, error: err}) => {
            if (data) {
                this.setState({resendStatus: 'success'});
            } else if (err) {
                this.setState({resendStatus: 'failure'});
            }
        });
    }*/

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.state.active_tab !== prevState.active_tab) {
            const el = ReactDOM.findDOMNode(this.modalBodyRef.current) as any;
            el.scrollTop = 0;
        }
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (Utils.cmdOrCtrlPressed(e) && e.shiftKey && Utils.isKeyPressed(e, Constants.KeyCodes.A)) {
            e.preventDefault();
            this.handleHide();
        }
    }

    // Called when the close button is pressed on the main modal
    handleHide = () => {
        if (this.requireConfirm) {
            this.showConfirmModal(() => this.handleHide());
            return;
        }

        this.setState({
            show: false,
        });
    }

    // called after the dialog is fully hidden and faded out
    handleHidden = () => {
        this.setState({
            active_tab: this.props.isContentProductSettings ? 'notifications' : 'profile',
            active_section: '',
        });
        this.props.onExited();
    }

    // Called to hide the settings pane when on mobile
    handleCollapse = () => {
        const el = ReactDOM.findDOMNode(this.modalBodyRef.current) as HTMLDivElement;
        el.closest('.modal-dialog')!.classList.remove('display--content');

        this.setState({
            active_tab: '',
            active_section: '',
        });
    }

    handleConfirm = () => {
        this.setState({
            showConfirmModal: false,
            enforceFocus: true,
        });

        this.requireConfirm = false;
        this.customConfirmAction = null;

        if (this.afterConfirm) {
            this.afterConfirm();
            this.afterConfirm = null;
        }
    }

    handleCancelConfirmation = () => {
        this.setState({
            showConfirmModal: false,
            enforceFocus: true,
        });

        this.afterConfirm = null;
    }

    showConfirmModal = (afterConfirm: () => void) => {
        if (afterConfirm) {
            this.afterConfirm = afterConfirm;
        }

        if (this.customConfirmAction) {
            this.customConfirmAction(this.handleConfirm);
            return;
        }

        this.setState({
            showConfirmModal: true,
            enforceFocus: false,
        });
    }

    // Called by settings tabs when their close button is pressed
    closeModal = () => {
        if (this.requireConfirm) {
            this.showConfirmModal(this.closeModal);
        } else {
            this.handleHide();
        }
    }

    // Called by settings tabs when their back button is pressed
    collapseModal = () => {
        if (this.requireConfirm) {
            this.showConfirmModal(this.collapseModal);
        } else {
            this.handleCollapse();
        }
    }

    updateTab = (tab?: string, skipConfirm?: boolean) => {
        if (!skipConfirm && this.requireConfirm) {
            this.showConfirmModal(() => this.updateTab(tab, true));
        } else {
            this.setState({
                active_tab: tab,
                active_section: '',
            });
        }
    }

    updateSection = (section?: string, skipConfirm?: boolean) => {
        if (!skipConfirm && this.requireConfirm) {
            this.showConfirmModal(() => this.updateSection(section, true));
        } else {
            this.setState({
                active_section: section!,
            });
        }
    }

    render() {
        const {formatMessage} = this.props.intl;
        const {currentUser} = this.props;
        if (this.props.currentUser == null) {
            return (<div/>);
        }
        const tabs = [];
        if (this.props.isContentProductSettings) {
            tabs.push({name: 'notifications', uiName: formatMessage(holders.notifications), icon: 'icon fa fa-exclamation-circle', iconTitle: Utils.localizeMessage('user.settings.notifications.icon', 'Notification Settings Icon')});
            tabs.push({name: 'display', uiName: formatMessage(holders.display), icon: 'icon fa fa-eye', iconTitle: Utils.localizeMessage('user.settings.display.icon', 'Display Settings Icon')});
            tabs.push({name: 'sidebar', uiName: formatMessage(holders.sidebar), icon: 'icon fa fa-columns', iconTitle: Utils.localizeMessage('user.settings.sidebar.icon', 'Sidebar Settings Icon')});
            tabs.push({name: 'advanced', uiName: formatMessage(holders.advanced), icon: 'icon fa fa-list-alt', iconTitle: Utils.localizeMessage('user.settings.advance.icon', 'Advanced Settings Icon')});
        } else {
            tabs.push({name: 'profile', uiName: formatMessage(holders.profile), icon: 'icon fa fa-user', iconTitle: Utils.localizeMessage('user.settings.profile.icon', 'Profile Settings Icon')});
            tabs.push({name: 'security', uiName: formatMessage(holders.security), icon: 'icon fa fa-lock', iconTitle: Utils.localizeMessage('user.settings.security.icon', 'Security Settings Icon')});
        }

        return (
            <Modal
                id='staticBackdrop'
                dialogClassName='modal postcontent'
                show={this.state.show}
                onHide={this.handleHide}
                onExited={this.handleHidden}
                enforceFocus={this.state.enforceFocus}
                role='dialog'
                aria-labelledby='staticBackdropLabel'
            >
                <Modal.Header
                    id='staticBackdropHeader'
                    closeButton={true}
                >
                    <Modal.Title
                        componentClass='h6'
                        id='accountSettingsModalLabel'
                    >
                        <FormattedMessage
                            id='createPost'
                            defaultMessage='Create post'
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body ref={this.modalBodyRef}>
                    <div className='row'>
                        <div className='col-2 text-center'>
                            <img width='50px' className='img-fluid' src='assets/images/sample-user-primary-picture-6.png'/>
                        </div>
                        <div className='col-10 text-left'>
                            <strong>
                                <a href='#'>First name</a> 
                                <a href='#' className='feelingspost'><small className='text-muted'>is feeling Grinning smile</small> &#128512;</a>
                                <a href='#' className='locationviewpost'><small className='text-muted'>is in</small> Muntinlupa City</a> 
                                <a href='#' className='tagviewpost'><small className='text-muted'>with</small> Friend name goes here</a> 
                                <a href='#' className='activities'><small className='text-muted'>Activities</small> &#128151;</a> 
                            </strong>
                            <br />
                            <a className='onSelectactionfriends'><i className='bi-people-fill'></i> Friends <i className='bi-chevron-down'></i></a>
                            <a className='onSelectactionpublic'><i className='bi-globe'></i> Everyone <i className='bi-chevron-down'></i></a>
                            <a className='onSelectactiononlyme'><i className='bi-person'></i> Private <i className='bi-chevron-down'></i></a>
                        </div>
                    </div>
                    <div className='row'>
                            <div className='form-floating'>
                            <textarea className='form-control write-whats-goingon mt-3 validate' rows='10' placeholder={`What's going on, ${currentUser.first_name} ${currentUser.last_name}`} id='floatingTextarea'></textarea>
                            <label htmlFor='floatingTextarea'>What's going on, {currentUser.first_name} {currentUser.last_name}.</label>
                            </div>
                    </div>

                    <div className='post-photo-content'>
                        <div className='row'>
                        <div className='col-9'><strong>Add Photos / Video</strong></div>
                        <div className='col-3'><a className='closePhotocontent'><i className='bi-x float-end'></i></a></div>
                        <div className='text-center'>
                            <input className='form-control form-control-lg' id='formFileLg' type='file' />
                        </div>
                        </div>
                    </div>

                    <div className='post-music-content'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-2 text-left'><img width='50px' className='rounded' src='assets/images/Cover-album.jpg' alt='Cover album' /></div>
                                <div className='col-8 mt-0'>
                                <label className='ms-3'><strong>Lovely</strong></label>
                                <p className='ms-3'><small>Eric Godlow</small></p>
                                </div>
                                <div className='col-2 mt-0'>
                                <a className='onClosemusicpost float-end'><i className='bi-x'></i></a>
                                </div>
                            </div>
                            <div className='row'>
                                <label className='mb-2'><strong>Lyrics:</strong> <br /><br /> What a wonderful world is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. <br /><br /> when an unknown printer took a galley of type and scrambled it to make a type specimen book.</label>
                            </div>
                        </div>
                    </div>

                    <div className='box-add-border'>
                        <div className='row mt-3'>
                            <div className='col-5'><p className='mt-1'><strong>Add to your post</strong></p></div>
                            <div className='col-7'>
                                <div className='btn-group float-end gap-2' role='group' aria-label='Add to your post group'>
                                    <a className='onTag'><i className='bi-tag-fill'></i></a>
                                    <a className='onAddimage'><i className='bi-image'></i></a>
                                    <a className='onAddfeelings'><i className='bi-emoji-smile-fill'></i></a>
                                    <a className='onAddmusic'><i className='bi-music-note-beamed'></i></a>
                                    <a className='onAddimage'><i className='bi-camera-video'></i></a>
                                    <a className='onLocation'><i className='bi-geo-alt-fill'></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='col-lg-12 text-center'>
                        <div className='d-grid'>
                            <button type='submit' className='btn btn-primary btn-md btn-create-post' disabled>Post</button>
                        </div>
                    </div>
                </Modal.Footer>
                <ConfirmModal
                    title={formatMessage(holders.confirmTitle)}
                    message={formatMessage(holders.confirmMsg)}
                    confirmButtonText={formatMessage(holders.confirmBtns)}
                    show={this.state.showConfirmModal}
                    onConfirm={this.handleConfirm}
                    onCancel={this.handleCancelConfirmation}
                />
            </Modal>
        );
    }
}

export default injectIntl(PostModal);
