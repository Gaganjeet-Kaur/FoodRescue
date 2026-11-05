import { useState } from 'react';

const API_URL = 'https://foodrescue-7aug.onrender.com/api/requests';

function RequestButton({ donationId, token, requested, onRequested }) {
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!token) {
      alert('Please login as a receiver first.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ donationId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Request failed');
      }

      alert('Food request submitted successfully!');
      await onRequested();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="claim-button"
      onClick={handleRequest}
      disabled={requested || loading}
    >
      {loading
        ? 'Please wait...'
        : requested
          ? '✓ Request Submitted'
          : 'Request Donation →'}
    </button>
  );
}

export default RequestButton;