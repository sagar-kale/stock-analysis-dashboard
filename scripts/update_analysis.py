"""
Script to update stock and mutual fund analysis and generate new recommendations
"""
import os
import sys
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from datetime import datetime, timedelta
import requests
import time

# Add parent directory to path to import from data module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Constants
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
OUTPUT_DIR = os.path.join(DATA_DIR, 'analysis_results')
RECOMMENDATIONS_DIR = os.path.join(DATA_DIR)

# Ensure directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(RECOMMENDATIONS_DIR, exist_ok=True)

def fetch_stock_data(symbol, region='IN', interval='1mo', range='1y'):
    """
    Fetch stock data from Yahoo Finance API
    """
    print(f"Fetching data for stock: {symbol}")
    
    try:
        # In a real implementation, this would use the Yahoo Finance API
        # For this example, we'll simulate the API call
        
        # Simulate API delay
        time.sleep(0.5)
        
        # Generate simulated data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        date_range = pd.date_range(start=start_date, end=end_date, freq='M')
        
        # Create random price data with a slight upward trend
        initial_price = np.random.uniform(100, 1000)
        monthly_returns = np.random.normal(0.01, 0.05, len(date_range))  # Mean 1% monthly return
        
        prices = [initial_price]
        for ret in monthly_returns:
            prices.append(prices[-1] * (1 + ret))
        prices = prices[1:]  # Remove the initial seed price
        
        # Create DataFrame
        data = pd.DataFrame({
            'Date': date_range,
            'Open': prices,
            'High': [p * (1 + np.random.uniform(0, 0.03)) for p in prices],
            'Low': [p * (1 - np.random.uniform(0, 0.03)) for p in prices],
            'Close': [p * (1 + np.random.normal(0, 0.01)) for p in prices],
            'Volume': [np.random.randint(100000, 10000000) for _ in prices],
            'Adj Close': [p * (1 + np.random.normal(0, 0.005)) for p in prices]
        })
        
        data.set_index('Date', inplace=True)
        return data
    
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None

def fetch_mutual_fund_data(symbol, region='IN', interval='1mo', range='1y'):
    """
    Fetch mutual fund data (similar to stock data but with different parameters)
    """
    print(f"Fetching data for mutual fund: {symbol}")
    
    try:
        # In a real implementation, this would use the Yahoo Finance API or AMFI API
        # For this example, we'll simulate the API call
        
        # Simulate API delay
        time.sleep(0.5)
        
        # Generate simulated data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        date_range = pd.date_range(start=start_date, end=end_date, freq='M')
        
        # Create random NAV data with a slight upward trend
        initial_nav = np.random.uniform(10, 100)
        monthly_returns = np.random.normal(0.008, 0.03, len(date_range))  # Mean 0.8% monthly return
        
        navs = [initial_nav]
        for ret in monthly_returns:
            navs.append(navs[-1] * (1 + ret))
        navs = navs[1:]  # Remove the initial seed price
        
        # Create DataFrame
        data = pd.DataFrame({
            'Date': date_range,
            'NAV': navs,
            'Adj NAV': navs  # For mutual funds, NAV and Adj NAV are typically the same
        })
        
        data.set_index('Date', inplace=True)
        return data
    
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None

def calculate_metrics(returns_df):
    """
    Calculate performance metrics from returns DataFrame
    """
    metrics = pd.DataFrame(index=returns_df.columns)
    
    # Annualized return
    metrics['annualized_return'] = (1 + returns_df.mean()) ** 12 - 1
    
    # Volatility (annualized)
    metrics['volatility'] = returns_df.std() * np.sqrt(12)
    
    # Sharpe ratio (assuming risk-free rate of 3%)
    risk_free_rate = 0.03
    metrics['sharpe_ratio'] = (metrics['annualized_return'] - risk_free_rate) / metrics['volatility']
    
    # Maximum drawdown
    cum_returns = (1 + returns_df).cumprod()
    rolling_max = cum_returns.cummax()
    drawdowns = (cum_returns / rolling_max) - 1
    metrics['max_drawdown'] = drawdowns.min()
    
    # Win rate (percentage of months with positive returns)
    metrics['win_rate'] = (returns_df > 0).mean()
    
    return metrics

