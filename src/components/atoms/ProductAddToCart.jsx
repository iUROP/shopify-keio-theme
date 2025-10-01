import React, { useState, useEffect } from 'react'
import Icon from './Icon';

function ProductAddToCart({
  text,
  variantId
}) {
  const [itemUpdating, setItemUpdating] = useState(false)

  const add = async () => {
    setItemUpdating(true);
    console.log("add this", variantId)
    const trigger = await Permalink.addItems(
      [
        {
          id: Number(variantId),
          quantity: 1
        }
      ],
      false
    )
    setItemUpdating(false);

    if (trigger && trigger.status == 'bad_request') {
      console.log("trigger", trigger)
    } else {
      Permalink.openCart()
    }
  }

  return (
    <button className={`i-product-add-to-cart-container ${!itemUpdating ? 'is-button-hover-primary' : ''}`} onClick={add}>
      {itemUpdating
        ? <Icon name="preloader" />
        : text
      }
    </button>
  )
}

export default ProductAddToCart