import React, { useEffect, useState } from 'react';
import { getUserReviews, addReview, updateReview, deleteReview } from './api';

function ReviewsList({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ movieId: '', movieTitle: '', rating: '', comment: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserReviews(userId);
      setReviews(data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;
    fetchReviews();
    // eslint-disable-next-line
  }, [userId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!form.movieId || !form.rating) {
      setError('Movie ID and rating are required.');
      return;
    }
    try {
      if (editingId) {
        await updateReview(editingId, form);
        setMessage('Review updated!');
      } else {
        await addReview(form);
        setMessage('Review added!');
      }
      setEditingId(null);
      setForm({ movieId: '', movieTitle: '', rating: '', comment: '' });
      fetchReviews();
    } catch (err) {
      setError(err);
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
    try {
      await deleteReview(id);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!reviews.length) return <div className="text-secondary">No reviews yet.</div>;

  return (
    <>
      <form onSubmit={handleSubmit} className="row g-2 align-items-end mb-4 reviews-form" aria-label="Add or edit review">
        <div className="col-md-3">
          <label htmlFor="review-movie-id" className="form-label visually-hidden">Movie ID</label>
          <input
            id="review-movie-id"
            className="form-control"
            name="movieId"
            placeholder="Movie ID"
            value={form.movieId}
            onChange={handleChange}
            required
            aria-label="Movie ID"
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="review-movie-title" className="form-label visually-hidden">Movie Title</label>
          <input
            id="review-movie-title"
            className="form-control"
            name="movieTitle"
            placeholder="Movie Title (optional)"
            value={form.movieTitle}
            onChange={handleChange}
            aria-label="Movie Title (optional)"
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="review-rating" className="form-label visually-hidden">Rating</label>
          <input
            id="review-rating"
            className="form-control"
            name="rating"
            type="number"
            min="1"
            max="10"
            placeholder="Rating"
            value={form.rating}
            onChange={handleChange}
            required
            aria-label="Rating"
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="review-comment" className="form-label visually-hidden">Comment</label>
          <input
            id="review-comment"
            className="form-control"
            name="comment"
            placeholder="Comment"
            value={form.comment}
            onChange={handleChange}
            aria-label="Comment"
          />
        </div>
        <div className="col-md-1">
          <button className="btn btn-warning w-100" type="submit" style={{ minHeight: 44, minWidth: 44 }}>{editingId ? 'Update' : 'Add'}</button>
        </div>
        {editingId && (
          <div className="col-12">
            <button className="btn btn-link text-danger p-0" type="button" onClick={() => { setEditingId(null); setForm({ movieId: '', movieTitle: '', rating: '', comment: '' }); }}>Cancel Edit</button>
          </div>
        )}
        {message && <div className="col-12 alert alert-info mt-2" role="status">{message}</div>}
      </form>
      <ul className="reviews-list list-group list-group-flush" aria-label="User Reviews">
        {reviews.map(r => (
          <li key={r._id} className="list-group-item bg-transparent px-0 py-2 border-0 d-flex justify-content-between align-items-start review-list-item" role="listitem" tabIndex={0} aria-label={`Review for ${r.movieId.title || r.movieTitle || r.movieId}`}>
            <div>
              <div className="fw-bold">{r.movieId.title || r.movieTitle || r.movieId}</div>
              <div className="text-secondary small mb-1">Rating: {r.rating} / 10</div>
              <div>{r.comment}</div>
            </div>
            <div className="review-actions d-flex flex-column gap-2">
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(r)} aria-label={`Edit review for ${r.movieId.title || r.movieTitle || r.movieId}`} style={{ minHeight: 44, minWidth: 44 }}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r._id)} aria-label={`Delete review for ${r.movieId.title || r.movieTitle || r.movieId}`} style={{ minHeight: 44, minWidth: 44 }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <style>{`
        .reviews-form {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .review-list-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .review-actions {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
        }
        @media (min-width: 600px) {
          .reviews-form {
            flex-wrap: nowrap;
          }
          .review-list-item {
            flex-direction: row;
            align-items: center;
          }
          .review-actions {
            flex-direction: row;
          }
        }
        .btn-outline-secondary, .btn-outline-danger {
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
        }
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          border: 0;
        }
      `}</style>
    </>
  );
}

export default ReviewsList;
