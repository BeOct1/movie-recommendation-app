import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNotification } from './NotificationContext';
import { GoogleLogin } from '@react-oauth/google';
import { FacebookLoginButton, GithubLoginButton } from 'react-social-login-buttons';

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
      } else if (data.errors && Array.isArray(data.errors)) {
        // Show all validation errors from backend
        data.errors.forEach(err => notify(err.msg || err.message, 'error'));
        setMessage(data.message || 'Login failed');
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

  // Helper for OAuth popup
  const handleOAuthLogin = (provider) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const url = `${apiUrl}/api/auth/${provider}`;
    const popup = window.open(url, `${provider}Login`, `width=${width},height=${height},left=${left},top=${top}`);
    if (!popup) {
      notify('Popup blocked. Please allow popups and try again.', 'error');
      return;
    }
    // Listen for message from popup
    const handleMessage = (event) => {
      if (!event.data || !event.data.token) return;
      localStorage.setItem('token', event.data.token);
      login(event.data.user || {}, event.data.token);
      setMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`);
      notify(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`, 'success');
      if (onLogin) onLogin();
      window.removeEventListener('message', handleMessage);
      popup.close();
    };
    window.addEventListener('message', handleMessage);
  };

  const handleFacebookLogin = () => {
    handleOAuthLogin('facebook');
  };

  const handleGithubLogin = () => {
    handleOAuthLogin('github');
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
      <div className="d-flex justify-content-center flex-column gap-2">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          width="100%"
        />
        <FacebookLoginButton onClick={handleFacebookLogin} style={{ width: '100%' }}>
          Continue with Facebook
        </FacebookLoginButton>
        <GithubLoginButton onClick={handleGithubLogin} style={{ width: '100%' }}>
          Continue with GitHub
        </GithubLoginButton>
      </div>
      {message && <div className="alert alert-info mt-3" aria-live="polite">{message}</div>}
    </form>
  );
}

export default Login;
