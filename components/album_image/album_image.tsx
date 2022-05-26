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
    }

    getImage = async (channel: string) => {
        const {albumId, fileName} = this.props;
        const response = await fetch(`https://localhost:44312/api/crypter/albumfile?id=${albumId}&filename=${fileName}`);
        console.log(response);
        const imageBlob = await response.blob();
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
        const { img_url } = this.state;
        let cover;
        if(img_url === 'unavailable'){
            cover = (<img width='100%' height='190' src={GroupLogo} alt=''/>);
        }
        else{
            cover = (<img width='100%' height='190' src={img_url} alt=''/>);
        }

        return (
            <>
                {cover}
            </>
        );
    }
}
