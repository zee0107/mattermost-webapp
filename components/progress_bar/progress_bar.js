import React from 'react'
  
const Progress_bar = ({progress}) => {

    const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: '#44cc4b',
        borderRadius:40,
        textAlign: 'right'
      }

    const progresstext = {
        padding: 10,
        color: 'black',
        fontWeight: 900
      }
        
    return (
        <div className='containter-bar'>
            <div style={Childdiv}>
           {/*<span style={progresstext}>{`${progress}%`}</span>*/}
        </div>
        </div>
    )
}