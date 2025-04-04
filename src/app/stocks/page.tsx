'use client';

import { useRecommendations } from "@/hooks/useRecommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function StocksPage() {
  const { recommendations, loading, error } = useRecommendations();
  const [latestMonth, setLatestMonth] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations && recommendations.monthly_stock_picks) {
      const months = Object.keys(recommendations.monthly_stock_picks);
      if (months.length > 0) {
        // Sort months in descending order (newest first)
        const sortedMonths = months.sort((a, b) => b.localeCompare(a));
        setLatestMonth(sortedMonths[0]);
      }
    }
  }, [recommendations]);

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Top Indian Stocks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Stocks Overall</CardTitle>
            <CardDescription>
              Based on annualized returns, volatility, and risk-adjusted performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations?.top_stocks.map((stock, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{stock}</h3>
                      <p className="text-sm text-muted-foreground">
                        {index < 3 ? "Strong Buy" : index < 7 ? "Buy" : "Hold"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {latestMonth ? `Top Stock Picks for ${latestMonth}` : "Monthly Stock Picks"}
            </CardTitle>
            <CardDescription>
              Based on recent performance trends
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
            ) : (
              <div className="space-y-4">
                {latestMonth && recommendations?.monthly_stock_picks[latestMonth]?.map((stock, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{stock}</h3>
                      <p className="text-sm text-muted-foreground">
                        Recommended for {latestMonth}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Analyzed Stocks</CardTitle>
          <CardDescription>
            Complete list of analyzed NIFTY 50 stocks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-wrap gap-2">
              {Array(50).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recommendations?.top_stocks.map((stock, index) => (
                <Badge key={index} variant={index < 10 ? "default" : "outline"}>
                  {stock}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
