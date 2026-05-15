import { useState, useEffect, useCallback } from 'react';
import { apiCheckEmail, apiRegister, apiLogin, apiMe, setToken, clearToken, getToken } from '../services/api';
import { showToast } from '../components/shared/Toast';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists, validate it via /me
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiMe()
      .then((data) => setUser(data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const checkEmail = useCallback(async (email) => {
    try {
      const { exists } = await apiCheckEmail(email);
      return exists;
    } catch (err) {
      showToast(err.message, 'error');
      return null;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { token, user } = await apiLogin({ email, password });
      setToken(token);
      setUser(user);
      showToast(`Welcome back, ${user.name}`);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const { token, user } = await apiRegister({ name, email, password });
      setToken(token);
      setUser(user);
      showToast(`Account created — welcome, ${user.name}`);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    showToast('Signed out');
  }, []);

  return { user, loading, checkEmail, login, register, logout };
}
