const THEME_KEY = "theme";

document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem(THEME_KEY);

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

function toggleDarkMode() {
  const html = document.documentElement;

  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem(THEME_KEY, "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem(THEME_KEY, "dark");
  }
}
