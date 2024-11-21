from flask import Flask, jsonify, request
from flask_cors import CORS
from scrape import scrape_data as fetch_legislative_data

app = Flask(__name__)
CORS(app)

@app.route('/api/scrape', methods=['GET'])
def get_scraped_data():
    try:
        page = int(request.args.get('page', 0))
        batch_size = int(request.args.get('batch_size', 8))
        start_index = page * batch_size
        
        data = fetch_legislative_data(start_index, batch_size)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 