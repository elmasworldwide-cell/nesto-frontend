import { useState, useEffect } from 'react';
import { getRooms } from '../services/roomService';
import { Property } from '../types';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    getRooms()
      .then((res) => {
        setRooms(res.data || []);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { rooms, loading, error };
};
