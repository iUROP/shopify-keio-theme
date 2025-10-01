import React from 'react'

import VerticalCenter from './VerticalCenter'

function Preloader({
  type,
  invert
}) {

  return (
    <div className={`i-preloader-container i-preloader-container__${type}`}>
      {type === 'section' &&
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <circle fill="none" strokeOpacity="1" stroke="#FF156D" strokeWidth=".5" cx="100" cy="100" r="0">
            <animate attributeName="r" calcMode="spline" dur="0.5" values="1;80" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
            <animate attributeName="stroke-width" calcMode="spline" dur="0.5" values="0;25" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
            <animate attributeName="stroke-opacity" calcMode="spline" dur="0.5" values="1;0" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
          </circle>
        </svg>
      }
      {type === 'fullscreen' &&
        <VerticalCenter>
          <img src='/assets/images/logo_mc.gif' alt='loader' className='inline-loader' />
        </VerticalCenter>
      }
    </div>
  )
}

export default Preloader