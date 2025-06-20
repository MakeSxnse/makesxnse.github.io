 window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    const threshold = window.innerHeight * 0.05;

    if (window.scrollY > threshold) {
      nav.style.backgroundColor = "#e6e6e6";
      nav.style.transition = "background-color 0.6s ease";
    } else {
      nav.style.backgroundColor = "rgba(255, 255, 255, 0)";




    }
  });

const text = "Pro ty, kdo jdou za svými cíli";
const speed = 100;
const pause = 1500;
let index = 0;
let deleting = false;
const container = document.getElementById("typewriter");

function typeWriter() {
  if (!deleting && index <= text.length) {
    if (index === 0) container.textContent = ""; // reset
    // přidáme písmeno jako span s animací
    if (index > 0) {
      const span = document.createElement('span');
      span.textContent = text.charAt(index - 1);
      span.classList.add('fade-in');
      container.appendChild(span);
    }
    index++;
    if (index > text.length) {
      setTimeout(() => {
        deleting = true;
        typeWriter();
      }, pause);
      return;
    }
  } else if (deleting && index >= 0) {
    // mažeme znak (poslední span)
    if (container.lastChild) {
      container.removeChild(container.lastChild);
    }
    index--;
    if (index < 0) {
      deleting = false;
    }
  }
  setTimeout(typeWriter, speed);
}

typeWriter();

