// Runs when the HTML is used standalone (direct load).
// When injected via innerHTML, DOMContentLoaded won't fire —
// initNavigation() is called directly by HomePage.js instead.
document.addEventListener("DOMContentLoaded", initNavigation);

function initNavigation() {
  const menuIcon     = document.querySelector(".menu-icon");
  const mobileMenu   = document.getElementById("mobileMenu");
  const menuBackdrop = document.getElementById("menuBackdrop");

  if (!menuIcon || !mobileMenu) return;

  function openMenu() {
    menuIcon.classList.add("open");
    menuIcon.setAttribute("aria-expanded", "true");
    menuIcon.setAttribute("aria-label", "Close navigation menu");
    mobileMenu.classList.add("open");
    if (menuBackdrop) menuBackdrop.classList.add("open");
  }

  function closeMenu() {
    menuIcon.classList.remove("open");
    menuIcon.setAttribute("aria-expanded", "false");
    menuIcon.setAttribute("aria-label", "Open navigation menu");
    mobileMenu.classList.remove("open");
    if (menuBackdrop) menuBackdrop.classList.remove("open");
  }

  menuIcon.addEventListener("click", function () {
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  if (menuBackdrop) {
    menuBackdrop.addEventListener("click", closeMenu);
  }

  // Clicking a link closes the menu automatically
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
}