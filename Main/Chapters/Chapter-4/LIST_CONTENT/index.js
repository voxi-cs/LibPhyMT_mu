// Load the navigation bar
fetch("../../../Navigation-bar/NavigationBar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    // Inject the CSS dynamically
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../../../Navigation-bar/NavigationBar.css";
    document.head.appendChild(link);
  })
  .catch((error) => console.error("Error loading navbar:", error));

// Make lesson-box clickable
document.querySelectorAll(".lesson-box").forEach((box) => {
  box.addEventListener("click", function () {
    const link = this.getAttribute("data-link");
    window.location.href = link;
  });
});
