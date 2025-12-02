import React, { useState } from 'react'
import Icon from '../atoms/Icon'
import Stars from '../atoms/Stars'

function CartItem({
  product,
  discounted
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

  const remove = async (bulker_id) => {
    setItemUpdating(true)
    await Permalink.clearCart(bulker_id)
    
    setItemUpdating(false)
  }

  const goToProduct = (e) => {
    if (e.target.closest('button') || e.target.closest('.i-cart-item--delete') || e.target.closest('.i-cart-item--actions')) {
      return
    }
    if (product.handle) {
      window.location.href = `/products/${product.handle}`
    }
  }

  const addonsVariants = [55889944969547, 55889939890507, 55889935270219, 55889933173067, 55901036544331, 56023547871563, 56023553245515, 56023554457931]
  
  return (
    <div 
      className={`i-cart-item ${itemUpdating ? 'loading' : ''} ${addonsVariants.includes(product.variant_id) ? 'is-add-on' : ''}`}
      onClick={goToProduct}
      style={{ cursor: addonsVariants.includes(product.variant_id) ? 'default' : 'pointer' }}
    >
      <div className='i-cart-item--image' style={{"backgroundImage": `url(${product.featured_image.url})`}}></div>
      <div className='i-cart-item--labels'>
        <div className='i-cart-item--labels--reviews'>
          <Stars stars={5} />
        </div>
        <div className='i-cart-item--labels--name'>
          {product.product_title}
          {addonsVariants.includes(product.variant_id) &&
            <> x{product.quantity}</>
          }
          {product.selling_plan_allocation?.selling_plan?.name &&
            <span>{product.selling_plan_allocation.selling_plan.name.replace('Entrega c','C').replace(', 30% de descuento','')}</span>
          }
          {product.options_with_values &&
            <>
              {product.options_with_values[0] && product.options_with_values[0].value != 'Default Title' && 
                <span>{product.options_with_values[0].value}</span>
              }
              {product.options_with_values[1] && product.options_with_values[0].value != 'Default Title' && 
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
          : <div className='i-cart-item--labels--price no-discounted'>
              {product.variant_id == discounted
                ? Permalink.getPrice(-50)
                : Permalink.getPrice(product.final_line_price / 100)
              }
            </div>
        }
        
      </div>
      <div className='i-cart-item--actions' onClick={(e) => e.stopPropagation()}>
        <div className='i-cart-item--actions--qty'>
          <button onClick={(e) => { e.stopPropagation(); down(); }} className='slow_ani'>
            <Icon name="minus" />
          </button>
          <input type="number" readOnly={true} value={product.quantity} />
          <button onClick={(e) => { e.stopPropagation(); up(); }} className='slow_ani'>
            <Icon name="plus" />
          </button>
        </div>
      </div>

      <div className='i-cart-item--delete' onClick={(e) => {
        e.stopPropagation();
        remove(product.properties?._bulker_id);
      }}>
        <Icon name="remove" />
      </div>
    </div>
  )
}

export default CartItem