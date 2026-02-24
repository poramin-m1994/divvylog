const APP_CONFIG = {
  SHEET_API:
    "https://script.google.com/macros/s/AKfycbzD1WHFhWzfmEmlXia5gMvPat8l2jMlDp6Q7MiDY6INi8hbc6cFyBAnleakr7TYyEG3/exec",
  STORAGE_KEYS: {
    USERNAME: "username",
    THEME: "theme",
  },
};

function getCurrentUser() {
  return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USERNAME);
}

function redirectToLogin() {
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USERNAME);
  redirectToLogin();
}
