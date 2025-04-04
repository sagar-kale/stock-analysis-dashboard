import { useEffect, useState } from 'react';

type Recommendations = {
  top_stocks: string[];
  top_mutual_funds: string[];
  monthly_stock_picks: Record<string, string[]>;
  monthly_mf_picks: Record<string, string[]>;
};

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch('/data/recommendations.json');
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  return { recommendations, loading, error };
}
