import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);

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
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        // Optionally, fetch user profile here or use data.user if returned
        login(data.user || {}, data.token);
        setMessage('Login successful!');
        if (onLogin) onLogin();
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate style={{ gap: 24, display: 'flex', flexDirection: 'column' }}>
      <div className="form-floating mb-3">
        <input
          type="email"
          className={`form-control rounded-3${errors.email ? ' is-invalid' : ''}`}
          id="loginEmail"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="loginEmail">Email address</label>
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className={`form-control rounded-3${errors.password ? ' is-invalid' : ''}`}
          id="loginPassword"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="loginPassword">Password</label>
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      <button className="btn btn-warning w-100 py-2 fw-bold" type="submit" style={{ fontSize: 18, borderRadius: 24, transition: 'box-shadow 0.3s' }}>Login</button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </form>
  );
}

export default Login;
