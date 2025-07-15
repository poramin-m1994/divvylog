document.addEventListener("DOMContentLoaded", () => {
  const checkDataReady = setInterval(() => {
    if (window.dividendData) {
      drawMonthlyChart(window.dividendData);
      drawYearlyChart(window.dividendData);
      clearInterval(checkDataReady);
    }
  }, 200); // รอข้อมูลจาก dashboard.js
});

function drawMonthlyChart(data) {
  const ctx = document.getElementById("monthlyChart").getContext("2d");

  // เตรียมข้อมูลแบบ grouped by ปี
  const years = [...new Set(data.map(d => new Date(d.date).getFullYear()))].sort();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const datasets = years.map((year, i) => {
    const color = ["#facc15", "#f87171", "#60a5fa", "#34d399", "#c084fc"][i % 5]; // random สีสวยๆ

    const monthlyTotals = Array(12).fill(0);
    data
      .filter(d => new Date(d.date).getFullYear() === year)
      .forEach(d => {
        const m = new Date(d.date).getMonth();
        monthlyTotals[m] += parseFloat(d.amount);
      });

    return {
      label: year.toString(),
      data: monthlyTotals,
      backgroundColor: color
    };
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: months,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "USD" }
        }
      }
    }
  });
}

function drawYearlyChart(data) {
  const ctx = document.getElementById("yearlyChart").getContext("2d");

  const yearlyMap = {};

  data.forEach(d => {
    const year = new Date(d.date).getFullYear();
    yearlyMap[year] = (yearlyMap[year] || 0) + parseFloat(d.amount);
  });

  const sortedYears = Object.keys(yearlyMap).sort();
  const values = sortedYears.map(year => yearlyMap[year]);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: sortedYears,
      datasets: [{
        label: "Year Dividend income",
        data: values,
        backgroundColor: "#4ade80"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "USD" }
        }
      }
    }
  });
}
