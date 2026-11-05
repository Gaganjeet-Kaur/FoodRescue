import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import './App.css';
import './Dashboard.css';
import DonationForm from './DonationForm';
import RequestButton from './RequestButton';
import FoodSearch from './FoodSearch';
import AdminDashboard from './AdminDashboard';

const API = 'https://foodrescue-7aug.onrender.com/api';
const foodImage =
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=700';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const handleLogin = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  setUser(data.user);

  navigate(
    data.user.role === 'admin'
      ? '/admin-dashboard'
      : data.user.role === 'donor'
        ? '/donor-dashboard'
        : '/receiver-dashboard'
  );
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />

      <Route
        path="/login"
        element={
          user ? (
  <Navigate
    to={
      user.role === 'admin'
        ? '/admin-dashboard'
        : user.role === 'donor'
          ? '/donor-dashboard'
          : '/receiver-dashboard'
    }
  />
) : (
  <AuthPage mode="login" onAuth={handleLogin} />
)
        }
      />

      <Route
        path="/register"
        element={
          user ? (
  <Navigate
    to={
      user.role === 'admin'
        ? '/admin-dashboard'
        : user.role === 'donor'
          ? '/donor-dashboard'
          : '/receiver-dashboard'
    }
  />
) : (
  <AuthPage mode="register" onAuth={handleLogin} />
)
        }
      />

      <Route
        path="/donor-dashboard"
        element={
          user?.role === 'donor' ? (
            <DonorDashboard user={user} logout={logout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
  path="/admin-dashboard"
  element={
    user?.role === 'admin' ? (
      <AdminDashboard user={user} logout={logout} />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

      <Route
        path="/receiver-dashboard"
        element={
          user?.role === 'receiver' ? (
            <ReceiverDashboard user={user} logout={logout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// PUBLIC HOME PAGE
function Home({ user }) {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/donations`)
      .then((res) => res.json())
      .then((result) => setFoods(result.data || []))
      .catch(() => setFoods([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredFoods = foods.filter((food) =>
    `${food.foodName} ${food.location} ${food.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <nav className="navbar">
        <Link className="logo" to="/">♻ FoodRescue</Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#donations">Find Food</a>
          <a href="#impact">Our Impact</a>
        </div>

        {user ? (
          <Link
            className="nav-button"
            to={user.role === 'donor' ? '/donor-dashboard' : '/receiver-dashboard'}
          >
            Dashboard →
          </Link>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="nav-button">Get Started →</Link>
          </div>
        )}
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
              <Link to="/register" className="secondary-button">
                Join FoodRescue
              </Link>
            </div>

            <div className="hero-note">
              <span>✓</span> Every meal saved makes a difference.
            </div>
          </div>

          <div className="hero-image">
            <img src={foodImage} alt="Fresh healthy food" />
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
            <strong>2</strong>
            <span>User Roles</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Food Access</span>
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
            <Link to="/register" className="outline-button">
              Join to Request →
            </Link>
          </div>

          <FoodSearch search={search} setSearch={setSearch} />

          <div className="food-grid">
            {loading && <p>Loading donations...</p>}

            {!loading && filteredFoods.length === 0 && (
              <p className="empty-message">No food donations available.</p>
            )}

            {filteredFoods.map((food) => (
              <article className="food-card" key={food._id}>
                <div className="food-image">
                  <img src={foodImage} alt={food.foodName} />
                  <span className="food-type">{food.category}</span>
                </div>
                <div className="food-info">
                  <h3>{food.foodName}</h3>
                  <p>📦 {food.quantity}</p>
                  <p>📍 {food.location}</p>
                  <p>⏰ Pickup before {new Date(food.deadline).toLocaleString()}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cta">
          <h2>Be a Part of the Change</h2>
          <p>Donate surplus food or help communities access fresh meals.</p>
          <Link to="/register" className="cta-button">
            Create Your Account →
          </Link>
        </section>
      </main>

      <footer>
        <Link className="logo" to="/">♻ FoodRescue</Link>
        <p>Rescue Food. Reduce Waste. Feed Communities.</p>
        <span>© 2026 FoodRescue. Built for a better tomorrow.</span>
      </footer>
    </div>
  );
}

// LOGIN AND REGISTER PAGE
function AuthPage({ mode, onAuth }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'receiver',
    organizationName: '',
    phone: '',
    location: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? 'register' : 'login';

      const response = await fetch(`${API}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed');
      }

      onAuth(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="logo auth-logo">♻ FoodRescue</Link>

      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="tag">FOODRESCUE COMMUNITY</span>
        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p>{isRegister ? 'Join us in reducing food waste.' : 'Login to continue to your dashboard.'}</p>

        {isRegister && (
          <>
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
          </>
        )}

        <label>Email Address</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required minLength="6" placeholder="Minimum 6 characters" />

        {isRegister && (
          <>
            <label>Register As</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="receiver">Receiver / NGO</option>
              <option value="donor">Food Donor / Restaurant</option>
            </select>

            <label>Organization Name</label>
            <input name="organizationName" value={form.organizationName} onChange={handleChange} placeholder="Organization or restaurant" />

            <label>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Contact number" />

            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="City or area" />
          </>
        )}

        {error && <p className="form-error">{error}</p>}

        <button className="auth-submit" disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Create Account →' : 'Login →'}
        </button>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <Link to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Login' : 'Register'}
          </Link>
        </p>

        <Link className="back-home" to="/">← Back to Home</Link>
      </form>
    </div>
  );
}

// SHARED DASHBOARD NAVBAR
function DashboardNav({ user, logout }) {
  return (
    <nav className="dashboard-nav">
      <Link to="/" className="logo">♻ FoodRescue</Link>
      <div>
        <span className="welcome-user">Hi, {user.name}</span>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
}

// DONOR DASHBOARD
function DonorDashboard({ user, logout }) {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      const [donationRes, requestRes] = await Promise.all([
        fetch(`${API}/donations/my`, { headers: authHeaders() }),
        fetch(`${API}/requests`, { headers: authHeaders() }),
      ]);

      const donationData = await donationRes.json();
      const requestData = await requestRes.json();

      if (!donationRes.ok) throw new Error(donationData.message);
      if (!requestRes.ok) throw new Error(requestData.message);

      setDonations(donationData.data || []);
      setRequests(requestData.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const addDonation = async (donation) => {
    try {
      const response = await fetch(`${API}/donations`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(donation),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert('Donation added successfully!');
      await loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteDonation = async (id) => {
    if (!window.confirm('Delete this donation?')) return;

    try {
      const response = await fetch(`${API}/donations/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      await loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateRequest = async (id, status) => {
    try {
      const response = await fetch(`${API}/requests/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      await loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-page">
      <DashboardNav user={user} logout={logout} />

      <main className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <span className="tag">DONOR PORTAL</span>
            <h1>Donor Dashboard</h1>
            <p>Manage your food donations and incoming requests.</p>
          </div>
          <span className="role-chip">Food Donor</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><span>Total Donations</span><strong>{donations.length}</strong></div>
          <div className="stat-card"><span>Available Food</span><strong>{donations.filter(d => d.status === 'Available').length}</strong></div>
          <div className="stat-card"><span>Incoming Requests</span><strong>{requests.length}</strong></div>
          <div className="stat-card"><span>Approved Requests</span><strong>{requests.filter(r => r.status === 'Approved' || r.status === 'Collected').length}</strong></div>
        </div>

        <DonationForm onAddDonation={addDonation} />

        <section className="dashboard-section">
          <h2>My Donations</h2>
          {loading && <p>Loading donations...</p>}
          {error && <p className="form-error">{error}</p>}

          <div className="dashboard-list">
            {donations.map((donation) => (
              <div className="dashboard-item" key={donation._id}>
                <div>
                  <h3>{donation.foodName}</h3>
                  <p>{donation.quantity} · {donation.category} · {donation.location}</p>
                  <span className={`status-chip ${donation.status.toLowerCase()}`}>{donation.status}</span>
                </div>
                {donation.status === 'Available' && (
                  <button className="delete-button" onClick={() => deleteDonation(donation._id)}>Delete</button>
                )}
              </div>
            ))}
            {!loading && donations.length === 0 && <p>No donations added yet.</p>}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Incoming Food Requests</h2>
          <div className="dashboard-list">
            {requests.map((request) => (
              <div className="dashboard-item" key={request._id}>
                <div>
                  <h3>{request.foodName}</h3>
                  <p>Receiver: {request.receiverId?.organizationName || request.receiverId?.name || 'Community receiver'}</p>
                  <span className={`status-chip ${request.status.toLowerCase()}`}>{request.status}</span>
                </div>

                {request.status === 'Pending' && (
                  <div className="action-buttons">
                    <button className="approve-button" onClick={() => updateRequest(request._id, 'Approved')}>Approve</button>
                    <button className="delete-button" onClick={() => updateRequest(request._id, 'Rejected')}>Reject</button>
                  </div>
                )}

                {request.status === 'Approved' && (
                  <button className="approve-button" onClick={() => updateRequest(request._id, 'Collected')}>Mark Collected</button>
                )}
              </div>
            ))}
            {!loading && requests.length === 0 && <p>No requests received yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

// RECEIVER DASHBOARD
function ReceiverDashboard({ user, logout }) {
  const [foods, setFoods] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      const [foodRes, requestRes] = await Promise.all([
        fetch(`${API}/donations`),
        fetch(`${API}/requests`, { headers: authHeaders() }),
      ]);

      const foodData = await foodRes.json();
      const requestData = await requestRes.json();

      if (!foodRes.ok) throw new Error(foodData.message);
      if (!requestRes.ok) throw new Error(requestData.message);

      setFoods(foodData.data || []);
      setRequests(requestData.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      `${food.foodName} ${food.location} ${food.category}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory = category === 'All' || food.category === category;
    return matchesSearch && matchesCategory;
  });

  const requestedIds = requests
    .filter((r) => ['Pending', 'Approved'].includes(r.status))
    .map((r) => r.donationId?._id || r.donationId);

  return (
    <div className="dashboard-page">
      <DashboardNav user={user} logout={logout} />

      <main className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <span className="tag">RECEIVER PORTAL</span>
            <h1>Receiver Dashboard</h1>
            <p>Discover surplus food and track your requests.</p>
          </div>
          <span className="role-chip">Food Receiver</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><span>Available Listings</span><strong>{foods.length}</strong></div>
          <div className="stat-card"><span>My Requests</span><strong>{requests.length}</strong></div>
          <div className="stat-card"><span>Approved</span><strong>{requests.filter(r => r.status === 'Approved').length}</strong></div>
          <div className="stat-card"><span>Collected</span><strong>{requests.filter(r => r.status === 'Collected').length}</strong></div>
        </div>

        <section className="dashboard-section">
          <h2>Find Available Food</h2>

          <div className="filter-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food or location..."
            />

            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>All</option>
              <option>Prepared Food</option>
              <option>Bakery</option>
              <option>Fruits & Vegetables</option>
              <option>Packaged Food</option>
            </select>
          </div>

          {loading && <p>Loading food listings...</p>}
          {error && <p className="form-error">{error}</p>}

          <div className="food-grid">
            {filteredFoods.map((food) => (
              <article className="food-card" key={food._id}>
                <div className="food-image">
                  <img src={foodImage} alt={food.foodName} />
                  <span className="food-type">{food.category}</span>
                </div>
                <div className="food-info">
                  <h3>{food.foodName}</h3>
                  <p>📦 {food.quantity}</p>
                  <p>📍 {food.location}</p>
                  <p>⏰ Pickup before {new Date(food.deadline).toLocaleString()}</p>
                  <RequestButton
                    donationId={food._id}
                    token={getToken()}
                    requested={requestedIds.includes(food._id)}
                    onRequested={loadDashboard}
                  />
                </div>
              </article>
            ))}
          </div>

          {!loading && filteredFoods.length === 0 && (
            <p className="empty-message">No matching food listings found.</p>
          )}
        </section>

        <section className="dashboard-section">
          <h2>My Request History</h2>
          <div className="dashboard-list">
            {requests.map((request) => (
              <div className="dashboard-item" key={request._id}>
                <div>
                  <h3>{request.foodName}</h3>
                  <p>Requested on {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`status-chip ${request.status.toLowerCase()}`}>{request.status}</span>
              </div>
            ))}
            {requests.length === 0 && <p>You haven't requested any food yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;