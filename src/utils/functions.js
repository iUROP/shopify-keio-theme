window.Permalink = function() {
  const init = function() {
    console.log("Init iUROP Theme Functions!")

    function getActiveAddOnsTotal() {
      let total = 0;

      document.querySelectorAll('.custom-product-add-ons--option.active').forEach(el => {
        const text = el.textContent;
        const match = text.match(/([+-]?)\s*€\s*([\d.,]+)/);

        if (match) {
          const sign = match[1] === '-' ? -1 : 1;
          const value = parseFloat(match[2].replace('.', '').replace(',', '.'));
          total += sign * value;
        }
      });

      return total;
    }

    if (document.querySelector('body.template-cart')) {
      // document.location.href = '/checkout'
    }

    setInterval(function () {
      if (document.querySelector('body.template-product')) {
        const productJson = JSON.parse(document.querySelector('[id^="ProductJson"]').textContent);
        const variantSelect = document.querySelector('form[action="/cart/add"] [name="id"]');
        const variantSelectValue = document.querySelector('form[action="/cart/add"] [name="id"]').value;

        let variant = productJson.variants.find(v => v.id == variantSelectValue);
        variantSelect.addEventListener('change', (event) => {
          const variantId = event.target.value;
          variant = productJson.variants.find(v => v.id == variantId);
        });

        let totalForm = variant.price / 100
        const totalAddOns = getActiveAddOnsTotal();

        const formattedPrice = (totalForm + totalAddOns).toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR'
        });
        document.querySelectorAll('.print-current-price').forEach(el => {
          el.textContent = formattedPrice;
        });
      }
    }, 1000);

    stickyMenu()
    setupHeader()

  } // init

  const getCart = async function(openCart) {
    return new Promise(async (resolve) => {

      const request = await fetch(`/cart.js`, {
        method: "GET"
      })

      resolve(await request.json())
    })
  }

  const getProduct = async function() {

    return new Promise((resolve) => {

      resolve("getProduct!")
    })
  }

  const getCollection = async function() {

    return new Promise((resolve) => {

      resolve("getCollection!")
    })
  }

  const addItems = async function(items, open) {
    return new Promise(async (resolve) => {

      const request = await fetch(`/cart/add.js`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: items })
      })

      resolve(await request.json())

      if (open) openCart()
      reactive()
    })
  }

  const updateItems = async function() {

    return new Promise((resolve) => {

      resolve("updateItems!")
    })
  }

  const updateQty = function(id, quantity) {

    return new Promise(async (resolve) => {

      const request = await fetch(`/cart/change.js`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id.toString(), quantity })
      })

      resolve(await request.json())

      reactive()
    })
  }

  const clearCart = async function() {
    return new Promise(async (resolve) => {
      const request = await fetch(`/cart/clear.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      resolve(await request.json());

      reactive();
    });
  };

  const updateNote = async function() {

    return new Promise((resolve) => {

      resolve("updateNote!")
    })
  }

  const updateAttributes = async function() {

    return new Promise((resolve) => {

      resolve("updateAttributes!")
    })
  }

  const removeItems = async function() {

    return new Promise((resolve) => {

      resolve("removeItems!")
    })
  }

  const openCart = function(){
    window.dispatchEvent(new CustomEvent('cartToggle', {
      detail: {
        message: 'Cart is toggle'
      }
    }))
  }

  const reactive = function() {
    window.dispatchEvent(new CustomEvent('cartUpdate', {
      detail: {
        message: 'Cart is updated'
      }
    }))
  }

  const openMenu = function() {
    const el = document.querySelector('body')
    const target = document.querySelector('body.open-menu')
    const scroll = window.scrollY
    
    if (!target) {
      el.classList.add('open-menu')
    } else {
      el.classList.remove('open-menu')
    }

    setTimeout( () => {
      document.querySelector('.i-header-menu__content--items__item .item-details').classList.remove('open')
      document.querySelector('.i-header-menu__content--items__item--submenu--items__item .item-details').classList.remove('open')
    }, 10 )
  }

  const stickyMenu = function() {
    let actualScroll = 0
    let lastScrollTop = 0
    const header = document.querySelector('.section-header')
    const body = document.querySelector('body')

    window.addEventListener("scroll", function() {
      const top = Math.min(-(window.scrollY - actualScroll + header.clientHeight), 0)
      if (window.scrollY  > actualScroll) {
        actualScroll = window.scrollY
      }

      if (top === 0) {
        actualScroll = window.scrollY + header.clientHeight
      }

      header.setAttribute("style", `--_top:${top}px`);
      header.classList.toggle('sticky',window.scrollY < actualScroll)
      header.classList.toggle('clr',window.scrollY > header.clientHeight * 1.5)


      let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop) {
        body.classList.add('scrolled')
      } else {
        body.classList.remove('scrolled')
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

  }, false);
  }

  const setupHeader = function() {

  }

  const getPrice = function(number, currency='en-ES') {
    const formatter = new Intl.NumberFormat(currency, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  
    return formatter.format(number)
  }

  const setScrollDragger = function() {
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.desktop-dragger-function').forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
          isDown = true;
          container.classList.add('active');
          startX = e.pageX - container.offsetLeft;
          scrollLeft = container.scrollLeft;
          container.style.cursor = 'grabbing';
        });

        container.addEventListener('mouseleave', () => {
          isDown = false;
          container.classList.remove('active');
          container.style.cursor = 'grab';
        });

        container.addEventListener('mouseup', () => {
          isDown = false;
          container.classList.remove('active');
          container.style.cursor = 'grab';
        });

        container.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - container.offsetLeft;
          const walk = (x - startX) * 1;
          container.scrollLeft = scrollLeft - walk;
        });
      });
    }
    
  }


  return {
    init,
    getCart,
    getProduct,
    getCollection,
    addItems,
    updateItems,
    updateQty,
    clearCart,
    updateNote,
    updateAttributes,
    removeItems,
    openCart,
    reactive,

    openMenu,
    stickyMenu,
    setupHeader,
    getPrice,
    setScrollDragger
  }
}();
Permalink.init();


document.addEventListener('click', function(event) {
  const toggle = event.target.closest('.js.product-form__input');
  console.log("Click to:", toggle)

  if (!toggle) return;
  toggle.classList.toggle('active');
});


document.addEventListener('click', function(event) {
  const option = event.target.closest('.custom-product-add-ons--option');
  console.log("Click to option:", option)

  if (!option) return;
  option.classList.toggle('active');
});

document.addEventListener('click', function(event) {
  const fieldset = event.target.closest('.shopify_subscriptions_fieldset');
  if (!fieldset) return;

  if (event.target === fieldset) {
    fieldset.classList.toggle('active');
  }
});

document.addEventListener('click', function(event) {
  const fieldset = event.target.closest('.open-search');
  if (!fieldset) return;

  console.log("clcik to open search", fieldset.closest('.main-custom-header'))
  fieldset.closest('.main-custom-header').querySelector('.global-search').classList.toggle('active');
});



document.addEventListener('click', function(event) {
  const mobileNav = event.target.closest('.main-custom-header__top--container__mobile-menu');

  if (!mobileNav) return;
  document.querySelector('body').classList.toggle('show-mobile-menu');
});

document.addEventListener('click', function(event) {
  const option = event.target.closest('.product-form__buttons--sim-selector');

  if (!option) return;
  option.classList.toggle('active');
});

