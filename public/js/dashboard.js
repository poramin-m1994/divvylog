document.addEventListener("DOMContentLoaded", async () => {
  const user = getCurrentUser();
  if (!user) {
    redirectToLogin();
    return;
  }

  await loadDashboard(user);
});

async function loadDashboard(user) {
  try {
    const data = await DivvyApi.getDividends(user);
    if (!data.success) {
      throw new Error("Failed to load dividends");
    }

    const allRecords = data.records || [];
    const thisYearRecords = getRecordsForYear(allRecords, new Date().getFullYear());
    renderDashboardSummary(thisYearRecords);

    window.dividendData = allRecords;
  } catch (error) {
    console.error("Dashboard Load Error:", error);
  }
}

function getRecordsForYear(records, year) {
  return records.filter((record) => new Date(record.date).getFullYear() === year);
}

function renderDashboardSummary(records) {
  const total = records.reduce(
    (sum, record) => sum + toNumber(record.amount),
    0
  );
  const latestTicker = records[records.length - 1]?.ticker || "-";

  document.getElementById("total-dividend").textContent = `$${total.toFixed(2)}`;
  document.getElementById("total-entries").textContent = records.length;
  document.getElementById("latest-ticker").textContent = latestTicker;
}

function parseDividendForm() {
  return {
    user: getCurrentUser(),
    ticker: document.getElementById("ticker").value.trim(),
    amount: parseFloat(document.getElementById("amountUSD").value),
    rate: parseFloat(document.getElementById("exchangeRate").value),
    date: document.getElementById("date").value,
  };
}

function isValidDividendPayload(payload) {
  return (
    payload.user &&
    payload.ticker &&
    !Number.isNaN(payload.amount) &&
    !Number.isNaN(payload.rate) &&
    payload.date
  );
}

function toNumber(value) {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function submitDividend() {
  const payload = parseDividendForm();

  if (!isValidDividendPayload(payload)) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  try {
    const result = await DivvyApi.addDividend(payload);
    if (result.success) {
      alert("✅ บันทึกสำเร็จ!");
      window.location.reload();
      return;
    }

    alert("❌ เกิดข้อผิดพลาดในการบันทึก");
  } catch (error) {
    console.error("Submit Error:", error);
    alert("เกิดปัญหาในการเชื่อมต่อกับเซิร์ฟเวอร์");
  }
}
