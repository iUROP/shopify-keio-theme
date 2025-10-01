import React from 'react'

import Icon from "./Icon"

function Stars({
  stars
}) {
  
  return (
    <div className={`i-product-stars`}>
      {stars > 0 && 
        <Icon name="star-review" />
      }
      {stars > 1 && 
        <Icon name="star-review" />
      }
      {stars > 2 && 
        <Icon name="star-review" />
      }
      {stars > 3 && 
        <Icon name="star-review" />
      }
      {stars > 4 && 
        <Icon name="star-review" />
      }
    </div>
  )
}

export default Stars