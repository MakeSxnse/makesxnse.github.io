// ---------------------------------------------
// Navbar scroll efekt
(function() {
  'use strict';
  
  function initNavScrollEffect() {
    window.addEventListener("scroll", () => {
      const nav = document.querySelector("nav");
      const threshold = 0; // prakticky 0
      
      if (window.scrollY > threshold) {
        nav.style.boxShadow = "0 0 10px rgb(142, 142, 142)";
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

// ---------------------------------------------
// Typewriter efekt
(function() {
  'use strict';
  
  const TypewriterEffect = {
    text: "Pro ty, kdo jdou za svými cíli",
    speed: 100,
    pause: 1500,
    index: 0,
    deleting: false,
    timeoutId: null,
    container: null,
    
    init: function() {
      this.container = document.getElementById("typewriter");
      if (!this.container) return;
      this.animate();
    },
    
    animate: function() {
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
    
    destroy: function() {
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

// ---------------------------------------------
// Funkce pro vytvoření carouselu
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
    console.warn(`Carousel elements missing for selectors:`, arguments[0]);
    return;
  }

  let index = 0;

  // Vytvoření teček dle počtu fotek
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

  // Inicializace carouselu
  updateCarousel();

  // Automatický posun carouselu každých 6 sekund
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
});

// ---------------------------------------------
// Nákupní košík
let cartCount = 0;

function addToCart(size, variant) {
  cartCount++;
  updateCartCounter();
}

function updateCartCounter() {
  const counter = document.getElementById('cartCounter');
  if (!counter) return;
  
  let text = '';
  if (cartCount === 1) {
    text = '1 položka';
  } else if (cartCount >= 2 && cartCount <= 4) {
    text = `${cartCount} položky`;
  } else {
    text = `${cartCount} položek`;
  }
  
  counter.textContent = text;
}

function initAddToCartButtons() {
  const buttons = document.querySelectorAll('.add_to_cart');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const container = button.closest('.accessories_others');
      if (!container) return;

      const selects = container.querySelectorAll('select');
      const sizeSelect = selects[0];
      const variantSelect = selects[1];

      // Kontrola vybraných hodnot
      if (!sizeSelect.value) {
        alert('Prosím, vyberte velikost.');
        return;
      }
      if (!variantSelect.value) {
        alert('Prosím, vyberte variantu.');
        return;
      }

      addToCart(sizeSelect.value, variantSelect.value);

      alert(`Přidáno do košíku: Velikost ${sizeSelect.value}, Varianta ${variantSelect.value}`);
    });
  });
}

// ---------------------------------------------
// Zobrazení košíku po scrollu (120vh) s fade efektem
function setupCartVisibilityOnScroll() {
  const cart = document.getElementById('cart');
  if (!cart) return;

  // Inicialně skrytý košík (CSS by měl mít opacity:0 a pointer-events:none)
  function checkScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const limit = window.innerHeight * 1.2; // 120vh

    if (scrollY > limit) {
      cart.classList.add('visible');
    } else {
      cart.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // hned při načtení
}
