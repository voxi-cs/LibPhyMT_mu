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


function initCopyButtons() {

  function dedent(str) {
    str = str.replace(/^\s*\n/, "").replace(/\n\s*$/, "");
    const lines = str.split("\n");
    const indents = lines.filter(l => l.trim()).map(l => (l.match(/^([ \t]*)/) || [])[1].length);
    const minIndent = indents.length ? Math.min.apply(null, indents) : 0;
    return lines.map(l => l.slice(minIndent)).join("\n");
  }


  function fallbackCopy(text) {
    return new Promise((resolve, reject) => {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed"; 
        ta.style.left = "-9999px";
        ta.setAttribute("aria-hidden", "true");
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length); // iOS
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) resolve();
        else reject(new Error("execCommand returned false"));
      } catch (err) {
        reject(err);
      }
    });
  }

  document.querySelectorAll(".code-cell").forEach(cell => {
    const btn = cell.querySelector(".copy-btn");

    const pre = cell.querySelector(".demo-highlight pre") || cell.querySelector("pre") || cell.querySelector("code");
    if (!btn || !pre) return;


    if (!btn.getAttribute("type")) btn.setAttribute("type", "button");


    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", async () => {
      const originalText = newBtn.textContent;
      try {

        let text = pre.innerText || pre.textContent || "";
        text = dedent(text);

        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          await fallbackCopy(text);
        }

        newBtn.textContent = "Copied!";
        newBtn.classList.add("copied");
      } catch (err) {
        console.error("Copy failed:", err);
        newBtn.textContent = "Error";
        newBtn.classList.add("error");
      } finally {
        setTimeout(() => {
          newBtn.textContent = originalText;
          newBtn.classList.remove("copied", "error");
        }, 1500);
      }
    });
  });
}

MathJax.startup.promise.then(() => {
    document.querySelectorAll('mjx-container[display="true"]').forEach(container => {

      if (container.parentElement.classList.contains('mjx-scroll-wrap')) return;


      const wrapper = document.createElement('div');
      wrapper.className = 'mjx-scroll-wrap';


      container.parentNode.insertBefore(wrapper, container);
      wrapper.appendChild(container);
    });
  });