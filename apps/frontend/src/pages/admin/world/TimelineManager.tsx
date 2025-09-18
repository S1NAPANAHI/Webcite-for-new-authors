import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimelineManager = () => {
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    era: '',
    related_entities: '{}',
    is_published: false
  });
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const fetchTimelineEvents = async () => {
    try {
      const { data } = await axios.get('/api/world/timeline');
      setTimelineEvents(data);
    } catch (err) {
      console.error('Error fetching timeline events:', err);
      setError('Failed to fetch timeline events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this timeline event?')) {
      try {
        await axios.delete(`/api/world/timeline/${id}`);
        setTimelineEvents(timelineEvents.filter(event => event.id !== id));
      } catch (err) {
        console.error('Error deleting timeline event:', err);
        setError('Failed to delete timeline event.');
      }
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        ...newEvent,
        related_entities: JSON.parse(newEvent.related_entities || '{}')
      };
      await axios.post('/api/world/timeline', { timelineEventData: eventData });
      setShowCreateModal(false);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        era: '',
        related_entities: '{}',
        is_published: false
      });
      fetchTimelineEvents(); // Refresh the list of events
    } catch (err) {
      console.error('Error creating timeline event:', err);
      setError('Failed to create timeline event.');
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      const eventData = {
        ...editingEvent,
        related_entities: JSON.parse(editingEvent.related_entities || '{}')
      };
      await axios.put(`/api/world/timeline/${editingEvent.id}`, { timelineEventData: eventData });
      setShowEditModal(false);
      setEditingEvent(null);
      fetchTimelineEvents(); // Refresh the list of events
    } catch (err) {
      console.error('Error updating timeline event:', err);
      setError('Failed to update timeline event.');
    }
  };

  const openEditModal = (event: any) => {
    setEditingEvent({ 
      ...event, 
      related_entities: JSON.stringify(event.related_entities || {}, null, 2)
    });
    setShowEditModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Timeline</h1>
      <div className="mb-4">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Event
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Era</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timelineEvents.map((event: any) => (
            <tr key={event.id}>
              <td className="border px-4 py-2">{event.title}</td>
              <td className="border px-4 py-2">{event.date}</td>
              <td className="border px-4 py-2">{event.era}</td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => openEditModal(event)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Create New Timeline Event</h2>
            <form onSubmit={handleCreateEvent}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date</label>
                <input
                  type="text"
                  id="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="era">Era</label>
                <input
                  type="text"
                  id="era"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newEvent.era}
                  onChange={(e) => setNewEvent({ ...newEvent, era: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="related_entities">Related Entities (JSON)</label>
                <textarea
                  id="related_entities"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={newEvent.related_entities}
                  onChange={(e) => setNewEvent({ ...newEvent, related_entities: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_published">Is Published</label>
                <input
                  type="checkbox"
                  id="is_published"
                  className="mr-2 leading-tight"
                  checked={newEvent.is_published}
                  onChange={(e) => setNewEvent({ ...newEvent, is_published: e.target.checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Timeline Event</h2>
            <form onSubmit={handleEditEvent}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">Title</label>
                <input
                  type="text"
                  id="edit-title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-date">Date</label>
                <input
                  type="text"
                  id="edit-date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-era">Era</label>
                <input
                  type="text"
                  id="edit-era"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editingEvent.era}
                  onChange={(e) => setEditingEvent({ ...editingEvent, era: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-related_entities">Related Entities (JSON)</label>
                <textarea
                  id="edit-related_entities"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  value={editingEvent.related_entities}
                  onChange={(e) => setEditingEvent({ ...editingEvent, related_entities: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-is_published">Is Published</label>
                <input
                  type="checkbox"
                  id="edit-is_published"
                  className="mr-2 leading-tight"
                  checked={editingEvent.is_published}
                  onChange={(e) => setEditingEvent({ ...editingEvent, is_published: e.target.checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Event
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

export default TimelineManager;
