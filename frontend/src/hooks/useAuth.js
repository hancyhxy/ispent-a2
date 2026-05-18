import { useState, useEffect, useCallback } from 'react';
import { apiCheckEmail, apiRegister, apiLogin, apiLogout, apiMe, setToken, clearToken, getToken } from '../services/api';
import { showToast } from '../components/shared/Toast';

export default function useAuth() {
  const [user, setUser] = useState(null);
  // Lazy initial value: only "loading" if there is a token to validate.
  // With no token there is nothing to check, so we skip the loading
  // state entirely instead of toggling it inside the effect.
  const [loading, setLoading] = useState(() => !!getToken());

  // On mount: if a token exists, validate it via /me
  useEffect(() => {
    if (!getToken()) return;
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

  const logout = useCallback(async () => {
    // Tell the server first (while the token is still valid) so the
    // logout is captured in the activity log. Fire-and-forget: if it
    // fails the client logout must still proceed.
    try {
      await apiLogout();
    } catch {
      /* ignore — logging out locally is what matters to the user */
    }
    clearToken();
    setUser(null);
    showToast('Signed out');
  }, []);

  return { user, loading, checkEmail, login, register, logout };
}
