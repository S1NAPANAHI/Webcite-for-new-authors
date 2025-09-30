import { useState, useEffect } from 'react';
import { Age, Book, TimelineEvent, fetchAges, fetchBooks, fetchEventsByAge } from '../../../lib/api-timeline';

export const useTimelineData = () => {
  const [ages, setAges] = useState<Age[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [agesData, booksData] = await Promise.all([
          fetchAges(),
          fetchBooks()
        ]);
        setAges(agesData);
        setBooks(booksData);
      } catch (err) {
        console.error('Failed to load timeline data:', err);
        setError('Failed to load timeline data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { ages, books, loading, error };
};

export const useEventsByAge = (ageId: number) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ageId) {
      setEvents([]);
      return;
    }

    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await fetchEventsByAge(ageId);
        setEvents(eventsData);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [ageId]);

  return { events, loading, error };
};
