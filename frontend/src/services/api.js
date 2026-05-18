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

  // Network-layer failures (offline, DNS, server down) reject here before
  // we ever see a response, so surface a human-readable message instead of
  // a raw "Failed to fetch".
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error('Network error — please check your connection and try again');
  }

  // Read the body as text first: a 204, an empty body, or a non-JSON error
  // page (e.g. a 502 HTML page from a proxy) would make res.json() throw and
  // mask the real failure. Parse defensively only if there is content.
  const raw = await res.text();
  let data = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { error: raw };
    }
  }

  if (!res.ok) {
    // An expired/invalid token on a protected route: drop the stale
    // token and bounce to the auth screen instead of leaving the user
    // stuck on a half-broken page.
    if (res.status === 401 && getToken()) {
      clearToken();
      window.location.reload();
    }
    throw new Error(data.error || `Request failed (${res.status})`);
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

// Goals (third entity — savings / spending_limit / simple_todo)
export const fetchGoals = () => request('GET', '/goals');
export const createGoal = (data) => request('POST', '/goals', data);
export const updateGoal = (id, data) => request('PUT', `/goals/${id}`, data);
export const deleteGoal = (id) => request('DELETE', `/goals/${id}`);
