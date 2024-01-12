# import yfinance as yf
# from flask import Flask, request, jsonify

# app = Flask(__name__)

# @app.route('/get_stock_price', methods=['POST'])
# def get_stock_price():
#     symbol = request.json.get('symbol')

#     if not symbol:
#         return jsonify(error='Symbol not provided'), 400

#     try:
#         stock = yf.Ticker(symbol)
#         current_price = stock.info.get('currentPrice')
#         return jsonify(symbol=symbol, current_price=current_price)
#     except Exception as e:
#         return jsonify(error=str(e)), 500

# if __name__ == '__main__':
#     app.run(port=3001)

# from nsetools import Nse

# nse = Nse()

# # Get all stock codes and their corresponding company names
# all_stock_codes = nse.get_stock_codes()

# # Display the stock codes and names
# for code, name in all_stock_codes.items():
#     print(f"{code}: {name}")
# from nsetools import Nse

# def search_stock(keyword):
#     nse = Nse()

#     # Get all stock codes and their corresponding company names
#     all_stock_codes = nse.get_stock_codes()

#     # Search for the keyword in stock names
#     matching_stocks = [(code, name) for code, name in all_stock_codes.items() if keyword.lower() in name.lower()]

#     return matching_stocks

# # Example: Search for stocks with the keyword "ITC"
# keyword = "ITC"
# result = search_stock(keyword)

# if result:
#     print(f"Matching stocks for '{keyword}':")
#     for code, name in result:
#         print(f"{code}: {name}")
# else:
#     print(f"No matching stocks found for '{keyword}'")
print("hello")