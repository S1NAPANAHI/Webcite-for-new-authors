"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscription = void 0;
const supabaseClient_1 = require("./supabaseClient");
const getSubscription = async (userId) => {
    const { data, error } = await supabaseClient_1.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error) {
        console.error('Error fetching subscription:', error);
        return null;
    }
    return data;
};
exports.getSubscription = getSubscription;
