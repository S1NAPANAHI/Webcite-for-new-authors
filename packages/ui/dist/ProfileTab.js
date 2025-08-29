import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../../packages/shared/src/supabaseClient.js';
export const ProfileTab = ({ userProfile, onProfileUpdate }) => {
    const [displayName, setDisplayName] = useState(userProfile.display_name || '');
    const [bio, setBio] = useState(userProfile.bio || '');
    const [location, setLocation] = useState(userProfile.location || '');
    const [favoriteGenre, setFavoriteGenre] = useState(userProfile.favorite_genre || '');
    const [readingGoal, setReadingGoal] = useState(userProfile.reading_goal || 0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setDisplayName(userProfile.display_name || '');
        setBio(userProfile.bio || '');
        setLocation(userProfile.location || '');
        setFavoriteGenre(userProfile.favorite_genre || '');
        setReadingGoal(userProfile.reading_goal || 0);
    }, [userProfile]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const updates = {
            display_name: displayName,
            bio,
            location,
            favorite_genre: favoriteGenre,
            reading_goal: readingGoal,
            updated_at: new Date().toISOString(),
        };
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userProfile.id);
        if (error) {
            console.error('Error updating profile:', error.message);
            alert('Error updating profile!');
        }
        else {
            alert('Profile updated successfully!');
            onProfileUpdate({ ...userProfile, ...updates }); // Update parent state
        }
        setLoading(false);
    };
    return (_jsxs("div", { children: [_jsx("h2", { className: "section-title text-2xl font-semibold text-secondary mb-4 border-b-2 border-primary-dark pb-2", children: "Edit Profile" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "block text-text-light text-sm font-bold mb-2", children: "Username" }), _jsx("input", { type: "text", className: "w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light", value: userProfile.username, readOnly: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "block text-text-light text-sm font-bold mb-2", children: "Display Name" }), _jsx("input", { type: "text", className: "w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light", value: displayName, onChange: (e) => setDisplayName(e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "block text-text-light text-sm font-bold mb-2", children: "Email" }), _jsx("input", { type: "email", className: "w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light", value: userProfile.email || 'N/A', readOnly: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "block text-text-light text-sm font-bold mb-2", children: "Location" }), _jsx("input", { type: "text", className: "w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light", value: location, onChange: (e) => setLocation(e.target.value) })] })] }), _jsxs("div", { className: "form-group mb-4", children: [_jsx("label", { className: "block text-text-light text-sm font-bold mb-2", children: "Bio" }), _jsx("textarea", { className: "w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light h-24 resize-y", value: bio, onChange: (e) => setBio(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "block text-text-light text-sm font-bold mb-2", children: "Favorite Genre" }), _jsx("input", { type: "text", className: "w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light", value: favoriteGenre, onChange: (e) => setFavoriteGenre(e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "block text-text-light text-sm font-bold mb-2", children: "Reading Goal (Books/Year)" }), _jsx("input", { type: "number", className: "w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light", value: readingGoal, onChange: (e) => setReadingGoal(parseInt(e.target.value)) })] })] }), _jsx("button", { type: "submit", className: "bg-secondary hover:bg-secondary-dark text-background-dark font-bold py-2 px-4 rounded-md transition-colors duration-300", disabled: loading, children: loading ? 'Saving...' : 'Save Changes' })] })] }));
};
export default ProfileTab;
//# sourceMappingURL=ProfileTab.js.map