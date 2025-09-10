import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#ecf0f1' }}>Admin Panel</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '15px' }}>
              <Link to="users" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 15px',
                display: 'block',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease',
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#34495e'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}>
                User Management
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="subscriptions" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 15px',
                display: 'block',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease',
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#34495e'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}>
                Subscription Management
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="plans" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 15px',
                display: 'block',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease',
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#34495e'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}>
                Plan Management
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="timeline" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 15px',
                display: 'block',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease',
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#34495e'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}>
                Timeline Manager
              </Link>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <Link to="/account/admin/learn" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '10px 15px',
                display: 'block',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease',
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#34495e'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}>
                Learn Page Manager
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '30px', color: '#34495e' }}>Welcome to the Admin Dashboard</h1>
        {/* This is where nested routes will render */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
