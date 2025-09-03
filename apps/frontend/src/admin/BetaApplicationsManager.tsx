import React, { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';


interface BetaApplicationData {
  id: string;
  user_id: string;
  created_at: string;
  status: 'pending' | 'approved' | 'denied';
  admin_notes: string | null;

  // Stage 1: Application Form
  full_name: string;
  email: string;
  time_zone: string;
  country: string | null;
  goodreads: string | null;
  beta_commitment: string;
  hours_per_week: string;
  portal_use: string;
  recent_reads: string | null;
  interest_statement: string;
  prior_beta: string | null;
  feedback_philosophy: string;
  track_record: string | null;
  communication: string;
  devices: string[];
  access_needs: string | null;
  demographics: string | null;
  stage1_raw_score: number;
  stage1_passed: boolean | null;
  stage1_auto_fail: boolean | null;

  // Stage 2: Comprehension Test
  q1: string | null;
  q2: string | null;
  clarity_feedback: string | null;
  pacing_analysis: string | null;
  taste_alignment: string | null;
  stage2_raw_score: number;
  stage2_passed: boolean | null;

  // Stage 3: Calibration Test
  worse_passage: string | null;
  passage_a_analysis: string | null;
  passage_b_analysis: string | null;
  priority_fix: string | null;
  stage3_raw_score: number;
  stage3_passed: boolean | null;

  // Stage 4: Timed Trial
  overall_assessment: string | null;
  chapter_summary: string | null;
  stage4_raw_score: number;
  stage4_passed: boolean | null;
  composite_score: number;
}

const BetaApplicationsManager: React.FC = () => {
  const [applications, setApplications] = useState<BetaApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<BetaApplicationData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      // Select all fields for detailed view
      const { data, error } = await supabase
        .from('beta_applications')
        .select('*'); // Now fetching all fields

      if (error) {
        console.error('Error fetching beta applications:', error);
        setError(error.message);
      } else {
        setApplications(data || []);
      }
      setLoading(false);
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'denied', notes: string) => {
    // First, update the beta_applications table
    const { error: appUpdateError } = await supabase
      .from('beta_applications')
      .update({ status: newStatus, admin_notes: notes })
      .eq('id', id);

    if (appUpdateError) {
      console.error('Error updating application status:', appUpdateError);
      alert('Failed to update application status.');
      return;
    }

    // Get the user_id from the application
    const { data: application, error: fetchAppError } = await supabase
      .from('beta_applications')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchAppError || !application) {
      console.error('Error fetching application user_id:', fetchAppError);
      alert('Failed to fetch application user for profile update.');
      return;
    }

    const profileStatus = newStatus === 'approved' ? 'approved' : 'rejected';

    // Then, update the profiles table
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ beta_reader_status: profileStatus }) // Use newStatus directly as it matches enum
      .eq('id', application.user_id);

    if (profileUpdateError) {
      console.error('Error updating user profile beta_reader_status:', profileUpdateError);
      alert("Failed to update user's beta reader status in profile.");
      return;
    }

    setApplications(prevApps => 
      prevApps.map(app => 
        app.id === id ? { ...app, status: newStatus, admin_notes: notes } : app
      )
    );
    alert(`Application ${newStatus} and user profile updated successfully!`);
  };

  const handleViewDetails = (app: BetaApplicationData) => {
    setSelectedApplication(app);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedApplication(null);
    setShowDetailsModal(false);
  };

  // Function to update admin notes from modal
  const handleUpdateAdminNotes = async (appId: string, newNotes: string) => {
    const { error: updateError } = await supabase
      .from('beta_applications')
      .update({ admin_notes: newNotes })
      .eq('id', appId);

    if (updateError) {
      console.error('Error updating admin notes:', updateError);
      alert('Failed to update admin notes.');
    } else {
      // Update the state to reflect the change
      setApplications(prevApps =>
        prevApps.map(app =>
          app.id === appId ? { ...app, admin_notes: newNotes } : app
        )
      );
      if (selectedApplication && selectedApplication.id === appId) {
        setSelectedApplication(prev => prev ? { ...prev, admin_notes: newNotes } : null);
      }
      alert('Admin notes updated successfully!');
    }
  };

  if (loading) return <div className="text-gray-100">Loading applications...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="admin-beta-applications-manager">
      <h1 className="text-2xl font-bold text-white mb-6">Manage Beta Applications</h1>
      
      {applications.length === 0 ? (
        <p className="text-gray-400">No beta applications submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map(app => (
            <div key={app.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white">{app.full_name}</h3>
              <p className="text-gray-400 text-sm">{app.email}</p>
              <p className="text-gray-400 text-sm">Status: <span className={`font-medium ${
                app.status === 'pending' ? 'text-yellow-400' :
                app.status === 'approved' ? 'text-green-400' :
                'text-red-400'
              }`}>{app.status.toUpperCase()}</span></p>
              <p className="text-gray-400 text-sm">Composite Score: {app.composite_score}/100</p>
              
              <div className="mt-4 space-y-2">
                <p className="text-gray-300 text-sm">Stage 1 Score: {app.stage1_raw_score}/100</p>
                <p className="text-gray-300 text-sm">Stage 2 Score: {app.stage2_raw_score}/60</p>
                <p className="text-gray-300 text-sm">Stage 3 Score: {app.stage3_raw_score}/40</p>
                <p className="text-gray-300 text-sm">Stage 4 Score: {app.stage4_raw_score}/60</p>
              </div>

              {app.admin_notes && (
                <div className="mt-4 p-3 bg-gray-700/50 rounded-lg text-gray-300 text-sm">
                  <strong>Admin Notes:</strong> {app.admin_notes}
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                {app.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'approved', prompt('Add admin notes for approval:') || '')}
                      className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'denied', prompt('Add admin notes for denial:') || '')}
                      className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
                    >
                      Deny
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleViewDetails(app)} // Updated onClick
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/90 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 relative">
            <button
              onClick={handleCloseDetailsModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Application Details: {selectedApplication.full_name}</h2>

            <div className="space-y-4 text-gray-300">
              {/* Basic Info */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Applicant Information</h3>
                <p><strong>Email:</strong> {selectedApplication.email}</p>
                <p><strong>Time Zone:</strong> {selectedApplication.time_zone}</p>
                <p><strong>Country:</strong> {selectedApplication.country || 'N/A'}</p>
                <p><strong>Goodreads:</strong> {selectedApplication.goodreads || 'N/A'}</p>
                <p><strong>Applied On:</strong> {new Date(selectedApplication.created_at).toLocaleString()}</p>
                <p><strong>Current Status:</strong> {selectedApplication.status.toUpperCase()}</p>
                <p><strong>Composite Score:</strong> {selectedApplication.composite_score}/100</p>
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Admin Notes</h3>
                <textarea
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  rows={4}
                  value={selectedApplication.admin_notes || ''}
                  onChange={(e) => setSelectedApplication(prev => prev ? { ...prev, admin_notes: e.target.value } : null)}
                ></textarea>
                <button
                  onClick={() => handleUpdateAdminNotes(selectedApplication.id, selectedApplication.admin_notes || '')}
                  className="mt-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium"
                >
                  Save Notes
                </button>
              </div>

              {/* Stage 1 Details */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Stage 1: Application Form (Score: {selectedApplication.stage1_raw_score}/100)</h3>
                <p><strong>Beta Commitment:</strong> {selectedApplication.beta_commitment}</p>
                <p><strong>Hours Per Week:</strong> {selectedApplication.hours_per_week}</p>
                <p><strong>Portal Use:</strong> {selectedApplication.portal_use}</p>
                <p><strong>Recent Reads:</strong> {selectedApplication.recent_reads || 'N/A'}</p>
                <p><strong>Interest Statement:</strong> {selectedApplication.interest_statement}</p>
                <p><strong>Prior Beta Experience:</strong> {selectedApplication.prior_beta || 'N/A'}</p>
                <p><strong>Feedback Philosophy:</strong> {selectedApplication.feedback_philosophy}</p>
                <p><strong>Track Record:</strong> {selectedApplication.track_record || 'N/A'}</p>
                <p><strong>Communication:</strong> {selectedApplication.communication}</p>
                <p><strong>Devices:</strong> {selectedApplication.devices.join(', ') || 'N/A'}</p>
                <p><strong>Access Needs:</strong> {selectedApplication.access_needs || 'N/A'}</p>
                <p><strong>Demographics:</strong> {selectedApplication.demographics || 'N/A'}</p>
                <p><strong>Passed Stage 1:</strong> {selectedApplication.stage1_passed ? 'Yes' : 'No'}</p>
                <p><strong>Auto Fail:</strong> {selectedApplication.stage1_auto_fail ? 'Yes' : 'No'}</p>
              </div>

              {/* Stage 2 Details */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Stage 2: Comprehension Test (Score: {selectedApplication.stage2_raw_score}/60)</h3>
                <p><strong>Q1 Answer:</strong> {selectedApplication.q1 || 'N/A'}</p>
                <p><strong>Q2 Answer:</strong> {selectedApplication.q2 || 'N/A'}</p>
                <p><strong>Clarity Feedback:</strong> {selectedApplication.clarity_feedback || 'N/A'}</p>
                <p><strong>Pacing Analysis:</strong> {selectedApplication.pacing_analysis || 'N/A'}</p>
                <p><strong>Taste Alignment:</strong> {selectedApplication.taste_alignment || 'N/A'}</p>
                <p><strong>Passed Stage 2:</strong> {selectedApplication.stage2_passed ? 'Yes' : 'No'}</p>
              </div>

              {/* Stage 3 Details */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Stage 3: Calibration Test (Score: {selectedApplication.stage3_raw_score}/40)</h3>
                <p><strong>Worse Passage:</strong> {selectedApplication.worse_passage || 'N/A'}</p>
                <p><strong>Passage A Analysis:</strong> {selectedApplication.passage_a_analysis || 'N/A'}</p>
                <p><strong>Passage B Analysis:</strong> {selectedApplication.passage_b_analysis || 'N/A'}</p>
                <p><strong>Priority Fix:</strong> {selectedApplication.priority_fix || 'N/A'}</p>
                <p><strong>Passed Stage 3:</strong> {selectedApplication.stage3_passed ? 'Yes' : 'No'}</p>
              </div>

              {/* Stage 4 Details */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Stage 4: Timed Trial (Score: {selectedApplication.stage4_raw_score}/60)</h3>
                <p><strong>Overall Assessment:</strong> {selectedApplication.overall_assessment || 'N/A'}</p>
                <p><strong>Chapter Summary:</strong> {selectedApplication.chapter_summary || 'N/A'}</p>
                <p><strong>Passed Stage 4:</strong> {selectedApplication.stage4_passed ? 'Yes' : 'No'}</p>
              </div>

              {/* Status Change from Modal (Optional, but useful) */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white mb-2">Change Application Status</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusChange(selectedApplication.id, 'approved', prompt('Add admin notes for approval:') || selectedApplication.admin_notes || '')}
                    className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApplication.id, 'denied', prompt('Add admin notes for denial:') || selectedApplication.admin_notes || '')}
                    className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetaApplicationsManager;