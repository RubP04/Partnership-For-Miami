import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_data():
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

    # Looping through all the valid indexes in the given timeframe
    legislative_entries = []
    count = 0
    for link in soup.find_all('a', href=True):
        # The link should contain 'matter.asp?matter=' to identify the right anchor
        if 'matter.asp?matter=' in link['href']:
            if count >= 6:
                break
            # Extract the matter number
            file_number = link['href'].split('matter=')[1].split('&')[0].strip()

            count+=1
            
            # Construct the valid detailed URL
            detailed_page_url = f"{base_url}?matter={file_number}&file=true&fileAnalysis=false&yearFolder=Y{curr_year}"
            detailed_pdf_url = f"https://www.miamidade.gov/govaction/legistarfiles/Matters/Y{curr_year}/{file_number}.pdf"

            # Request to begin scrapind detailed index page
            detailed_page_response = requests.get(detailed_page_url)
            detailed_soup = BeautifulSoup(detailed_page_response.text, 'html.parser')

            # Extract relevant information from the detailed page
            file_name = detailed_soup.find('strong', string='File Name: ').next_sibling.strip()
            legislative_entries.append((file_number, file_name))

    return legislative_entries