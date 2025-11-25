import React, { useState, useEffect } from 'react'
import Slider from "react-slick"

import Icon from '../atoms/Icon'
import VerticalCenter from '../atoms/VerticalCenter'
import CartItem from '../molecules/CartItem'

function MiniCart({
  blocks
}) {
  const [cartQty, setCartQty] = useState(false)
  const [lineItems, setLineItems] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [cartTotal, setCartTotal] = useState(0)
  const [freeShippingAmount, setFreeShippingAmount] = useState(0)
  const [freeShippingPercent, setFreeShippingPercent] = useState(0)

  const [upsellProducts, setUpsellProducts] = useState([])
  const [addingUpsell, setAddingUpsell] = useState(false)
  const [termsAgree, setTermsAgree] = useState(false)
  const [dicsount, setDiscount] = useState(0)
  const [hasDiscount, setHasDiscount] = useState(false)

  const discounted = 55889944969547

  useEffect(() => {
    async function get() {
      console.log("Re run cart")
      const allProducts = window.allProducts
      const cart = await Permalink.getCart()
      const items =  []
      const itemsWithUpsell = []
      if (cart && cart.items) {

        for (const item of cart.items) {
          const handle = item.handle;
          const product = await fetch(`/products/${handle}.js`).then(res => res.json());
          if (product) {
            const variant = product.variants.find(v => v.id === item.variant_id);

            for (let i = 0; i < allProducts.length; i++) {
              const ap = allProducts[i];
              if (ap.id == item.product_id) {
                for (let l = 0; l < ap.related_products.length; l++) {
                  const lt = ap.related_products[l];
                  itemsWithUpsell.push(lt)
                }
              }
            }

            if (variant) {
              item['compare_at_price'] = variant.compare_at_price
            }
          }
          items.push(item);

          if (item.variant_id == discounted) {
            setDiscount(50)
          }
        }
        setLineItems(items)
      }
      console.log("cart info", cart)
      console.log("itemsWithUpsell", itemsWithUpsell)

      // setUpsellProducts(itemsWithUpsell);
      setCartQty(cart.item_count)
      setCartTotal(cart.total_price)

      let blocksSplit = blocks.split('|')
      let freeShipping =  (Number(blocksSplit[0])) - cart.total_price
      let freePercent = (cart.total_price) / (Number(blocksSplit[0]))

      setFreeShippingAmount(freeShipping)
      setFreeShippingPercent(freePercent)

      const cart_level_discount_applications = cart.cart_level_discount_applications
      if (cart_level_discount_applications) {
        const hasCouponEnergy = cart_level_discount_applications.find((item) => item.title == 'KEIOENERGY')
        if (hasCouponEnergy) setHasDiscount(true)
      }
    }
    get()

    window.addEventListener('cartUpdate', function() {
      get()
    })

    window.addEventListener('cartToggle', function() {
      setShowCart(!showCart)
    })
  }, [])

  useEffect(() => {
    const body = document.querySelector('body')
    const isMobile = window.innerWidth <= 1024
    
    if (showCart) {
      if (isMobile) {
        const scrollY = window.scrollY
        body.style.top = `-${scrollY}px`
        body.classList.add('open-cart')
      } else {
        body.classList.add('open-cart')
      }
    } else {
      if (isMobile) {
        const scrollY = body.style.top
        body.classList.remove('open-cart')
        body.style.top = ''
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1)
        }
      } else {
        body.classList.remove('open-cart')
      }
    }
  }, [showCart])
  
  const cartToggler = () => {
    setShowCart(!showCart)
  }

  const checkoutValidator = (e) => {
    
    if (!termsAgree) {
      e.preventDefault()
    } else {
      window.location.href = '/checkout'
    }
    
    console.log("validare link")
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplaySpeed: 4000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    centerPadding: '20px',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      }
    ]
  }

  const add = (handle) => {
    window.location.href = `/products/${handle}`
  }

  return (
    <div className={`i-minicart-container`}>
      <VerticalCenter>
        <div onClick={cartToggler} className='toggleCart'>
          <Icon name="cart" />
          <span className='qty'>({cartQty})</span>
        </div>
      </VerticalCenter>
      {/* {cartQty &&
        <strong>{cartQty}</strong>
      } */}
      <div className={`i-minicart-container__snap slow_ani ${showCart ? 'open' : ''}`}>
        <div className='i-minicart-container__snap--header'>
          <VerticalCenter>
            <h2>
              Carrito
              {/* <span>{cartQty && <>({cartQty})</>}</span> */}
            </h2>
          </VerticalCenter>
          <button onClick={cartToggler} className='i-minicart-container__snap--header__close slow_ani'>
            <Icon name="close" />
          </button>
        </div>
        {/* <div className='i-minicart-container__snap--deals'>

          <Slider {...settings}>
            {list.map((deal, index) => {

              return (
                <div key={index} className='i-minicart-container__snap--deals--deal'>
                  <VerticalCenter>
                    {deal.title}
                  </VerticalCenter>
                </div>
              )
            })}
          </Slider>
        </div> */}

        <div className='i-minicart-container__snap--freeShipping'>
          <div className='i-minicart-container__snap--freeShipping--labels Text-Colors-500 Family-Font---Body Typo-Body-S'>
            <Icon name="shipping" /> 
            {freeShippingAmount <= 0 
              ? <>¡Ahora tienes envio gratuito!</>
              : <>¡Gasta {window.Permalink.getPrice(freeShippingAmount)} más y obtén envío gratis!</>

            }
          </div>
          <div className='i-minicart-container__snap--freeShipping--bar'>
            <div className='i-minicart-container__snap--freeShipping--bar__progress slow_ani' style={{width: `${freeShippingPercent}%`}}></div>
          </div>
        </div>

        <div className='i-minicart-container__snap--items'>
          {lineItems
            ? lineItems.length > 0
              ? lineItems.map((item, index) => {
                  return (
                    <CartItem product={item} key={index} discounted={discounted} />
                  )
                })
              : <div className='empty-cart-state'>Carrito vacío</div>
            : <>Cargando items...</>
          }
        </div>

        <div className={`i-minicart-container__snap--upsells`}>
          <h3>
            Completa tu servicio Keio
          </h3>
          <div className='i-minicart-container__snap--upsells--list'>
              {upsellProducts[0]
                ? <Slider {...settings}>
                    {upsellProducts.map((p, index) => {
                      return (
                        <div key={index} className='i-minicart-container__snap--upsells--list__item is-related' onClick={() => {
                          add(p.handle)
                        }}>
                          <div className='i-minicart-container__snap--upsells--list__item--image'>
                            <img src={p.images[0]} />
                          </div>
                          <div className='i-minicart-container__snap--upsells--list__item--labels'>
                            <h3>{p.title}</h3>
                            <p>
                              {(p.compare_at_price && p.price != p.compare_at_price) &&
                                <span>{Permalink.getPrice(p.compare_at_price / 100)}</span>
                              }
                              {Permalink.getPrice(p.price / 100)}
                            </p>
                          </div>
                          <div className='i-minicart-container__snap--upsells--list__item--actions'>
                            <button onClick={() => {
                              add(p.handle)
                            }} className='main-custom-button'>
                              {addingUpsell
                                ? '...'
                                : <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                    <mask maskUnits="userSpaceOnUse" x="0" y="0" width="29" height="29">
                                      <rect width="28.7209" height="28.7209" fill="#D9D9D9"/>
                                    </mask>
                                    <g mask="url(#mask0_13905_5136)">
                                      <path d="M13.1029 24.1047V15.1294H4V12.9753H13.1029V4.00006H15.2876V12.9753H24.3905V15.1294H15.2876V24.1047H13.1029Z" fill="#931E31"/>
                                    </g>
                                  </svg>
                              }
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </Slider>
                : <Slider {...settings}>
                    {window.allProducts.sort(() => Math.random() - 0.5).filter((item) => {
                      let available = true
                      if (lineItems && lineItems[0]) {
                        lineItems.forEach(lineItem => {

                          if (lineItem.product_id == item.id) {
                            available = false
                          }
                        });
                      }
                      if (available) {
                        return true;
                      } else {
                        return false;
                      }
                    }).slice(0, 3).map((p, index) => {
                      return (
                        <div key={index} className='i-minicart-container__snap--upsells--list__item is-all' onClick={() => {
                          add(p.handle)
                        }}>
                          <div className='i-minicart-container__snap--upsells--list__item--image'>
                            <img src={p.images[0]} />
                          </div>
                          <div className='i-minicart-container__snap--upsells--list__item--labels'>
                            <h3>{p.title}</h3>
                            <p>
                              {(p.compare_at_price && p.price != p.compare_at_price) &&
                                <span>{Permalink.getPrice(p.compare_at_price / 100)}</span>
                              }
                              {Permalink.getPrice(p.price / 100)}
                            </p>
                          </div>
                          <div className='i-minicart-container__snap--upsells--list__item--actions'>
                            <button onClick={() => {
                              add(p.handle)
                            }} className='main-custom-button'>
                              {addingUpsell
                                ? '...'
                                : <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                    <mask maskUnits="userSpaceOnUse" x="0" y="0" width="29" height="29">
                                      <rect width="28.7209" height="28.7209" fill="#D9D9D9"/>
                                    </mask>
                                    <g mask="url(#mask0_13905_5136)">
                                      <path d="M13.1029 24.1047V15.1294H4V12.9753H13.1029V4.00006H15.2876V12.9753H24.3905V15.1294H15.2876V24.1047H13.1029Z" fill="#931E31"/>
                                    </g>
                                  </svg>
                              }
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </Slider>
              }
              
          </div>
        </div>

        <div className='i-minicart-container__snap--footer'>
          <div className='i-minicart-container__snap--footer__subtotals'>
            <div className='i-minicart-container__snap--footer__subtotals--row'>
              <div className='i-minicart-container__snap--footer__subtotals--row__key'>Total</div>
              <div className='i-minicart-container__snap--footer__subtotals--row__value'>{Permalink.getPrice( hasDiscount ? (cartTotal / 100) : (cartTotal / 100) - dicsount) }</div>
            </div>
          </div>
          <p>*en la pantalla de pagos se incluye el impuesto y se calculan los gastos de envío.</p>
          <div className="cart-agree">
            <input type="checkbox" id="cart-agree" name="cart-agree" value="agree" onChange={(e) => setTermsAgree(e.target.checked)} />
            <label for="cart-agree"> He leído y acepto la <a href="/policies/privacy-policy">política de privacidad y la política de contratación*</a></label>
          </div>
          <div className='i-minicart-container__snap--footer__actions'>
            <div className='checkout-button-wrapper'>
              {!termsAgree && (
                <div className='checkout-tooltip'>
                  <div className='checkout-tooltip__content'>
                    Aceptar póliticas para poder continuar
                  </div>
                  <div className='checkout-tooltip__beak'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M5.65723 0L11.3141 5.65685L5.65723 11.3137L0.00037241 5.65685L5.65723 0Z" fill="#5C5E5C"/>
                    </svg>
                  </div>
                </div>
              )}
              <a 
                href={termsAgree ? `/checkout${dicsount > 0 ? '?discount=KEIOENERGY' : ''}` : '#'} 
                className={`main-custom-button ${!termsAgree ? 'disabled' : ''}`} 
                onClick={checkoutValidator}
              >
                Pago seguro
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.25 20.25C8.66421 20.25 9 19.9142 9 19.5C9 19.0858 8.66421 18.75 8.25 18.75C7.83579 18.75 7.5 19.0858 7.5 19.5C7.5 19.9142 7.83579 20.25 8.25 20.25Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.75 20.25C19.1642 20.25 19.5 19.9142 19.5 19.5C19.5 19.0858 19.1642 18.75 18.75 18.75C18.3358 18.75 18 19.0858 18 19.5C18 19.9142 18.3358 20.25 18.75 20.25Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.25 3.75H5.25L7.5 16.5H19.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.13327 12.75H18.8902C18.9774 12.7501 19.062 12.7201 19.1294 12.6651C19.1969 12.6101 19.2431 12.5336 19.2602 12.4486L20.6177 5.69859C20.6286 5.64417 20.6273 5.588 20.6138 5.53414C20.6002 5.48029 20.5749 5.43009 20.5395 5.38717C20.5041 5.34426 20.4595 5.30969 20.4091 5.28597C20.3586 5.26225 20.3035 5.24996 20.2477 5.25H5.625" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            </div>
          </div>
          <div className='i-minicart-container__snap--footer__cards'>
            <Icon name="footer-cards" />
          </div>
        </div>
      </div>
      <div className={`i-minicart-container__overlay slow_ani ${showCart ? 'open' : ''}`} onClick={cartToggler}></div>
    </div>
  )
}

export default MiniCart