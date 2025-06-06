import React, { useState } from 'react';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful! You can now log in.');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input className="form-control" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="btn btn-primary w-100" type="submit">Register</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default Register;
