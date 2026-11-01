import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/requests';

function RequestButton({ foodName }) {
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (response.ok) {
          const alreadyRequested = result.data.some(
            (request) =>
              request.foodName === foodName &&
              request.status === 'Pending'
          );

          setRequested(alreadyRequested);
        }
      } catch (error) {
        console.error('Unable to fetch requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [foodName]);

  const handleRequest = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodName }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Request failed');
      }

      setRequested(true);
      alert('Food request submitted successfully!');
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
        ? 'Loading...'
        : requested
          ? '✓ Request Submitted'
          : 'Request Donation →'}
    </button>
  );
}

export default RequestButton;