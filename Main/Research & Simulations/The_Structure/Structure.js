// --- NAVBAR + COPY BUTTONS ---

// Guard: ensures initMenu only ever runs once even if
// onload, onerror, and setTimeout all fire in the same tick.
let menuInitialized = false;

fetch("/LibPhyMT_mu/Main/Navigation-bar/NavigationBar.html")
  .then(response => {
    if (!response.ok) {
      throw new Error(
        `Failed to load NavigationBar.html — HTTP ${response.status} ${response.statusText}`
      );
    }
    return response.text();
  })
  .then(data => {
    const container = document.getElementById("navbar-container");
    container.innerHTML = data;

    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "/LibPhyMT_mu/Main/Navigation-bar/NavigationBar.css";

    link.onload  = initMenu;
    link.onerror = () => {
      console.warn("NavigationBar.css failed to load — continuing to init menu.");
      initMenu();
    };

    document.head.appendChild(link);

    // Fallback: if onload/onerror never fires (some browsers), still init.
    setTimeout(initMenu, 300);

    // Wire copy buttons now that the DOM is ready.
    initCopyButtons();
  })
  .catch(error => {
    console.error("Error loading navigation:", error);
  });

/* -----------------------
   Menu initialization
   ----------------------- */
function initMenu() {
  // Guard prevents duplicate runs from onload + setTimeout both firing.
  if (menuInitialized) return;
  menuInitialized = true;

  const container = document.getElementById("navbar-container");
  if (!container) {
    console.error("initMenu: #navbar-container not found.");
    return;
  }

  const menuIcon = container.querySelector(".menu-icon");
  const navLinks = container.querySelector(".nav-links");

  if (menuIcon && navLinks) {
    menuIcon.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  } else {
    // Log which element is missing to help diagnose the nav HTML structure.
    if (!menuIcon) console.error("initMenu: .menu-icon not found inside #navbar-container.");
    if (!navLinks) console.error("initMenu: .nav-links not found inside #navbar-container.");
  }
}

/* -----------------------
   Copy button wiring
   ----------------------- */
function initCopyButtons() {
  // Strip consistent leading indentation and trim blank boundary lines.
  function dedent(str) {
    str = str.replace(/^\s*\n/, "").replace(/\n\s*$/, "");
    const lines   = str.split("\n");
    const indents = lines
      .filter(l => l.trim())
      .map(l => (l.match(/^([ \t]*)/) || [])[1].length);
    const minIndent = indents.length ? Math.min(...indents) : 0;
    return lines.map(l => l.slice(minIndent)).join("\n");
  }

  // Fallback for browsers without clipboard API.
  function fallbackCopy(text) {
    return new Promise((resolve, reject) => {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left     = "-9999px";
        ta.setAttribute("aria-hidden", "true");
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length); // iOS
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("execCommand returned false"));
      } catch (err) {
        reject(err);
      }
    });
  }

  // initCopyButtons is called exactly once, so no clone-and-replace needed.
  document.querySelectorAll(".code-cell").forEach(cell => {
    const btn = cell.querySelector(".copy-btn");
    const pre =
      cell.querySelector(".demo-highlight pre") ||
      cell.querySelector("pre") ||
      cell.querySelector("code");

    if (!btn || !pre) return;

    btn.setAttribute("type", "button"); // prevent accidental form submission

    btn.addEventListener("click", async () => {
      const original = btn.textContent;
      try {
        let text = pre.innerText || pre.textContent || "";
        text = dedent(text);

        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          await fallbackCopy(text);
        }

        btn.textContent = "Copied!";
        btn.classList.add("copied");
      } catch (err) {
        console.error("Copy failed:", err);
        btn.textContent = "Error";
        btn.classList.add("error");
      } finally {
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("copied", "error");
        }, 1500);
      }
    });
  });
}

/* -----------------------
   MathJax scroll-wrap
   ----------------------- */
MathJax.startup.promise.then(() => {
  document.querySelectorAll('mjx-container[display="true"]').forEach(container => {
    // Avoid double-wrapping on re-typeset calls.
    if (container.parentElement.classList.contains("mjx-scroll-wrap")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "mjx-scroll-wrap";
    container.parentNode.insertBefore(wrapper, container);
    wrapper.appendChild(container);
  });
});