// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {ReactNode} from 'react';
import GroupDetails from 'components/group_details';
import GroupLogo from 'images/groupcover.png';
import { isGIFImage } from 'utils/utils';
import { throws } from 'assert';
import ThemeSetting from 'components/user_settings/display/user_settings_theme/user_settings_theme';

export type Props = {
    channelId:string;
    channelName: string;
    suggested: boolean;
    actions: {
        leaveChannelNew: (channelId: string) => Promise<ActionResult>;
    }
}

type State = {
    isDark: string;
    img_url: string;
};

export default class PageImage extends React.PureComponent<Props, State> {
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
        
        this.getImage(this.props.channelId);
    }

    componentDidUpdate(){

    }

    getImage = async (channel: string) => {
        const response = await fetch(`https://crypterfighter.polywickstudio.ph/api/crypter/pagecoverimg?id=${channel}`);
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
        window.location.href = `./page/channels/${name}`;
    }
    
    render= (): JSX.Element => {
        const {channelId, channelName, suggested} = this.props;
        const { img_url } = this.state;
        let cover;
        if(img_url === 'unavailable'){
            if(suggested){
                cover = (<img width='100%' height='190' src={GroupLogo} alt=''/>);
            }
            else{
                cover = (<img onClick={this.handleRedirect.bind(this,channelName,channelId)} width='100%' height='190' src={GroupLogo} alt=''/>);
            }
        }
        else{
            if(suggested){
                cover = (<img width='100%' height='190' src={img_url} alt=''/>);
            }
            else{
                cover = (<img onClick={this.handleRedirect.bind(this,channelName,channelId)} width='100%' height='190' src={img_url} alt=''/>);
            }
        }

        return (
            <div>
                {cover}
            </div>
        );
    }
}
