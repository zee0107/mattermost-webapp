import { minBy } from 'lodash';
import React from 'react'

const ProgressBar = (props) => {
    const { bgcolor, completed,min,max } = props;  

    return (
      <div className='containter-bar'>
        <div className='filler-bar'>
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
