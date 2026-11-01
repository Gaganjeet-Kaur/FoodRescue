
import { useState, useEffect } from 'react';
import './App.css';
import DonationForm from './DonationForm';
import RequestButton from './RequestButton';
import FoodSearch from './FoodSearch';

const API_URL = 'http://localhost:5000/api/donations';

const foodImage =
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=700';

function formatDonation(donation) {
  return {
    id: donation._id,
    name: donation.foodName,
    type: donation.category,
    quantity: donation.quantity,
    time: `Pickup before ${new Date(donation.deadline).toLocaleString()}`,
    location: donation.location,
    image: foodImage,
  };
}

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Unable to fetch donations');
        }

        const result = await response.json();
        setFoods(result.data.map(formatDonation));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const filteredFoods = foods.filter((food) =>
    `${food.name} ${food.location} ${food.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const addDonation = async (donation) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donation),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Donation failed');
      }

      setFoods((previousFoods) => [
        formatDonation(result.data),
        ...previousFoods,
      ]);

      alert('Donation added successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <a className="logo" href="#home">
          <span className="logo-icon">♻</span> FoodRescue
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#donations">Find Food</a>
          <a href="#impact">Our Impact</a>
        </div>

        <a className="nav-button" href="#donate">Get Started ↗</a>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="tag">🌱 TOGETHER FOR A ZERO-WASTE FUTURE</span>
            <h1>Good Food.<br /><span>Better Future.</span></h1>
            <p>
              Connecting surplus food with people who need it.
              Rescue meals, reduce waste, and make every bite count.
            </p>

            <div className="hero-buttons">
              <a href="#donations" className="primary-button">
                Explore Donations →
              </a>
              <a href="#impact" className="secondary-button">
                Our Mission
              </a>
            </div>

            <div className="hero-note">
              <span>✓</span> Every meal saved makes a difference.
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000"
              alt="Fresh healthy food"
            />
            <div className="floating-card">
              <span>💚</span>
              <div>
                <strong>Save Food,</strong>
                <small>Share Hope</small>
              </div>
            </div>
          </div>
        </section>

        <section className="impact" id="impact">
          <div>
            <strong>{foods.length}</strong>
            <span>Food Listings</span>
          </div>
          <div>
            <strong>{foods.length}</strong>
            <span>Community Donations</span>
          </div>
          <div>
            <strong>Food for All</strong>
            <span>Our Mission</span>
          </div>
          <div>
            <strong>Zero Waste</strong>
            <span>Our Goal</span>
          </div>
        </section>

        <section className="donations" id="donations">
          <div className="section-heading">
            <div>
              <span className="tag">MAKE A DIFFERENCE</span>
              <h2>Available Food Donations</h2>
              <p>Surplus food waiting for a new home.</p>
            </div>
            <a href="#donate" className="outline-button">
              Donate Food →
            </a>
          </div>

          <FoodSearch search={search} setSearch={setSearch} />

          <div className="food-grid">
            {loading && <p>Loading donations...</p>}

            {!loading && error && (
              <p className="empty-message">{error}</p>
            )}

            {!loading && !error && filteredFoods.length === 0 && (
              <p className="empty-message">
                No food donations found. Try another search.
              </p>
            )}

            {!loading && filteredFoods.map((food) => (
              <article className="food-card" key={food.id}>
                <div className="food-image">
                  <img src={food.image} alt={food.name} />
                  <span className="food-type">{food.type}</span>
                </div>

                <div className="food-info">
                  <h3>{food.name}</h3>
                  <p>📦 {food.quantity}</p>
                  <p>📍 {food.location}</p>
                  <p>⏰ {food.time}</p>
                  <RequestButton foodName={food.name} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <DonationForm onAddDonation={addDonation} />

        <section className="cta">
          <h2>Have Surplus Food?</h2>
          <p>Turn your extra food into someone else's opportunity.</p>
          <a href="#donate" className="cta-button">
            Donate Food Today →
          </a>
        </section>
      </main>

      <footer>
        <a className="logo" href="#home">♻ FoodRescue</a>
        <p>Rescue Food. Reduce Waste. Feed Communities.</p>
        <span>© 2026 FoodRescue. Built for a better tomorrow.</span>
      </footer>
    </div>
  );
}

export default App;
