'use client';

import { useRecommendations } from "@/hooks/useRecommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function MutualFundsPage() {
  const { recommendations, loading, error } = useRecommendations();
  const [latestMonth, setLatestMonth] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations && recommendations.monthly_mf_picks) {
      const months = Object.keys(recommendations.monthly_mf_picks);
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
      <h1 className="text-3xl font-bold mb-8">Top Indian Mutual Funds</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Mutual Funds Overall</CardTitle>
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
                {recommendations?.top_mutual_funds.map((fund, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{fund}</h3>
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
              {latestMonth ? `Top Mutual Fund Picks for ${latestMonth}` : "Monthly Mutual Fund Picks"}
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
                {latestMonth && recommendations?.monthly_mf_picks[latestMonth]?.map((fund, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{fund}</h3>
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
          <CardTitle>Fund Categories</CardTitle>
          <CardDescription>
            Mutual funds analyzed by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Equity Funds</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Large Cap</Badge>
                <Badge>Mid Cap</Badge>
                <Badge>Small Cap</Badge>
                <Badge>Flexi Cap</Badge>
                <Badge>Multi Cap</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Thematic Funds</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Infrastructure</Badge>
                <Badge>PSU</Badge>
                <Badge>Banking</Badge>
                <Badge>IT</Badge>
                <Badge>Pharma</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Hybrid Funds</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Equity & Debt</Badge>
                <Badge>Multi Asset</Badge>
                <Badge>Balanced</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Debt Funds</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Liquid</Badge>
                <Badge>Money Market</Badge>
                <Badge>Floating Rate</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
