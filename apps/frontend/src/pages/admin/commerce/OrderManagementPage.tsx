import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/commerce/orders');
      setOrders(data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openViewModal = async (orderId: string) => {
    try {
      const { data } = await axios.get(`/api/commerce/orders/${orderId}`);
      setViewingOrder(data);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details.');
    }
  };

  const openEditModal = async (orderId: string) => {
    try {
      const { data } = await axios.get(`/api/commerce/orders/${orderId}`);
      setEditingOrder(data);
      setShowEditModal(true);
    } catch (err) {
      console.error('Error fetching order details for edit:', err);
      setError('Failed to fetch order details for edit.');
    }
  };

  const handleEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      await axios.put(`/api/commerce/orders/${editingOrder.id}`, { orderData: editingOrder });
      setShowEditModal(false);
      setEditingOrder(null);
      fetchOrders(); // Refresh the list of orders
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order.');
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
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order Number</th>
            <th className="py-2 px-4 border-b">Customer</th>
            <th className="py-2 px-4 border-b">Total</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.order_number}</td>
              <td className="border px-4 py-2">{order.email}</td>
              <td className="border px-4 py-2">{order.total_amount / 100} {order.currency}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => openViewModal(order.id)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  View
                </button>
                <button 
                  onClick={() => openEditModal(order.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showViewModal && viewingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Order Details: {viewingOrder.order_number}</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Customer Email:</strong> {viewingOrder.email}</p>
              <p><strong>Total Amount:</strong> {viewingOrder.total_amount / 100} {viewingOrder.currency}</p>
              <p><strong>Status:</strong> {viewingOrder.status}</p>
              <p><strong>Payment Status:</strong> {viewingOrder.payment_status}</p>
              <p><strong>Fulfillment Status:</strong> {viewingOrder.fulfillment_status}</p>
              <p><strong>Created At:</strong> {new Date(viewingOrder.created_at).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(viewingOrder.updated_at).toLocaleString()}</p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Items</h3>
              {viewingOrder.order_items && viewingOrder.order_items.length > 0 ? (
                <ul className="list-disc pl-5">
                  {viewingOrder.order_items.map((item: any) => (
                    <li key={item.id}>
                      {item.product_name} ({item.quantity} x {item.unit_amount / 100} {viewingOrder.currency}) - Total: {item.total_amount / 100} {viewingOrder.currency}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No items found for this order.</p>
              )}
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

      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Order: {editingOrder.order_number}</h2>
            <form onSubmit={handleEditOrder}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-email">Customer Email</label>
                <input
                  type="email"
                  id="edit-email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingOrder.email}
                  onChange={(e) => setEditingOrder({ ...editingOrder, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-payment_status">Payment Status</label>
                <select
                  id="edit-payment_status"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingOrder.payment_status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, payment_status: e.target.value })}
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="no_payment_required">No Payment Required</option>
                  <option value="failed">Failed</option>
                  <option value="processing">Processing</option>
                  <option value="requires_payment_method">Requires Payment Method</option>
                  <option value="requires_confirmation">Requires Confirmation</option>
                  <option value="requires_action">Requires Action</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-fulfillment_status">Fulfillment Status</label>
                <select
                  id="edit-fulfillment_status"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingOrder.fulfillment_status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, fulfillment_status: e.target.value })}
                >
                  <option value="unfulfilled">Unfulfilled</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="partial">Partial</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-notes">Notes</label>
                <textarea
                  id="edit-notes"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                  value={editingOrder.notes}
                  onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-admin_notes">Admin Notes</label>
                <textarea
                  id="edit-admin_notes"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"
                  value={editingOrder.admin_notes}
                  onChange={(e) => setEditingOrder({ ...editingOrder, admin_notes: e.target.value })}
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
