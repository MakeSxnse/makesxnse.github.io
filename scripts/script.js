// =========================
// NAV SCROLL EFFECT
// =========================
(function () {
  const nav = document.querySelector("nav");
  if (!nav) return;
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      nav.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.23)";
      nav.style.transition = "box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out";
    } else {
      nav.style.boxShadow = "none";
    }
  });
})();

// =========================
// TYPEWRITER EFFECT
// =========================
(function () {
  const el = document.getElementById("typewriter");
  if (!el) return;
  
  const text = "Pro ty, kdo jdou za svými cíli";
  let index = 0;
  let deleting = false;
  const speed = 100;
  const pause = 1500;

  function animate() {
    if (!deleting) {
      el.textContent = text.slice(0, index);
      index++;
      if (index > text.length) {
        deleting = true;
        setTimeout(animate, pause);
        return;
      }
    } else {
      el.textContent = text.slice(0, index);
      index--;
      if (index < 0) deleting = false;
    }
    setTimeout(animate, speed);
  }

  animate();
})();

// =========================
// CAROUSEL
// =========================
function createCarousel({carouselSelector, photoSelector, nextBtnSelector, prevBtnSelector, dotsContainerSelector}) {
  const carousel = document.querySelector(carouselSelector);
  const photos = document.querySelectorAll(photoSelector);
  const nextBtn = document.querySelector(nextBtnSelector);
  const prevBtn = document.querySelector(prevBtnSelector);
  const dotsContainer = document.querySelector(dotsContainerSelector);

  if (!carousel || photos.length === 0) return;

  let index = 0;

  photos.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => { 
      index = i; 
      update(); 
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("span");

  function update() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => { 
      index = (index + 1) % photos.length; 
      update(); 
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener("click", () => { 
      index = (index - 1 + photos.length) % photos.length; 
      update(); 
    });
  }

  update();
  setInterval(() => { 
    index = (index + 1) % photos.length; 
    update(); 
  }, 6000);
}

// -------------------------
// GENERIC CAROUSEL FOR WRAPPER ELEMENTS
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
    const carousel = wrapper.querySelector("div");
    const nextBtn = wrapper.querySelector(".next");
    const prevBtn = wrapper.querySelector(".prev");
    const dotsContainer = wrapper.querySelector("div[class$='dots']");
    
    if (!carousel) return;
    
    const items = carousel.children;
    let index = 0;

    function updateCarousel() {
      Array.from(items).forEach((item, i) => {
        item.style.display = i === index ? "block" : "none";
      });
      
      if (dotsContainer) {
        dotsContainer.innerHTML = "";
        Array.from(items).forEach((_, i) => {
          const dot = document.createElement("span");
          dot.className = i === index ? "active" : "";
          dot.addEventListener("click", () => { 
            index = i; 
            updateCarousel(); 
          });
          dotsContainer.appendChild(dot);
        });
      }
    }

    nextBtn?.addEventListener("click", () => { 
      index = (index + 1) % items.length; 
      updateCarousel(); 
    });
    
    prevBtn?.addEventListener("click", () => { 
      index = (index - 1 + items.length) % items.length; 
      updateCarousel(); 
    });

    updateCarousel();
  });
});

