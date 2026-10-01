"use strict";
const themeButton = document.getElementById("theme-toggle");
function labelTheme() {
  const dark = document.documentElement.dataset.theme === "dark";
  themeButton.textContent = dark ? "Light mode" : "Dark mode";
  themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}
themeButton.hidden = false;
labelTheme();
themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch {}
  labelTheme();
});
