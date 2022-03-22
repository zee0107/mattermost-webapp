// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

type Props = {
    symbol?: string;
};

export default class CurrencyCap extends React.PureComponent<Props>{
    constructor(props: Props) {
        super(props);
        this.state = {symbol:'',data: [],};
    }

    componentDidMount (){
        const uri = new URL("https://crypterfighter.polywickstudio.ph/api/crypter/getcurrencydata");
        const config = { method: "GET" }
        
        const sendData={symbol: this.props.symbol};
        uri.search = new URLSearchParams(sendData).toString();
    
        fetch(uri,config).then(response => response.json()).then(response => {
            this.setState({data: response});
        }).catch(function(error) {console.log(error);});  
    }

    render(): React.ReactNode {
        const { symbol } = this.props;

        return(
            <div>
                <label className='text-secondary small'key={symbol + '-range'}>1 {symbol} - {parseFloat(this.state.data.price).toFixed(15)} USD</label>
            </div>
        )
    }
}
