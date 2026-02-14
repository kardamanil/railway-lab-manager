# Indian Railways Laboratory Management System (CMT)

A lightweight browser-based implementation of the requested CMT workflow for:

- Water
- Lube Oil
- Grease
- Diesel
- Misc

## Implemented workflow

- **UI 1**: Category selection.
- **UI 2**: Smart sample entry with:
  - Zone + conditional Division (required only for NWR).
  - Batch mode for Water/Diesel (multi-sample table with editable source/location).
  - Single mode for Lube/Grease/Misc (PO/PL/PO Date fields).
  - Standard search + dynamic test list + Facility Available toggle.
- **UI 3**: Data entry by sample tabs.
  - Water: direct value entry.
  - Lube/Grease/Diesel/Misc: raw readings + simple auto-calculation.
- **UI 5**: Submission and billing prompt for test charges.
- **Analytics**: 5 query buttons:
  - Water count
  - Lube count
  - Diesel count
  - Specific test load
  - Total workload

## Data/storage notes

- Uses `localStorage` for saved records (demo mode).
- Firebase integration can be plugged in at persistence points in `app.js`.
- A downloadable `.docx` report file is generated on submission.

## Run locally

Open `index.html` directly, or run a static server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.
