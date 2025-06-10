import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNotification } from './NotificationContext';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
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
    if (!form.username) errs.username = 'Username is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
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
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`, {
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
        setMessage('Registration successful!');
        notify('Registration successful!', 'success');
      } else {
        setMessage(data.message || 'Registration failed');
        notify(data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      setMessage('Server error');
      notify('Server error', 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate style={{ gap: 24, display: 'flex', flexDirection: 'column' }} aria-label="Registration Form">
      <div className="form-floating mb-3">
        <label htmlFor="registerUsername" className="form-label">Username</label>
        <input
          className={`form-control rounded-3${errors.username ? ' is-invalid' : ''}`}
          id="registerUsername"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        {errors.username && <div className="invalid-feedback" aria-live="polite">{errors.username}</div>}
      </div>
      <div className="form-floating mb-3">
        <label htmlFor="registerEmail" className="form-label">Email</label>
        <input
          className={`form-control rounded-3${errors.email ? ' is-invalid' : ''}`}
          id="registerEmail"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        {errors.email && <div className="invalid-feedback" aria-live="polite">{errors.email}</div>}
      </div>
      <div className="form-floating mb-3 position-relative">
        <label htmlFor="registerPassword" className="form-label">Password</label>
        <input
          className={`form-control rounded-3${errors.password ? ' is-invalid' : ''}`}
          id="registerPassword"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <button type="button" className="show-password-btn" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)} tabIndex={0}>
          {showPassword ? 'Hide' : 'Show'}
        </button>
        {errors.password && <div className="invalid-feedback" aria-live="polite">{errors.password}</div>}
      </div>
      <button className="btn btn-warning w-100 py-2 fw-bold" type="submit" style={{ fontSize: 18, borderRadius: 24, transition: 'box-shadow 0.3s' }} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      {message && <div className="alert alert-info mt-3" aria-live="polite">{message}</div>}
    </form>
  );
}

export default Register;
