import React, { useEffect, useState } from 'react';

function ReviewsList({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;
  if (!reviews.length) return <div className="text-secondary">No reviews yet.</div>;

  return (
    <ul className="list-group list-group-flush">
      {reviews.map(r => (
        <li key={r._id} className="list-group-item bg-transparent px-0 py-2 border-0">
          <div className="fw-bold">{r.movieTitle || r.movieId}</div>
          <div className="text-secondary small mb-1">Rating: {r.rating} / 10</div>
          <div>{r.comment}</div>
        </li>
      ))}
    </ul>
  );
}

export default ReviewsList;
