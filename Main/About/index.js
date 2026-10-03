// ─── Navigation ───
fetch("/LibPhyMT_mu/Main/Navigation-bar/NavigationBar.html")
  .then(r => r.text())
  .then(data => {
    document.getElementById("navbar-container").innerHTML = data;
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "/LibPhyMT_mu/Main/Navigation-bar/NavigationBar.css";
    document.head.appendChild(link);
    initNavigation();
  })
  .catch(err => console.error("Navigation load error:", err));

function initNavigation() {
  const menuIcon     = document.querySelector(".menu-icon");
  const mobileMenu   = document.getElementById("mobileMenu");
  const menuBackdrop = document.getElementById("menuBackdrop");

  if (!menuIcon || !mobileMenu) { setTimeout(initNavigation, 50); return; }

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

  menuIcon.addEventListener("click", () =>
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu()
  );
  if (menuBackdrop) menuBackdrop.addEventListener("click", closeMenu);
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
}