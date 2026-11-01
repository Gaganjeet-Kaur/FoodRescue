
import { useState, useEffect } from 'react';
import './App.css';
import DonationForm from './DonationForm';
import RequestButton from './RequestButton';
import FoodSearch from './FoodSearch';

const initialFoods = [
  {
    id: 1,
    name: 'Fresh Vegetable Meals',
    type: 'Ready to Eat',
    quantity: '35 meals',
    time: 'Pickup before 6:00 PM',
    location: 'Sector 17, Chandigarh',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=700',
  },
  {
    id: 2,
    name: 'Fresh Bakery Collection',
    type: 'Bakery',
    quantity: '20 packets',
    time: 'Pickup before 7:00 PM',
    location: 'Sector 22, Chandigarh',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700',
  },
  {
    id: 3,
    name: 'Healthy Rice Bowls',
    type: 'Prepared Food',
    quantity: '25 meals',
    time: 'Pickup before 5:30 PM',
    location: 'Sector 35, Chandigarh',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700',
  },
];

function App() {
  const [foods, setFoods] = useState(() => {
    try {
      const savedFoods = localStorage.getItem('foodrescue-donations');
      return savedFoods ? JSON.parse(savedFoods) : initialFoods;
    } catch {
      return initialFoods;
    }
  });

  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('foodrescue-donations', JSON.stringify(foods));
  }, [foods]);

  const filteredFoods = foods.filter((food) =>
    `${food.name} ${food.location} ${food.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const addDonation = (donation) => {
    const newDonation = {
      id: Date.now(),
      name: donation.foodName,
      type: donation.category,
      quantity: donation.quantity,
      time: `Pickup before ${new Date(donation.deadline).toLocaleString()}`,
      location: donation.location,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=700',
    };

    setFoods((previousFoods) => [newDonation, ...previousFoods]);
    alert('Donation added successfully!');
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
            <strong>{foods.filter((food) => food.id > 3).length}</strong>
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
            {filteredFoods.length === 0 && (
              <p className="empty-message">
                No food donations found. Try another search.
              </p>
            )}

            {filteredFoods.map((food) => (
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
