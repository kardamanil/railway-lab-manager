# railway-lab-manager

# 🧪 Laboratory Report Management System (Web-Based LIMS)

## 📌 Project Overview

This is a **Web-Based Laboratory Report Management System (LIMS)** designed for managing and generating laboratory reports for:

- 💧 Water
- 🛢 Lube Oil
- 🧈 Grease
- ⛽ Diesel
- 🧪 Misc Samples

The system is fully responsive (Mobile + Desktop) and generates automated **MS Word (.docx)** reports.

---

# 🏗 Project Architecture (बुनियादी ढांचा)

## 🌐 Platform
- Web Application
- Mobile & Desktop Responsive
- Frontend: HTML + CSS + JavaScript
- Backend Code: GitHub
- Database: Firebase Firestore

## 🔑 Unique Key
- **Lab No.**
  - Entire system works using Lab No as the primary identifier.

## 📄 Final Output
- Automated MS Word (.docx) Reports
- Monthly Register Entry Reports
- Analytical Reports

---

# 🔷 PHASE 1: USER INTERFACE (UI Workflow)

---

## 🏠 UI 1: Home Screen (Category Selection)

User selects one of the following categories:

- Water
- Lube Oil
- Grease
- Diesel
- Misc

---

## 📝 UI 2: Sample Details & Standard Configuration

Input fields dynamically change based on selected category.

---

### A. Common Input Fields (For All Categories)

- Lab No. (Unique ID)
- Sample Received Date
- Sample Received Letter No.
- Received From (Sender)
- Railway Zone (Dropdown: NWR, WR, etc.)
- Sample Description
- Sample Name

---

### B. Category-Specific Fields

#### 💧 Water Only
- Received From Label → CHI
- CHI Sample No.
- Source of Water (Borewell / RO / Open Well)
- Location of Water (Platform / Waiting Room etc.)

---

#### 🛢 Lube / 🧈 Grease / 🧪 Misc
- PO No.
- PO Date
- PL No.

---

#### ⛽ Diesel Only
- Storage Tank Details
- Date of Sample Collection

---

## 🔍 Standard Selection (Rules Engine)

### Standard Search

User searches for a standard (e.g., IS 1448).

### Logic

If Found:
- Load:
  - Test Name
  - Test Method
  - Specification (Min / Max)

If Not Found:
- User selects **Add New Standard**
- Adds:
  - Standard Name
  - Test Method
  - Specification
- Saved for future use.

---

### 🏭 Facility Toggle

Each test has:

`Facility Available? (Yes / No)`

- Yes → Test included in next step
- No → Test hidden from workflow

---

## 🧮 UI 3: Test Data Entry (Calculation Hub)

Only "Available" tests are displayed.

### Date of Report
User enters Testing Date.

---

### Input Logic

#### 🛢 Lube / ⛽ Diesel / 🧈 Grease

User enters Raw Data:
- Tube No
- Factor
- Time (t1, t2)
- Temperature
- Pressure

System:
- Applies formula
- Calculates average
- Applies correction
- Generates final result

---

#### 💧 Water

User enters direct values.

System checks:
- Desirable Limit
- Permissible Limit

Result:
- Pass
- Acceptable
- Fail

---

## 📊 UI 4: Result Logic

### Test Status
Each test compared with specification:
- Pass
- Fail

### Overall Sample Status

- PASS → All tests pass
- FAIL → Even one test fails

---

## 💰 UI 5: Submission & Billing

On Submit:

System asks:
`Test Charges Applicable? (Yes / No)`

If NO:
- Data saved directly.

If YES:
- Popup opens.
- List of performed tests shown.
- User enters ₹ Amount per test.
- Total auto-calculated.
- Data saved.

---

# 🔷 PHASE 2: REPORTING (Register Entry)

Reports generated monthly (Based on Testing Date).

---

## 📘 Type A: Water Report (Horizontal Format)

Single Page Table Format:

Columns:
- Lab No.
- Date Received
- Letter No.
- CHI Sample No.
- Source
- Location
- Date of Report

Test Columns:
- pH
- TDS
- Turbidity
- etc.

Observation:
- Desirable
- Acceptable
- Fail

Footer:
- Signature (Blank)

---

## 📕 Type B: Lube / Grease Report (Vertical Detailed)

### Header
- Lab No
- Dates
- Letter No
- Sender
- Description
- Sample Name
- PO No
- PO Date
- PL No

### Body (Dynamic Test Parameters)
For each test:
1. Test Name (Method)
2. Raw Data
3. Calculation
4. Final Result

Footer:
- Observation (Pass / Fail)
- Signature

---

## 📗 Type C: Diesel Report (Vertical Detailed)

Header:
- Same as Lube
- + Storage Tank Details
- + Date of Sample Collection

Body:
- Raw Data
- Calculation
- Final Result

Footer:
- Observation (Pass / Fail)
- Signature

---

# 🔷 PHASE 3: ANALYTICS (Predefined Queries)

Report section includes 5 predefined queries:

---

### 1️⃣ Water Count (Yearly)
- Distinct Lab No count

---

### 2️⃣ Lube Count (Yearly)
- Distinct Lab No count

---

### 3️⃣ Diesel / Grease Count (Yearly)
- Distinct Lab No count

---

### 4️⃣ Specific Test Load (Yearly)
User selects:
- Year
- Test Name

System returns:
- Count of (Lab No + Test Name)

Purpose:
- Machine workload analysis

---

### 5️⃣ Total Workload (Yearly)
User selects:
- Year
- Categories (Water / Lube / Diesel / etc.)

System returns:
- Total Tests Performed

---

# 🎯 System Highlights

- Dynamic Rules Engine
- Automated Pass/Fail Logic
- Monthly Register Entry
- Billing Integration
- Analytics Dashboard
- Firebase Cloud Storage
- Responsive Design

---

# 📜 License

Developed for laboratory automation and internal reporting use.
