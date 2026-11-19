"use strict";
// Pages open dark. A light choice made with the button is remembered until dark is chosen again;
// the inline script in index.html restores it before paint.
const themeButton = document.getElementById("theme-toggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
}
themeButton.hidden = false;
applyTheme(document.documentElement.dataset.theme);
themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try {
    if (theme === "light") localStorage.setItem("theme", theme);
    else localStorage.removeItem("theme");
  } catch {}
  applyTheme(theme);
});
