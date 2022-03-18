// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, HTMLAttributes, useEffect} from 'react';
import classNames from 'classnames';
import { registerPluginTranslationsSource } from 'actions/views/root';
import { typeOf } from 'react-is';

type Props = {
    code?: string;
};

export default class Icon extends React.PureComponent<Props>{
    constructor(props: Props) {
        super(props);
        this.state = {code:'',logo_url: '',};
    }

    componentDidMount (){
        const uri = new URL("https://crypterfighter.polywickstudio.ph/api/crypter/GetLogo");
        const config = {
            method: "GET"
        }
        
        const sendData={symbol: this.props.code};
        uri.search = new URLSearchParams(sendData).toString();
    
        fetch(uri,config).then(response => response.json()).then(response => {
            this.setState({logo_url: response})
        }).catch(function(error) {console.log(error);});  
    }

    render(): React.ReactNode {
        const {
            code
        } = this.props;

        return(
            <img src={this.state.logo_url} alt={code + '-icon'} className='currency-icon'></img>
        )
    }
}
