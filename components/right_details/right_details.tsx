// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, HTMLAttributes, useEffect} from 'react';
import trendImage from 'images/trending-up.svg';
import trenddownImage from 'images/trending-down.svg';
import btcImage from 'images/currency-icons/btc.svg';
import ltcImage from 'images/currency-icons/ltc.svg';
import bnbImage from 'images/currency-icons/bnb.svg';
import ethImage from 'images/currency-icons/eth.svg';
import graphImage from 'images/graph-up.svg';
import graphdownImage from 'images/graph-down.svg';

type Props = {
    symbol?: string;
};

export default class RightDetails extends React.PureComponent<Props>{
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

    renderGraph = () =>{
        if(this.props.symbol === 'BTC'){
            return (<div className="livecoinwatch-widget-1" lcw-coin="BTC" lcw-base="USD" lcw-secondary="BTC" lcw-period="d" lcw-color-tx="#ffffff" lcw-color-pr="#58c7c5" lcw-color-bg="#1f2434" lcw-border-w="1" ></div>);
        }
        else{
            if(parseFloat(this.state.data.percent_change_24h) > 0){ 
                return (<img src={graphImage} className="graph-img"></img>) 
            }
            else{ 
                return (<img src={graphdownImage} className="graph-img"></img>) 
            }
        }
    }

    renderPercent = () => {
        if(parseFloat(this.state.data.percent_change_24h) > 0){
            return (<div>
                        <h3 className='text-secondary' key={this.state.data.symbol+"_price"}>{parseFloat(this.state.data.price).toFixed(2)}</h3>
                        <p className='text-percent' key={this.state.data.symbol+"_24h"}><img src={trendImage}></img> {parseFloat(this.state.data.percent_change_24h).toFixed(2)}%</p>
                    </div>)
        }else{
            return (<div>
                        <h3 className='text-secondary' key={this.state.data.symbol+"_price"}>{parseFloat(this.state.data.price).toFixed(2)}</h3>
                        <p className='text-percent-down' key={this.state.data.symbol+"_24h"}><img src={trenddownImage}></img> {parseFloat(this.state.data.percent_change_24h).toFixed(2)*(-1)}%</p>
                    </div>)
        }
    }
    
    sideBoxRender = (code: string) => {
        let img;
        if(code === "BTC"){ img = (<img src={btcImage} className="current-conversion-img"></img>);}
        if(code === "LTC"){ img = (<img src={ltcImage} className="current-conversion-img"></img>);}
        if(code === "ETH"){ img = (<img src={ethImage} className="current-conversion-img"></img>);}
        if(code === "BNB"){ img = (<img src={bnbImage} className="current-conversion-img"></img>);}
        return(
            <div className='col-sm-12'>
                <div className='sidemenuBox'>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className={code.toLocaleLowerCase() +"-icon"}>
                                {img}
                            </div>
                            <h5 className='text-primary'>{code} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="var(--text-primary)" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                            </svg> USD</h5>
                            {this.renderPercent()}
                        </div>
                        <div className='col-lg-6 removePaddingRight'>

                            {this.renderGraph()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render(): React.ReactNode {
        const { symbol } = this.props;
        let renderData = this.sideBoxRender(symbol);

        return(
            <div>
                {renderData}
            </div>
        )
    }
}
