# 📝 Implementation Plan – Group 36 (Entity: Component)

### 📌 Project Title

**Digital Component Tracker for Local Electronics Repair Shops**

---

## 1. **Project Overview**

Small electronics repair shops in places like **Lapaz, Abossey Okai, and Suame Magazine** struggle to manage their spare parts. Most track stock in notebooks or by memory, which leads to:

- Delays when parts are missing
- Wasted trips to buy stock
- Poor customer satisfaction

Our system will provide a **simple digital tool** that allows repairers to keep track of their **components (spare parts)** on a phone or PC.

---

## 2. **Objectives**

- Build a simple system that allows shop owners to:
    - ➕ Add new parts/components
    - 👁️ View what’s available
    - 🖊️ Update stock details
    - ❌ Delete old/used components
- Prevent shortages by tracking low stock levels
- Reduce wasted time and increase efficiency in local repair shops

---

## 3. **Scope**

The system will include:

- **Frontend UI**: Simple, easy-to-use forms (optimized for phone/PC)
- **Backend Processing**: Handles CRUD operations for parts
- **Database**: Stores all component details (e.g., screens, chargers, resistors, batteries)

**Focus is simplicity** so local shop owners can use it without tech training.

---

## 4. **Entity Attributes (Component)**

Each **Component (spare part)** will have fields like:

- `id` – unique identifier
- `name` – e.g., Phone Screen, Charger, Resistor
- `type` – category (phone part, electronic component, laptop accessory)
- `quantity` – how many are in stock
- `supplier` – who provides the part
- `price` – cost per unit
- `status` – Available, Low Stock, Out of Stock
- `last_updated` – timestamp for inventory changes

---

## 5. **Implementation Phases**

### **Phase 1: Planning (Aug 20 – Aug 25)**

- Finalize project focus (repair shop inventory)
- Assign roles (frontend, backend, database, documentation, video)
- Collect sample real-life data (types of parts shops use)

### **Phase 2: Design (Aug 26 – Aug 31)**

- UI wireframes for “Add Part”, “View Inventory”, “Update”, “Delete”
- Database schema for components
- Decide tech stack (e.g., React + Node.js + SQLite)

### **Phase 3: Development (Sept 1 – Sept 5)**

- Implement component CRUD operations
- Build inventory list with “Low Stock” indicator
- Connect backend to database
- Test with sample data (screens, resistors, chargers, batteries)

### **Phase 4: Testing & Feedback (Sept 6 – Sept 7)**

- Verify all CRUD operations work
- Simulate repair shop usage scenario
- Fix any bugs and improve UI simplicity

### **Phase 5: Video Demo (Sept 8 – Sept 9)**

- Record a **5-minute video** showing:
    - Adding a new component (e.g., Phone Screen)
    - Viewing stock levels
    - Updating quantity after a repair
    - Deleting old stock
- Add narration: explain how this helps repairers at Lapaz, Abossey Okai, Suame

---

## 6. **Team Roles (Suggested)**

| Role | Responsibility |
| --- | --- |
| **Project Lead** | Oversees planning & coordination |
| **Frontend Developer** | Builds simple forms & inventory table |
| **Backend Developer** | Handles CRUD API & logic |
| **Database Manager** | Sets up database schema |
| **Research Lead** | Collects real examples from repair shops |
| **Tester** | Ensures app works correctly |
| **Video Lead** | Records demo & handles narration |
| **Documentation Lead** | Prepares problem statement & write-up |

---

## 7. **Tools & Technologies**

- **Frontend**: React (or simple HTML/CSS if team prefers)
- **Backend**: Node.js (Express) or Flask (Python)
- **Database**: SQLite/MySQL (easy setup for demo)
- **Video Tools**: OBS Studio / Zoom / Screen Recorder

---

## 8. **Challenges & Solutions**

- **Non-technical members** → help with design, narration, research, testing
- **Time pressure** → stick to core CRUD features only
- **Simplicity for repairers** → keep interface minimal and mobile-friendly

---

## 9. **Deliverables**

- Working CRUD application (Component Tracker for repair shops)
- 5-minute demo video
- Short documentation (problem statement, entity attributes, process)

---

📅 **Deadline: 9th September, 2025**