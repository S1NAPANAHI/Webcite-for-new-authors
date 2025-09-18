import axios from 'axios';
import { supabase } from './supabase'; // Assuming supabase client is exported from here

axios.interceptors.request.use(async (config) => {
  // Only attach token for requests to our backend API
  if (config.url && config.url.startsWith('/api')) {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;
