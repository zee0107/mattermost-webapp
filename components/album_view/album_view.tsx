// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {UserProfile} from 'mattermost-redux/types/users';
import RightSideView from 'components/right_side_view';
import { Album } from 'mattermost-redux/types/crypto';
import AlbumImageList from 'components/album_image_list';
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
                                <AlbumImageList albumId={album.id} fileName={item} index={index}/>                                    
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
                <div className='row row-cols-1 row-cols-sm-2 row-cols-md-4' data-bs-toggle='modal' data-bs-target='#ViewImageModal'>
                    {list}
                </div>
            </div>
        );
    }

    render= (): JSX.Element => {
        const { album_view, album } = this.state;
        let viewDetails;
        let albumName;
        let albumCount;
        let viewImages;
        if(album){
            console.log(album);
            albumName = album.album_name;
            albumCount = album.img_count;
            const imageList = album.files_names.split(',');
            viewImages = (
                <>
                    <div id='carouselloopIndicators' className='carousel slide' data-bs-interval='false'>
                        <div className="carousel-indicators" style={{width:'70%'}}>
                            {imageList.map((item,index) => {
                                let activeClass;
                                if(index === 0){
                                    activeClass = 'active';
                                }

                                return (
                                    <button className='hidden' type="button" data-bs-target="#carouselloopIndicators" data-bs-slide-to={index} className={activeClass} aria-label={`Slide ${index}`} key={`${item.id}--${index}`}></button>
                                );
                            })}
                        </div>
                        <div className='carousel-inner text-center'>
                            {imageList.map((item,index) => {
                                let activeClass;
                                if(index === 0){
                                    activeClass = 'active';
                                }
                                return (
                                    <div className={`carousel-item ${activeClass}`} key={`${item}-${index}`}>
                                        <AlbumImage albumId={album.id} fileName={item} />
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
                </>
            );
        }
        if(this.state.album_view === "myalbums"){
            viewDetails = this.myAlbums();
        }

        return (
            <>
                <div className='row'>
                    <div className='col-md-9'>
                        <div className='crypter-section-desktop'>
                            <div className='box-middle-panel-albums-menu'>
                                <div className='col-12 mt-2 mx-auto row'>
                                    <div className='col-md-3'></div>
                                    <div className='col-md-6'>
                                        <div className='row'>
                                            <div className='col-md-12 text-center mb-3 p-0'>
                                                <a className='onMygroupspages text-dark' onClick={() => { this.setState({album_view: 'myalbums',})}}><h3><i className='bi-image'></i> {albumName}</h3>{albumCount} Photos and Videos</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-3 text-end'>
                                        <a className='float-end rounded onCreategroups negative-margin-top' id='showNewChannel' href='/albums/create'>
                                            <i className="bi-pencil-fill"></i> Update Album</a>
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
                                            <small><h3><i className='bi-image'></i> {albumName}</h3>{albumCount} Photos and Videos</small>
                                        </a>
                                        <a className='float-end rounded onCreategroupsdesktop btn-sm text-center mt-3' href='/albums/create'>
                                        <i className="bi-pencil-fill"></i>  Update</a>
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
                <div className='modal' id='ViewImageModal' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='ViewImageModal' aria-hidden='true'>
                    <div className='modal-dialog modal-lg modal-dialog-centered' role='document'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <a className='btn-close-canvas shadow onClosecreatepost float-end' data-bs-dismiss='modal' aria-label='Close'><i className='bi-x-lg'></i></a>
                            </div>
                            <div className='modal-body'>
                                {viewImages}
                            </div>
                        </div>
                    </div>
                </div>
            </>
            
        );
    }
}
