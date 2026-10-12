"use strict";
const themeButton = document.getElementById("theme-toggle");
function labelTheme() {
  themeButton.textContent = document.documentElement.dataset.theme === "dark" ? "Light mode" : "Dark mode";
}
themeButton.hidden = false;
labelTheme();
themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch {}
  labelTheme();
});
