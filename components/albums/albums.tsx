// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {UserProfile} from 'mattermost-redux/types/users';
import RightSideView from 'components/right_side_view';

export type Props = {
    userId: string;
    currentUser: UserProfile;
}

type State = {
    isDark: string;
    album_view: string;
};
export default class MyAlbums extends React.PureComponent<Props, State> {
    static defaultProps = {
        userId: ''
    }

    constructor(props: Props) {
        super(props);

        this.state = { isDark:'light', album_view: 'myalbums',};
    }

    componentDidMount(){
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});
    }

    myAlbums = () => {
        let errorServer;

        return (
            <div className='joinedcontent col-md-12'>
                {errorServer}
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                    {/*this.state.mygroups.map((item,index) => {
                        if(item.display_name !== ''  && item.display_name !== 'Town Square'){
                            return(
                                <div className='col-md-3 p-1'>
                                    <div className='box-each-groups'>
                                        <GroupImage channelId={item.id} channelName={item.name} suggested={false} />
                                        <p onClick={this.handleRedirect.bind(this,item.name,item.id)} className='mt-4 ms-3 ml-5'>
                                        <label className='text-name-products'><strong>{item.display_name}</strong></label><br/><GroupDetail channelId={item.id}/>
                                        </p>
    
                                        <div className='col-md-12 mb-3 p-3 text-center'>
                                            <div className='d-grid'><button type='button' className='btn onUnfollowsuggested' onClick={this.leaveGroup.bind(this,item)}><label>Unfollow</label></button></div>
                                        </div>
                                        <div className='row'></div>
                                    </div>
                                </div>
                            );
                        }
                    })*/}
                </div>
            </div>
        );
    }

    render= (): JSX.Element => {
        const { album_view } = this.state;
        let viewDetails;
        if(this.state.album_view === "myalbums"){
            viewDetails = this.myAlbums();
        }

        return (
            <div className='row'>
                <div className='col-md-9'>
                    <div className='crypter-section-desktop'>
                        <div className='box-middle-panel-forums-menu'>
                            <div className='col-12 mt-2 mx-auto row'>
                                <div className='col-md-3'>
                                    <a href='/mygroups' className='onCartmarketplaceicon onMarketplace float-start mr-5'><i className='bi-images'></i></a>
                                    <label className='ms-2 text-mygroups float-start mt-2 me-5'>Albums</label>
                                </div>
                                <div className='col-md-6'>
                                    <div className='row'>
                                        <div className='col-md-12 text-center mt-2 mb-2 p-0'><a className={album_view === 'myalbums' ? 'onMygroupspages p-6 active-group-menu' : 'onMygroupspages p-6'} onClick={() => { this.setState({album_view: 'myalbums',})}}>My Albums</a></div>
                                    </div>
                                </div>
                                <div className='col-md-3 text-end'>
                                    <a className='float-end rounded onCreategroups negative-margin-top' id='showNewChannel' href='/albums/create'>
                                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#fff' className='bi bi-plus side-menu-align' viewBox='0 0 16 16'>
                                        <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/>
                                    </svg> Create Album</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='crypter-section-mobile'>
                        <div className='position-sticky float-middle-panel'>
                            <div className='d-flex mt-2'>
                                <div className='col-md-7 '><a className='onCartmarketplaceicon onMarketplace float-start'><i className='bi-images'></i></a>
                                    <strong className='float-start mt-3 ml-2 text-mygroups'>Albums</strong>
                                </div>
                                <div className='col-md-5 '><a className='float-end rounded onCreategroupsdesktop btn-sm text-center mt-3' href='/albums/create'>
                                    <i className='bi-plus'></i> Create</a>
                                </div>
                            </div>
                        </div>
                        <div className='box-middle-panel-marketplace-mobile mt-3 col-md-12'>
                            <div className='d-flex'>
                                <div className='col-md-12 text-center p-0'>
                                    <a 
                                        className={album_view === 'myalbums' ? 'onMygroupspages btn-md p-2 active-group-menu text-success' : 'onMygroupspages btn-md p-2'}
                                        onClick={() => { this.setState({album_view: 'myalbums',})}}
                                    ><small>My Albums</small></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {viewDetails}
                </div>
                <div className='col-md-3' id='rightSideView'>
                    <RightSideView/>
                </div>
            </div>
        );
    }
}
