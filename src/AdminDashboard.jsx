
import { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api';

function AdminDashboard({ user, logout }) {
  const [stats, setStats] = useState({
    users: 0,
    donations: 0,
    requests: 0,
    pendingNGOs: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const loadData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes] = await Promise.all([
        fetch(`${API}/admin/stats`, { headers }),
        fetch(`${API}/admin/users`, { headers }),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      if (!statsRes.ok) throw new Error(statsData.message);
      if (!usersRes.ok) throw new Error(usersData.message);

      setStats(statsData.data);
      setUsers(usersData.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const verifyNGO = async (id) => {
    try {
      const response = await fetch(`${API}/admin/users/${id}/verify`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <span className="logo">♻ FoodRescue Admin</span>
        <div>
          <span className="welcome-user">Hi, {user.name}</span>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <span className="tag">ADMIN CONTROL PANEL</span>
            <h1>Admin Dashboard</h1>
            <p>Monitor platform activity and verify NGOs.</p>
          </div>
          <span className="role-chip">Administrator</span>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Users</span>
            <strong>{stats.users}</strong>
          </div>
          <div className="stat-card">
            <span>Total Donations</span>
            <strong>{stats.donations}</strong>
          </div>
          <div className="stat-card">
            <span>Total Requests</span>
            <strong>{stats.requests}</strong>
          </div>
          <div className="stat-card">
            <span>Pending NGO Verification</span>
            <strong>{stats.pendingNGOs}</strong>
          </div>
        </div>

        <section className="dashboard-section">
          <h2>User Management</h2>

          {loading && <p>Loading users...</p>}

          <div className="dashboard-list">
            {users.map((item) => (
              <div className="dashboard-item" key={item._id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.email}</p>
                  <p>
                    {item.organizationName || 'Individual'} · {item.location || 'Location not added'}
                  </p>
                  <span className="status-chip">
                    {item.role.toUpperCase()}
                  </span>
                  {item.role === 'receiver' && (
                    <span className={`status-chip ${item.isVerified ? 'approved' : 'pending'}`}>
                      {item.isVerified ? 'Verified NGO' : 'Not Verified'}
                    </span>
                  )}
                </div>

                {item.role === 'receiver' && (
                  <button
                    className={item.isVerified ? 'delete-button' : 'approve-button'}
                    onClick={() => verifyNGO(item._id)}
                  >
                    {item.isVerified ? 'Remove Verification' : 'Verify NGO'}
                  </button>
                )}
              </div>
            ))}

            {!loading && users.length === 0 && (
              <p>No users registered yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
