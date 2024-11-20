from flask import Flask, jsonify
from flask_cors import CORS
from scrape import scrape_data as fetch_legislative_data

app = Flask(__name__)
CORS(app)

@app.route('/api/scrape', methods=['GET'])
def get_scraped_data():
    try:
        print("Starting scrape request...")
        data = fetch_legislative_data()
        print(f"Data fetched: {data}")
        return jsonify(data)
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 