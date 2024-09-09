import requests
from bs4 import BeautifulSoup
from datetime import datetime

# Recording current time as script is run
now = datetime.now()
curr_day = str(now.day)
curr_month = str(now.month)
curr_year = str(now.year)

# Scraping main page (Miami Dade Legislative Index)
url = 'https://www.miamidade.gov/govaction/Legislative.asp?begdate=8%2F1%2F2024&enddate=' + curr_month + '%2F' + curr_day + '%2F' + curr_year +'&MatterType=AllMatters&submit1=Submit'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Base URL for more detailed index information
base_url = 'https://www.miamidade.gov/govaction/matter.asp'

# Looping through all the valid indexes in the given timeframe
count = 0
for link in soup.find_all('a', href=True):
    # The link should contain 'matter.asp?matter=' to identify the right anchor
    if 'matter.asp?matter=' in link['href']:
        if count >= 5:
            break
        # Extract the matter number
        file_number = link['href'].split('matter=')[1].split('&')[0]
        
        # Construct the valid detailed URL
        detailed_page_url = f"{base_url}?matter={file_number}&file=true&fileAnalysis=false&yearFolder=Y{curr_year}"

        # Request to begin scrapind detailed index page
        detailed_page_response = requests.get(detailed_page_url)
        detailed_soup = BeautifulSoup(detailed_page_response.text, 'html.parser')

        # Extract relevant information from the detailed page
        file_type = detailed_soup.find('strong', string='File Type: ').next_sibling.strip()
        status = detailed_soup.find('strong', string='Status: ').next_sibling.strip()
        file_name = detailed_soup.find('strong', string='File Name: ').next_sibling.strip()
        agenda_date = detailed_soup.find('strong', string='Agenda Date: ').next_sibling.strip()
        agenda_item_number = detailed_soup.find('strong', string='Agenda Item Number: ').next_sibling.strip()
        title = detailed_soup.find('font', string='Title: ').find_next('font').text.strip()
        indexes = detailed_soup.find('font', string='Indexes: ').find_next('font').text.strip()
        sponsors = detailed_soup.find('font', string='Sponsors: ').find_next('font').text.strip()

        agenda_date = agenda_date if agenda_date else "N/A"
        agenda_item_number = agenda_item_number if agenda_item_number else "N/A"

        
        print(f"Detailed Page URL: {detailed_page_url}")
        print(f"File Number: {file_number}")
        print(f"Title: {title}")
        print(f"File Type: {file_type}")
        print(f"Status: {status}")
        print(f"File Name: {file_name}")
        print(f"Agenda Date: {agenda_date}")
        print(f"Agenda Item Number: {agenda_item_number}")
        print(f"Indexes: {indexes}")
        print(f"Sponsors: {sponsors}")
        print("---------")
        count+=1