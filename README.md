# Indian Investment Advisor

A comprehensive web application that analyzes Indian stocks and mutual funds to provide monthly investment recommendations.

## Overview

This application analyzes historical performance data of NIFTY 50 stocks and top Indian mutual funds to identify the best investment opportunities. It provides:

- Top performing stocks and mutual funds based on multiple metrics
- Monthly investment recommendations
- Detailed performance analysis with metrics like returns, volatility, Sharpe ratio, etc.
- Interactive web interface to explore the recommendations

## Live Demo

The application is deployed and accessible at: [https://dqjpitou.manus.space](https://dqjpitou.manus.space)

## Features

- **Dashboard**: Overview of top performing stocks and mutual funds
- **Stock Analysis**: Detailed analysis of NIFTY 50 stocks with performance metrics
- **Mutual Fund Analysis**: Analysis of top Indian mutual funds across different categories
- **Monthly Recommendations**: Monthly investment picks based on recent performance

## Local Setup

### Prerequisites

- Node.js 20.x or later
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sagar-kale/stock-analysis-dashboard.git
   cd stock-analysis-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To build the application for production:

```bash
npm run build
# or
pnpm build
```

## Project Structure

- `src/app/` - Next.js pages and routes
  - `page.tsx` - Main dashboard page
  - `stocks/page.tsx` - Stock analysis page
  - `mutual-funds/page.tsx` - Mutual fund analysis page
  - `monthly/page.tsx` - Monthly recommendations page
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks
  - `useRecommendations.ts` - Hook to fetch recommendation data
- `public/data/` - Static data files
  - `recommendations.json` - Investment recommendations data
  - `stock_performance_charts.pdf` - Stock performance charts
  - `mutual_fund_performance_charts.pdf` - Mutual fund performance charts

## Data Analysis

The investment recommendations are based on a comprehensive analysis of historical data:

1. **Data Collection**: Historical data for NIFTY 50 stocks and top Indian mutual funds
2. **Performance Analysis**: Calculation of key metrics like returns, volatility, Sharpe ratio
3. **Ranking**: Ranking investments based on multiple weighted criteria
4. **Monthly Picks**: Identifying top performers for each month based on recent trends

## Technologies Used

- **Next.js**: React framework for building the web application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library for UI elements
- **Python**: Used for data analysis and generating recommendations
- **Pandas**: Data manipulation and analysis
- **Matplotlib**: Data visualization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Data sourced from Yahoo Finance API
- Analysis based on historical performance of Indian stocks and mutual funds
