// =========================
// NAV SCROLL EFFECT
// =========================
(function () {
  const nav = document.querySelector("nav");
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
  const text = "Pro ty, kdo jdou za svými cíli";
  let index = 0;
  let deleting = false;
  const speed = 100;
  const pause = 1500;

  function animate() {
    if (!el) return;

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
      if (index < 0) {
        deleting = false;
      }
    }
    setTimeout(animate, speed);
  }

  document.addEventListener("DOMContentLoaded", animate);
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
    dot.addEventListener("click", () => { index = i; update(); });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("span");

  function update() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  }

  nextBtn.addEventListener("click", () => { index = (index + 1) % photos.length; update(); });
  prevBtn.addEventListener("click", () => { index = (index - 1 + photos.length) % photos.length; update(); });

  update();
  setInterval(() => { index = (index + 1) % photos.length; update(); }, 6000);
}

document.addEventListener("DOMContentLoaded", () => {
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

// =========================
// KOŠÍK
// =========================
let cartCount = 0;

function getCartItems() {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCartItems(items) {
  localStorage.setItem("cartItems", JSON.stringify(items));
}

function addToCart(size, variant) {
  const items = getCartItems();
  items.push({size, variant, quantity: 1});
  saveCartItems(items);

  cartCount++;
  updateCartCounter();

  const cartIcon = document.querySelector(".cart_icon");
  if (cartIcon) {
    cartIcon.classList.add("animate");
    cartIcon.addEventListener("animationend", () => { cartIcon.classList.remove("animate"); }, {once: true});
  }
}

function updateCartCounter() {
  const counter = document.getElementById("cartCounter");
  const items = getCartItems();
  const count = items.length;

  if (!counter) return;

  let text = "";
  if (count === 1) text = "1 položka";
  else if (count >= 2 && count <= 4) text = `${count} položky`;
  else text = `${count} položek`;

  counter.textContent = text;
}

function initAddToCartButtons() {
  const forms = document.querySelectorAll(".accessories_others");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const selects = form.querySelectorAll(".select");
      const size = selects[0].value;
      const variant = selects[1].value;
      addToCart(size, variant);
    });
  });
}

document.getElementById("clear-cart").addEventListener("click", () => {
  clearCart();
});


function setupCartVisibilityOnScroll() {
  const cart = document.getElementById("cart");
  const footer = document.querySelector("footer");
  if (!cart || !footer) return;

  function checkScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const limit = windowHeight * 1.2;
    const footerTop = footer.getBoundingClientRect().top + scrollY;

    if (scrollY > limit) cart.classList.add("visible");
    else cart.classList.remove("visible");
  }

  window.addEventListener("scroll", checkScroll);
  checkScroll();
}

function renderCartItems() {
  const cartContainer = document.querySelector(".kosik_items");
  if (!cartContainer) return;

  const items = getCartItems();
  if (items.length === 0) {
    cartContainer.innerHTML = "<p>Košík je prázdný.</p>";
    return;
  }

  cartContainer.innerHTML = "";
  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("kosik_item");
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
  localStorage.removeItem("cartItems");
  renderCartItems();
  updateCartCounter();
}
