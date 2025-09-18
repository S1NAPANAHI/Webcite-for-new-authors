import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BetaApplicationsManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get('/api/beta/applications');
        setApplications(data.applications);
      } catch (error) {
        console.error('Error fetching beta applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Beta Applications</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Applicant</th>
            <th className="py-2">Status</th>
            <th className="py-2">Score</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application: any) => (
            <tr key={application.id}>
              <td className="border px-4 py-2">{application.full_name} ({application.email})</td>
              <td className="border px-4 py-2">{application.status}</td>
              <td className="border px-4 py-2">{application.composite_score}</td>
              <td className="border px-4 py-2">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
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
    </div>
  );
};

export default BetaApplicationsManager;
