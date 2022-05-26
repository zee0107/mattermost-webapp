// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {UserProfile} from 'mattermost-redux/types/users';
import RightSideView from 'components/right_side_view';
import { Album } from 'mattermost-redux/types/crypto';
import AlbumImageList from 'components/album_image_list';
import AlbumImage from 'components/album_image';
import logoWhite from 'images/logoLight.png';

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
        let viewImagesDesktop;
        let viewImagesMobile;
        if(album){
            console.log(album);
            albumName = album.album_name;
            albumCount = album.img_count;
            const imageList = album.files_names.split(',');
            viewImagesDesktop = (
                <>
                    <div id='carouselVideophotosIndicators' className='carousel slide' data-bs-interval='false'>
                        <div className='carousel-inner'>
                            {imageList.map((item,index) => {
                                let activeClass;
                                if(index === 0){
                                    activeClass = 'active';
                                }
                                else{
                                    activeClass = ''
                                }

                                return (
                                    <div className={`carousel-item text-center ${activeClass}`} key={`${item}-${index}`}>
                                        <AlbumImage albumId={album.id} fileName={item} />
                                    </div>
                                );
                            })}
                        </div>
                        <a className='carousel-control-prev' href='#carouselVideophotosIndicators' role='button' data-slide='prev'>
                            <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                            <span className='sr-only'>Previous</span>
                        </a>
                        <a className='carousel-control-next' href='#carouselVideophotosIndicators' role='button' data-slide='next'>
                            <span className='carousel-control-next-icon' aria-hidden='true'></span>
                            <span className='sr-only'>Next</span>
                        </a>
                    </div>
                </>
            );

            viewImagesMobile = (
                <>
                    <div id='carouselVideophotosIndicatorsMobile' className='carousel slide' data-bs-interval='false'>
                        <div className='carousel-inner'>
                            {imageList.map((item,index) => {
                                let activeClass;
                                if(index === 0){
                                    activeClass = 'active';
                                }
                                else{
                                    activeClass = ''
                                }

                                return (
                                    <div className={`carousel-item ${activeClass}`} key={`${item}-${index}`}>
                                        <AlbumImage albumId={album.id} fileName={item} />
                                    </div>
                                );
                            })}
                        </div>
                        <a className='carousel-control-prev' href='#carouselVideophotosIndicatorsMobile' role='button' data-slide='prev'>
                            <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                            <span className='sr-only'>Previous</span>
                        </a>
                        <a className='carousel-control-next' href='#carouselVideophotosIndicatorsMobile' role='button' data-slide='next'>
                            <span className='carousel-control-next-icon' aria-hidden='true'></span>
                            <span className='sr-only'>Next</span>
                        </a>
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

                <div className='modal postvideophotoviewer' id='ViewImageModal' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='ViewImageModal' aria-hidden='true'>
                    <div className='video-photo-post-viewer-desktop'>
                        <div className='position-absolute top-0 end-0 p-2' style={{zIndex: 99}}>
                            <a className='onClosevideophotosprev shadow float-end ms-2'><i className='bi-x'></i></a>
                        </div>
                    </div>
                    <div className='video-photo-post-viewer-mobile'>
                        <div className='position-absolute top-0 end-0 p-3' style={{zIndex:350, margin: '62px 0px 0px 0px'}}>
                            <a className='onClosevideophotosprev shadow float-end ms-2'><i className='bi-x'></i></a>
                        </div>
                    </div>
                    <div className='position-absolute top-0 start-0 p-2' style={{zIndex: 99}}>
                        <img className='img-fluid' src={logoWhite} alt=''/>
                    </div>
                    <div className='container-fluid mt-4 mb-4 post-ratio'>
                        <div className='post-ratio-style'>
                            <div className='row'>
                                <div className='col-lg-12 mt-2'>
                                    <div className='video-photo-post-viewer-desktop'>
                                        {viewImagesDesktop}
                                    </div>
                                    <div className='video-photo-post-viewer-mobile'>
                                        {viewImagesMobile}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
