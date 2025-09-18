import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<any | null>(null);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get('/api/commerce/customers');
      setCustomers(data.customers);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openViewModal = async (customerId: string) => {
    try {
      const { data } = await axios.get(`/api/commerce/customers/${customerId}`);
      setViewingCustomer(data);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError('Failed to fetch customer details.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: any) => (
            <tr key={customer.id}>
              <td className="border px-4 py-2">{customer.full_name || customer.username}</td>
              <td className="border px-4 py-2">{customer.email}</td>
              <td className="border px-4 py-2">{customer.role}</td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => openViewModal(customer.id)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  View
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showViewModal && viewingCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Customer Details: {viewingCustomer.full_name || viewingCustomer.username}</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> {viewingCustomer.email}</p>
              <p><strong>Role:</strong> {viewingCustomer.role}</p>
              <p><strong>Subscription Status:</strong> {viewingCustomer.subscription_status}</p>
              <p><strong>Total Reading Minutes:</strong> {viewingCustomer.total_reading_minutes}</p>
              <p><strong>Books Completed:</strong> {viewingCustomer.books_completed}</p>
              <p><strong>Chapters Read:</strong> {viewingCustomer.chapters_read}</p>
              <p><strong>Member Since:</strong> {new Date(viewingCustomer.created_at).toLocaleString()}</p>
              <p><strong>Last Active:</strong> {new Date(viewingCustomer.last_active_at).toLocaleString()}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagementPage;
