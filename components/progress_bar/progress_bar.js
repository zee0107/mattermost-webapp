import React from 'react'
  
const Progress_bar = ({progress}) => {

      const progresstext = {
        padding: 10,
        color: 'black',
        fontWeight: 900
      }
        
    return (
        <div className='containter-bar'>
            <div className='filler-bar'>
            <span style={progresstext}>{`${progress}%`}</span>
        </div>
        </div>
    )
}