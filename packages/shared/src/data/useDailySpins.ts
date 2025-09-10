import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

import { useAuth } from '../AuthContext';



export const useDailySpins = () => {
  const { user } = useAuth();
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpins = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        setSpinsLeft(0);
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('daily_spins')
        .select('*')
        .eq('user_id', user.id)
        .eq('spin_date', today)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching daily spins:', error);
        setError(error.message);
        setSpinsLeft(0);
      } else if (data) {
        setSpinsLeft(3 - data.spin_count);
      } else {
        setSpinsLeft(3);
        // Create a new entry for today if it doesn't exist
        const { error: insertError } = await supabase
          .from('daily_spins')
          .insert({ user_id: user.id, spin_date: today, spin_count: 0 });
        if (insertError) {
          console.error('Error inserting new daily spin entry:', insertError);
          setError(insertError.message);
        }
      }
      setLoading(false);
    };

    fetchSpins();
  }, [user]);

  const updateSpinCount = async (newSpinCount: number) => {
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase
      .from('daily_spins')
      .upsert({ user_id: user.id, spin_date: today, spin_count: newSpinCount }, { onConflict: 'user_id, spin_date' });
    if (error) {
      console.error('Error updating daily spin count:', error);
      setError(error.message);
      return false;
    }
    setSpinsLeft(3 - newSpinCount);
    return true;
  };

  return { spinsLeft, loading, error, updateSpinCount };
};