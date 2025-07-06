(function() {
  'use strict';
  
  function initNavScrollEffect() {
    window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    const threshold = window.innerHeight * 0.0000000000000000001;
    if (window.scrollY > threshold) {
      nav.style.boxShadow = "0 0 10px rgb(142, 142, 142)";
      nav.style.transition = "box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out";
    } 
    if (window.scrollY < threshold) {
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
