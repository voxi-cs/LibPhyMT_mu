

document.querySelectorAll(".lesson-box").forEach((box) => {
  box.addEventListener("click", function () {
    const link = this.getAttribute("data-link");
    window.location.href = link;
  });
});
