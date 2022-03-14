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
        this.state = {code:'',logo_url: [],final_url:[]};
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
        
            return fetch(uri,config).then(response => response.json()).then(response => {
                let tmpArray = [];
                tmpArray.push(response.data);
                return tmpArray;
            }).catch(function(error) {console.log(error);});  
    }

    icon_value = () => {
        const value = this.getIcon(this.props.code);
        const array = value.map(item => {
            const key = Object.keys(item)[0];
            return item[key]
        });

        const newData = array.map(item => {
            const key = Object.keys(item)[0];
            return item[key]
        });

        const slicedData = newData.slice(0,1);
        console.log(slicedData);
        return slicedData;
    }

    render(): React.ReactNode {
        const {
            code
        } = this.props;

        this.getIcon(code);

        return(
            <div>
                {this.icon_value().map((item,index) => 
                    (<img src={item.logo} key={code+index} alt={code + '-icon'}></img>)
                )}
            </div>
        )
    }
}
