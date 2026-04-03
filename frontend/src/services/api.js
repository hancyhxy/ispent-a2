const BASE_URL = '/api';

async function request(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

// Records
export const fetchRecords = (month) => request('GET', `/records?month=${month}`);
export const createRecord = (data) => request('POST', '/records', data);
export const updateRecord = (id, data) => request('PUT', `/records/${id}`, data);
export const deleteRecord = (id) => request('DELETE', `/records/${id}`);

// Budgets
export const fetchBudgets = (month) => request('GET', `/budgets?month=${month}`);
export const createBudget = (data) => request('POST', '/budgets', data);
export const updateBudget = (id, data) => request('PUT', `/budgets/${id}`, data);
export const deleteBudget = (id) => request('DELETE', `/budgets/${id}`);

// Stats
export const fetchMonthlyStats = (month) => request('GET', `/stats/monthly?month=${month}`);
export const fetchCategoryStats = (month, type) => request('GET', `/stats/categories?month=${month}&type=${type}`);
export const fetchDailyStats = (month) => request('GET', `/stats/daily?month=${month}`);
