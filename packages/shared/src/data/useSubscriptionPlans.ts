import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Tables } from '../database.types';

type SubscriptionPlan = Tables<'subscription_plans'>;

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) {
        throw error;
      }
      setPlans(data || []);
    } catch (err: any) {
      console.error('Error fetching subscription plans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error };
};