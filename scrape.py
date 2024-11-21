import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_data(start_index=0, batch_size=8):
    try:
        # Recording current time as script is run
        beg_month = 8
        beg_day = 1
        beg_year = 2024
        now = datetime.now()
        curr_day = str(now.day)
        curr_month = str(now.month)
        curr_year = str(now.year)

        # Scraping main page (Miami Dade Legislative Index)
        url = f"https://www.miamidade.gov/govaction/Legislative.asp?begdate={beg_month}%2F{beg_day}%2F{beg_year}&enddate={curr_month}%2F{curr_day}%2F{curr_year}&MatterType=AllMatters&submit1=Submit"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Base URL for more detailed index information
        base_url = 'https://www.miamidade.gov/govaction/matter.asp'

        legislative_entries = []
        all_links = [link for link in soup.find_all('a', href=True) 
                    if 'matter.asp?matter=' in link['href']]
        
        # Get only the links for the requested batch
        batch_links = all_links[start_index:start_index + batch_size]
        
        for link in batch_links:
            file_number = link['href'].split('matter=')[1].split('&')[0].strip()
            
            detailed_page_url = f"{base_url}?matter={file_number}&file=true&fileAnalysis=false&yearFolder=Y{curr_year}"
            detailed_page_response = requests.get(detailed_page_url)
            detailed_soup = BeautifulSoup(detailed_page_response.text, 'html.parser')

            file_name_element = detailed_soup.find('strong', string='File Name: ')
            if file_name_element and file_name_element.next_sibling:
                file_name = file_name_element.next_sibling.strip()
                legislative_entries.append((file_number, file_name))

        total_entries = len(all_links)
        
        return {
            'entries': legislative_entries,
            'total': total_entries,
            'hasMore': (start_index + batch_size) < total_entries
        }
        
    except Exception as e:
        raise Exception(f"Scraping error: {str(e)}")