import { minBy } from 'lodash';
import React from 'react'

const ProgressBar = (props) => {
    const { bgcolor, completed,min,max } = props;
  
  // styles...
    const containerStyles = {
        height: 20,
        width: '100%',
        backgroundColor: "transparent",
        borderRadius: 50,
        margin: 50
    }

    const fillerStyles = {
        height: '100%',
        width: '0px',
        backgroundColor: '#44cc4b',
        borderRadius: 'inherit',
        textAlign: 'right'
    }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span
              style={labelStyles}>{`${completed}%`}
              role="progressbar"
              aria-valuenow=${completed}
              aria-valuemin=${min}
              aria-valuemax=${max} >
        </span>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;
