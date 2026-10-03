fetch("/Main/Navigation-bar/NavigationBar.html")
  .then(r => r.text())
  .then(data => {
    document.getElementById("navbar-container").innerHTML = data;

    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "/Main/Navigation-bar/NavigationBar.css";
    document.head.appendChild(link);

    initNavigation();
  })
  .catch(err => console.error("Navigation load error:", err));

function initNavigation() {
  const menuIcon     = document.querySelector(".menu-icon");
  const mobileMenu   = document.getElementById("mobileMenu");
  const menuBackdrop = document.getElementById("menuBackdrop");

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

  menuIcon.addEventListener("click", () => {
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  if (menuBackdrop) menuBackdrop.addEventListener("click", closeMenu);
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
}

document.addEventListener("DOMContentLoaded", function () {

  const freqBtns = document.querySelectorAll(".freq-btn");
  const slider   = document.querySelector(".freq-slider");
  let currentFreq = "once";

  function positionSlider(btn) {
    if (!slider || !btn) return;
    slider.style.width     = btn.offsetWidth + "px";
    slider.style.transform = "translateX(" + btn.offsetLeft + "px)";
  }

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    const active = document.querySelector(".freq-btn.active");
    if (active) {
      slider.style.transition = "none";
      positionSlider(active);
      requestAnimationFrame(() => { slider.style.transition = ""; });
    }
  });

  freqBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      freqBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFreq = btn.dataset.freq;
      positionSlider(btn);
    });
  });

  const presetBtns   = document.querySelectorAll(".preset-btn");
  const customAmount = document.getElementById("customAmount");

  presetBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      customAmount.value = btn.dataset.amount;
    });
  });

  customAmount.addEventListener("input", function () {
    const val = parseFloat(customAmount.value);
    presetBtns.forEach(btn => {
      btn.classList.toggle("active", parseFloat(btn.dataset.amount) === val);
    });
  });

  const donateBtn = document.querySelector(".donate-btn");
  if (donateBtn) {
    donateBtn.addEventListener("click", function () {
      const amount = parseFloat(customAmount.value);
      if (!amount || amount <= 0) {
        customAmount.focus();
        return;
      }
    });
  }

});