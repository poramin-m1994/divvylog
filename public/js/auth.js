async function login() {
  const username = document.getElementById("username").value.trim();
  const errorText = document.getElementById("error");

  if (!username) return;

  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbzD1WHFhWzfmEmlXia5gMvPat8l2jMlDp6Q7MiDY6INi8hbc6cFyBAnleakr7TYyEG3/exec?username=" + username
    );
    const data = await res.json();

    if (data && data.exists) {
      localStorage.setItem("username", username);
      window.location.href = "main.html";
    } else {
      errorText.classList.remove("hidden");
    }
  } catch (e) {
    console.error("Error:", e);
    errorText.textContent = "เกิดข้อผิดพลาด กรุณาลองใหม่";
    errorText.classList.remove("hidden");
  }
}
