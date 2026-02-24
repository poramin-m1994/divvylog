const summaryModalState = {
  modal: null,
  closeBtn: null,
  monthSelect: null,
  yearSelect: null,
  listContainer: null,
};

document.addEventListener("DOMContentLoaded", () => {
  summaryModalState.modal = document.getElementById("summaryModal");
  summaryModalState.closeBtn = document.getElementById("closeSummaryModal");
  summaryModalState.monthSelect = document.getElementById("summaryMonth");
  summaryModalState.yearSelect = document.getElementById("summaryYear");
  summaryModalState.listContainer = document.getElementById("summaryList");

  summaryModalState.closeBtn.onclick = closeSummaryModal;
  summaryModalState.monthSelect.onchange = showMonthlySummary;
  summaryModalState.yearSelect.onchange = showMonthlySummary;
});

function openSummaryModal() {
  summaryModalState.modal.classList.remove("hidden");
  populateYears();
  showMonthlySummary();
}

function closeSummaryModal() {
  summaryModalState.modal.classList.add("hidden");
}

function populateYears() {
  const data = window.dividendData || [];
  const years = [...new Set(data.map((item) => new Date(item.date).getFullYear()))].sort();

  summaryModalState.yearSelect.innerHTML = years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");
}

function showMonthlySummary() {
  const selectedMonth = parseInt(summaryModalState.monthSelect.value, 10);
  const selectedYear = parseInt(summaryModalState.yearSelect.value, 10);

  const results = (window.dividendData || []).filter((item) => {
    const date = new Date(item.date);
    return (
      date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
    );
  });

  if (results.length === 0) {
    summaryModalState.listContainer.innerHTML =
      "<p class='text-gray-400 text-center'>ไม่มีรายการปันผลในเดือนนี้</p>";
    return;
  }

  summaryModalState.listContainer.innerHTML = results
    .map((item) => {
      const formattedDate = formatDate(item.date);
      const amount = parseFloat(item.amount).toFixed(2);
      return `<div class="bg-gray-100 dark:bg-gray-700 p-2 rounded-md flex justify-between">
                <span>${item.ticker} (${formattedDate})</span>
                <span class="font-semibold text-green-500">$${amount}</span>
              </div>`;
    })
    .join("");
}

function formatDate(rawDate) {
  const date = new Date(rawDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
