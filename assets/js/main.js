// Mobile nav toggle
const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
    });
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));
