window.Permalink = function() {
  const init = function() {
    console.log("Init Permalink Theme Functions!")

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
Permalink.init()