import sqlite3
import requests
from bs4 import BeautifulSoup
from datetime import datetime

beg_month = 8
beg_day = 1
beg_year = 2024
now = datetime.now()
curr_day = str(now.day)
curr_month = str(now.month)
curr_year = str(now.year)
base_url = 'https://www.miamidade.gov/govaction/matter.asp'

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
        
        # Scrape main page
        url = f"https://www.miamidade.gov/govaction/Legislative.asp?begdate={beg_month}%2F{beg_day}%2F{beg_year}&enddate={curr_month}%2F{curr_day}%2F{curr_year}&MatterType=AllMatters&submit1=Submit"
        response = requests.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
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
    
def scrape_specific_entry(file_number):
    try:
        detailed_url = f"{base_url}?matter={file_number}&file=true&fileAnalysis=false&yearFolder=Y{curr_year}"
        detailed_response = requests.get(detailed_url)
        detailed_response.raise_for_status()
        detailed_soup = BeautifulSoup(detailed_response.text, 'html.parser')

        # PDF URL
        detailed_pdf_url = f"https://www.miamidade.gov/govaction/legistarfiles/Matters/Y{curr_year}/{file_number}.pdf"
        
        # Check if PDF exists
        try:
            pdf_response = requests.head(detailed_pdf_url, timeout=5)
            detailed_pdf_url = detailed_pdf_url if pdf_response.status_code == 200 else "N/A"
        except requests.RequestException:
            detailed_pdf_url = "N/A"

        # Helper function to safely extract text
        def get_field(soup, field_name, is_font=False):
            try:
                if is_font:
                    element = soup.find('font', string=field_name)
                    return element.find_next('font').text.strip() if element else "N/A"
                else:
                    element = soup.find('strong', string=field_name)
                    return element.next_sibling.strip() if element else "N/A"
            except:
                return "N/A"

        # Build response dictionary
        return {
            "file_number": file_number,
            "file_type": get_field(detailed_soup, 'File Type: '),
            "status": get_field(detailed_soup, 'Status: '),
            "version": get_field(detailed_soup, 'Version: '),
            "control": get_field(detailed_soup, 'Control: '),
            "file_name": get_field(detailed_soup, 'File Name: '),
            "introduced": get_field(detailed_soup, 'Introduced: '),
            "requester": get_field(detailed_soup, 'Requester: '),
            "cost": get_field(detailed_soup, 'Cost: '),
            "final_action": get_field(detailed_soup, 'Final Action: '),
            "agenda_date": get_field(detailed_soup, 'Agenda Date: '),
            "agenda_item_number": get_field(detailed_soup, 'Agenda Item Number: '),
            "title": get_field(detailed_soup, 'Title: ', True),
            "indexes": get_field(detailed_soup, 'Indexes: ', True),
            "sponsors": get_field(detailed_soup, 'Sponsors: ', True),
            "sunset_provision": get_field(detailed_soup, 'Sunset Provision: '),
            "effective_date": get_field(detailed_soup, 'Effective Date: '),
            "expiration_date": get_field(detailed_soup, 'Expiration Date: '),
            "registered_lobbyist": get_field(detailed_soup, 'Registered Lobbyist: ', True),
            "detailed_pdf_url": detailed_pdf_url,
            "detailed_url": detailed_url
        }

    except requests.RequestException as e:
        raise Exception(f"Failed to fetch entry details: {str(e)}")
    except Exception as e:
        raise Exception(f"Error processing entry details: {str(e)}")

