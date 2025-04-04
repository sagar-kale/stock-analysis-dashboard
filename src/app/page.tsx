'use client';

import Link from "next/link";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function ClientPage() {
  const { recommendations, loading, error } = useRecommendations();
  const [latestMonth, setLatestMonth] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations) {
      // Get all unique months from both stock and mutual fund picks
      const stockMonths = Object.keys(recommendations.monthly_stock_picks || {});
      const mfMonths = Object.keys(recommendations.monthly_mf_picks || {});
      const allMonths = [...new Set([...stockMonths, ...mfMonths])];
      
      // Sort months in descending order (newest first)
      const sortedMonths = allMonths.sort((a, b) => b.localeCompare(a));
      
      // Set the latest month
      if (sortedMonths.length > 0) {
        setLatestMonth(sortedMonths[0]);
      }
    }
  }, [recommendations]);

  return (
    <main className="flex min-h-screen flex-col p-6 md:p-24">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold text-center mb-2">Indian Investment Advisor</h1>
        <p className="text-xl text-center text-muted-foreground mb-6">
          Get monthly recommendations for the best Indian stocks and mutual funds
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stocks">Top Stocks</TabsTrigger>
          <TabsTrigger value="mutual-funds">Top Mutual Funds</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Picks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Analysis Dashboard</CardTitle>
              <CardDescription>
                Comprehensive analysis of Indian stocks and mutual funds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This dashboard provides data-driven investment recommendations based on 
                historical performance analysis of Indian stocks and mutual funds. Our 
                analysis includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Historical performance metrics (returns, volatility, Sharpe ratio)</li>
                <li>Risk assessment and drawdown analysis</li>
                <li>Monthly performance tracking</li>
                <li>Ranking based on multiple performance criteria</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Stock Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analysis of 50 NIFTY stocks with performance metrics and rankings
                    </p>
                    <Link href="/stocks">
                      <Button>View Stock Analysis</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Mutual Fund Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analysis of top Indian mutual funds across different categories
                    </p>
                    <Link href="/mutual-funds">
                      <Button>View Mutual Fund Analysis</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Download our detailed analysis reports:
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <a href="/data/stock_performance_charts.pdf" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">Stock Performance Charts</Button>
                  </a>
                  <a href="/data/mutual_fund_performance_charts.pdf" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">Mutual Fund Performance Charts</Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stocks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Indian Stocks</CardTitle>
              <CardDescription>
                Based on annualized returns, volatility, and risk-adjusted performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-500">Error loading stock data</p>
              ) : (
                <div className="space-y-4">
                  {recommendations?.top_stocks.slice(0, 5).map((stock, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{stock}</h3>
                        <p className="text-sm text-muted-foreground">
                          {index < 3 ? "Strong Buy" : "Buy"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Link href="/stocks">
                      <Button>View All Stocks</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mutual-funds" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Indian Mutual Funds</CardTitle>
              <CardDescription>
                Based on annualized returns, volatility, and risk-adjusted performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-500">Error loading mutual fund data</p>
              ) : (
                <div className="space-y-4">
                  {recommendations?.top_mutual_funds.slice(0, 5).map((fund, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{fund}</h3>
                        <p className="text-sm text-muted-foreground">
                          {index < 3 ? "Strong Buy" : "Buy"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Link href="/mutual-funds">
                      <Button>View All Mutual Funds</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Investment Recommendations</CardTitle>
              <CardDescription>
                Top picks for each month based on recent performance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Stock Picks</h3>
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Mutual Fund Picks</h3>
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : error ? (
                <p className="text-red-500">Error loading monthly recommendations</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {latestMonth ? `Stock Picks for ${latestMonth}` : "Stock Picks"}
                    </h3>
                    <div className="space-y-4">
                      {latestMonth && recommendations?.monthly_stock_picks[latestMonth]?.slice(0, 3).map((stock, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{stock}</h3>
                            <p className="text-sm text-muted-foreground">
                              {index === 0 ? "Top Pick" : `Rank #${index + 1}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {latestMonth ? `Mutual Fund Picks for ${latestMonth}` : "Mutual Fund Picks"}
                    </h3>
                    <div className="space-y-4">
                      {latestMonth && recommendations?.monthly_mf_picks[latestMonth]?.slice(0, 3).map((fund, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{fund}</h3>
                            <p className="text-sm text-muted-foreground">
                              {index === 0 ? "Top Pick" : `Rank #${index + 1}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-8 text-center">
                <Link href="/monthly">
                  <Button>View All Monthly Recommendations</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>© 2025 Indian Investment Advisor. All data is for informational purposes only.</p>
        <p className="mt-1">
          Data sourced from historical analysis of NIFTY 50 stocks and top Indian mutual funds.
        </p>
      </footer>
    </main>
  );
}
