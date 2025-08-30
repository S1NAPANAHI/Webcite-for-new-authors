import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from './Timelines.module.css';
import { fetchTimelineEvents } from '../lib/api';
const Milestone = ({ date, title, description, details, nested_events = [], background_image }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const milestoneStyle = background_image ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
    } : {};
    return (_jsxs("div", { className: styles.milestone, style: milestoneStyle, children: [_jsx("div", { className: styles.dot }), _jsxs("div", { className: styles.content, onClick: toggleExpand, children: [_jsx("span", { className: styles.date, children: date }), _jsx("h3", { children: title }), _jsx("p", { children: description }), isExpanded && (_jsxs("div", { className: styles.expandedContent, children: [details && _jsx("p", { className: styles.detailsText, children: details }), nested_events && nested_events.length > 0 && (_jsx("div", { className: styles.miniTimeline, children: nested_events.map((event, index) => (_jsxs("div", { className: styles.miniMilestone, children: [_jsx("div", { className: styles.miniDot }), _jsxs("div", { className: styles.miniContent, children: [_jsx("span", { className: styles.miniDate, children: event.date }), _jsx("h4", { children: event.title }), _jsx("p", { children: event.description })] })] }, index))) }))] }))] })] }));
};
const Timelines = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const data = await fetchTimelineEvents();
                setEvents(data);
            }
            catch (err) {
                console.error('Failed to load timeline events:', err);
                setError('Failed to load timeline. Please try again later.');
            }
            finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "container mx-auto p-4", children: _jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [_jsx("strong", { className: "font-bold", children: "Error: " }), _jsx("span", { className: "block sm:inline", children: error })] }) }));
    }
    if (events.length === 0) {
        return (_jsx("div", { className: "container mx-auto p-4", children: _jsxs("div", { className: "text-center py-12", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "No Timeline Events Found" }), _jsx("p", { className: "text-gray-600", children: "Check back later for updates to the timeline." })] }) }));
    }
    return (_jsx("section", { className: `${styles.timeline} py-12`, children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("h1", { className: "text-4xl font-bold text-center mb-12", children: "Zoroastrian Timeline" }), events.map((event) => (_jsx(Milestone, { date: event.date, title: event.title, description: event.description, details: event.details, nested_events: event.nested_events, background_image: event.background_image }, event.id)))] }) }));
};
export default Timelines;
//# sourceMappingURL=Timelines.js.map