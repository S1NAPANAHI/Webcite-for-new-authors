export const BetaPortalPage = () => {
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('betaApplicationStatus'); // Clear status on logout
    window.location.href = '/login'; // Redirect to login page after logout
  };

  // Simulated Data for an accepted beta reader
  const currentProject = {
    title: "The Obsidian Gate - Issue 7",
    chaptersRead: 5,
    totalChapters: 10,
    readingWindowEnd: "August 30, 2025",
    feedbackWindowEnd: "September 7, 2025",
    launchDay: "September 15, 2025",
    downloadLink: "#", // Placeholder
  };

  const mandatoryTasks = [
    { id: 1, description: "Read the Material", completed: false },
    { id: 2, description: "Submit Structured Feedback", completed: false },
    { id: 3, description: "Convert to Public Review", completed: false },
  ];

  const earnedBadges = [
    { name: "Beta Alumni", description: "Completed 1+ beta cycles" },
    // { name: "Veteran Reader", description: "Completed 3+ beta cycles" },
  ];

  const announcements = [
    { id: 1, title: "New Feedback Form Available!", date: "August 20, 2025", content: "The feedback form for Issue 7 is now live. Please submit your thoughts by the deadline." },
    { id: 2, title: "Reminder: Reading Window Ends Soon", date: "August 25, 2025", content: "Just a friendly reminder that the reading window for Issue 7 closes on August 30th." },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Beta Reader Portal!</h1>
      <p className="mb-4">This is your central hub for all active beta reading projects and resources.</p>

      {/* Current Beta Cycle Overview */}
      <div className="bg-card shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Current Beta Cycle: {currentProject.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Reading Window Ends:</strong> {currentProject.readingWindowEnd}</p>
            <p><strong>Feedback Window Ends:</strong> {currentProject.feedbackWindowEnd}</p>
            <p><strong>Launch Day:</strong> {currentProject.launchDay}</p>
            <p className="mt-2"><strong>Your Progress:</strong> Chapters Read {currentProject.chaptersRead}/{currentProject.totalChapters}</p>
            <a href={currentProject.downloadLink} className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">Download Material</a>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Mandatory Tasks</h3>
            <ul className="list-none">
              {mandatoryTasks.map(task => (
                <li key={task.id} className="flex items-center mb-1">
                  <input type="checkbox" checked={task.completed} readOnly className="mr-2" />
                  {task.description}
                </li>
              ))}
            </ul>
            <a href="/beta/feedback" className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">Submit Feedback</a>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-card shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
        {announcements.length > 0 ? (
          <ul>
            {announcements.map(announcement => (
              <li key={announcement.id} className="mb-4 pb-4 border-b last:border-b-0">
                <h3 className="font-bold text-lg">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground">{announcement.date}</p>
                <p className="mt-1">{announcement.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No new announcements at this time.</p>
        )}
      </div>

      {/* Rewards & Recognition */}
      <div className="bg-card shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Rewards & Recognition</h2>
        {earnedBadges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {earnedBadges.map(badge => (
              <span key={badge.name} className="bg-muted text-muted-foreground text-sm font-medium px-3 py-1 rounded-full">
                {badge.name} - {badge.description}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Complete your first beta cycle to earn your first badge!</p>
        )}
        <p className="mt-4 text-muted-foreground">Upon successful completion of a beta cycle, you will receive a store discount coupon.</p>
      </div>

      {/* Important Links */}
      <div className="bg-card shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Important Links</h2>
        <ul className="list-disc list-inside text-primary">
          <li><a href="/beta/handbook" className="hover:underline">Beta Reader Handbook</a></li>
          <li><a href="/beta/timeline" className="hover:underline">Operational Timeline</a></li>
          <li><a href="#" className="hover:underline">Community Forum (Discord/Private Channel)</a></li>
          <li><a href="/beta/nda" className="hover:underline">View NDA</a></li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 bg-destructive hover:bg-destructive-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Logout
      </button>
    </div>
  );
};

