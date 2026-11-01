
import { useState } from 'react';

function DonationForm({ onAddDonation }) {
  const [form, setForm] = useState({
    foodName: '',
    quantity: '',
    location: '',
    category: 'Prepared Food',
    deadline: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (new Date(form.deadline) <= new Date()) {
      setError('Please select a future pickup deadline.');
      return;
    }

    onAddDonation(form);

    setForm({
      foodName: '',
      quantity: '',
      location: '',
      category: 'Prepared Food',
      deadline: '',
    });

    setError('');
  };

  return (
    <section className="donation-form-section" id="donate">
      <div className="form-heading">
        <span className="tag">SHARE THE GOODNESS</span>
        <h2>Donate Surplus Food</h2>
        <p>Have extra food? Help someone by sharing it.</p>
      </div>

      <form className="donation-form" onSubmit={handleSubmit}>
        <label htmlFor="foodName">Food Name</label>
        <input
          id="foodName"
          name="foodName"
          value={form.foodName}
          onChange={handleChange}
          placeholder="e.g. Fresh vegetable meals"
          required
        />

        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="e.g. 25 meals"
          required
        />

        <label htmlFor="category">Food Category</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Prepared Food</option>
          <option>Bakery</option>
          <option>Fruits & Vegetables</option>
          <option>Packaged Food</option>
        </select>

        <label htmlFor="location">Pickup Location</label>
        <input
          id="location"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Enter pickup location"
          required
        />

        <label htmlFor="deadline">Pickup Deadline</label>
        <input
          id="deadline"
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          min={new Date().toISOString().slice(0, 16)}
          required
        />

        {error && <p className="success-message" style={{ color: '#c0392b' }}>{error}</p>}

        <button type="submit" className="submit-donation">
          Submit Donation →
        </button>
      </form>
    </section>
  );
}

export default DonationForm;
