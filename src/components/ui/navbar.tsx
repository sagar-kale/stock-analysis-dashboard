"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Home, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
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
    </>
  );
};