// =========================
// KOŠÍK (CART) FUNCTIONALITY
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Get DOM elements
  const cartCounter = document.getElementById("cartCounter");
  const cartElement = document.getElementById("cart");
  const cartContainer = document.getElementById("cartContainer");
  const clearBtn = document.getElementById("clearCartBtn");
  const footer = document.querySelector("footer");

  // Update cart counter display
  function updateCartCounter() {
    if (cartCounter) {
      const itemCount = cart.length;
      cartCounter.textContent = `${itemCount} ${itemCount === 1 ? 'položka' : 'položek'}`;
    }
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Show flying notification when item is added
  function showFlyingNotification(productName, buttonElement) {
    const notification = document.createElement("div");
    notification.className = "fly_to_cart";
    notification.textContent = `+1 ${productName}`;
    notification.style.cssText = `
      position: fixed;
      z-index: 10000;
      background: #4CAF50;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      pointer-events: none;
      transition: all 0.8s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Get button position
    const rect = buttonElement.getBoundingClientRect();
    notification.style.left = rect.left + "px";
    notification.style.top = rect.top + "px";
    
    // Animate to cart position (top right)
    setTimeout(() => {
      notification.style.transform = `translate(${window.innerWidth - rect.left - 200}px, -${rect.top + 50}px)`;
      notification.style.opacity = "0";
    }, 100);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 1000);
  }

  // Handle cart visibility on scroll (for index page)
  function handleCartVisibility() {
    if (!cartElement || !footer) return;
    
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const footerTop = footer.offsetTop;
    const scrollBottom = scrollY + vh;

    if (scrollY > vh * 0.5 && scrollBottom < footerTop - 100) {
      cartElement.style.display = "flex";
      cartElement.classList.add('visible');
    } else {
      cartElement.style.display = "none";
      cartElement.classList.remove('visible');
    }
  }

  // Add event listener for cart visibility
  window.addEventListener("scroll", handleCartVisibility);
  
  // Initial cart counter update
  updateCartCounter();

  // Handle add to cart buttons (multiple selectors for compatibility)
  const addToCartSelectors = [
    '.accessories_others', 
    '.add_to_cart', 
    'form[data-cart-form]',
    'button[data-add-to-cart]'
  ];

  addToCartSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      const isForm = element.tagName.toLowerCase() === 'form';
      const isButton = element.tagName.toLowerCase() === 'button';
      
      if (isForm) {
        element.addEventListener("submit", handleAddToCart);
      } else if (isButton) {
        element.addEventListener("click", handleAddToCart);
      } else {
        // For other elements, look for submit buttons inside
        const submitBtn = element.querySelector('button[type="submit"], input[type="submit"], .add_to_cart');
        if (submitBtn) {
          submitBtn.addEventListener("click", handleAddToCart);
        }
      }
    });
  });

  function handleAddToCart(e) {
    e.preventDefault();
    
    const form = e.target.closest('form') || e.target.closest('.accessories_others');
    if (!form) {
      console.error('No form found for add to cart');
      return;
    }

    // Get product information from form
    const productNameSelect = form.querySelector('select[name="product_name"], select:first-of-type');
    const sizeSelect = form.querySelector('select[name="size"], select:nth-of-type(2)');
    const variantSelect = form.querySelector('select[name="variant"], select:nth-of-type(3)');
    const priceElement = form.querySelector('h4, .price, [data-price]');

    if (!productNameSelect || !sizeSelect || !variantSelect) {
      console.error('Missing required form elements');
      return;
    }

    const productName = productNameSelect.value;
    const size = sizeSelect.value;
    const variant = variantSelect.value;
    const price = priceElement ? priceElement.textContent.replace(/[^\d,.-]/g, '').trim() : '';

    // Validate selections
    if (!productName || !size || !variant) {
      alert('Prosím vyberte všechny možnosti');
      return;
    }

    // Create product object
    const product = {
      id: Date.now() + Math.random(), // Simple unique ID
      productName: productName,
      size: size,
      variant: variant,
      price: price,
      dateAdded: new Date().toISOString()
    };

    // Add to cart
    cart.push(product);
    saveCart();
    updateCartCounter();

    // Show flying notification
    showFlyingNotification(productName, e.target);

    console.log('Product added to cart:', product);
  }

  // -------------------------
  // CART.HTML SPECIFIC LOGIC
  // -------------------------
  const kosikItems = document.querySelector('.kosik_items');
  
  if (kosikItems) {
    function renderCart() {
      kosikItems.innerHTML = "";
      
      if (cart.length === 0) {
        kosikItems.innerHTML = `
          <div class="empty-cart">
            <p>Váš košík je prázdný</p>
            <a href="index.html" class="continue-shopping">Pokračovat v nákupu</a>
          </div>
        `;
        return;
      }

      // Calculate total price
      let totalPrice = 0;
      const cartItemsHtml = cart.map((item, index) => {
        // Extract numeric value from price string
        const priceMatch = item.price ? item.price.match(/\d+/) : null;
        const itemPrice = priceMatch ? parseInt(priceMatch[0]) : 0;
        totalPrice += itemPrice;

        return `
          <div class="cart-item" data-index="${index}">
            <div class="item-info">
              <h3>${item.productName}</h3>
              <div class="item-details">
                <span class="size">Velikost: ${item.size}</span>
                <span class="variant">Varianta: ${item.variant}</span>
                ${item.price ? `<span class="price">${item.price}</span>` : ''}
              </div>
            </div>
            <div class="item-actions">
              <button class="remove-item" data-index="${index}">
                <span>✕</span> Odstranit
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Create cart summary
      kosikItems.innerHTML = `
        <div class="cart-content">
          <div class="cart-items-list">
            ${cartItemsHtml}
          </div>
          
          <div class="cart-summary">
            <div class="summary-row">
              <span>Počet položek:</span>
              <span>${cart.length}</span>
            </div>
            ${totalPrice > 0 ? `
              <div class="summary-row total">
                <span>Celková cena:</span>
                <span>${totalPrice} Kč</span>
              </div>
            ` : ''}
            
            <div class="cart-actions">
              <button class="clear-cart-btn">Vyprázdnit košík</button>
              <button class="checkout-btn">Pokračovat k objednávce</button>
            </div>
          </div>
        </div>
      `;

      // Add event listeners for remove buttons
      document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", () => {
          const index = parseInt(btn.dataset.index);
          const removedItem = cart[index];
          
          if (confirm(`Opravdu chcete odstranit "${removedItem.productName}" z košíku?`)) {
            cart.splice(index, 1);
            saveCart();
            updateCartCounter();
            renderCart();
            
            // Show notification
            showRemoveNotification(removedItem.productName);
          }
        });
      });

      // Clear cart button
      const clearCartBtn = document.querySelector('.clear-cart-btn');
      if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
          if (confirm('Opravdu chcete vyprázdnit celý košík?')) {
            cart = [];
            saveCart();
            updateCartCounter();
            renderCart();
          }
        });
      }

      // Checkout button (placeholder)
      const checkoutBtn = document.querySelector('.checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
          alert('Funkce objednávky bude brzy dostupná!');
          // Here you would typically redirect to checkout page
          // window.location.href = 'checkout.html';
        });
      }
    }

    // Show notification when item is removed
    function showRemoveNotification(productName) {
      const notification = document.createElement("div");
      notification.className = "remove_notification";
      notification.textContent = `${productName} byl odstraněn z košíku`;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: #f44336;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
      `;
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.style.transform = "translateX(0)";
      }, 100);
      
      // Animate out and remove
      setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }, 2000);
    }

    // Initial cart render
    renderCart();
  }

  // Make cart globally accessible for debugging
  window.cartDebug = {
    getCart: () => cart,
    clearCart: () => {
      cart = [];
      saveCart();
      updateCartCounter();
      if (cartContainer) renderCart();
    },
    addTestItem: () => {
      cart.push({
        id: Date.now(),
        productName: 'Test Product',
        size: 'M',
        variant: 'Red',
        price: '100 Kč'
      });
      saveCart();
      updateCartCounter();
      if (cartContainer) renderCart();
    }
  };
});