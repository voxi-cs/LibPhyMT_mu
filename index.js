fetch("/Main/Navigation-bar/NavigationBar.html")
  .then(function (response) { return response.text(); })
  .then(function (data) {
    document.getElementById("navbar-container").innerHTML = data;

    // Scripts inside innerHTML are never executed by the browser,
    // so we load the CSS and init the nav manually here.
    var link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "/Main/Navigation-bar/NavigationBar.css";
    document.head.appendChild(link);

    initNavigation();
  })
  .catch(function (error) {
    console.error("Error loading navigation:", error);
  });

function initNavigation() {
  var menuIcon     = document.querySelector(".menu-icon");
  var mobileMenu   = document.getElementById("mobileMenu");
  var menuBackdrop = document.getElementById("menuBackdrop");

  // If the DOM isn't ready yet, retry once
  if (!menuIcon || !mobileMenu) {
    setTimeout(initNavigation, 50);
    return;
  }

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

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
}