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
  renderYearlyGrowthSummary(sortedYears, values);

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
        tooltip: {
          callbacks: {
            label(context) {
              return `Year Dividend income: ${context.parsed.y.toFixed(2)}`;
            },
            afterLabel(context) {
              return getYearGrowthTooltipLine(
                sortedYears,
                values,
                context.dataIndex
              );
            },
          },
        },
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

function getYearGrowthTooltipLine(years, values, index) {
  if (index === 0) {
    return "Growth: N/A";
  }

  const currentYear = years[index];
  const previousYear = years[index - 1];
  const currentValue = values[index];
  const previousValue = values[index - 1];

  if (previousValue === 0) {
    return `Growth: N/A (base = 0)`;
  }

  const growthPercent = ((currentValue - previousValue) / previousValue) * 100;
  const sign = growthPercent >= 0 ? "+" : "";
  const trend = growthPercent >= 0 ? "up" : "down";
  return `${currentYear} is ${trend} ${sign}${growthPercent.toFixed(2)}%`;
}

function renderYearlyGrowthSummary(sortedYears, values) {
  const growthTextEl = document.getElementById("yearly-growth-text");
  if (!growthTextEl) {
    return;
  }

  if (sortedYears.length < 2) {
    growthTextEl.textContent = "ยังมีข้อมูลไม่พอสำหรับเทียบการเติบโตกับปีก่อนหน้า";
    growthTextEl.className = "text-sm mb-2 text-gray-500 dark:text-gray-300";
    return;
  }

  const latestYear = sortedYears[sortedYears.length - 1];
  const previousYear = sortedYears[sortedYears.length - 2];
  const latestValue = values[values.length - 1];
  const previousValue = values[values.length - 2];

  if (previousValue === 0) {
    growthTextEl.textContent = `เทียบปี ${previousYear} ไม่สามารถคำนวณเปอร์เซ็นต์ได้ (ฐาน = 0)`;
    growthTextEl.className = "text-sm mb-2 text-gray-500 dark:text-gray-300";
    return;
  }

  const growthPercent = ((latestValue - previousValue) / previousValue) * 100;
  const trendText = growthPercent >= 0 ? "เพิ่มขึ้น" : "ลดลง";
  const sign = growthPercent >= 0 ? "+" : "";

  growthTextEl.textContent =
    `ปี ${latestYear} ${trendText}จากปี ${previousYear} ${sign}${growthPercent.toFixed(2)}%`;
  growthTextEl.className =
    growthPercent >= 0
      ? "text-sm mb-2 text-green-600 dark:text-green-400"
      : "text-sm mb-2 text-red-600 dark:text-red-400";
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
