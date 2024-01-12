# import yfinance as yf
# import pandas as pd

# # Define the stock symbol, start date, and end date
# symbol = 'TCS.BO'  # Use the stock symbol with the appropriate exchange code (e.g., .BO for BSE)
# start_date = '2022-01-01'
# end_date = '2022-12-31'

# # Fetch historical stock data
# stock_data = yf.download(symbol, start=start_date, end=end_date)

# # Display the fetched data
# print(stock_data)


# import yfinance as yf

# # Define the stock symbol
# symbol = 'TCS.BO'  # Use the stock symbol with the appropriate exchange code (e.g., .BO for BSE)

# # Fetch current stock data
# current_stock_data = yf.Ticker(symbol).info

# # Display the fetched data
# print(current_stock_data)


# the latst was working
# ((((((((((((((()))))))))))))))
# import yfinance as yf

# # Define the stock symbol
# symbol = 'TCS.BO'  # Use the stock symbol with the appropriate exchange code (e.g., .BO for BSE)

# # Fetch current stock data
# current_stock_data = yf.Ticker(symbol).info

# # Print all available keys and their values
# for key, value in current_stock_data.items():
#     print(f"{key}: {value}")

# # Extract relevant information if available
# stock_name = current_stock_data.get('longName', 'N/A')
# stock_price = current_stock_data.get('currentPrice', 'N/A')

# # Display the information
# print(f"Stock Name: {stock_name}")
# print(f"Current Stock Price: {stock_price} INR")

# trying to coonect****************
import yfinance as yf
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/get_stock_price', methods=['POST'])
def get_stock_price():
    symbol = request.json.get('symbol')

    if not symbol:
        return jsonify(error='Symbol not provided'), 400

    try:
        stock = yf.Ticker(symbol)
        current_price = stock.info.get('currentPrice')
        return jsonify(symbol=symbol, current_price=current_price)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(port=3001)
