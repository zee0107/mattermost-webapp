// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {UserProfile} from 'mattermost-redux/types/users';
import RightSideView from 'components/right_side_view';
import { Album } from 'mattermost-redux/types/crypto';
import AlbumImage from 'components/album_image';

export type Props = {
    userId: string;
    currentUser: UserProfile;
    album: Promise<Album>;
}

type State = {
    isDark: string;
    album_view: string;
    album: Album;
};
export default class AlbumView extends React.PureComponent<Props, State> {
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

        if(this.props.album !== undefined && this.props.album !== null){
            Promise.resolve(this.props.album).then((value) => {this.setState({album: value});})
        }
    }

    componentDidUpdate(){
        if(this.props.album !== undefined && this.props.myalbums !== null){
            Promise.resolve(this.props.album).then((value) => {this.setState({album: value});})
        }
    }

    myAlbums = () => {
        const {album} = this.state;
        let errorServer;
        let list;
        let noList;
        if(album){
            const images = album.files_names.split(',');
            list = (
                <>
                    {images.map((item,index) => {
                        return(
                            <div className='col-md-3 p-1' key={`${item}--${index}`}>
                                <AlbumImage albumId={album.id} fileName={item} />                                    
                            </div>
                        );
                    })}
                </>
            );
        }
        else{
            noList = (
                <h2 className='text-muted text-center mt-5'><i className='bi-image'></i><br/>There are no Photo or Video</h2>
            );
        }

        return (
            <div className='joinedcontent col-md-12'>
                {errorServer}
                {noList}
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4'>
                    {list}
                </div>
            </div>
        );
    }

    render= (): JSX.Element => {
        const { album_view, album } = this.state;
        let viewDetails;
        let albumName;
        if(album){
            albumName = album.album_name;
        }
        if(this.state.album_view === "myalbums"){
            viewDetails = this.myAlbums();
        }

        return (
            <div className='row'>
                <div className='col-md-9'>
                    <div className='crypter-section-desktop'>
                        <div className='box-middle-panel-albums-menu'>
                            <div className='col-12 mt-2 mx-auto row'>
                                <div className='col-md-3'></div>
                                <div className='col-md-6'>
                                    <div className='row'>
                                        <div className='col-md-12 text-center mt-2 p-0'>
                                            <a className='onMygroupspages text-dark' onClick={() => { this.setState({album_view: 'myalbums',})}}><h3><i className='bi-image'></i> {albumName}</h3></a>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-3 text-end'>
                                    <a className='float-end rounded onCreategroups negative-margin-top' id='showNewChannel' href='/albums/create'>
                                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#fff' className='bi bi-plus side-menu-align' viewBox='0 0 16 16'>
                                        <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/>
                                    </svg> Update Album</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='crypter-section-mobile'>
                        <div className='box-middle-panel-album-mobile mt-3 col-md-12'>
                            <div className='d-flex'>
                                <div className='col-md-12 text-center p-0'>
                                    <a className='onMygroupspages btn-md p-2 text-dark'
                                        onClick={() => { this.setState({album_view: 'myalbums',})}}>
                                        <small><h3><i className='bi-image'></i> {albumName}</h3></small>
                                    </a>
                                    <a className='float-end rounded onCreategroupsdesktop btn-sm text-center mt-3' href='/albums/create'>
                                    <i className='bi-plus'></i> Update</a>
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
