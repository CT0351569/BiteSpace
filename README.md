# BiteSpace

⚠️ **Note:** Some parts of this project may not run due to outdated dependencies or environment changes.  
---

## Project Overview

**BiteSpace** is a full-stack project demonstrating:

- **Mobile app:** React Native (Expo)  
- **Backend:** Flask with SQLAlchemy  
- **Analytics:** Elasticsearch pipelines for data handling and visualization  

The repository contains two main components:  

1. **BiteSpace App** – React Native mobile front-end  
2. **FlaskBackend** – Python backend and API services  

---

## Key Features

- User authentication and profile management  
- Social features: posts, comments, likes  
- Data analytics and search capabilities using Elasticsearch  
- Structured project folders for clarity and maintainability
- 
## Documentation
The **final project report** is available here:  
-[Final Report (PDF)](BiteSpace/docs/Report.pdf)

> **Screenshots of the app and key interfaces can be found in the report starting from page 45 onwards.**  

---

## Setup Instructions (Optional)

> Some parts may not run due to outdated dependencies. For reference:  

```bash
# Backend setup
cd FlaskBackend
python -m venv venv
pip install -r requirements.txt
python app.py

# Mobile setup
cd BiteSpace
npm install
expo start
