// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, HTMLAttributes} from 'react';
import classNames from 'classnames';
import { registerPluginTranslationsSource } from 'actions/views/root';

type Props = {
    code?: string;
};

type Attrs = HTMLAttributes<HTMLElement>;

export default class Icon extends React.PureComponent<Props, Attrs>{
    constructor(props: Props) {
        super(props);
        this.state = {logo_url: []};
    }
    getIcon = (currency) => {
        const uri = new URL("https://pro-api.coinmarketcap.com/v2/cryptocurrency/info");
        let startupApiKey = "813046b6-001a-4064-83bb-1604c47beffa";
        const config = {
            method: "GET",
            headers: {Accepts: "application/json","Content-Type":"application/json","Access-Control-Allow-Origin": "*"}
        };
        
        const sendData={symbol: currency,CMC_PRO_API_KEY:startupApiKey};
        uri.search = new URLSearchParams(sendData).toString();
    
        fetch(uri,config).then(response => response.json()).then(response => {
            let tmpArray = [];
            tmpArray.push(response.data);
            this.setState({logo_url:tmpArray})
        }).catch(function(error) {console.log(error);});  
    
        const array = this.state.logo_url.map(item => {
            const key = Object.keys(item)[0];
            return item[key]
        });
        console.log(newData);
    
        const newData = array.map(item => {
            const key = Object.keys(item)[0];
            return item[key]
        });

        const finalData = newData.map(item => {
            const key = Object.keys(item)[0];
            return item[key]
        });
    
        console.log(finalData);
        return finalData;
    }

    render(): React.ReactNode {
        return(
            <div>
                {this.getIcon(this.props.code).map((item,index) => {
                    let key= Object.keys(item)[0];
                    return (<img src={item[key].logo} key={code+index} alt={code + '-icon'}></img>)
                })}
            </div>
        )
    }
}
