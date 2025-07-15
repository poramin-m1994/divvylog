const SHEET_API = "https://script.google.com/macros/s/AKfycbzD1WHFhWzfmEmlXia5gMvPat8l2jMlDp6Q7MiDY6INi8hbc6cFyBAnleakr7TYyEG3/exec";

// โหลดข้อมูลเมื่อเปิดหน้า
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("username");
  if (!user) return window.location.href = "index.html";
  loadDashboard(user);
});

// ดึงข้อมูลทั้งหมด
async function loadDashboard(user) {
  try {
    const res = await fetch(`${SHEET_API}?action=getDividends&user=${user}`);
    const data = await res.json();
    if (!data.success) throw new Error("โหลดข้อมูลล้มเหลว");

    const allRecords = data.records; // <-- ใช้ทั้งหมด ไม่กรองเฉพาะปี
    const thisYear = new Date().getFullYear();
    const thisYearRecords = allRecords.filter(d => new Date(d.date).getFullYear() === thisYear);

    // แสดงเฉพาะปีนี้ในสรุป
    const total = thisYearRecords.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    const latest = thisYearRecords[thisYearRecords.length - 1]?.ticker || "-";

    document.getElementById("total-dividend").textContent = `$${total.toFixed(2)}`;
    document.getElementById("total-entries").textContent = thisYearRecords.length;
    document.getElementById("latest-ticker").textContent = latest;

    // 👇 ส่งข้อมูลทั้งหมดเข้า chart.js
    window.dividendData = allRecords;

  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", err);
  }
}

// ฟังก์ชันบันทึกข้อมูลใหม่
async function submitDividend() {
  const user = localStorage.getItem("username");
  const ticker = document.getElementById("ticker").value.trim();
  const amount = parseFloat(document.getElementById("amountUSD").value);
  const rate = parseFloat(document.getElementById("exchangeRate").value);
  const date = document.getElementById("date").value;

  // ✅ ตรวจสอบความถูกต้องของข้อมูล
  if (!ticker || isNaN(amount) || isNaN(rate) || !date) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  // 🔗 เตรียม URL แบบ GET สำหรับ Google Apps Script
  const url = `${SHEET_API}?action=addDividend`
            + `&user=${encodeURIComponent(user)}`
            + `&date=${encodeURIComponent(date)}`
            + `&ticker=${encodeURIComponent(ticker)}`
            + `&amount=${amount}`
            + `&rate=${rate}`;

  try {
    const res = await fetch(url);
    const result = await res.json();

    if (result.success) {
      alert("✅ บันทึกสำเร็จ!");
      window.location.reload();
    } else {
      alert("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  } catch (err) {
    console.error("error:", err);
    alert("เกิดปัญหาในการเชื่อมต่อกับเซิร์ฟเวอร์");
  }
}


