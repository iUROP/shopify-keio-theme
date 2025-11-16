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
        }
        
        setLineItems(items)
      }
      console.log("cart info", cart)

      console.log("itemsWithUpsell", itemsWithUpsell)

      setUpsellProducts(itemsWithUpsell);
      setCartQty(cart.item_count)
      setCartTotal(cart.total_price)

      let blocksSplit = blocks.split('|')
      let freeShipping =  (Number(blocksSplit[0])) - cart.total_price
      let freePercent = (cart.total_price) / (Number(blocksSplit[0]))

      setFreeShippingAmount(freeShipping)
      setFreeShippingPercent(freePercent)

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
    if (showCart) {
      document.querySelector('body').classList.add('open-cart')
    } else {
      document.querySelector('body').classList.remove('open-cart')
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
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      }
    ]
  }

  const list = [
    {
      "title": "Envío gratis a todo el mundo en pedidos a partir de 65 €.",
      "icon": false
    }
  ]

  return (
    <div className={`i-minicart-container`}>
      <VerticalCenter>
        <div onClick={cartToggler}>
          <Icon name="cart" />
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
                    <CartItem product={item} key={index} />
                  )
                })
              : <div className='empty-cart-state'>Carrito vacio</div>
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
                        <div key={index} className='i-minicart-container__snap--upsells--list__item'>
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
                              add(p.variants[0].id)
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
                    {window.allProducts.slice(0, 4).filter((item) => {
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
                    }).map((p, index) => {
                      return (
                        <div key={index} className='i-minicart-container__snap--upsells--list__item'>
                          <div className='i-minicart-container__snap--upsells--list__item--image'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 22 15" fill="none">
                              <path d="M10.9997 8.8655C10.315 8.8655 9.6503 8.95517 9.00546 9.1345C8.36063 9.314 7.7523 9.58967 7.18046 9.9615C6.9958 10.068 6.79905 10.1203 6.59021 10.1183C6.38121 10.1164 6.19655 10.0353 6.03621 9.875C5.88888 9.7275 5.8203 9.55442 5.83046 9.35575C5.8408 9.15708 5.92988 9.00258 6.09771 8.89225C6.81705 8.39358 7.59463 8.01442 8.43046 7.75475C9.2663 7.49525 10.1227 7.3655 10.9997 7.3655C11.8767 7.3655 12.7331 7.49525 13.569 7.75475C14.4048 8.01442 15.1824 8.39358 15.9017 8.89225C16.0695 9.00258 16.1586 9.15708 16.169 9.35575C16.1791 9.55442 16.1105 9.7275 15.9632 9.875C15.8029 10.0353 15.6182 10.1164 15.4092 10.1183C15.2004 10.1203 15.0036 10.068 14.819 9.9615C14.2471 9.58967 13.6388 9.314 12.994 9.1345C12.3491 8.95517 11.6844 8.8655 10.9997 8.8655ZM10.9997 1.48075C9.28688 1.48075 7.63655 1.75125 6.04871 2.29225C4.46088 2.83325 3.00413 3.62875 1.67846 4.67875C1.51063 4.82242 1.32313 4.89325 1.11596 4.89125C0.908963 4.88942 0.72538 4.81475 0.565213 4.66725C0.417713 4.51992 0.34488 4.34267 0.346713 4.1355C0.348713 3.9285 0.431797 3.75958 0.595963 3.62875C2.0818 2.44425 3.71188 1.54333 5.48621 0.925999C7.26055 0.308666 9.09838 0 10.9997 0C12.901 0 14.7389 0.305417 16.5132 0.916251C18.2875 1.52725 19.9176 2.43142 21.4035 3.62875C21.5676 3.75958 21.6507 3.92533 21.6527 4.126C21.6545 4.32667 21.5817 4.50067 21.4342 4.648C21.274 4.7955 21.0905 4.87342 20.8835 4.88175C20.6763 4.89008 20.4888 4.82242 20.321 4.67875C18.9953 3.62875 17.5385 2.83325 15.9507 2.29225C14.3629 1.75125 12.7125 1.48075 10.9997 1.48075ZM11.019 5.173C9.82663 5.173 8.66955 5.35217 7.54771 5.7105C6.42605 6.06883 5.38571 6.60442 4.42671 7.31725C4.25871 7.44425 4.07121 7.50675 3.86421 7.50475C3.65705 7.50292 3.47338 7.42825 3.31321 7.28075C3.16955 7.13325 3.10188 6.96017 3.11021 6.7615C3.11855 6.56283 3.2048 6.4 3.36896 6.273C4.47146 5.41667 5.67371 4.7725 6.97571 4.3405C8.27755 3.90833 9.62721 3.69225 11.0247 3.69225C12.4094 3.69225 13.7517 3.90833 15.0517 4.3405C16.3517 4.7725 17.553 5.40833 18.6555 6.248C18.8196 6.375 18.9068 6.53883 18.917 6.7395C18.9273 6.94017 18.8587 7.11417 18.7112 7.2615C18.551 7.42183 18.3665 7.50292 18.1575 7.50475C17.9485 7.50675 17.76 7.44425 17.592 7.31725C16.6458 6.61725 15.6109 6.08492 14.4872 5.72025C13.3635 5.35542 12.2075 5.173 11.019 5.173ZM10.9997 14.0577C10.5779 14.0577 10.216 13.9068 9.91421 13.6048C9.61221 13.3029 9.46121 12.9411 9.46121 12.5192C9.46121 12.0974 9.61221 11.7388 9.91421 11.4433C10.216 11.1478 10.5779 11 10.9997 11C11.4215 11 11.7834 11.1478 12.0852 11.4433C12.3872 11.7388 12.5382 12.0974 12.5382 12.5192C12.5382 12.9411 12.3872 13.3029 12.0852 13.6048C11.7834 13.9068 11.4215 14.0577 10.9997 14.0577Z" fill="white"/>
                            </svg>
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
                              add(p.variants[0].id)
                            }} className='main-custom-button'>
                              {addingUpsell
                                ? '...'
                                : Shopify.locale == 'es' ? 'Añadir' : 'ADD'
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
              <div className='i-minicart-container__snap--footer__subtotals--row__value'>{Permalink.getPrice(cartTotal / 100)}</div>
            </div>
          </div>
          <p>*en la pantalla de pagos se incluye el impuesto y se calculan los gastos de envío.</p>
          <div className="cart-agree">
            <input type="checkbox" id="cart-agree" name="cart-agree" value="agree" onChange={(e) => setTermsAgree(e.target.checked)} />
            <label for="cart-agree"> He leído y acepto la <a href="/#">política de privacidad y la política de contratación*</a></label>
          </div>
          <div className='i-minicart-container__snap--footer__actions'>
            <a href="/checkout" className='main-custom-button' onClick={checkoutValidator}>
              Pago seguro
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.25 20.25C8.66421 20.25 9 19.9142 9 19.5C9 19.0858 8.66421 18.75 8.25 18.75C7.83579 18.75 7.5 19.0858 7.5 19.5C7.5 19.9142 7.83579 20.25 8.25 20.25Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.75 20.25C19.1642 20.25 19.5 19.9142 19.5 19.5C19.5 19.0858 19.1642 18.75 18.75 18.75C18.3358 18.75 18 19.0858 18 19.5C18 19.9142 18.3358 20.25 18.75 20.25Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.25 3.75H5.25L7.5 16.5H19.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.13327 12.75H18.8902C18.9774 12.7501 19.062 12.7201 19.1294 12.6651C19.1969 12.6101 19.2431 12.5336 19.2602 12.4486L20.6177 5.69859C20.6286 5.64417 20.6273 5.588 20.6138 5.53414C20.6002 5.48029 20.5749 5.43009 20.5395 5.38717C20.5041 5.34426 20.4595 5.30969 20.4091 5.28597C20.3586 5.26225 20.3035 5.24996 20.2477 5.25H5.625" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
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