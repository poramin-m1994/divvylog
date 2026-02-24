async function login() {
  const username = document.getElementById("username").value.trim();
  const errorText = document.getElementById("error");

  if (!username) {
    return;
  }

  try {
    const data = await DivvyApi.checkUserExists(username);

    if (data && data.exists) {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USERNAME, username);
      window.location.href = "main.html";
      return;
    }

    errorText.classList.remove("hidden");
  } catch (error) {
    console.error("Login Error:", error);
    errorText.textContent = "เกิดข้อผิดพลาด กรุณาลองใหม่";
    errorText.classList.remove("hidden");
  }
}
