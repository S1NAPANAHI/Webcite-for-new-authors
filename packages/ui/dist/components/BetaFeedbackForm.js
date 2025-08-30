import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Button } from '../button';
import { Label } from '../label';
import { Checkbox } from '@radix-ui/react-checkbox';
import { toast } from 'sonner';
import { Star, Eye, EyeOff, Send, BookOpen, Heart, Zap, Users, Globe, Lock } from 'lucide-react';
// --- Zod Schema for Validation ---
const feedbackSchema = z.object({
    // Public Review Fields
    overallRating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
    publicHeadline: z.string().min(1, 'Headline is required').max(80, 'Headline must be 80 characters or less'),
    quickTake: z.string().min(1, 'Quick Take is required').max(200, 'Quick Take must be 1-2 sentences'),
    highlights: z.array(z.string()).min(0, 'Select at least 0 highlights'), // Optional, but can have min/max if needed
    publicReview: z.string().min(1, 'Public review text is required'),
    allowSpoilers: z.boolean(),
    spoilerContent: z.string().optional(),
    // Private Feedback Fields
    privateFeedback: z.string().min(1, 'Detailed private feedback is required'),
    typoFixes: z.string().optional(),
    specificFeedback: z.object({
        pacing: z.string().optional(),
        characters: z.string().optional(),
        worldbuilding: z.string().optional(),
        dialogue: z.string().optional(),
        plot: z.string().optional(),
    }).optional(),
});
const StarRating = ({ value, onChange }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (_jsxs("div", { className: "flex items-center gap-1 mb-4", children: [[1, 2, 3, 4, 5].map((star) => (_jsx("button", { type: "button", className: `text-2xl transition-colors ${star <= (hoverRating || value) ? 'text-yellow-400' : 'text-gray-300'}`, onMouseEnter: () => setHoverRating(star), onMouseLeave: () => setHoverRating(0), onClick: () => onChange(star), children: _jsx(Star, { fill: "currentColor" }) }, star))), _jsx("span", { className: "ml-2 text-gray-600", children: value > 0 ? `${value}/5 stars` : 'Click to rate' })] }));
};
// --- BetaFeedbackForm Component ---
const BetaFeedbackForm = () => {
    const { handleSubmit, control, register, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            overallRating: 0,
            publicHeadline: '',
            quickTake: '',
            highlights: [],
            publicReview: '',
            allowSpoilers: false,
            spoilerContent: '',
            privateFeedback: '',
            typoFixes: '',
            specificFeedback: {
                pacing: '',
                characters: '',
                worldbuilding: '',
                dialogue: '',
                plot: '',
            },
        },
    });
    const [previewMode, setPreviewMode] = useState('pre-publication'); // 'pre-publication' | 'post-publication'
    const [spoilerRevealed, setSpoilerRevealed] = useState({});
    const allowSpoilers = watch('allowSpoilers');
    const currentRating = watch('overallRating');
    const selectedHighlights = watch('highlights');
    const publicHeadline = watch('publicHeadline');
    const quickTake = watch('quickTake');
    const publicReview = watch('publicReview');
    const spoilerContent = watch('spoilerContent');
    const highlightOptions = [
        { id: 'worldbuilding', label: '🌌 Worldbuilding', icon: Globe },
        { id: 'emotional', label: '💔 Emotional Impact', icon: Heart },
        { id: 'pacing', label: '⚡ Pacing', icon: Zap },
        { id: 'characters', label: '👥 Characters', icon: Users },
        { id: 'writing', label: '✨ Writing Style', icon: BookOpen }
    ];
    const toggleSpoiler = (spoilerId) => {
        setSpoilerRevealed(prev => ({
            ...prev,
            [spoilerId]: !prev[spoilerId]
        }));
    };
    const onSubmit = (data) => {
        console.log('Beta Reader Feedback Submitted:', data);
        toast.success('Thank you for your feedback! Your response has been submitted.');
        // In a real application, you would send this data to your backend
    };
    const renderSpoilerContent = (content, spoilerId) => {
        if (previewMode === 'pre-publication')
            return null;
        const isRevealed = spoilerRevealed[spoilerId];
        return (_jsxs("div", { className: "mt-4 border border-red-200 rounded-lg p-4 bg-red-50", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("span", { className: "text-sm font-semibold text-red-600 flex items-center gap-1", children: [_jsx(Eye, { className: "w-4 h-4" }), "Spoiler Content"] }), _jsxs("button", { type: "button", onClick: () => toggleSpoiler(spoilerId), className: "text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md flex items-center gap-1 transition-colors", children: [isRevealed ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }), isRevealed ? 'Hide' : 'Reveal'] })] }), _jsx("div", { className: `transition-all duration-300 ${isRevealed ? 'opacity-100' : 'opacity-100 blur-sm select-none pointer-events-none bg-black text-black'}`, children: content || 'No spoiler content provided' })] }));
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 bg-white min-h-screen", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-2", children: "Beta Reader Feedback Form" }), _jsx("p", { className: "text-gray-600", children: "Your feedback helps make this story the best it can be!" }), _jsxs("div", { className: "mt-4 flex justify-center gap-2", children: [_jsx("button", { type: "button", onClick: () => setPreviewMode('pre-publication'), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${previewMode === 'pre-publication'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`, children: "Pre-Publication Preview" }), _jsx("button", { type: "button", onClick: () => setPreviewMode('post-publication'), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${previewMode === 'post-publication'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`, children: "Post-Publication Preview" })] })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [_jsxs("div", { className: "p-6 rounded-lg border border-yellow-200", style: { backgroundColor: '#fffbeb' }, children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Lock, { className: "w-5 h-5 text-yellow-600" }), _jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Private Feedback (Author Only)" })] }), _jsx("p", { className: "text-sm text-yellow-700 mb-4", children: "This section is completely private and will only be seen by the author. Be as detailed and honest as possible!" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "privateFeedback", className: "block text-sm font-medium text-gray-700 mb-2", children: "Overall Detailed Feedback" }), _jsx(Textarea, { id: "privateFeedback", ...register('privateFeedback'), rows: 6, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500", placeholder: "Share your complete thoughts: plot holes, character development, pacing issues, suggestions for improvement, favorite moments, areas that confused you, etc. Include spoilers freely!" }), errors.privateFeedback && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.privateFeedback.message })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [{
                                                key: 'pacing',
                                                label: 'Pacing & Flow'
                                            }, {
                                                key: 'characters',
                                                label: 'Character Development'
                                            }, {
                                                key: 'worldbuilding',
                                                label: 'Worldbuilding & Setting'
                                            }, {
                                                key: 'dialogue',
                                                label: 'Dialogue & Voice'
                                            }, {
                                                key: 'plot',
                                                label: 'Plot & Structure'
                                            }].map(({ key, label }) => (_jsxs("div", { children: [_jsx(Label, { htmlFor: `specificFeedback.${key}`, className: "block text-sm font-medium text-gray-700 mb-1", children: label }), _jsx(Textarea, { id: `specificFeedback.${key}`, ...register(`specificFeedback.${key}`), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm", placeholder: `Specific feedback about ${label.toLowerCase()}...` }), errors.specificFeedback?.[key] && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.specificFeedback[key]?.message })] }, key))) })] })] }), _jsxs("div", { className: "p-6 rounded-lg border border-blue-200", style: { backgroundColor: '#eff6ff' }, children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Globe, { className: "w-5 h-5 text-blue-600" }), _jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Public Review" })] }), _jsx("p", { className: "text-sm text-blue-700 mb-6", children: "This section will be visible to the public. Use the preview mode above to see how it will appear!" }), _jsxs("div", { className: "mb-6", children: [_jsx(Label, { htmlFor: "overallRating", className: "block text-sm font-medium text-gray-700 mb-2", children: "Overall Rating *" }), _jsx(Controller, { name: "overallRating", control: control, render: ({ field }) => (_jsx(StarRating, { value: field.value, onChange: field.onChange })) }), errors.overallRating && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.overallRating.message })] }), _jsxs("div", { className: "mb-6", children: [_jsx(Label, { className: "block text-sm font-medium text-gray-700 mb-2", children: "Story Highlights" }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: "Select what stood out most (optional)" }), _jsx("div", { className: "flex flex-wrap gap-2", children: highlightOptions.map((highlight) => {
                                            const Icon = highlight.icon;
                                            return (_jsxs("button", { type: "button", onClick: () => {
                                                    const currentHighlights = watch('highlights') || [];
                                                    const newHighlights = currentHighlights.includes(highlight.id)
                                                        ? currentHighlights.filter((id) => id !== highlight.id)
                                                        : [...currentHighlights, highlight.id];
                                                    setValue('highlights', newHighlights, { shouldValidate: true });
                                                }, className: `flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${watch('highlights')?.includes(highlight.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), highlight.label] }, highlight.id));
                                        }) }), errors.highlights && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.highlights.message })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "publicHeadline", className: "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1", children: "Review Headline *" }), _jsx(Input, { id: "publicHeadline", type: "text", ...register('publicHeadline'), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "e.g., 'A captivating journey through...' (keep spoiler-free)" }), errors.publicHeadline && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.publicHeadline.message })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "quickTake", className: "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1", children: "Quick Take (1-2 sentences) *" }), _jsx(Textarea, { id: "quickTake", ...register('quickTake'), rows: 2, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Brief spoiler-free summary of your thoughts..." }), errors.quickTake && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.quickTake.message })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "publicReview", className: "block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1", children: "Public Review Text *" }), _jsx(Textarea, { id: "publicReview", ...register('publicReview'), rows: 5, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Your detailed review without spoilers. Focus on writing quality, emotional impact, and general impressions..." }), errors.publicReview && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.publicReview.message })] }), _jsxs("div", { className: "border-t pt-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Controller, { name: "allowSpoilers", control: control, render: ({ field }) => (_jsx(Checkbox, { id: "allowSpoilers", checked: field.value, onCheckedChange: field.onChange, className: "rounded border-gray-300 text-red-500 focus:ring-red-500" })) }), _jsx(Label, { htmlFor: "allowSpoilers", className: "text-sm font-medium text-gray-700 dark:text-gray-200", children: "Include spoiler content for post-publication review" })] }), allowSpoilers && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "spoilerContent", className: "block text-sm font-medium text-red-700 dark:text-red-200 mb-1", children: "Spoiler Content (Post-Publication Only)" }), _jsx(Textarea, { id: "spoilerContent", ...register('spoilerContent'), rows: 4, className: "w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500", placeholder: "Content that includes spoilers - plot details, twists, character fates, etc. This will only be visible after publication with spoiler warnings." }), errors.spoilerContent && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.spoilerContent.message })] }))] })] })] }), _jsxs("div", { className: "p-6 rounded-lg border border-green-200 col-span-2", style: { backgroundColor: '#f0fff4' }, children: [" ", _jsxs("h3", { className: "text-lg font-semibold text-gray-800 mb-4", children: ["Review Preview - ", previewMode === 'pre-publication' ? 'Pre-Publication' : 'Post-Publication', " Mode"] }), (currentRating > 0 || publicHeadline || quickTake || publicReview) ? (_jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [currentRating > 0 && (_jsxs("div", { className: "flex items-center gap-1 mb-2", children: [[1, 2, 3, 4, 5].map((star) => (_jsx(Star, { className: `w-5 h-5 ${star <= currentRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}` }, star))), _jsxs("span", { className: "ml-2 text-sm text-gray-600", children: [currentRating, "/5"] })] })), publicHeadline && (_jsx("h4", { className: "font-semibold text-lg text-gray-800 mb-2", children: publicHeadline })), selectedHighlights.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: selectedHighlights.map(highlightId => {
                                            const highlight = highlightOptions.find(h => h.id === highlightId);
                                            return (_jsx("span", { className: "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs", children: highlight?.label }, highlightId));
                                        }) })), quickTake && (_jsxs("p", { className: "text-gray-700 mb-3 italic", children: ["\"", quickTake, "\""] })), publicReview && (_jsx("p", { className: "text-gray-700 mb-3", children: publicReview })), allowSpoilers && spoilerContent && renderSpoilerContent(spoilerContent, 'main')] })) : (_jsx("p", { className: "text-gray-500 italic", children: "Fill out the form above to see your review preview..." }))] }), _jsxs("div", { className: "text-center col-span-2", children: [" ", _jsxs(Button, { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 mx-auto", children: [_jsx(Send, { className: "w-5 h-5" }), "Submit Beta Reader Feedback"] })] })] })] }));
};
export default BetaFeedbackForm;
//# sourceMappingURL=BetaFeedbackForm.js.map