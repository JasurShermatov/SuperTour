document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".admin-quick-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.borderColor = "#0f766e";
    });
    card.addEventListener("mouseleave", () => {
      card.style.borderColor = "#dbe5e9";
    });
  });
});
