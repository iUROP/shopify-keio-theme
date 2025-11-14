import React, { useState } from 'react'
import Icon from '../atoms/Icon'
import Stars from '../atoms/Stars'

function CartItem({
  product
}) {
  const [itemUpdating, setItemUpdating] = useState(false)

  const up = async () => {
    let c = product.quantity
    let f = c + 1

    setItemUpdating(true)
    await Permalink.updateQty(product.id, f)
    setItemUpdating(false)
  }

  const down = async () => {
    let c = product.quantity
    let f = c - 1

    setItemUpdating(true)
    await Permalink.updateQty(product.id, f)
    setItemUpdating(false)
  }

  const remove = async () => {
    setItemUpdating(true)
    // await Permalink.updateQty(product.id, 0)
    await Permalink.clearCart()
    
    setItemUpdating(false)
  }

  const addonsVariants = [55889944969547, 55889939890507, 55889935270219, 55889933173067, 55901036544331]
  
  return (
    <div className={`i-cart-item ${itemUpdating ? 'loading' : ''} ${addonsVariants.includes(product.variant_id) ? 'is-add-on' : ''}`}>
      <div className='i-cart-item--image' style={{"backgroundImage": `url(${product.featured_image.url})`}}></div>
      <div className='i-cart-item--labels'>
        <div className='i-cart-item--labels--reviews'>
          <Stars stars={5} />
        </div>
        <div className='i-cart-item--labels--name'>
          {product.product_title}
          {product.selling_plan_allocation?.selling_plan?.name &&
            <span>{product.selling_plan_allocation.selling_plan.name}</span>
          }

          {product.options_with_values &&
            <>
              {product.options_with_values[0] &&
                <span>{product.options_with_values[0].value}</span>
              }
              {product.options_with_values[1] &&
                <span>{product.options_with_values[1].value}</span>
              }
            </>
          }

        </div>

        {product.compare_at_price && product.compare_at_price != product.price
          ? <div className='i-cart-item--labels--price'>
              {Permalink.getPrice(product.final_line_price / 100)}
              <span>{Permalink.getPrice(product.compare_at_price / 100)}</span>
            </div>
          : <div className='i-cart-item--labels--price'>
              {Permalink.getPrice(product.final_line_price / 100)}
            </div>
        }
        
      </div>
      <div className='i-cart-item--actions'>
        <div className='i-cart-item--actions--qty'>
          <button onClick={down} className='slow_ani'>
            <Icon name="minus" />
          </button>
          <input type="number" readOnly={true} value={product.quantity} />
          <button onClick={up} className='slow_ani'>
            <Icon name="plus" />
          </button>
        </div>
      </div>

      <div className='i-cart-item--delete' onClick={remove}>
        <Icon name="remove" />
      </div>
    </div>
  )
}

export default CartItem