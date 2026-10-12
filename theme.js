"use strict";
// The page follows the system's appearance, live. A choice made with the button is remembered
// only while it differs from the system; choosing the system's theme again resumes following it.
const themeButton = document.getElementById("theme-toggle");
const systemLight = matchMedia("(prefers-color-scheme: light)");
const systemTheme = () => (systemLight.matches ? "light" : "dark");
function savedTheme() {
  try {
    const theme = localStorage.getItem("theme");
    return theme === "light" || theme === "dark" ? theme : null;
  } catch {
    return null;
  }
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}
themeButton.hidden = false;
applyTheme(document.documentElement.dataset.theme);
themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try {
    if (theme === systemTheme()) localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  } catch {}
  applyTheme(theme);
});
systemLight.addEventListener("change", () => {
  if (!savedTheme()) applyTheme(systemTheme());
});
