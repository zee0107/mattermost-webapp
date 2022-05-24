// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {ReactNode} from 'react';

import Avatar, {TAvatarSizeToken} from 'components/widgets/users/avatar/avatar';
import { UserProfile } from 'mattermost-redux/types/users';
import { Story } from 'mattermost-redux/types/crypto';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import { Client4 } from 'mattermost-redux/client';
import { key } from 'localforage';
import StoryImage from 'components/story_image';

type Props = {
    userId: string;
    profilePicture: string;
    userData: UserProfile;
    currentUser: UserProfile;
    stories: Promise<Story[]>;
    onChangeSelected: any;
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

        this.closeStory = this.closeStory.bind(this);
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

    closeStory = () => {
        this.props.onChangeSelected('');
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
            let storyPrivacy;
            if(stories !== undefined && stories !== null){
                renderView = (
                    <>
                        <div className='create-all-stories-previews'>
                            <div className='row'>
                                <div className='col-8'>
                                    {this.renderProfilePicture('lg')}
                                    <small className='float-start ms-2 text-muted'><strong>{name}</strong> {storyPrivacy}</small>
                                </div>
                                <div className='col-4'>
                                    <div className='dropdown'>
                                        <a className='onClosestoryallpreviewsactions float-end shadow ms-1' data-bs-toggle='dropdown' aria-expanded='false'><i className='bi-three-dots-vertical'></i></a>
                                        <a className='onClosestoryallpreviews float-end shadow ms-1' onClick={() => this.closeStory}><i className='bi-x-lg'></i></a>

                                        <ul className='dropdown-menu dropdown-menu-dark' aria-labelledby='storyDropdown'>
                                            <li><a className='dropdown-item text-dark'><i className='bi-x-octagon-fill'></i> Mute {name}</a></li>
                                            <li><a className='dropdown-item text-dark'><i className='bi-patch-exclamation-fill'></i> Find support or report story</a></li>
                                        </ul>
                                    </div>
                                
                                    
                                </div>
                            </div>
                            <div id='carouselStoryloopIndicators' className='carousel slide' data-bs-ride='carousel'>
                                <div className="carousel-indicators" style={{width:'70%'}}>
                                    {stories.map((item,index) => {
                                        let activeClass;
                                        if(index === 0){
                                            activeClass = 'active';
                                        }

                                        if(item.privacy === 'friends'){
                                            storyPrivacy = ( <i className='bi-people-fill'></i>);
                                        }
                                        else if(item.privacy === 'Private'){
                                            storyPrivacy =  (<i className="bi-person"></i>);
                                        }
                                        else{
                                            storyPrivacy =  (<i className="bi-globe"></i>);
                                        }

                                        return (
                                            <button type="button" data-bs-target="#carouselStoryloopIndicators" data-bs-slide-to={index} className={activeClass} aria-label={`Slide ${index}`} key={`${item.id}--${index}`}></button>
                                        );
                                    })}
                                </div>
                                <div className='carousel-inner text-center'>
                                    {stories.map((item,index) => {
                                        let activeClass;
                                        if(index === 0){
                                            activeClass = 'active';
                                        }
                                        return (
                                            <div className={`carousel-item ${activeClass}`} key={`${item.id}-${index}`}>
                                                {item.type === 'text' ? 
                                                (
                                                    <div className='previews-content mt-3 mb-3 text-center' style={{backgroundColor: `${item.bg_color}`}}>
                                                        <div className='container'>
                                                            <h3><strong className='text-center' style={{overflowWrap: 'break-word',color: `${item.text_color}`}}>{item.text}</strong></h3>
                                                        </div>
                                                    </div>
                                                ):(
                                                    <div className='col-lg-12 previews-photo-story mt-6 mb-1 pb-5'>
                                                        <div className='photo-story-uploaded rounded text-center' id='resizable'>
                                                            <StoryImage storyId={item.id}/>
                                                            <div className='text-center p-5' style={{backgroundColor: `${item.bg_color}`}}>
                                                                <div className='container'>
                                                                    <h4><strong className='text-center' style={{overflowWrap: 'break-word',color: `${item.text_color}`}}>{item.text}</strong></h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <button className='carousel-control-prev' type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide='prev'>
                                <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                                <span className='visually-hidden'>Previous</span>
                                </button>
                                <button className='carousel-control-next' type='button' data-bs-target='#carouselStoryloopIndicators' data-bs-slide='next'>
                                <span className='carousel-control-next-icon' aria-hidden='true'></span>
                                <span className='visually-hidden'>Next</span>
                                </button>
                            </div>
                            
                            
                            <div className='previews-content-actions'>
                                <div className='d-flex'>
                                    <div className='col-lg-11'>
                                        <div className='form-floating'>
                                            <textarea className='form-control textares-stories-input' placeholder='Send messages...' id='' style={{height: 55}}></textarea>
                                            <label htmlFor='floatingTextarea'>Send messages...</label>
                                        </div>
                                        <div className='position-relative float-end'>
                                            <a className='onSendmessage text-dark'>
                                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='bi bi-send-fill send-icons-previews' viewBox='0 0 16 16'>
                                                <path d='M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z'/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    <div className='col-lg-1 text-center'>
                                        <p>
                                            <a className='onClicklikepreviewstories position-relative me-3'><i className='bi-hand-thumbs-up style-hand-thumbs-up-fill'></i>
                                                {/*<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger count-likes-previews'>
                                                    2m+
                                                </span>*/}
                                            </a>
                                            <a className='onClickheartpreviewstories position-relative'><i className='bi-heart style-heart-fill'></i>
                                                {/*<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger count-heart-previews'>
                                                    3.5k+
                                                </span>*/}
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
