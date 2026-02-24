document.addEventListener("DOMContentLoaded", async () => {
  const user = getCurrentUser();
  if (!user) {
    redirectToLogin();
    return;
  }

  await loadRecords(user);
});

async function loadRecords(user) {
  try {
    const data = await DivvyApi.getDividends(user);
    if (!data.success) {
      throw new Error("Failed to load records");
    }

    renderRecordRows(data.records || [], user);
  } catch (error) {
    console.error("Load Error:", error);
    alert("เกิดปัญหาในการโหลดข้อมูล");
  }
}

function renderRecordRows(records, user) {
  const tbody = document.getElementById("recordTableBody");
  tbody.innerHTML = "";

  records.forEach((record, index) => {
    const row = buildRecordRow(record);
    tbody.appendChild(row);

    row.querySelector(".edit-btn").addEventListener("click", () => {
      enableEdit(row, index);
    });

    row.querySelector(".delete-btn").addEventListener("click", () => {
      deleteRow({ index, date: record.date, ticker: record.ticker, user });
    });
  });
}

function buildRecordRow(record) {
  const row = document.createElement("tr");
  row.className = "border-b border-gray-200 dark:border-gray-700";
  row.innerHTML = `
    <td class="p-3"><input type="date" name="date" class="bg-transparent w-full" value="${record.date}" disabled /></td>
    <td class="p-3"><input type="text" name="ticker" class="bg-transparent w-full uppercase" value="${record.ticker}" disabled /></td>
    <td class="p-3"><input type="number" name="amount" class="bg-transparent w-full" value="${record.amount}" disabled /></td>
    <td class="p-3"><input type="number" name="rate" class="bg-transparent w-full" value="${record.rate}" disabled /></td>
    <td class="p-3 space-x-2">
      <button class="text-blue-500 edit-btn">✏️</button>
      <button class="text-red-500 delete-btn">🗑️</button>
    </td>
  `;

  return row;
}

function enableEdit(row, index) {
  row.querySelectorAll("input").forEach((input) => {
    input.disabled = false;
  });

  const actionCell = row.querySelector("td:last-child");
  actionCell.innerHTML = `
    <button class="text-green-500 save-btn">💾</button>
    <button class="text-yellow-500 cancel-btn">❌</button>
  `;

  actionCell.querySelector(".save-btn").addEventListener("click", () => {
    saveRow(row, index);
  });
  actionCell.querySelector(".cancel-btn").addEventListener("click", () => {
    window.location.reload();
  });
}

function parseEditedRow(row, index) {
  return {
    index,
    user: getCurrentUser(),
    date: row.querySelector("input[name='date']").value,
    ticker: row.querySelector("input[name='ticker']").value.trim(),
    amount: parseFloat(row.querySelector("input[name='amount']").value),
    rate: parseFloat(row.querySelector("input[name='rate']").value),
  };
}

function isValidEditedPayload(payload) {
  return (
    payload.user &&
    payload.date &&
    payload.ticker &&
    !Number.isNaN(payload.amount) &&
    !Number.isNaN(payload.rate)
  );
}

async function saveRow(row, index) {
  const payload = parseEditedRow(row, index);
  if (!isValidEditedPayload(payload)) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  try {
    const result = await DivvyApi.editDividend(payload);
    if (result.success) {
      alert("บันทึกสำเร็จ");
      window.location.reload();
      return;
    }

    alert("เกิดข้อผิดพลาดในการบันทึก");
  } catch (error) {
    console.error("Save Error:", error);
    alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  }
}

async function deleteRow(payload) {
  const confirmDelete = confirm(
    `ลบรายการ ${payload.ticker} วันที่ ${payload.date} ใช่ไหม?`
  );
  if (!confirmDelete) {
    return;
  }

  try {
    const result = await DivvyApi.deleteDividend(payload);
    if (result.success) {
      alert("ลบสำเร็จ");
      window.location.reload();
      return;
    }

    alert("ลบไม่สำเร็จ");
  } catch (error) {
    console.error("Delete Error:", error);
    alert("ลบล้มเหลว");
  }
}
