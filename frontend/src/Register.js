import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);

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
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        login(data.user || {}, data.token);
        setMessage('Registration successful!');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate style={{ gap: 24, display: 'flex', flexDirection: 'column' }}>
      <div className="form-floating mb-3">
        <input
          className={`form-control rounded-3${errors.username ? ' is-invalid' : ''}`}
          id="registerUsername"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="registerUsername">Username</label>
        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
      </div>
      <div className="form-floating mb-3">
        <input
          className={`form-control rounded-3${errors.email ? ' is-invalid' : ''}`}
          id="registerEmail"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="registerEmail">Email address</label>
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="form-floating mb-3">
        <input
          className={`form-control rounded-3${errors.password ? ' is-invalid' : ''}`}
          id="registerPassword"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label htmlFor="registerPassword">Password</label>
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      <button className="btn btn-warning w-100 py-2 fw-bold" type="submit" style={{ fontSize: 18, borderRadius: 24, transition: 'box-shadow 0.3s' }}>Register</button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </form>
  );
}

export default Register;
