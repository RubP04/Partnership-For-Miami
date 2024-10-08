import sqlite3

conn =sqlite3.connect('school_board_minutes.db')

cursor =conn.cursor()



cursor.execute(''' 
               
CREATE TABLE IF NOT EXISTS school_board_minutes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_number TEXT NOT NULL,
    agenda_item TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT NOT NULL,
    notes TEXT
)
''')

#Insert data into table
meeting_data = [
    ('123,446', 'A-1', 'HEARD', "Superintendent's Informational Reports to the Board on Selected Topics."),
    ('123,447', 'B-4', 'APPROVED', "Resolution No. 24-059 of The School Board of Miami-Dade County, Florida, recognzing Girl Power Rocks Inc.", "Amended: To include Ms. Maria Teresa Rojas, Chair, Ms. Monica Colucci, Vice Chair, Mr. Roberto J. Alonso, Ms. Mary Blanco and Ms. Luisa Santos School Board Members as co-sponors of this item."),
    ('123,448', 'C-100', 'AUTHORIZED', "The Superintendent to initiate rulemaking proceedings in accordance with the Administrative Procedure ACT to amend Policy 2460, Exceptional Student Education, by repealing the document, Exceptional Student Education Policies and Procedures (SP&P) Effective Dates: 2020-2021 through 2022-2023, and promulgating the document Exceptional Student Education Policies and Procedures (P&P) Effective Dates 2023-2024 through 2025-26, which are incorporated by reference.",None),
    ('123,449', 'D-19', 'AUTHORIZED', "The Superintendent to enter into a contractual services agreement between The School Board of Miami-Dade County, Florida, and Citizen's Crime Watch of Miami-Dade County, Inc., in an amount of $71,000.", None),
    ('123,450', 'D-20', 'APPROVED', "1.Personnel Action Listing 1183 for Instructional and Non-instructional appointments, reassignments,  leaves, separations, retirements, and resignations from July 26, 2024 through August 14, 2024. 2. Instructional personnel assigned to teach out-of-field for the 2024-2025 Octover FTE Survey."),
    ('123,451', 'D-21', 'APPROVED', "That effective September 12, 2024, or as soon thereafter as can be facilitated: 1. Establish and classify the following MEP positions: a. Administrative Director, Real Estate Development, pay grade 24 b. District Director, Urban Planner, pay grade 23 c. Workforce Housing Director, pay grade 21 d. GIS Analyst, pay grade 19 2. Approve the changes of the title and minimum qualifications of Commander MEP pay grade S2 to Captain, MEP pay grade S2. \
     3. In alignment with other law enforcement agencies, approve, and laterally appoint the following: a. Ismael Castilla, Commander, MEP pay gra")

")
]