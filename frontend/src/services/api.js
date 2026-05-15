const BASE_URL = '/api';
const TOKEN_KEY = 'ispent_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

// Auth
export const apiCheckEmail = (email) => request('POST', '/auth/check-email', { email });
export const apiRegister = (data) => request('POST', '/auth/register', data);
export const apiLogin = (data) => request('POST', '/auth/login', data);
export const apiMe = () => request('GET', '/auth/me');

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
