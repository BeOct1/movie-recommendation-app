import React, { useEffect, useState } from 'react';

function ReviewsList({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ movieId: '', movieTitle: '', rating: '', comment: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) return;
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reviews/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    if (!form.movieId || !form.rating) {
      setMessage('Movie ID and rating are required.');
      return;
    }
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reviews/${editingId}`
      : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reviews`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(editingId ? 'Review updated!' : 'Review added!');
      setEditingId(null);
      setForm({ movieId: '', movieTitle: '', rating: '', comment: '' });
      // Refresh reviews
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reviews/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(setReviews);
    } else {
      setMessage(data.message || 'Error saving review');
    }
  };

  const handleEdit = review => {
    setEditingId(review._id);
    setForm({
      movieId: review.movieId._id || review.movieId,
      movieTitle: review.movieId.title || review.movieTitle || '',
      rating: review.rating,
      comment: review.comment || ''
    });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this review?')) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      setReviews(reviews.filter(r => r._id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!reviews.length) return <div className="text-secondary">No reviews yet.</div>;

  return (
    <>
      <form onSubmit={handleSubmit} className="row g-2 align-items-end mb-4">
        <div className="col-md-3">
          <input
            className="form-control"
            name="movieId"
            placeholder="Movie ID"
            value={form.movieId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            name="movieTitle"
            placeholder="Movie Title (optional)"
            value={form.movieTitle}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            name="rating"
            type="number"
            min="1"
            max="10"
            placeholder="Rating"
            value={form.rating}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            name="comment"
            placeholder="Comment"
            value={form.comment}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1">
          <button className="btn btn-warning w-100" type="submit">{editingId ? 'Update' : 'Add'}</button>
        </div>
        {editingId && (
          <div className="col-12">
            <button className="btn btn-link text-danger p-0" type="button" onClick={() => { setEditingId(null); setForm({ movieId: '', movieTitle: '', rating: '', comment: '' }); }}>Cancel Edit</button>
          </div>
        )}
        {message && <div className="col-12 alert alert-info mt-2">{message}</div>}
      </form>
      <ul className="list-group list-group-flush">
        {reviews.map(r => (
          <li key={r._id} className="list-group-item bg-transparent px-0 py-2 border-0 d-flex justify-content-between align-items-start">
            <div>
              <div className="fw-bold">{r.movieId.title || r.movieTitle || r.movieId}</div>
              <div className="text-secondary small mb-1">Rating: {r.rating} / 10</div>
              <div>{r.comment}</div>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(r)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ReviewsList;
