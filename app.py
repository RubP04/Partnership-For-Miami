import scrape
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_entries(start_index, batch_size):
    try:
        conn = sqlite3.connect('legislative_entries.db')
        cursor = conn.cursor()
        
        # Get total count
        cursor.execute('SELECT COUNT(*) FROM legislative_entries')
        total_entries = cursor.fetchone()[0]
        
        # Get batch of entries
        cursor.execute('''
            SELECT file_number, title 
            FROM legislative_entries 
            ORDER BY file_number DESC
            LIMIT ? OFFSET ?
        ''', (batch_size, start_index))
        
        entries = cursor.fetchall()
        
        conn.close()
        
        return {
            'entries': entries,
            'total': total_entries,
            'hasMore': (start_index + batch_size) < total_entries
        }
        
    except Exception as e:
        if 'conn' in locals():
            conn.close()
        raise Exception(f"Database error: {str(e)}")

@app.route('/api/entries', methods=['GET'])
def get_entries():
    try:
        # Check if we want all entries
        if request.args.get('all') == 'true':
            scrape.scrape_all_entries()
            conn = sqlite3.connect('legislative_entries.db')
            cursor = conn.cursor()
            
            cursor.execute('SELECT file_number, title FROM legislative_entries ORDER BY file_number DESC')
            entries = cursor.fetchall()
            
            conn.close()
            return jsonify({'entries': entries})
            
        # Original pagination logic
        page = int(request.args.get('page', 0))
        batch_size = int(request.args.get('batch_size', 8))
        start_index = page * batch_size
        
        data = get_db_entries(start_index, batch_size)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 