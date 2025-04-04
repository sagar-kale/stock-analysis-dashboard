'use client';

import { useRecommendations } from "@/hooks/useRecommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function MonthlyPage() {
  const { recommendations, loading, error } = useRecommendations();
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations) {
      // Get all unique months from both stock and mutual fund picks
      const stockMonths = Object.keys(recommendations.monthly_stock_picks || {});
      const mfMonths = Object.keys(recommendations.monthly_mf_picks || {});
      const allMonths = [...new Set([...stockMonths, ...mfMonths])];
      
      // Sort months in descending order (newest first)
      const sortedMonths = allMonths.sort((a, b) => b.localeCompare(a));
      setMonths(sortedMonths);
      
      // Set the latest month as selected
      if (sortedMonths.length > 0) {
        setSelectedMonth(sortedMonths[0]);
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
      <h1 className="text-3xl font-bold mb-8">Monthly Investment Recommendations</h1>
      
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : (
        <>
          {months.length > 0 ? (
            <>
              <Tabs 
                value={selectedMonth || months[0]} 
                onValueChange={setSelectedMonth}
                className="w-full mb-8"
              >
                <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full max-w-2xl">
                  {months.slice(0, 6).map((month) => (
                    <TabsTrigger key={month} value={month}>
                      {month}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {months.map((month) => (
                  <TabsContent key={month} value={month}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>Top Stock Picks for {month}</CardTitle>
                          <CardDescription>
                            Based on 3-month rolling performance
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {recommendations?.monthly_stock_picks[month]?.map((stock, index) => (
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
                            {(!recommendations?.monthly_stock_picks[month] || 
                              recommendations.monthly_stock_picks[month].length === 0) && (
                              <p className="text-muted-foreground">No stock picks available for this month.</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Top Mutual Fund Picks for {month}</CardTitle>
                          <CardDescription>
                            Based on 3-month rolling performance
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {recommendations?.monthly_mf_picks[month]?.map((fund, index) => (
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
                            {(!recommendations?.monthly_mf_picks[month] || 
                              recommendations.monthly_mf_picks[month].length === 0) && (
                              <p className="text-muted-foreground">No mutual fund picks available for this month.</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Strategy</CardTitle>
                  <CardDescription>
                    How to use these monthly recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      Our monthly recommendations are based on a comprehensive analysis of historical 
                      performance, including returns, volatility, and risk-adjusted metrics. Here's how 
                      to use these recommendations effectively:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Diversification:</strong> Consider investing across multiple recommended 
                        stocks and mutual funds rather than concentrating on a single pick.
                      </li>
                      <li>
                        <strong>Time Horizon:</strong> These recommendations are most suitable for 
                        investors with a medium to long-term investment horizon (1-3 years).
                      </li>
                      <li>
                        <strong>Regular Review:</strong> Check back monthly for updated recommendations 
                        based on the latest market performance.
                      </li>
                      <li>
                        <strong>Risk Assessment:</strong> Always consider your personal risk tolerance 
                        before making investment decisions.
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      Disclaimer: These recommendations are for informational purposes only and do not 
                      constitute financial advice. Past performance is not indicative of future results.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No monthly recommendations available. Please check back later.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
