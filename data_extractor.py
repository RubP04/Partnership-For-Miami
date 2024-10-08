import sqlite3
import pdfplumber 

def extract_data_from_pdf(pdf_path):
    structured_entries = []

    #Open the PDF File

    with pdfplumber.open(pdf_path) as pdf: 
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                #Splitting the text into lines
                lines = text.split('\n')

                # Iterate over lines and identify relevant entries
                current_entry = {}
                for line in lines:
                    #Check if a line contains an item number
                    if any(keyword in line for keyword in ["HEARD","APPROVED","WITHDRAWN","AUTHORIZED"]):
                        #If it exist commit the previous entry
                        if current_entry:
                            structured_entries.append(current_entry)
                            current_entry = {}

                        # Extract the entry number, item number, and action
                        parts = line.split()
                        current_entry['entry_number'] = parts[0] # ex. 123,446
                        current_entry['action'] = parts[1] #ex. "APPROVED"
                        current_entry['item_number'] = current_entry['entry_number']
                        current_entry['description'] = " ".join(parts[2:]) # The start of the description
                    else:
                        # Add additional lines to the description of the current entry
                        if current_entry:
                            current_entry['description'] += ' ' + line

                # Add the last entry
                if current_entry:
                    structured_entries.append(current_entry)

    return structured_entries

# PDF path using MDCPS 
pdf_path = "/Users/jalise2002/Downloads/School board meeting.pdf"

#extract data from PDF
entries = extract_data_from_pdf(pdf_path)

# Connect to the SQLite database
connection = sqlite3.connect('school_board.db')
cursor = connection.cursor()

# Insert extracted entries into the database
for entry in entries:
    cursor.execute(''' 
        INSERT INTO school_board_meetings (entry_number, item_number, action, description)
        VALUES (?, ?, ?, ?)
    ''', (entry['entry_number'], entry['item_number'], entry['action'], entry['description']))

# Commit to the changes and close the connection
connection.commit()
connection.close()

# Print out the entries
for entry in entries:
    print(entry)



                        