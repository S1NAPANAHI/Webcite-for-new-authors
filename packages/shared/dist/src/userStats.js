"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.initializeUserStats = void 0;
const supabaseClient_1 = require("./supabaseClient");
const initializeUserStats = async (userId) => {
    const defaultStats = {
        books_read: 0,
        reading_hours: 0,
        achievements: 0,
        currently_reading: 'None',
    };
    const { data, error } = await supabaseClient_1.supabase
        .from('user_stats')
        .upsert({ user_id: userId, ...defaultStats }, { onConflict: 'user_id' })
        .select('*')
        .single();
    if (error) {
        console.error('Error initializing user stats:', error);
        throw error;
    }
    return data;
};
exports.initializeUserStats = initializeUserStats;
const getUserStats = async (userId) => {
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        // If no row exists yet, initialize it
        if (!data && (!error || error.code === 'PGRST116')) {
            return (0, exports.initializeUserStats)(userId);
        }
        if (error)
            throw error;
        return data;
    }
    catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};
exports.getUserStats = getUserStats;
