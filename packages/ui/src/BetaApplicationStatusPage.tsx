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
      actionLink = <Link to="/beta/application" className="text-blue-500 hover:underline">Apply now</Link>;
      break;
    case 'pending':
      statusMessage = 'Your beta reader application is currently under review. We will notify you of our decision soon.';
      statusColor = 'text-yellow-700';
      break;
    case 'accepted':
      statusMessage = 'Congratulations! Your beta reader application has been accepted. Welcome to the program!';
      statusColor = 'text-green-700';
      actionLink = <Link to="/beta/portal" className="text-green-500 hover:underline">Go to Beta Portal</Link>;
      break;
    case 'rejected':
      statusMessage = 'We regret to inform you that your beta reader application was not successful at this time.';
      statusColor = 'text-red-700';
      break;
    default:
      statusMessage = 'Unknown application status.';
      statusColor = 'text-gray-800';
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Beta Application Status</h1>
      <div className={`p-6 rounded-lg shadow-md ${statusColor} bg-white`}>
        <p className="text-lg font-semibold mb-4">{statusMessage}</p>
        {actionLink && <p className="mt-4">{actionLink}</p>}
      </div>
    </div>
  );
};


