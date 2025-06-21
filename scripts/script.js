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
        nav.style.transition = "background-color 0.5s ease";
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

