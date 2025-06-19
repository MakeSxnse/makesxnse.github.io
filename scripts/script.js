  window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    const threshold = window.innerHeight * 0.05;

    if (window.scrollY > threshold) {
      nav.style.backgroundColor = "rgba(255, 255, 255, 1)";
      nav.style.transition = "background-color 0.3s ease";
    } else {
      nav.style.backgroundColor = "rgba(255, 255, 255, 0)";
    }
  });
