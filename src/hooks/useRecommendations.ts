import { useState, useEffect } from 'react';

// API URL - Change this to your deployed backend URL when available
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://indian-investment-advisor-backend.onrender.com';
const LOCAL_API_URL = 'http://localhost:3001';

// Fallback to static data if API is unavailable
const STATIC_DATA_PATH = '/data/recommendations.json';

export interface Recommendations {
  top_stocks: string[];
  top_mutual_funds: string[];
  monthly_stock_picks: Record<string, string[]>;
  monthly_mf_picks: Record<string, string[]>;
}

interface ApiResponse {
  lastUpdated: string;
  pendingApproval: boolean;
  recommendations: Recommendations;
}

export const useRecommendations = () => {
  const [data, setData] = useState<Recommendations | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch from the deployed API
        const response = await fetch(`${API_URL}/api/recommendations`);
        
        if (response.ok) {
          const apiData: ApiResponse = await response.json();
          setData(apiData.recommendations);
          setLastUpdated(apiData.lastUpdated);
          setIsLoading(false);
          return;
        }
        
        // If deployed API fails, try local API
        try {
          const localResponse = await fetch(`${LOCAL_API_URL}/api/recommendations`);
          
          if (localResponse.ok) {
            const localApiData: ApiResponse = await localResponse.json();
            setData(localApiData.recommendations);
            setLastUpdated(localApiData.lastUpdated);
            setIsLoading(false);
            return;
          }
        } catch (localError) {
          console.log('Local API unavailable, falling back to static data');
        }
        
        // If both APIs fail, fall back to static data
        const staticResponse = await fetch(STATIC_DATA_PATH);
        if (staticResponse.ok) {
          const staticData = await staticResponse.json();
          setData(staticData);
          setLastUpdated(new Date().toISOString()); // Use current time as fallback
          setIsLoading(false);
        } else {
          throw new Error('Failed to fetch recommendations from all sources');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return { data, lastUpdated, isLoading, error };
};
