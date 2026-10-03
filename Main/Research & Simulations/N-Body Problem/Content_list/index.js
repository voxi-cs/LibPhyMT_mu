fetch("/Main/Navigation-bar/NavigationBar.html")
  .then(response => {
    if (!response.ok) {
      throw new Error(
        `Failed to load NavigationBar.html: ${response.status}`
      );
    }

    return response.text();
  })
  .then(data => {

    const container = document.getElementById("navbar-container");

    if (!container) {
      console.error("navbar-container not found!");
      return;
    }

    container.innerHTML = data;

    console.log("Navigation bar loaded.");

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/Main/Navigation-bar/NavigationBar.css";

    document.head.appendChild(link);

    initMenu();
    initCopyButtons();
  })
  .catch(error => {
    console.error("Error loading navigation:", error);
  });


function initMenu() {

  const container = document.getElementById("navbar-container");

  if (!container) {
    console.error("Navbar container not found.");
    return;
  }

  const menuIcon = container.querySelector(".menu-icon");
  const navLinks = container.querySelector(".nav-links");

  console.log("Menu Icon:", menuIcon);
  console.log("Nav Links:", navLinks);

  if (!menuIcon || !navLinks) {
    console.error(
      "Could not find .menu-icon or .nav-links inside NavigationBar.html"
    );
    return;
  }

  menuIcon.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });
}

document.querySelectorAll(".lesson-box").forEach((box) => {
  box.addEventListener("click", function () {
    const link = this.getAttribute("data-link");
    window.location.href = link;
  });
});