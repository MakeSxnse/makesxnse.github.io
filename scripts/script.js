(function () {
  'use strict';

  function initNavScrollEffect() {
    window.addEventListener("scroll", () => {
      const nav = document.querySelector("nav");
      const threshold = 0;
      if (window.scrollY > threshold) {
        nav.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.23)";
        nav.style.transition = "box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out";
      } else {
        nav.style.boxShadow = "none";
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavScrollEffect);
  } else {
    initNavScrollEffect();
  }
})();

(function () {
  'use strict';

  const TypewriterEffect = {
    text: "Pro ty, kdo jdou za svými cíli",
    speed: 100,
    pause: 1500,
    index: 0,
    deleting: false,
    timeoutId: null,
    container: null,

    init: function () {
      this.container = document.getElementById("typewriter");
      if (!this.container) return;
      this.animate();
    },

    animate: function () {
      if (!this.deleting && this.index <= this.text.length) {
        if (this.index === 0) {
          this.container.textContent = "";
        }

        if (this.index > 0) {
          const span = document.createElement('span');
          span.textContent = this.text.charAt(this.index - 1);
          span.classList.add('fade-in');
          this.container.appendChild(span);
        }

        this.index++;

        if (this.index > this.text.length) {
          this.timeoutId = setTimeout(() => {
            this.deleting = true;
            this.animate();
          }, this.pause);
          return;
        }
      } else if (this.deleting && this.index >= 0) {
        if (this.container.lastChild) {
          this.container.removeChild(this.container.lastChild);
        }
        this.index--;
        if (this.index < 0) {
          this.deleting = false;
        }
      }

      this.timeoutId = setTimeout(() => this.animate(), this.speed);
    },

    destroy: function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TypewriterEffect.init());
  } else {
    TypewriterEffect.init();
  }
})();

function createCarousel({
  carouselSelector,
  photoSelector,
  nextBtnSelector,
  prevBtnSelector,
  dotsContainerSelector
}) {
  const carousel = document.querySelector(carouselSelector);
  const photos = document.querySelectorAll(photoSelector);
  const nextBtn = document.querySelector(nextBtnSelector);
  const prevBtn = document.querySelector(prevBtnSelector);
  const dotsContainer = document.querySelector(dotsContainerSelector);

  if (!carousel || photos.length === 0 || !nextBtn || !prevBtn || !dotsContainer) {
    return;
  }

  let index = 0;

  photos.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => {
      index = i;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('span');

  function updateCarousel() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % photos.length;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + photos.length) % photos.length;
    updateCarousel();
  });

  updateCarousel();

  setInterval(() => {
    index = (index + 1) % photos.length;
    updateCarousel();
  }, 6000);
}

// Spuštění carouselů pro accessories a clothes
document.addEventListener('DOMContentLoaded', () => {
  createCarousel({
    carouselSelector: '.acc_carousel',
    photoSelector: '.acc_photo',
    nextBtnSelector: '.acc-carousel-btn.next',
    prevBtnSelector: '.acc-carousel-btn.prev',
    dotsContainerSelector: '.acc-carousel-dots'
  });

  createCarousel({
    carouselSelector: '.cloth_carousel',
    photoSelector: '.cloth_photo',
    nextBtnSelector: '.cloth-carousel-btn.next',
    prevBtnSelector: '.cloth-carousel-btn.prev',
    dotsContainerSelector: '.cloth-carousel-dots'
  });

  initAddToCartButtons();
  setupCartVisibilityOnScroll();
  renderCartItems();
  updateCartCounter();
});

// ---------------------------------------------
// Nákupní košík
let cartCount = 0;
function addToCart(size, variant) {
  const cartIcon = document.querySelector(".cart_icon")
  cartIcon.classList.add("animate")
  cartIcon.addEventListener("animationend", ()=>{
    cartCount++;
    updateCartCounter();
    cartIcon.classList.remove("animate")
  }, {once: true})
}

function updateCartCounter() {
  const counter = document.getElementById('cartCounter');
  if (!counter) return;
  
  let text = '';

  if (count === 1) {
    text = '1 položka';
  } else if (count >= 2 && count <= 4) {
    text = `${count} položky`;
  } else {
    text = `${count} položek`;
  }
  
  counter.textContent = text;
}

function initAddToCartButtons() {
  const Forms = document.querySelectorAll(".accessories_others");
  Forms.forEach(e=>{
    e.addEventListener("submit", function(e) {
      e.preventDefault();
      const selects = document.querySelectorAll('.select');
      const sizeSelect = selects[0];
      const variantSelect = selects[1];

      addToCart(sizeSelect.value, variantSelect.value);
    });
  });
}

function setupCartVisibilityOnScroll() {
  const cart = document.getElementById('cart');
  const footer = document.querySelector('footer');
  if (!cart || !footer) return;

  function checkScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const limit = windowHeight * 1.2;
    const footerTop = footer.getBoundingClientRect().top + scrollY;
    const distanceToBottom = (scrollY + windowHeight) - footerTop;

    if (scrollY > limit) {
      cart.classList.add('visible');
    } else {
      cart.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

function renderCartItems() {
  const cartContainer = document.querySelector('.kosik_items');
  if (!cartContainer) return;

  const items = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (items.length === 0) {
    cartContainer.innerHTML = '<p>Košík je prázdný.</p>';
    return;
  }

  cartContainer.innerHTML = '';

  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('kosik_item');
    div.innerHTML = `
      <p><strong>Položka ${index + 1}:</strong></p>
      <p>Velikost: ${item.size}</p>
      <p>Varianta: ${item.variant}</p>
      <hr>
    `;
    cartContainer.appendChild(div);
  });
}

function clearCart() {
  localStorage.removeItem('cartItems');
  cartItems = [];
  renderCartItems();
  updateCartCounter();
}


// && distanceToBottom < -50