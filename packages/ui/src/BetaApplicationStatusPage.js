import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export const BetaApplicationStatusPage = () => {
    const betaApplicationStatus = localStorage.getItem('betaApplicationStatus') || 'none';
    let statusMessage = '';
    let statusColor = 'text-gray-800';
    let actionLink = null;
    switch (betaApplicationStatus) {
        case 'none':
            statusMessage = 'You have not yet submitted a beta reader application.';
            statusColor = 'text-blue-700';
            actionLink = _jsx(Link, { to: "/beta/application", className: "text-blue-500 hover:underline", children: "Apply now" });
            break;
        case 'pending':
            statusMessage = 'Your beta reader application is currently under review. We will notify you of our decision soon.';
            statusColor = 'text-yellow-700';
            break;
        case 'accepted':
            statusMessage = 'Congratulations! Your beta reader application has been accepted. Welcome to the program!';
            statusColor = 'text-green-700';
            actionLink = _jsx(Link, { to: "/beta/portal", className: "text-green-500 hover:underline", children: "Go to Beta Portal" });
            break;
        case 'rejected':
            statusMessage = 'We regret to inform you that your beta reader application was not successful at this time.';
            statusColor = 'text-red-700';
            break;
        default:
            statusMessage = 'Unknown application status.';
            statusColor = 'text-gray-800';
    }
    return (_jsxs("div", { className: "p-4 text-center", children: [_jsx("h1", { className: "text-3xl font-bold mb-4", children: "Beta Application Status" }), _jsxs("div", { className: `p-6 rounded-lg shadow-md ${statusColor} bg-white`, children: [_jsx("p", { className: "text-lg font-semibold mb-4", children: statusMessage }), actionLink && _jsx("p", { className: "mt-4", children: actionLink })] })] }));
};
