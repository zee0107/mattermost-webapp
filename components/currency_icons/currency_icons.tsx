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

    componentDidMount (){
        const uri = new URL("https://pro-api.coinmarketcap.com/v2/cryptocurrency/info");
        let startupApiKey = "813046b6-001a-4064-83bb-1604c47beffa";
        const config = {
            method: "GET",
            headers: {Accepts: "application/json","Content-Type": "application/json","Access-Control-Allow-Origin": "http://localhost:8065"}
        }
        
        const sendData={symbol: this.props.code,CMC_PRO_API_KEY:startupApiKey};
        uri.search = new URLSearchParams(sendData).toString();
    
        fetch(uri,config).then(response => response.json()).then(response => {
            let tmpArray = [];
            tmpArray.push(response.data);
            this.setState({logo_url:tmpArray})
        }).catch(function(error) {console.log(error);});  
    }

    getIcon = () => {
            const array = this.state.logo_url.map(item => {
                const key = Object.keys(item)[0];
                return item[key]
            });

            const newData = array.map(item => {
                const key = Object.keys(item)[0];
                return item[key]
            });

            const slicedData = newData.slice(0,1);
            return slicedData;
    }

    render(): React.ReactNode {
        const {
            code
        } = this.props;

        return(
            <div>
                {this.getIcon().map((item,index) => 
                    (<img src={item.logo} key={code+index} alt={code + '-icon'} className='currency-icon'></img>)
                )}
            </div>
        )
    }
}
