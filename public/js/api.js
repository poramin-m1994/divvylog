async function requestJson(url, options) {
  const response = await fetch(url, options);
  return response.json();
}

function buildQuery(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

const DivvyApi = {
  async checkUserExists(username) {
    const query = buildQuery({ username });
    const url = `${APP_CONFIG.SHEET_API}?${query}`;
    return requestJson(url);
  },

  async getDividends(user) {
    const query = buildQuery({ action: "getDividends", user });
    const url = `${APP_CONFIG.SHEET_API}?${query}`;
    return requestJson(url);
  },

  async addDividend(payload) {
    const query = buildQuery({
      action: "addDividend",
      user: payload.user,
      date: payload.date,
      ticker: payload.ticker,
      amount: payload.amount,
      rate: payload.rate,
    });
    const url = `${APP_CONFIG.SHEET_API}?${query}`;
    return requestJson(url);
  },

  async editDividend(payload) {
    return requestJson(APP_CONFIG.SHEET_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "editDividend",
        index: payload.index,
        date: payload.date,
        ticker: payload.ticker,
        amount: payload.amount,
        rate: payload.rate,
        user: payload.user,
      }),
    });
  },

  async deleteDividend(payload) {
    return requestJson(APP_CONFIG.SHEET_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "deleteDividend",
        user: payload.user,
        date: payload.date,
        ticker: payload.ticker,
      }),
    });
  },
};
