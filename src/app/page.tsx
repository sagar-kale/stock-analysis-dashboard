"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRecommendations } from '@/hooks/useRecommendations';
import Link from 'next/link';
import { Menu, Home, ArrowRight, BarChart3 } from 'lucide-react';

export default function Home() {
  const { data, lastUpdated, isLoading, error } = useRecommendations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading investment recommendations...</h2>
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
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md p-4 z-50 md:hidden flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Home className="h-5 w-5 mr-2" />
          <span className="font-bold">Home</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed top-14 left-0 right-0 bg-white dark:bg-gray-800 shadow-md p-4 z-40 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link href="/" className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Home className="h-5 w-5 mr-2" />
              <span>Home</span>
            </Link>
            <Link href="/stocks" className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <BarChart3 className="h-5 w-5 mr-2" />
              <span>Stocks</span>
            </Link>
            <Link href="/mutual-funds" className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <BarChart3 className="h-5 w-5 mr-2" />
              <span>Mutual Funds</span>
            </Link>
            <Link href="/monthly" className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <BarChart3 className="h-5 w-5 mr-2" />
              <span>Monthly Picks</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content - with padding top on mobile for the fixed navbar */}
      <div className="mt-16 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Indian Investment Advisor</h1>
        
        {lastUpdated && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stocks">Top Stocks</TabsTrigger>
            <TabsTrigger value="mutual-funds">Top Funds</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Picks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Stocks</CardTitle>
                  <CardDescription>Best NIFTY 50 stocks based on performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.top_stocks?.slice(0, 5).map((stock, index) => (
                    <div key={stock} className="flex justify-between items-center mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>{index + 1}. {stock}</span>
                    </div>
                  ))}
                  <Button asChild className="w-full mt-4">
                    <Link href="/stocks">View All Stocks <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Mutual Funds</CardTitle>
                  <CardDescription>Best mutual funds based on performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.top_mutual_funds?.slice(0, 5).map((fund, index) => (
                    <div key={fund} className="flex justify-between items-center mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>{index + 1}. {fund}</span>
                    </div>
                  ))}
                  <Button asChild className="w-full mt-4">
                    <Link href="/mutual-funds">View All Funds <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Monthly Investment Recommendations</CardTitle>
                <CardDescription>Best picks for each month based on recent performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/monthly">View Monthly Recommendations <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stocks">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Stocks</CardTitle>
                <CardDescription>Best performing NIFTY 50 stocks</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.top_stocks?.map((stock, index) => (
                  <div key={stock} className="flex justify-between items-center mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>{index + 1}. {stock}</span>
                  </div>
                ))}
                <Button asChild className="w-full mt-4">
                  <Link href="/stocks">View Detailed Analysis <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mutual-funds">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Mutual Funds</CardTitle>
                <CardDescription>Best performing mutual funds</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.top_mutual_funds?.map((fund, index) => (
                  <div key={fund} className="flex justify-between items-center mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>{index + 1}. {fund}</span>
                  </div>
                ))}
                <Button asChild className="w-full mt-4">
                  <Link href="/mutual-funds">View Detailed Analysis <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Investment Picks</CardTitle>
                <CardDescription>Best investments for each month</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/monthly">View Monthly Recommendations <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
