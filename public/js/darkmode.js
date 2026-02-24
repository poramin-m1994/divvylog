document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME);
  document.documentElement.classList.toggle("dark", theme === "dark");
});

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");

  localStorage.setItem(
    APP_CONFIG.STORAGE_KEYS.THEME,
    isDark ? "dark" : "light"
  );
}