def rank_investments(metrics_df, weights=None):
    """
    Rank investments based on weighted criteria
    """
    if weights is None:
        # Default weights prioritize risk-adjusted returns
        weights = {
            'annualized_return': 0.35,
            'sharpe_ratio': 0.30,
            'max_drawdown': 0.15,
            'volatility': 0.10,
            'win_rate': 0.10
        }
    
    # Create a copy of the metrics DataFrame
    ranked_df = metrics_df.copy()
    
    # Normalize metrics to 0-1 scale
    for metric in weights.keys():
        if metric in ranked_df.columns:
            # For metrics where higher is better
            if metric in ['annualized_return', 'sharpe_ratio', 'win_rate']:
                min_val = ranked_df[metric].min()
                max_val = ranked_df[metric].max()
                if max_val > min_val:
                    ranked_df[f'{metric}_norm'] = (ranked_df[metric] - min_val) / (max_val - min_val)
                else:
                    ranked_df[f'{metric}_norm'] = 0
            # For metrics where lower is better
            else:
                min_val = ranked_df[metric].min()
                max_val = ranked_df[metric].max()
                if max_val > min_val:
                    ranked_df[f'{metric}_norm'] = 1 - ((ranked_df[metric] - min_val) / (max_val - min_val))
                else:
                    ranked_df[f'{metric}_norm'] = 0
    
    # Calculate weighted score
    ranked_df['score'] = 0
    for metric, weight in weights.items():
        if f'{metric}_norm' in ranked_df.columns:
            ranked_df['score'] += ranked_df[f'{metric}_norm'] * weight
    
    # Sort by score
    ranked_df = ranked_df.sort_values('score', ascending=False)
    
    return ranked_df

