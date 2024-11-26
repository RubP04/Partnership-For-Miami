import sqlite3
import requests
from bs4 import BeautifulSoup
from datetime import datetime

def create_db():
    try:
        conn = sqlite3.connect('legislative_entries.db')
        cursor = conn.cursor()
        
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS legislative_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_number TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL
    )
        ''')
        conn.commit()
        return conn
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")

def scrape_all_entries():
    try:
        # Setup database connection first to check existing entries
        conn = create_db()
        cursor = conn.cursor()
        
        # Setup date range
        beg_month = 8
        beg_day = 1
        beg_year = 2024
        now = datetime.now()
        curr_day = str(now.day)
        curr_month = str(now.month)
        curr_year = str(now.year)

        # Scrape main page
        url = f"https://www.miamidade.gov/govaction/Legislative.asp?begdate={beg_month}%2F{beg_day}%2F{beg_year}&enddate={curr_month}%2F{curr_day}%2F{curr_year}&MatterType=AllMatters&submit1=Submit"
        response = requests.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        base_url = 'https://www.miamidade.gov/govaction/matter.asp'
        
        # Get all links
        all_links = [link for link in soup.find_all('a', href=True) 
                    if 'matter.asp?matter=' in link['href']]
        
        new_entries = 0
        for link in all_links:
            file_number = link['href'].split('matter=')[1].split('&')[0].strip()
            
            # Check if this file number exists
            cursor.execute('SELECT 1 FROM legislative_entries WHERE file_number = ?', (file_number,))
            if cursor.fetchone():
                print(f"Found existing entry {file_number}, stopping scrape.")
                break  # Stop processing as soon as we find a duplicate
            
            # Get detailed page for new entry
            detailed_url = f"{base_url}?matter={file_number}&file=true&fileAnalysis=false&yearFolder=Y{curr_year}"
            detailed_response = requests.get(detailed_url)
            detailed_response.raise_for_status()
            
            detailed_soup = BeautifulSoup(detailed_response.text, 'html.parser')
            file_name_element = detailed_soup.find('strong', string='File Name: ')
            
            if file_name_element and file_name_element.next_sibling:
                file_name = file_name_element.next_sibling.strip()
                
                # Insert new entry
                cursor.execute('''
                INSERT INTO legislative_entries (file_number, title)
                VALUES (?, ?)
                ''', (file_number, file_name))
                
                conn.commit()
                new_entries += 1
        
        # Get total count for return value
        cursor.execute('SELECT COUNT(*) FROM legislative_entries')
        total_entries = cursor.fetchone()[0]
        
        conn.close()
        return {
            "message": f"Successfully scraped {new_entries} new entries. Total entries: {total_entries}",
            "new_entries": new_entries,
            "total_entries": total_entries
        }
        
    except Exception as e:
        if 'conn' in locals():
            conn.close()
        raise Exception(f"Scraping error: {str(e)}")