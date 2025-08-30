import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared';
const BetaApplicationsManager = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
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
            }
            else {
                setApplications(data || []);
            }
            setLoading(false);
        };
        fetchApplications();
    }, []);
    const handleStatusChange = async (id, newStatus, notes) => {
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
        setApplications(prevApps => prevApps.map(app => app.id === id ? { ...app, status: newStatus, admin_notes: notes } : app));
        alert(`Application ${newStatus} and user profile updated successfully!`);
    };
    const handleViewDetails = (app) => {
        setSelectedApplication(app);
        setShowDetailsModal(true);
    };
    const handleCloseDetailsModal = () => {
        setSelectedApplication(null);
        setShowDetailsModal(false);
    };
    // Function to update admin notes from modal
    const handleUpdateAdminNotes = async (appId, newNotes) => {
        const { error: updateError } = await supabase
            .from('beta_applications')
            .update({ admin_notes: newNotes })
            .eq('id', appId);
        if (updateError) {
            console.error('Error updating admin notes:', updateError);
            alert('Failed to update admin notes.');
        }
        else {
            // Update the state to reflect the change
            setApplications(prevApps => prevApps.map(app => app.id === appId ? { ...app, admin_notes: newNotes } : app));
            if (selectedApplication && selectedApplication.id === appId) {
                setSelectedApplication(prev => prev ? { ...prev, admin_notes: newNotes } : null);
            }
            alert('Admin notes updated successfully!');
        }
    };
    if (loading)
        return _jsx("div", { className: "text-gray-100", children: "Loading applications..." });
    if (error)
        return _jsxs("div", { className: "text-red-400", children: ["Error: ", error] });
    return (_jsxs("div", { className: "admin-beta-applications-manager", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-6", children: "Manage Beta Applications" }), applications.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No beta applications submitted yet." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: applications.map(app => (_jsxs("div", { className: "bg-gray-800/50 rounded-xl p-6 border border-gray-700", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: app.full_name }), _jsx("p", { className: "text-gray-400 text-sm", children: app.email }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Status: ", _jsx("span", { className: `font-medium ${app.status === 'pending' ? 'text-yellow-400' :
                                        app.status === 'approved' ? 'text-green-400' :
                                            'text-red-400'}`, children: app.status.toUpperCase() })] }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Composite Score: ", app.composite_score, "/100"] }), _jsxs("div", { className: "mt-4 space-y-2", children: [_jsxs("p", { className: "text-gray-300 text-sm", children: ["Stage 1 Score: ", app.stage1_raw_score, "/100"] }), _jsxs("p", { className: "text-gray-300 text-sm", children: ["Stage 2 Score: ", app.stage2_raw_score, "/60"] }), _jsxs("p", { className: "text-gray-300 text-sm", children: ["Stage 3 Score: ", app.stage3_raw_score, "/40"] }), _jsxs("p", { className: "text-gray-300 text-sm", children: ["Stage 4 Score: ", app.stage4_raw_score, "/60"] })] }), app.admin_notes && (_jsxs("div", { className: "mt-4 p-3 bg-gray-700/50 rounded-lg text-gray-300 text-sm", children: [_jsx("strong", { children: "Admin Notes:" }), " ", app.admin_notes] })), _jsxs("div", { className: "mt-6 flex space-x-3", children: [app.status === 'pending' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleStatusChange(app.id, 'approved', prompt('Add admin notes for approval:') || ''), className: "px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium", children: "Approve" }), _jsx("button", { onClick: () => handleStatusChange(app.id, 'denied', prompt('Add admin notes for denial:') || ''), className: "px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium", children: "Deny" })] })), _jsx("button", { onClick: () => handleViewDetails(app), className: "px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium", children: "View Details" })] })] }, app.id))) })), showDetailsModal && selectedApplication && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-gray-800/90 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 relative", children: [_jsx("button", { onClick: handleCloseDetailsModal, className: "absolute top-4 right-4 text-gray-400 hover:text-white", children: "\u00D7" }), _jsxs("h2", { className: "text-2xl font-bold text-white mb-6", children: ["Application Details: ", selectedApplication.full_name] }), _jsxs("div", { className: "space-y-4 text-gray-300", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "Applicant Information" }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", selectedApplication.email] }), _jsxs("p", { children: [_jsx("strong", { children: "Time Zone:" }), " ", selectedApplication.time_zone] }), _jsxs("p", { children: [_jsx("strong", { children: "Country:" }), " ", selectedApplication.country || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Goodreads:" }), " ", selectedApplication.goodreads || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Applied On:" }), " ", new Date(selectedApplication.created_at).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Current Status:" }), " ", selectedApplication.status.toUpperCase()] }), _jsxs("p", { children: [_jsx("strong", { children: "Composite Score:" }), " ", selectedApplication.composite_score, "/100"] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "Admin Notes" }), _jsx("textarea", { className: "w-full p-2 rounded bg-gray-700 border border-gray-600 text-white", rows: 4, value: selectedApplication.admin_notes || '', onChange: (e) => setSelectedApplication(prev => prev ? { ...prev, admin_notes: e.target.value } : null) }), _jsx("button", { onClick: () => handleUpdateAdminNotes(selectedApplication.id, selectedApplication.admin_notes || ''), className: "mt-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium", children: "Save Notes" })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold text-white mb-2", children: ["Stage 1: Application Form (Score: ", selectedApplication.stage1_raw_score, "/100)"] }), _jsxs("p", { children: [_jsx("strong", { children: "Beta Commitment:" }), " ", selectedApplication.beta_commitment] }), _jsxs("p", { children: [_jsx("strong", { children: "Hours Per Week:" }), " ", selectedApplication.hours_per_week] }), _jsxs("p", { children: [_jsx("strong", { children: "Portal Use:" }), " ", selectedApplication.portal_use] }), _jsxs("p", { children: [_jsx("strong", { children: "Recent Reads:" }), " ", selectedApplication.recent_reads || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Interest Statement:" }), " ", selectedApplication.interest_statement] }), _jsxs("p", { children: [_jsx("strong", { children: "Prior Beta Experience:" }), " ", selectedApplication.prior_beta || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Feedback Philosophy:" }), " ", selectedApplication.feedback_philosophy] }), _jsxs("p", { children: [_jsx("strong", { children: "Track Record:" }), " ", selectedApplication.track_record || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Communication:" }), " ", selectedApplication.communication] }), _jsxs("p", { children: [_jsx("strong", { children: "Devices:" }), " ", selectedApplication.devices.join(', ') || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Access Needs:" }), " ", selectedApplication.access_needs || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Demographics:" }), " ", selectedApplication.demographics || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Passed Stage 1:" }), " ", selectedApplication.stage1_passed ? 'Yes' : 'No'] }), _jsxs("p", { children: [_jsx("strong", { children: "Auto Fail:" }), " ", selectedApplication.stage1_auto_fail ? 'Yes' : 'No'] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold text-white mb-2", children: ["Stage 2: Comprehension Test (Score: ", selectedApplication.stage2_raw_score, "/60)"] }), _jsxs("p", { children: [_jsx("strong", { children: "Q1 Answer:" }), " ", selectedApplication.q1 || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Q2 Answer:" }), " ", selectedApplication.q2 || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Clarity Feedback:" }), " ", selectedApplication.clarity_feedback || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Pacing Analysis:" }), " ", selectedApplication.pacing_analysis || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Taste Alignment:" }), " ", selectedApplication.taste_alignment || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Passed Stage 2:" }), " ", selectedApplication.stage2_passed ? 'Yes' : 'No'] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold text-white mb-2", children: ["Stage 3: Calibration Test (Score: ", selectedApplication.stage3_raw_score, "/40)"] }), _jsxs("p", { children: [_jsx("strong", { children: "Worse Passage:" }), " ", selectedApplication.worse_passage || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Passage A Analysis:" }), " ", selectedApplication.passage_a_analysis || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Passage B Analysis:" }), " ", selectedApplication.passage_b_analysis || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Priority Fix:" }), " ", selectedApplication.priority_fix || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Passed Stage 3:" }), " ", selectedApplication.stage3_passed ? 'Yes' : 'No'] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-semibold text-white mb-2", children: ["Stage 4: Timed Trial (Score: ", selectedApplication.stage4_raw_score, "/60)"] }), _jsxs("p", { children: [_jsx("strong", { children: "Overall Assessment:" }), " ", selectedApplication.overall_assessment || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Chapter Summary:" }), " ", selectedApplication.chapter_summary || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Passed Stage 4:" }), " ", selectedApplication.stage4_passed ? 'Yes' : 'No'] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "Change Application Status" }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: () => handleStatusChange(selectedApplication.id, 'approved', prompt('Add admin notes for approval:') || selectedApplication.admin_notes || ''), className: "px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium", children: "Approve" }), _jsx("button", { onClick: () => handleStatusChange(selectedApplication.id, 'denied', prompt('Add admin notes for denial:') || selectedApplication.admin_notes || ''), className: "px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium", children: "Deny" })] })] })] })] }) }))] }));
};
export default BetaApplicationsManager;
//# sourceMappingURL=BetaApplicationsManager.js.map