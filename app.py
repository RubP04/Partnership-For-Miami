import scrape
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
import requests
import time

app = Flask(__name__)
CORS(app)

# Replace with your Hugging Face API token
HUGGING_FACE_API_TOKEN = "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"

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

@app.route('/api/entry/<file_number>', methods=['GET'])
def get_specific_entry(file_number):
    try:
        entry_details = scrape.scrape_specific_entry(file_number)
        return jsonify(entry_details)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/entry/<file_number>/summary', methods=['GET'])
def get_entry_summary(file_number):
    try:
        entry_details = scrape.scrape_specific_entry(file_number)
        
        # Create initial response while model warms up
        initial_summary = f"""
        Key Points:
        - {entry_details['title']}
        - Type: {entry_details['file_type']}
        - Status: {entry_details['status']}
        - Requested by: {entry_details['requester']}
        - Cost Impact: {entry_details['cost']}

        Note: AI analysis is being generated. Please check back in 10-15 seconds.
        The model needs to initialize for the first request.
        """
        
        # Keep our existing successful prompt
        text = f"""
        Summarize this Miami-Dade County legislation in clear, simple terms. Be thorough:

        TITLE: {entry_details['title']}
        PURPOSE: {entry_details['file_name']}
        REQUESTED BY: {entry_details['requester']}
        COST IMPACT: {entry_details['cost']}
        STATUS: {entry_details['status']}

        Provide a brief summary focusing on:
        1. What this legislation approves or authorizes
        2. Who it affects
        3. Any important changes or requirements
        4. Cost implications
        """
        
        API_URL = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6"
        headers = {"Authorization": f"Bearer {HUGGING_FACE_API_TOKEN}"}
        
        max_retries = 5  # Increased retries
        base_wait = 2    # Base wait time in seconds
        
        for attempt in range(max_retries):
            try:
                response = requests.post(
                    API_URL,
                    headers=headers,
                    json={
                        "inputs": text,
                        "parameters": {
                            "max_length": 4000,
                            "min_length": 100,
                            "do_sample": False,
                            "temperature": 0.5,
                            "num_beams": 4
                        }
                    },
                    timeout=10  # Add timeout to prevent hanging
                )
                
                if response.status_code == 200:
                    ai_summary = response.json()[0]['summary_text'].strip()
                    
                    # Keep our existing summary format
                    formatted_summary = "Key Points:\n"
                    for point in ai_summary.split('. '):
                        if point.strip():
                            formatted_summary += f"- {point.strip()}\n"
                    
                    formatted_summary += f"\nAdditional Information:\n"
                    formatted_summary += f"- Requested by: {entry_details['requester']}\n"
                    formatted_summary += f"- Status: {entry_details['status']}\n"
                    if entry_details['cost'] and entry_details['cost'] != "N/A":
                        formatted_summary += f"- Cost Impact: {entry_details['cost']}\n"
                    
                    return jsonify({
                        "summary": formatted_summary,
                        "status": "success"
                    })
                    
                elif response.status_code == 503:
                    wait_time = base_wait * (2 ** attempt)  # Exponential backoff
                    print(f"Model loading, attempt {attempt + 1} of {max_retries}. Waiting {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                    
                else:
                    print(f"API Error: {response.status_code} - {response.text}")
                    return jsonify({
                        "summary": initial_summary,
                        "status": "error"
                    })
                    
            except requests.Timeout:
                print(f"Request timeout on attempt {attempt + 1}")
                continue
                
        # If we've exhausted all retries
        return jsonify({
            "summary": initial_summary,
            "status": "failed",
            "message": "Model initialization timed out. Please try again later."
        })
            
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/search', methods=['GET'])
def search_entries():
    try:
        query = request.args.get('query', '').strip()
        page = int(request.args.get('page', 0))
        batch_size = int(request.args.get('batch_size', 8))
        
        if not query:
            return jsonify({"error": "Search query is required"}), 400

        conn = sqlite3.connect('legislative_entries.db')
        cursor = conn.cursor()
        
        # Search by file number or title (case-insensitive, partial match)
        cursor.execute('''
            SELECT file_number, title 
            FROM legislative_entries 
            WHERE file_number LIKE ? OR LOWER(title) LIKE LOWER(?)
            ORDER BY file_number DESC
            LIMIT ? OFFSET ?
        ''', (f'%{query}%', f'%{query}%', batch_size, page * batch_size))
        
        entries = cursor.fetchall()
        
        # Get total count of search results
        cursor.execute('''
            SELECT COUNT(*) 
            FROM legislative_entries 
            WHERE file_number LIKE ? OR LOWER(title) LIKE LOWER(?)
        ''', (f'%{query}%', f'%{query}%'))
        
        total_entries = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'entries': entries,
            'total': total_entries,
            'hasMore': (page + 1) * batch_size < total_entries
        })
        
    except Exception as e:
        if 'conn' in locals():
            conn.close()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 