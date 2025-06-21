// ============================================
// NAVIGATION SCROLL EFFECT
// ============================================
(function() {
  'use strict';
  
  function initNavScrollEffect() {
    const nav = document.querySelector("nav");
    if (!nav) return;
    
    const threshold = window.innerHeight * 0.05;
    
    function handleScroll() {
      if (window.scrollY > threshold) {
        nav.style.backgroundColor = "#e6e6e6";
        nav.style.transition = "background-color 0.01s ease";
      } else {
        nav.style.backgroundColor = "rgba(255, 255, 255, 0)";
      }
    }
    
    window.addEventListener("scroll", handleScroll);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavScrollEffect);
  } else {
    initNavScrollEffect();
  }
})();

// ============================================
// TYPEWRITER EFFECT
// ============================================
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
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TypewriterEffect.init());
  } else {
    TypewriterEffect.init();
  }
})();

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================
(function() {
  'use strict';
  
  const CarouselManager = {
    carousel: null,
    slides: null,
    dots: null,
    buttons: null,
    isInitialized: false,
    
    init: function() {
      if (this.isInitialized) return;
      
      this.carousel = document.querySelector("[data-carousel]");
      if (!this.carousel) return;
      
      this.slides = this.carousel.querySelectorAll("[data-carousel-slide]");
      this.dots = this.carousel.querySelectorAll("[data-carousel-dot]");
      this.buttons = this.carousel.querySelectorAll("[data-carousel-btn]");
      
      if (this.slides.length === 0) return;
      
      this.bindEvents();
      this.isInitialized = true;
    },
    
    showSlide: function(targetIndex) {
      if (!this.slides || targetIndex < 0 || targetIndex >= this.slides.length) return;
      
      this.slides.forEach((slide, index) => {
        if (index === targetIndex) {
          slide.setAttribute('data-active', '');
          if (this.dots[index]) {
            this.dots[index].setAttribute('data-active', '');
          }
        } else {
          slide.removeAttribute('data-active');
          if (this.dots[index]) {
            this.dots[index].removeAttribute('data-active');
          }
        }
      });
    },
    
    getActiveIndex: function() {
      if (!this.slides) return 0;
      
      for (let i = 0; i < this.slides.length; i++) {
        if (this.slides[i].hasAttribute('data-active')) {
          return i;
        }
      }
      return 0;
    },
    
    navigateToNext: function() {
      const currentIndex = this.getActiveIndex();
      const nextIndex = (currentIndex + 1) % this.slides.length;
      this.showSlide(nextIndex);
    },
    
    navigateToPrevious: function() {
      const currentIndex = this.getActiveIndex();
      const previousIndex = (currentIndex - 1 + this.slides.length) % this.slides.length;
      this.showSlide(previousIndex);
    },
    
    navigateToDot: function(dotIndex) {
      this.showSlide(dotIndex);
    },
    
    bindEvents: function() {
      // Button navigation
      this.buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          
          const direction = button.getAttribute('data-carousel-btn');
          if (direction === 'next') {
            this.navigateToNext();
          } else if (direction === 'prev') {
            this.navigateToPrevious();
          }
        });
      });
      
      // Dot navigation
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', (event) => {
          event.preventDefault();
          this.navigateToDot(index);
        });
      });
    }
  };
  
  // Initialize when DOM is ready
  function initCarousel() {
    CarouselManager.init();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }
})();