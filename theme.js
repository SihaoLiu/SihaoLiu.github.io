"use strict";
const themeButton = document.getElementById("theme-toggle");
function labelTheme() {
  const label = document.documentElement.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
}
themeButton.hidden = false;
labelTheme();
themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch {}
  labelTheme();
});
