const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CHART_COLORS = ["#facc15", "#f87171", "#60a5fa", "#34d399", "#c084fc"];

document.addEventListener("DOMContentLoaded", () => {
  const checkDataReady = setInterval(() => {
    if (!window.dividendData) {
      return;
    }

    drawMonthlyChart(window.dividendData);
    drawYearlyChart(window.dividendData);
    clearInterval(checkDataReady);
  }, 200);
});

function drawMonthlyChart(data) {
  const ctx = document.getElementById("monthlyChart").getContext("2d");
  const years = getSortedYears(data);
  const datasets = years.map((year, index) => {
    return {
      label: year.toString(),
      data: sumByMonth(data, year),
      backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
      stack: "dividends",
    };
  });

  new Chart(ctx, {
    type: "bar",
    data: { labels: MONTH_NAMES, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false },
      },
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          beginAtZero: true,
          title: { display: true, text: "USD" },
        },
      },
    },
  });
}

function drawYearlyChart(data) {
  const ctx = document.getElementById("yearlyChart").getContext("2d");
  const yearlyTotals = sumByYear(data);
  const sortedYears = Object.keys(yearlyTotals).sort();
  const values = sortedYears.map((year) => yearlyTotals[year]);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: sortedYears,
      datasets: [
        {
          label: "Year Dividend income",
          data: values,
          backgroundColor: "#4ade80",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "USD" },
        },
      },
    },
  });
}

function getSortedYears(data) {
  return [...new Set(data.map((item) => new Date(item.date).getFullYear()))].sort();
}

function sumByMonth(data, year) {
  const monthlyTotals = Array(12).fill(0);

  data.forEach((item) => {
    const itemDate = new Date(item.date);
    if (itemDate.getFullYear() !== year) {
      return;
    }

    const month = itemDate.getMonth();
    const amount = parseFloat(item.amount);
    monthlyTotals[month] += Number.isNaN(amount) ? 0 : amount;
  });

  return monthlyTotals;
}

function sumByYear(data) {
  return data.reduce((accumulator, item) => {
    const year = new Date(item.date).getFullYear();
    const amount = parseFloat(item.amount);
    accumulator[year] = (accumulator[year] || 0) + (Number.isNaN(amount) ? 0 : amount);
    return accumulator;
  }, {});
}
