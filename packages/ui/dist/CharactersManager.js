import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { Plus, Edit3, Trash2, Search, } from 'lucide-react';
// --- Supabase Data Functions ---
const fetchCharacters = async () => {
    const { data, error } = await supabase.from('characters').select('*').order('created_at', { ascending: true });
    if (error)
        throw new Error(error.message);
    return data;
};
const createCharacter = async (newCharacter) => {
    const { data, error } = await supabase.from('characters').insert(newCharacter).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const updateCharacter = async (updatedCharacter) => {
    const { id, ...updates } = updatedCharacter; // Exclude id from update payload
    const { data, error } = await supabase.from('characters').update(updates).eq('id', id).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
const deleteCharacter = async (id) => {
    const { error } = await supabase.from('characters').delete().eq('id', id);
    if (error)
        throw new Error(error.message);
};
// --- Character Editor Component ---
export const CharacterEditor = ({ character, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: character?.name || '',
        title: character?.title || '',
        description: character?.description || '',
        traits: character?.traits.join(', ') || '',
        image_url: character?.image_url || '',
        silhouette_url: character?.silhouette_url || '',
    });
    const handleSubmit = () => {
        const characterData = {
            ...formData,
            traits: formData.traits.split(',').map((trait) => trait.trim()).filter((trait) => trait !== ''),
        };
        onSave({ ...character, ...characterData, id: character?.id });
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6 mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: character ? 'Edit Character' : 'Create New Character' }), _jsxs("form", { onSubmit: (e) => { e.preventDefault(); handleSubmit(); }, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Name" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Title" }), _jsx("input", { type: "text", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Traits (comma-separated)" }), _jsx("input", { type: "text", value: formData.traits, onChange: (e) => setFormData({ ...formData, traits: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Image URL" }), _jsx("input", { type: "url", value: formData.image_url, onChange: (e) => setFormData({ ...formData, image_url: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Silhouette URL (Optional)" }), _jsx("input", { type: "url", value: formData.silhouette_url, onChange: (e) => setFormData({ ...formData, silhouette_url: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", className: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors", children: "Save Character" }), _jsx("button", { type: "button", onClick: onCancel, className: "bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors", children: "Cancel" })] })] })] }));
};
// --- Characters Management Component ---
export const CharactersManager = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: characters, isLoading, isError, error } = useQuery({ queryKey: ['characters'], queryFn: fetchCharacters });
    const createMutation = useMutation({
        mutationFn: createCharacter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['characters'] });
            setIsEditing(false);
            setEditingCharacter(null);
        },
    });
    const updateMutation = useMutation({
        mutationFn: updateCharacter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['characters'] });
            setIsEditing(false);
            setEditingCharacter(null);
        },
    });
    const deleteMutation = useMutation({
        mutationFn: deleteCharacter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['characters'] });
        },
    });
    const handleSaveCharacter = (characterData) => {
        if (editingCharacter) {
            updateMutation.mutate(characterData);
        }
        else {
            createMutation.mutate(characterData);
        }
    };
    const handleDeleteCharacter = (id) => {
        if (window.confirm('Are you sure you want to delete this character?')) {
            deleteMutation.mutate(id);
        }
    };
    const filteredCharacters = characters?.filter(character => {
        return character.name.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];
    if (isLoading)
        return _jsx("div", { children: "Loading characters..." });
    if (isError)
        return _jsxs("div", { children: ["Error loading characters: ", error?.message] });
    return (_jsx("div", { className: "space-y-6", children: isEditing ? (_jsx(CharacterEditor, { character: editingCharacter, onSave: handleSaveCharacter, onCancel: () => {
                setIsEditing(false);
                setEditingCharacter(null);
            } })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Characters" }), _jsxs("button", { onClick: () => {
                                setEditingCharacter(null);
                                setIsEditing(true);
                            }, className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Character"] })] }), _jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm border mb-6", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search characters...", className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Name" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Title" }), _jsx("th", { className: "text-left py-3 px-6 text-sm font-medium text-gray-900", children: "Traits" }), _jsx("th", { className: "text-right py-3 px-6 text-sm font-medium text-gray-900", children: "Actions" })] }) }), _jsx("tbody", { children: filteredCharacters.map((character) => (_jsxs("tr", { className: "border-b border-gray-200 hover:bg-gray-50", children: [_jsx("td", { className: "py-4 px-6", children: _jsx("div", { className: "font-medium text-gray-900", children: character.name }) }), _jsx("td", { className: "py-4 px-6 text-sm text-gray-500", children: character.title }), _jsx("td", { className: "py-4 px-6 text-sm text-gray-500", children: character.traits.join(', ') }), _jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => {
                                                            setEditingCharacter(character);
                                                            setIsEditing(true);
                                                        }, className: "p-1 text-gray-500 hover:text-blue-600", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteCharacter(character.id), className: "p-1 text-gray-500 hover:text-red-600", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, character.id))) })] }) })] })) }));
};
//# sourceMappingURL=CharactersManager.js.map