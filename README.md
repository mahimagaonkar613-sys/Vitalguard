# VitalGuard (React app) - NASA OSD-575 biomarker platform

## Run (Windows, in a terminal inside this folder)
1. Install Node.js LTS from https://nodejs.org (once). Check: `node -v`
2. `npm install`
3. `npm start`      -> opens http://localhost:3000

Optional - rebuild the data from the NASA files in data/osd575/ :
   `pip install pandas` then `python make_data.py`   (writes src/data.js)
Production build: `npm run build` (output in dist/)

## Pages (left menu)
Home | Biomarkers | Alerts | Crew overview | Method and safety

## Structure
data/osd575/        NASA OSD-575 files (4 used by the code, extra_copies/, metadata/)
make_data.py        NASA CSVs -> src/data.js (300 analytes, 4 crew, 7 times)
src/analysis.js     baseline + shift + alert logic
src/store.jsx       shared state (selected crew, time, alert actions)
src/App.jsx         sidebar menu + routes
src/pages/*.jsx     the 5 pages

## Data and AI disclosure
NASA OSDR OSD-575 (SpaceX Inspiration4), accessed 2 Oct 2026; check the study page for terms.
Code and logo were created with AI assistance (Claude). Decision support, not a diagnosis.
