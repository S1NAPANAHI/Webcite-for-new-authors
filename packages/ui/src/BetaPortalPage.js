import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "p-4", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Welcome to the Beta Reader Portal!" }), _jsx("p", { className: "mb-4", children: "This is your central hub for all active beta reading projects and resources." }), _jsxs("div", { className: "bg-card shadow-md rounded-lg p-6 mb-6", children: [_jsxs("h2", { className: "text-2xl font-semibold mb-4", children: ["Current Beta Cycle: ", currentProject.title] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("p", { children: [_jsx("strong", { children: "Reading Window Ends:" }), " ", currentProject.readingWindowEnd] }), _jsxs("p", { children: [_jsx("strong", { children: "Feedback Window Ends:" }), " ", currentProject.feedbackWindowEnd] }), _jsxs("p", { children: [_jsx("strong", { children: "Launch Day:" }), " ", currentProject.launchDay] }), _jsxs("p", { className: "mt-2", children: [_jsx("strong", { children: "Your Progress:" }), " Chapters Read ", currentProject.chaptersRead, "/", currentProject.totalChapters] }), _jsx("a", { href: currentProject.downloadLink, className: "mt-4 inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded", children: "Download Material" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "Mandatory Tasks" }), _jsx("ul", { className: "list-none", children: mandatoryTasks.map(task => (_jsxs("li", { className: "flex items-center mb-1", children: [_jsx("input", { type: "checkbox", checked: task.completed, readOnly: true, className: "mr-2" }), task.description] }, task.id))) }), _jsx("a", { href: "/beta/feedback", className: "mt-4 inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded", children: "Submit Feedback" })] })] })] }), _jsxs("div", { className: "bg-card shadow-md rounded-lg p-6 mb-6", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Announcements" }), announcements.length > 0 ? (_jsx("ul", { children: announcements.map(announcement => (_jsxs("li", { className: "mb-4 pb-4 border-b last:border-b-0", children: [_jsx("h3", { className: "font-bold text-lg", children: announcement.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: announcement.date }), _jsx("p", { className: "mt-1", children: announcement.content })] }, announcement.id))) })) : (_jsx("p", { className: "text-muted-foreground", children: "No new announcements at this time." }))] }), _jsxs("div", { className: "bg-card shadow-md rounded-lg p-6 mb-6", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Your Rewards & Recognition" }), earnedBadges.length > 0 ? (_jsx("div", { className: "flex flex-wrap gap-4", children: earnedBadges.map(badge => (_jsxs("span", { className: "bg-muted text-muted-foreground text-sm font-medium px-3 py-1 rounded-full", children: [badge.name, " - ", badge.description] }, badge.name))) })) : (_jsx("p", { className: "text-muted-foreground", children: "Complete your first beta cycle to earn your first badge!" })), _jsx("p", { className: "mt-4 text-muted-foreground", children: "Upon successful completion of a beta cycle, you will receive a store discount coupon." })] }), _jsxs("div", { className: "bg-card shadow-md rounded-lg p-6 mb-6", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Important Links" }), _jsxs("ul", { className: "list-disc list-inside text-primary", children: [_jsx("li", { children: _jsx("a", { href: "/beta/handbook", className: "hover:underline", children: "Beta Reader Handbook" }) }), _jsx("li", { children: _jsx("a", { href: "/beta/timeline", className: "hover:underline", children: "Operational Timeline" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "hover:underline", children: "Community Forum (Discord/Private Channel)" }) }), _jsx("li", { children: _jsx("a", { href: "/beta/nda", className: "hover:underline", children: "View NDA" }) })] })] }), _jsx("button", { onClick: handleLogout, className: "mt-8 bg-destructive hover:bg-destructive-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", children: "Logout" })] }));
};
