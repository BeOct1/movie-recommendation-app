import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNotification } from './NotificationContext';
import { GoogleLogin } from '@react-oauth/google';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const notify = useNotification();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        login(data.user || {}, data.token);
        setMessage('Login successful!');
        notify('Login successful!', 'success');
        if (onLogin) onLogin();
      } else {
        setMessage(data.message || 'Login failed');
        notify(data.message || 'Login failed', 'error');
      }
    } catch (err) {
      setMessage('Server error');
      notify('Server error', 'error');
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        login(data.user || {}, data.token);
        setMessage('Login successful!');
        notify('Login successful!', 'success');
        if (onLogin) onLogin();
      } else {
        setMessage(data.message || 'Google login failed');
        notify(data.message || 'Google login failed', 'error');
      }
    } catch (err) {
      setMessage('Server error');
      notify('Server error', 'error');
      setLoading(false);
    }
  };
  const handleGoogleError = () => {
    notify('Google login failed', 'error');
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate style={{ gap: 24, display: 'flex', flexDirection: 'column' }} aria-label="Login Form">
      <div className="form-floating mb-3">
        <label htmlFor="loginEmail" className="form-label">Email</label>
        <input
          type="email"
          className={`form-control rounded-3${errors.email ? ' is-invalid' : ''}`}
          id="loginEmail"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        {errors.email && <div className="invalid-feedback" aria-live="polite">{errors.email}</div>}
      </div>
      <div className="form-floating mb-3 position-relative">
        <label htmlFor="loginPassword" className="form-label">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`form-control rounded-3${errors.password ? ' is-invalid' : ''}`}
          id="loginPassword"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <button type="button" className="show-password-btn" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)} tabIndex={0}>
          {showPassword ? 'Hide' : 'Show'}
        </button>
        {errors.password && <div className="invalid-feedback" aria-live="polite">{errors.password}</div>}
      </div>
      <div className="d-flex align-items-center mb-2">
        <input type="checkbox" id="rememberMe" className="form-check-input me-2" />
        <label htmlFor="rememberMe" className="form-check-label">Remember Me</label>
        <button type="button" className="ms-auto small text-warning btn btn-link p-0" style={{ textDecoration: 'underline' }} aria-label="Forgot Password">Forgot Password?</button>
      </div>
      <button className="btn btn-warning w-100 py-2 fw-bold" type="submit" style={{ fontSize: 18, borderRadius: 24, transition: 'box-shadow 0.3s' }} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      <div className="text-center my-2 text-secondary">or</div>
      <div className="d-flex justify-content-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          width="100%"
        />
      </div>
      {message && <div className="alert alert-info mt-3" aria-live="polite">{message}</div>}
    </form>
  );
}

export default Login;
