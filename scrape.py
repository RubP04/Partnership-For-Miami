import requests
from bs4 import BeautifulSoup
from datetime import datetime

# Recording current time as script is run
now = datetime.now()
curr_day = str(now.day)
curr_month = str(now.month)
curr_year = str(now.year)

# Scraping main page (Miami Dade Legislative Index)
url = f"https://www.miamidade.gov/govaction/Legislative.asp?begdate=8%2F1%2F2024&enddate={curr_month}%2F{curr_day}%2F{curr_year}&MatterType=AllMatters&submit1=Submit"
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
        detailed_pdf_url = f"https://www.miamidade.gov/govaction/legistarfiles/Matters/Y{curr_year}/{file_number}.pdf"

        # Request to begin scrapind detailed index page
        detailed_page_response = requests.get(detailed_page_url)
        detailed_soup = BeautifulSoup(detailed_page_response.text, 'html.parser')

        # Extract relevant information from the detailed page
        file_type = detailed_soup.find('strong', string='File Type: ').next_sibling.strip()
        status = detailed_soup.find('strong', string='Status: ').next_sibling.strip()
        version = detailed_soup.find('strong', string='Version: ').next_sibling.strip()
        #reference = detailed_soup.find('font', string='Reference: ').find_next('font').text.strip()
        control = detailed_soup.find('strong', string='Control: ').next_sibling.strip()
        file_name = detailed_soup.find('strong', string='File Name: ').next_sibling.strip()
        introduced = detailed_soup.find('strong', string='Introduced: ').next_sibling.strip()
        requester = detailed_soup.find('strong', string='Requester: ').next_sibling.strip()
        cost = detailed_soup.find('strong', string='Cost: ').next_sibling.strip()
        final_action = detailed_soup.find('strong', string='Final Action: ').next_sibling.strip()
        introduced = detailed_soup.find('strong', string='Introduced: ').next_sibling.strip()
        agenda_date = detailed_soup.find('strong', string='Agenda Date: ').next_sibling.strip() 
        agenda_item_number = detailed_soup.find('strong', string='Agenda Item Number: ').next_sibling.strip()
        title = detailed_soup.find('font', string='Title: ').find_next('font').text.strip()
        indexes = detailed_soup.find('font', string='Indexes: ').find_next('font').text.strip()
        sponsors = detailed_soup.find('font', string='Sponsors: ').find_next('font').text.strip()
        sunset_provision = detailed_soup.find('strong', string='Sunset Provision: ').next_sibling.strip()
        effective_date = detailed_soup.find('strong', string='Effective Date: ').next_sibling.strip()
        expiration_date = detailed_soup.find('strong', string='Expiration Date: ').next_sibling.strip()
        registered_lobbyist = detailed_soup.find('font', string='Registered Lobbyist: ').find_next('font').text.strip()
        
        cost = cost if cost else "N/A"
        final_action = final_action if final_action else "N/A"
        agenda_date = agenda_date if agenda_date else "N/A"
        agenda_item_number = agenda_item_number if agenda_item_number else "N/A"
        effective_date = effective_date if effective_date else "N/A"
        expiration_date = expiration_date if expiration_date else "N/A"
        
        print(f"Detailed Page URL: {detailed_page_url}")
        print(f"Detailed PDF URL: {detailed_pdf_url}")
        print(f"File Number: {file_number}")
        print(f"Title: {title}")
        print(f"File Type: {file_type}")
        print(f"Status: {status}")
        print(f"Version: {version}")
        #print(f"Reference: {reference}")
        print(f"Control: {control}")
        print(f"File Name: {file_name}")
        print(f"Introduced: {introduced}")
        print(f"Requester: {requester}")
        print(f"Cost: {cost}")
        print(f"Final Action: {final_action}")
        print(f"Agenda Date: {agenda_date}")
        print(f"Agenda Item Number: {agenda_item_number}")
        print(f"Indexes: {indexes}")
        print(f"Sponsors: {sponsors}")
        print(f"Sunset Provision: {sunset_provision}")
        print(f"Effective Date: {effective_date}")
        print(f"Expiration Date: {expiration_date}")
        print(f"Registered Lobbyist: {registered_lobbyist}")
        print("---------")
        print("")
        count+=1