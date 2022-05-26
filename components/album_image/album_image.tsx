// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import GroupLogo from 'images/groupcover.png';
import { UserProfile } from 'mattermost-redux/types/users';

export type Props = {
    albumId: string;
    fileName: string;
    userId: string;
}

type State = {
    isDark: string;
    img_url: string;
    type: string;
};

export default class AlbumImage extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isDark:'light',
            img_url: 'unavailable',
        };
    }

    componentDidMount = () =>{
        const ThemeValue = window.localStorage.getItem('theme');
        this.setState({isDark: ThemeValue});

        this.getImage();
    }

    getImage = async () => {
        const {albumId, fileName} = this.props;
        const response = await fetch(`https://localhost:44312/api/crypter/albumfile?id=${albumId}&filename=${fileName}`);
        const imageBlob = await response.blob();
        if(imageBlob.type.includes('image')){
            this.setState({type: 'image'});
        }
        else{
            this.setState({type: 'video'});
        }

        const textBlob = await imageBlob.text();
        if (textBlob.toString() === '\"unavailable\"' || textBlob.toString() === 'unavailable')
        {
            this.setState({img_url: 'unavailable'});
        }
        else
        {
            const imageObjectURL = URL.createObjectURL(imageBlob);
            this.setState({img_url: imageObjectURL});
        }
    }

    handleRedirect = (name: string, id: string) => {
        window.localStorage.setItem('channelId', id);
        window.location.href = `./crypter/channels/${name}`;
    }
    
    render= (): JSX.Element => {
        const {channelId, channelName, suggested} = this.props;
        const { img_url, type } = this.state;
        let cover;
        if(img_url === 'unavailable'){
            cover = (<img width='100%' height='190' src={GroupLogo} alt=''/>);
        }
        else{
            if(type === 'image'){
                cover = (<img width='100%' height='190' src={img_url} alt=''/>);
            }else{
                cover = (
                    <video width='100%' height='185' style={{borderTopLeftRadius: 25,borderTopRightRadius: 25}}>
                        <source src={img_url} type='video/ogg' />
                    </video>
                );
            }
            
        }

        return (
            <>
                {cover}
            </>
        );
    }
}
