// ─── Navigation ───

fetch("/Main/Navigation-bar/NavigationBar.html")
  .then(r => r.text())
  .then(data => {
    document.getElementById("navbar-container").innerHTML = data;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/Main/Navigation-bar/NavigationBar.css";
    document.head.appendChild(link);

    initNavigation();
  })
  .catch(err => console.error("Navigation load error:", err));


function initNavigation() {
  const menuIcon = document.querySelector(".menu-icon");
  const mobileMenu = document.getElementById("mobileMenu");
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

    if (menuBackdrop) {
      menuBackdrop.classList.add("open");
    }
  }

  function closeMenu() {
    menuIcon.classList.remove("open");
    menuIcon.setAttribute("aria-expanded", "false");
    menuIcon.setAttribute("aria-label", "Open navigation menu");

    mobileMenu.classList.remove("open");

    if (menuBackdrop) {
      menuBackdrop.classList.remove("open");
    }
  }

  menuIcon.addEventListener("click", () =>
    mobileMenu.classList.contains("open")
      ? closeMenu()
      : openMenu()
  );

  if (menuBackdrop) {
    menuBackdrop.addEventListener("click", closeMenu);
  }

  mobileMenu
    .querySelectorAll("a")
    .forEach(a => a.addEventListener("click", closeMenu));
}


// ─── Contact form ──────────────────────────────────────────────────────────

const FORMSPREE_ID = "mkjglyee";


document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");
  const successState = document.getElementById("successState");
  const sendAnotherBtn = document.getElementById("sendAnotherBtn");


  // ── Submit ──

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();


    // Client-side validation

    if (!name || !email || !subject || !message) {
      showStatus("Please fill in all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }


    setLoading(true);
    clearStatus();


    try {

      const res = await fetch(
        `https://formspree.io/f/${FORMSPREE_ID}`,
        {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        }
      );


      if (res.ok) {

        form.hidden = true;
        successState.hidden = false;

      } else {

        const json = await res.json().catch(() => ({}));

        const msg = json.errors
          ? json.errors.map(e => e.message).join(". ")
          : "Something went wrong. Please try again.";

        showStatus(msg, "error");
        setLoading(false);
      }

    } catch {

      showStatus(
        "Could not send — check your connection and try again.",
        "error"
      );

      setLoading(false);
    }
  });


  // ── Send another ──

  sendAnotherBtn.addEventListener("click", function () {

    form.reset();

    // Reset the submit button
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";

    // Show the form again
    form.hidden = false;
    successState.hidden = true;

    clearStatus();
  });


  // ── Helpers ──

  function setLoading(on) {

    submitBtn.disabled = on;

    submitBtn.textContent = on
      ? "Sending…"
      : "Send Message";
  }


  function showStatus(msg, type) {

    formStatus.textContent = msg;
    formStatus.className = "form-status " + type;
  }


  function clearStatus() {

    formStatus.textContent = "";
    formStatus.className = "form-status";
  }


  function isValidEmail(v) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

});