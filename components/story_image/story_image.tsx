// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import GroupDetails from 'components/group_details';
import GroupLogo from 'images/groupcover.png';
import { isGIFImage } from 'utils/utils';
import { throws } from 'assert';
import ThemeSetting from 'components/user_settings/display/user_settings_theme/user_settings_theme';

export type Props = {
    storyId:string;
}

type State = {
    isDark: string;
    img_url: string;
};

export default class StoryImage extends React.PureComponent<Props, State> {
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
        
        this.getImage(this.props.storyId);
    }

    componentDidUpdate(){

    }

    getImage = async (story: string) => {
        const response = await fetch(`https://crypterfighter.polywickstudio.ph/api/crypter/viewphotostory?id=${story}`);
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
    
    render= (): JSX.Element => {
        const { img_url } = this.state;

        return (
            <>
                <img className='d-block w-100' src={img_url} style={{height: '100%', width: 'auto', objectFit: 'contain'}}></img>
            </>
        );
    }
}
