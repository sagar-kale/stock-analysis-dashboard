"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRecommendations } from '@/hooks/useRecommendations';
import Link from 'next/link';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';

export default function StocksPage() {
  const { data, lastUpdated, isLoading, error } = useRecommendations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading stock recommendations...</h2>
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
          <h1 className="text-3xl font-bold">Top Performing Stocks</h1>
        </div>
        
        {lastUpdated && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Top 10 NIFTY 50 Stocks</CardTitle>
            <CardDescription>Based on performance metrics including returns, volatility, and risk-adjusted performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.top_stocks?.map((stock, index) => (
                <div key={stock} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <span className="font-medium">{stock}</span>
                  </div>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Performance Analysis</h3>
              <p className="mb-2">These stocks have been selected based on a comprehensive analysis of:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Historical returns over the past year</li>
                <li>Volatility and risk metrics</li>
                <li>Sharpe ratio (risk-adjusted performance)</li>
                <li>Maximum drawdown</li>
                <li>Win rate (percentage of months with positive returns)</li>
              </ul>
              <p>The ranking algorithm weighs these factors to identify stocks with the best combination of returns and risk characteristics.</p>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/mutual-funds">View Top Mutual Funds</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/monthly">View Monthly Picks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
