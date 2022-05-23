// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import { Story } from 'mattermost-redux/types/crypto';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import { Client4 } from 'mattermost-redux/client';

type Props = {
    userId: string;
    profilePicture: string;
    userData: UserProfile;
    currentUser: UserProfile;
    stories: Promise<Story[]>;
}

type State = {
    isDark: string;
    currentUser: UserProfile;
    stories: Story[];
};

export default class StoryView extends React.PureComponent<Props, State> {
    static defaultProps = {userId: '',profilePicture: '',}

    constructor(props: Props) {
        super(props);
        this.state = {
            isDark: 'dark',
        };
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        this.getStoryData();
    }

    componentDidUpdate(prevProps: Props){
        if(this.props.userId !== prevProps.userId){
            this.getStoryData();
        }
    }

    getStoryData = () => {
        const { currentUser } = this.props;
        const storiesData = Client4.viewSotries(currentUser.id);
        if(storiesData !== undefined && storiesData !== null){
            Promise.resolve(storiesData).then((value) => {this.setState({stories: value});});
        }
    }

    renderProfilePicture = (size: TAvatarSizeToken): ReactNode => {
        if (!this.props.profilePicture) {
            return null;
        }
        
        return (
            <Avatar
                size={size}
                url={this.props.profilePicture}
                text={'story'}
            />
        );
    }

    render= (): JSX.Element => {
        const { currentUser } = this.props;
        const { stories } = this.state;
        
        let name;
        let renderView;
        if(currentUser !== undefined && currentUser !== null){
            if(currentUser.first_name !== ''){
                name = (<>{`${currentUser.first_name} ${currentUser.last_name}` }</>);
            }
            else{
                name = (<>{currentUser.user_name}</>);
            }

            if(stories !== undefined && stories !== null){
                renderView = (
                    <>
                        <div className='create-all-stories-previews'>
                            <div className='row'>
                                <div className='col-8'>
                                    {this.renderProfilePicture('lg')}
                                    <small className='float-start ms-2 text-muted'><strong>{name}</strong> {stories.map((item,index) => {
                                        if(item.privacy === 'friends'){
                                            return ( <i className='bi-people-fill'></i>);
                                        }
                                        else if(item.privacy === 'Private'){
                                            return (<i className="bi-person"></i>);
                                        }
                                        else{
                                            return (<i className="bi-globe"></i>);
                                        }
                                    })}</small>
                                </div>
                                <div className='col-4'>
                                    <div className='dropdown'>
                                        <a className='onClosestoryallpreviewsactions float-end shadow ms-1' id='storyDropdown' data-bs-toggle='dropdown' aria-expanded='false'><i className='bi-three-dots-vertical'></i></a>
                                        <a className='onClosestoryallpreviews float-end shadow ms-1'><i className='bi-x-lg'></i></a>
                                    </div>
                                
                                    <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='storyDropdown' id='storyDropdown'>
                                        <li><a className='dropdown-item text-dark'><i className='bi-x-octagon-fill'></i> Mute {name}</a></li>
                                        <li><a className='dropdown-item text-dark'><i className='bi-patch-exclamation-fill'></i> Find support or report story</a></li>
                                    </ul>
                                </div>
                            </div>
                            {stories.map((item,index) => {
                                return (
                                    <div className='previews-content mt-3 mb-3 text-center' style={{backgroundColor: `${item.bg_color}`}} key={`${item.id}-${index}`}>
                                        <div id='carouselStoryloopIndicators' className='carousel slide' data-bs-ride='carousel'>
                                            <div className='carousel-indicators'>
                                                <button type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide-to='0' className='active' aria-current='true' aria-label='Slide 1'></button>
                                                <button type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide-to='1' aria-label='Slide 2'></button>
                                                <button type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide-to='2' aria-label='Slide 3'></button>
                                            </div>
                                            {/*Loop for many story post*/}
                                            <div className='carousel-inner text-center'>
                                                {item.type === 'text' ? 
                                                    ( <div className='container'>
                                                        <h3><strong className='text-center' style={{overflowWrap: 'break-word',color: `${item.text_color}`}}>{this.state.textValue}</strong></h3>
                                                    </div>):
                                                    (<div className='carousel-item active'>
                                                        <img width='' src='assets/images/Cover-album-2.jpg' className='d-block w-100' alt=''/>
                                                    </div>)
                                                }
                                            </div>
                                            {/*Loop for many story post*/}
                                            <button className='carousel-control-prev' type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide='prev'>
                                            <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                                            <span className='visually-hidden'>Previous</span>
                                            </button>
                                            <button className='carousel-control-next' type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide='next'>
                                            <span className='carousel-control-next-icon' aria-hidden='true'></span>
                                            <span className='visually-hidden'>Next</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            <div className='previews-content-actions'>
                                <div className='row'>
                                    <div className='col-lg-9'>
                                        <div className='form-floating'>
                                            <textarea className='form-control textares-stories-input' placeholder='Send messages...' id=''></textarea>
                                            <label htmlFor='floatingTextarea'>Send messages...</label>
                                        </div>
                                        <div className='position-relative float-end'>
                                            <a className='onSendmessage'>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='bi bi-send-fill send-icons-previews' viewBox='0 0 16 16'>
                                                <path d='M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z'/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    <div className='col-lg-3 text-center'>
                                        <p>
                                            <a className='onClicklikepreviewstories position-relative me-3'><i className='bi-hand-thumbs-up style-hand-thumbs-up-fill'></i>
                                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger count-likes-previews'>
                                                    2m+
                                                </span>
                                            </a>
                                            <a className='onClickheartpreviewstories position-relative'><i className='bi-heart style-heart-fill'></i>
                                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger count-heart-previews'>
                                                    3.5k+
                                                </span>
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            }
        }

        return (
            <>
                {renderView}
            </>
        );
    }
}
