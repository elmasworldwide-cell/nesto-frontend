import { useState, useEffect } from 'react';
import api from '../services/api';

export const useFetch = (url: string, params?: any) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    api.get(url, { params })
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [url, JSON.stringify(params)]);

  return { data, error, loading };
};
