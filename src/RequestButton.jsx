
import { useState } from 'react';

function RequestButton({ foodName }) {
  const [requested, setRequested] = useState(() => {
    try {
      const requests = JSON.parse(
        localStorage.getItem('foodrescue-requests') || '[]'
      );
      return requests.includes(foodName);
    } catch {
      return false;
    }
  });

  const handleRequest = () => {
    try {
      const requests = JSON.parse(
        localStorage.getItem('foodrescue-requests') || '[]'
      );

      if (!requests.includes(foodName)) {
        const updatedRequests = [...requests, foodName];

        localStorage.setItem(
          'foodrescue-requests',
          JSON.stringify(updatedRequests)
        );

        setRequested(true);
      }
    } catch {
      alert('Unable to save your request. Please try again.');
    }
  };

  return (
    <button
      className="claim-button"
      onClick={handleRequest}
      disabled={requested}
    >
      {requested ? '✓ Request Submitted' : 'Request Donation →'}
    </button>
  );
}

export default RequestButton;
