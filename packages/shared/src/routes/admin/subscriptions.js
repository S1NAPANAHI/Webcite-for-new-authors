const express = require('express');
const router = express.Router();
const { supabase } = require('../../services/userService'); // Import supabase from userService

// Route to update or create a user subscription
router.post('/', async (req, res) => {
  const { userId, subscriptionType, subscriptionStatus, startDate, endDate } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Check if an existing active/trialing subscription exists for the user
    const { data: existingSubscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing']);

    if (fetchError) throw fetchError;

    if (existingSubscriptions && existingSubscriptions.length > 0) {
      // Update existing subscription
      const existingSub = existingSubscriptions[0];
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: subscriptionStatus,
          subscription_type: subscriptionType,
          current_period_start: startDate ? new Date(startDate).toISOString() : null,
          current_period_end: endDate ? new Date(endDate).toISOString() : null,
        })
        .eq('id', existingSub.id)
        .select(); // Use .select() to return the updated data

      if (error) throw error;
      return res.status(200).json({ message: 'Subscription updated successfully!', subscription: data[0] });
    } else {
      // Insert new subscription
      const { data, error } = await supabase.from('subscriptions').insert({
        user_id: userId,
        status: subscriptionStatus,
        subscription_type: subscriptionType,
        current_period_start: startDate ? new Date(startDate).toISOString() : null,
        current_period_end: endDate ? new Date(endDate).toISOString() : null,
      }).select(); // Use .select() to return the inserted data

      if (error) throw error;
      return res.status(201).json({ message: 'Subscription created successfully!', subscription: data[0] });
    }
  } catch (error) {
    console.error('Error managing subscription:', error.message);
    res.status(500).json({ message: error.message || 'An unexpected error occurred while managing subscription.' });
  }
});

module.exports = router;
