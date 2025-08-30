"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const supabaseClient_1 = require("./supabaseClient");
const getProfile = async (userId) => {
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('profiles')
            .select('*, user_stats(*)') // Select all from profiles and join user_stats
            .eq('id', userId)
            .maybeSingle();
        if (error)
            throw error;
        // Flatten the user_stats object into the UserProfile
        return data;
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
exports.getProfile = getProfile;