def identify_monthly_picks(returns_df, metrics_df, top_n=5):
    """
    Identify best investments for each month based on recent performance
    """
    monthly_picks = {}
    
    # Get list of months in the returns data
    months = returns_df.index.unique()
    
    # For each month, calculate 3-month rolling performance
    for i in range(len(months) - 3):
        month = months[i + 3]
        month_str = month.strftime('%Y-%m')
        
        # Get 3-month window
        window_start = i
        window_end = i + 3
        window_months = months[window_start:window_end]
        
        # Calculate performance over the window
        window_returns = returns_df.loc[window_months]
        
        # Calculate cumulative returns for the window
        cumulative_returns = (1 + window_returns).prod() - 1
        
        # Sort by cumulative returns
        sorted_returns = cumulative_returns.sort_values(ascending=False)
        
        # Get top N performers that are also in the top half of overall metrics
        top_half_metrics = metrics_df.index[:len(metrics_df) // 2]
        top_performers = [name for name in sorted_returns.index if name in top_half_metrics]
        
        # Select top N
        monthly_picks[month_str] = top_performers[:top_n]
    
    # Add prediction for next month
    next_month = (months[-1] + pd.DateOffset(months=1)).strftime('%Y-%m')
    
    # Use the most recent 3 months to predict next month
    recent_months = months[-3:]
    recent_returns = returns_df.loc[recent_months]
    cumulative_returns = (1 + recent_returns).prod() - 1
    sorted_returns = cumulative_returns.sort_values(ascending=False)
    
    # Get top N performers that are also in the top half of overall metrics
    top_half_metrics = metrics_df.index[:len(metrics_df) // 2]
    top_performers = [name for name in sorted_returns.index if name in top_half_metrics]
    
    # Select top N for next month prediction
    monthly_picks[next_month] = top_performers[:top_n]
    
    return monthly_picks

def create_recommendations(stock_metrics, stock_returns, mf_metrics, mf_returns):
    """
    Create monthly investment recommendations
    """
    # Rank stocks and mutual funds
    ranked_stocks = rank_investments(stock_metrics)
    ranked_mf = rank_investments(mf_metrics)
    
    # Identify monthly picks
    stock_picks = identify_monthly_picks(stock_returns, ranked_stocks)
    mf_picks = identify_monthly_picks(mf_returns, ranked_mf)
    
    # Create recommendations dictionary
    recommendations = {
        'top_stocks': ranked_stocks.index[:10].tolist(),
        'top_mutual_funds': ranked_mf.index[:10].tolist(),
        'monthly_stock_picks': stock_picks,
        'monthly_mf_picks': mf_picks
    }
    
    return recommendations

def update_analysis():
    """
    Main function to update analysis and generate new recommendations
    """
    print("Starting analysis update...")
    
    # 1. Load stock and mutual fund lists
    try:
        with open(os.path.join(DATA_DIR, 'nifty50_stocks.json'), 'r') as f:
            stock_list = json.load(f)
        
        with open(os.path.join(DATA_DIR, 'mutual_funds.json'), 'r') as f:
            mf_list = json.load(f)
    except FileNotFoundError:
        # If files don't exist, create sample lists
        stock_list = [
            "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "HINDUNILVR.NS",
            "ICICIBANK.NS", "KOTAKBANK.NS", "ITC.NS", "SBIN.NS", "BAJFINANCE.NS",
            "BHARTIARTL.NS", "ASIANPAINT.NS", "AXISBANK.NS", "MARUTI.NS", "TITAN.NS",
            "SUNPHARMA.NS", "ULTRACEMCO.NS", "BAJAJFINSV.NS", "WIPRO.NS", "HCLTECH.NS",
            "ADANIENT.NS", "TATAMOTORS.NS", "POWERGRID.NS", "NTPC.NS", "TATASTEEL.NS",
            "TECHM.NS", "NESTLEIND.NS", "GRASIM.NS", "JSWSTEEL.NS", "ADANIPORTS.NS",
            "INDUSINDBK.NS", "ONGC.NS", "HINDALCO.NS", "DRREDDY.NS", "CIPLA.NS",
            "EICHERMOT.NS", "DIVISLAB.NS", "COALINDIA.NS", "SBILIFE.NS", "BRITANNIA.NS",
            "HEROMOTOCO.NS", "BAJAJ-AUTO.NS", "TATACONSUM.NS", "APOLLOHOSP.NS", "LTIM.NS",
            "UPL.NS", "BPCL.NS", "HDFCLIFE.NS", "M&M.NS", "SHREECEM.NS"
        ]
        
        mf_list = [
            "Axis Bluechip Fund", "Mirae Asset Large Cap Fund", "Parag Parikh Flexi Cap Fund",
            "SBI Small Cap Fund", "Kotak Emerging Equity Fund", "Axis Midcap Fund",
            "HDFC Mid-Cap Opportunities Fund", "Nippon India Small Cap Fund",
            "Canara Robeco Emerging Equities Fund", "Tata Digital India Fund",
            "ICICI Prudential Technology Fund", "SBI Healthcare Opportunities Fund",
            "Aditya Birla Sun Life Digital India Fund", "DSP Healthcare Fund",
            "Kotak Pioneer Fund", "Axis ESG Equity Fund", "SBI Balanced Advantage Fund",
            "ICICI Prudential Balanced Advantage Fund", "Edelweiss Balanced Advantage Fund",
            "Taurus Largecap Equity Fund", "Quant Active Fund"
        ]
        
        # Save the lists
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(os.path.join(DATA_DIR, 'nifty50_stocks.json'), 'w') as f:
            json.dump(stock_list, f)
        
        with open(os.path.join(DATA_DIR, 'mutual_funds.json'), 'w') as f:
            json.dump(mf_list, f)
    
    # 2. Fetch updated data
    stock_data = {}
    for symbol in stock_list:
        data = fetch_stock_data(symbol)
        if data is not None:
            stock_data[symbol] = data
    
    mf_data = {}
    for fund in mf_list:
        data = fetch_mutual_fund_data(fund)
        if data is not None:
            mf_data[fund] = data
    
    # 3. Calculate monthly returns
    stock_monthly_returns = pd.DataFrame()
    for symbol, data in stock_data.items():
        if 'Adj Close' in data.columns:
            monthly_returns = data['Adj Close'].pct_change().dropna()
            stock_monthly_returns[symbol] = monthly_returns
    
    mf_monthly_returns = pd.DataFrame()
    for fund, data in mf_data.items():
        if 'Adj NAV' in data.columns:
            monthly_returns = data['Adj NAV'].pct_change().dropna()
            mf_monthly_returns[fund] = monthly_returns
    
    # 4. Calculate performance metrics
    stock_metrics = calculate_metrics(stock_monthly_returns)
    mf_metrics = calculate_metrics(mf_monthly_returns)
    
    # 5. Create recommendations
    recommendations = create_recommendations(stock_metrics, stock_monthly_returns, mf_metrics, mf_monthly_returns)
    
    # 6. Save results
    stock_monthly_returns.to_csv(os.path.join(OUTPUT_DIR, 'stock_monthly_returns.csv'))
    mf_monthly_returns.to_csv(os.path.join(OUTPUT_DIR, 'mutual_fund_monthly_returns.csv'))
    stock_metrics.to_csv(os.path.join(OUTPUT_DIR, 'stock_metrics.csv'))
    mf_metrics.to_csv(os.path.join(OUTPUT_DIR, 'mutual_fund_metrics.csv'))
    
    # Save new recommendations to a temporary file
    with open(os.path.join(RECOMMENDATIONS_DIR, 'new_recommendations.json'), 'w') as f:
        json.dump(recommendations, f, indent=2)
    
    print("Analysis update completed successfully!")
    return recommendations

if __name__ == "__main__":
    update_analysis()
