"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRecommendations } from '@/hooks/useRecommendations';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';

export default function MonthlyPage() {
  const { data, lastUpdated, isLoading, error } = useRecommendations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading monthly recommendations...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Get all months from both stock and mutual fund picks
  const allMonths = new Set([
    ...Object.keys(data?.monthly_stock_picks || {}),
    ...Object.keys(data?.monthly_mf_picks || {})
  ]);

  // Sort months in descending order (newest first)
  const sortedMonths = Array.from(allMonths).sort().reverse();

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-24">
      {/* Mobile Navigation Bar */}
      <Navbar />
      
      {/* Main Content - with padding top on mobile for the fixed navbar */}
      <div className="mt-16 md:mt-0">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link href="/"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold">Monthly Investment Recommendations</h1>
        </div>
        
        {lastUpdated && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}

        <div className="space-y-6">
          {sortedMonths.map(month => (
            <Card key={month}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {new Date(month + "-01").toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </CardTitle>
                <CardDescription>Top investment picks for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Stocks</h3>
                    {data?.monthly_stock_picks?.[month]?.length > 0 ? (
                      <ul className="space-y-2">
                        {data.monthly_stock_picks[month].map((stock, index) => (
                          <li key={stock} className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center">
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                              {index + 1}
                            </span>
                            {stock}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No stock recommendations for this month</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Mutual Funds</h3>
                    {data?.monthly_mf_picks?.[month]?.length > 0 ? (
                      <ul className="space-y-2">
                        {data.monthly_mf_picks[month].map((fund, index) => (
                          <li key={fund} className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center">
                            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">
                              {index + 1}
                            </span>
                            {fund}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No mutual fund recommendations for this month</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/stocks">View Top Stocks</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/mutual-funds">View Top Mutual Funds</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
