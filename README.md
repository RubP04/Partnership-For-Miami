# Legal Loop

## Overview

Legal Loop is an innovative web application developed to streamline access to legislative updates within Miami-Dade County. The platform focuses on critical areas such as education, transportation, and housing, serving as a centralized hub for legislative information.

### Key Features

- **Customizable Filters**: Track updates based on keywords, categories, or government entities
- **AI Summaries**: Provides concise, user-friendly explanations of legislative details
- **Mobile-Responsive UI**: Ensures seamless access across devices

## Purpose

Miami-Dade County comprises numerous local governments and agencies with unique systems for disseminating legislative information. Legal Loop consolidates these scattered data sources into a cohesive platform.

### Target Users

- Residents seeking to stay informed about community decisions
- Advocates monitoring policy changes
- Researchers analyzing trends in education, transportation, and housing

## Technology Stack

### Frontend
- React.js
- React Native
- CSS

### Backend
- Flask
- SQLite
- BeautifulSoup
- Hugging Face API

### Authentication and Data Storage
- Firebase Authentication
- Firestore

### APIs and Libraries
- Requests
- Datetime
- SQLite3
- Flask-CORS
- Firebase SDK

## Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.8+
- React CLI
- Firebase CLI

### Backend Setup

1. Install Firebase
```bash
npm install firebase
```

2. Install Python Libraries
```bash
pip install flask flask-cors requests beautifulsoup4
```

3. Run Web Scraper
```bash
python app.py
```

### Frontend Setup

1. Install Node.js and React CLI
```bash
npm i react
```

2. Install Project Dependencies
```bash
cd reactNativeApp
npm install
```

3. Start Development Server
```bash
npm start
```

## Potential Improvements

1. **Expanded Scraping**
   - Incorporate data from additional municipal sources
   - Integrate government API for real-time data

2. **AI Model Upgrade**
   - Transition to more robust AI like OpenAI's GPT
   - Improve summarization accuracy

3. **Deployment**
   - Host on dedicated server
   - Create public access through secure URL

4. **Advanced Features**
   - Add category-based filters
   - Enable push notifications
   - Improve accessibility

5. **Collaboration**
   - Implement collaborative annotation features
