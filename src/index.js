import React from 'react'
import ReactDOM from 'react-dom'
import MiniCart from './components/organisms/MiniCart.jsx'
import ProductAddToCart from './components/atoms/ProductAddToCart.jsx'
import ShippingCalculator from './components/organisms/ShippingCalculator.jsx'
import './styles/main.scss'
import './utils/functions.js'

class MiniCartElement extends HTMLElement {
  static get observedAttributes() { 
    return ['blocks']
  }

  constructor() {
    super()
    this.state = {
      blocks: null
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {

    if (name === 'blocks') {
      this.state.blocks = newValue ? newValue : null;
    }
  }

  connectedCallback() {
    
    ReactDOM.render(<MiniCart blocks={this.state.blocks} />, this);
  }
}

customElements.define("i-minicart", MiniCartElement)


class AddToCartElement extends HTMLElement {
  static get observedAttributes() { 
    return ['blocks']
  }

  constructor() {
    super()
    this.state = {
      text: null,
      variant: null
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'blocks') {
      let arrBlocks = newValue
      if (arrBlocks) arrBlocks = arrBlocks.split('|')

      this.state.text = arrBlocks[0] ? arrBlocks[0] : null;
      this.state.variant = arrBlocks[1] ? arrBlocks[1] : null;
    }
  }

  connectedCallback() {
    
    ReactDOM.render(<ProductAddToCart text={this.state.text} variantId={this.state.variant} />, this);
  }
}

customElements.define("i-add-to-cart", AddToCartElement)


class ShippingCalculatorElement extends HTMLElement {
  static get observedAttributes() { 
    return ['blocks']
  }

  constructor() {
    super()
    this.state = {
      blocks: null
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {

    if (name === 'blocks') {
      this.state.blocks = newValue ? newValue : null;
    }
  }

  connectedCallback() {
    
    ReactDOM.render(<ShippingCalculator blocks={this.state.blocks} />, this);
  }
}

customElements.define("i-shipping-calculator", ShippingCalculatorElement)