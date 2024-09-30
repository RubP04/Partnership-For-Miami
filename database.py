from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLAlchemy setup
engine = create_engine('sqlite:///legislation.db', echo=True)
Base = declarative_base()

# Define the schema
class LegislativeEntry(Base):
    __tablename__ = 'legislative_entries'
    file_number = Column(String, primary_key=True, nullable=False, unique=True)
    title = Column(String, nullable=False)
    file_type = Column(String)
    status = Column(String)
    version = Column(String)
    control = Column(String)
    file_name = Column(String)
    introduced = Column(String)
    requester = Column(String)
    cost = Column(String)
    final_action = Column(String)
    agenda_date = Column(String)
    agenda_item_number = Column(String)
    indexes = Column(String)
    sponsors = Column(String)
    sunset_provision = Column(String)
    effective_date = Column(String)
    expiration_date = Column(String)
    registered_lobbyist = Column(String)
    detailed_page_url = Column(String)
    detailed_pdf_url = Column(String)

# Create the table in the database
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
