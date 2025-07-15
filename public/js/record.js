const SHEET_API = "https://script.google.com/macros/s/AKfycbzD1WHFhWzfmEmlXia5gMvPat8l2jMlDp6Q7MiDY6INi8hbc6cFyBAnleakr7TYyEG3/exec";

// โหลดข้อมูลเมื่อเปิดหน้า
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("username");
  if (!user) return window.location.href = "index.html";
  loadRecords(user);
});

async function loadRecords(user) {
  try {
    const res = await fetch(`${SHEET_API}?action=getDividends&user=${user}`);
    const data = await res.json();

    if (!data.success) throw new Error("ไม่สามารถโหลดข้อมูลได้");

    const tbody = document.getElementById("recordTableBody");
    tbody.innerHTML = "";

    data.records.forEach((r, i) => {
      const row = document.createElement("tr");
      row.className = "border-b border-gray-200 dark:border-gray-700";

      row.innerHTML = `
        <td class="p-3"><input type="date" name="date" class="bg-transparent w-full" value="${r.date}" disabled /></td>
        <td class="p-3"><input type="text" name="ticker" class="bg-transparent w-full uppercase" value="${r.ticker}" disabled /></td>
        <td class="p-3"><input type="number" name="amount" class="bg-transparent w-full" value="${r.amount}" disabled /></td>
        <td class="p-3"><input type="number" name="rate" class="bg-transparent w-full" value="${r.rate}" disabled /></td>
        <td class="p-3 space-x-2">
          <button class="text-blue-500 edit-btn">✏️</button>
          <button class="text-red-500 delete-btn">🗑️</button>
        </td>
      `;

      tbody.appendChild(row);

      const editBtn = row.querySelector(".edit-btn");
      const deleteBtn = row.querySelector(".delete-btn");

      editBtn.addEventListener("click", () => enableEdit(row, i));
      deleteBtn.addEventListener("click", () => deleteRow(i, r.date, r.ticker, user));
    });

  } catch (err) {
    console.error("Load Error:", err);
    alert("เกิดปัญหาในการโหลดข้อมูล");
  }
}

function enableEdit(row, index) {
  const inputs = row.querySelectorAll("input");
  inputs.forEach(input => input.disabled = false);

  const actionCell = row.querySelector("td:last-child");
  actionCell.innerHTML = `
    <button class="text-green-500 save-btn">💾</button>
    <button class="text-yellow-500 cancel-btn">❌</button>
  `;

  actionCell.querySelector(".save-btn").addEventListener("click", () => saveRow(row, index));
  actionCell.querySelector(".cancel-btn").addEventListener("click", () => window.location.reload());
}

async function saveRow(row, index) {
  const date = row.querySelector("input[name='date']").value;
  const ticker = row.querySelector("input[name='ticker']").value.trim();
  const amount = parseFloat(row.querySelector("input[name='amount']").value);
  const rate = parseFloat(row.querySelector("input[name='rate']").value);
  const user = localStorage.getItem("username");

  if (!date || !ticker || isNaN(amount) || isNaN(rate)) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  const payload = {
    action: "editDividend",
    index,
    date,
    ticker,
    amount,
    rate,
    user
  };

  try {
    const res = await fetch(SHEET_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
      alert("บันทึกสำเร็จ");
      window.location.reload();
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  } catch (err) {
    console.error("Save Error:", err);
    alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  }
}


async function deleteRow(index, date, ticker, user) {
  const confirmDelete = confirm(`ลบรายการ ${ticker} วันที่ ${date} ใช่ไหม?`);
  if (!confirmDelete) return;

  try {
    const payload = {
      action: "deleteDividend",
      user,
      date,
      ticker
    };

    const res = await fetch(SHEET_API, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();
    if (result.success) {
      alert("ลบสำเร็จ");
      window.location.reload();
    } else {
      alert("ลบไม่สำเร็จ");
    }
  } catch (err) {
    console.error("Delete Error:", err);
    alert("ลบล้มเหลว");
  }
}
