# 📌 Frontend Implementation Plan

---

### 🎯 Goal

Build a frontend for the **Electronics Repair Shop Inventory System** that:

- Authenticates users (signup, signin, JWT-based auth)
- Lets authenticated users manage their **own components** (CRUD)
- Handles **image uploads with compression** before sending to backend
- Displays low-stock warnings clearly

---

## 1. 🔑 Authentication (Signup & Login)

**Tasks:**

- Create **Signup** and **Login** forms
- On success, store JWT in **localStorage** or **httpOnly cookies**
- Redirect to dashboard after login
- Protect routes with an **Auth Context / ProtectedRoute** (redirect if no token)

**UI Pages:**

- `/signup` → register new users
- `/login` → authenticate existing users
- `/dashboard` → main app (protected)

---

## 2. 🛠 Component Management (CRUD)

**Tasks:**

- **Create Component Form** (with image upload + compression)
- **List Components** → fetch user’s components from backend
- **Edit Component Form** → update existing details & replace image if needed
- **Delete Component** → confirmation modal before removing

**UI Pages/Components:**

- `ComponentList` → displays table/grid of user’s components
- `ComponentForm` → create/update form
- `ComponentCard` → show name, image, status, stock level

---

## 3. 🖼 Image Upload with Compression

**Library:** [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)

**Flow:**

1. User selects image from file input
2. Compress before sending
3. Upload to backend via **FormData**

**Example Code:**

```jsx
import imageCompression from 'browser-image-compression';

async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const options = {
    maxSizeMB: 1,          // Limit ~1MB
    maxWidthOrHeight: 800, // Resize max dimension to 800px
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const formData = new FormData();
    formData.append("image", compressedFile);
    formData.append("name", componentName);
    formData.append("quantity", quantity);
    // ... other fields

    await fetch("http://localhost:5000/components", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
  } catch (error) {
    console.error("Error compressing/uploading image:", error);
  }
}

```

---

## 4. 📊 Low Stock Alerts

**Tasks:**

- Backend already returns `lowStock: true/false`
- In `ComponentList`/`Card`:
    - If `lowStock === true` → highlight with red badge `"Low Stock!"`
    - Optionally show a **notification bar** at top of dashboard

---

## 5. 🗂 UI & UX Enhancements

- Add **search + filter** (by type, status, supplier)
- Paginate or infinite scroll if components grow large
- Mobile responsive UI (since repair shop owners may use phones)

---

## 6. 🔄 API Integration Checklist

Frontend should consume all backend routes:

- **Auth**
    - `POST /auth/signup`
    - `POST /auth/login`
- **Components** (with `Authorization: Bearer <token>`)
    - `POST /components` → Create (with image)
    - `GET /components` → List user’s components
    - `GET /components/:id` → Get one
    - `PUT /components/:id` → Update (with image)
    - `DELETE /components/:id` → Delete

---

## 7. 🚀 Timeline / Steps for Dev

**Day 1–2:** Setup project, routing, auth context, login/signup UI

**Day 3–4:** Dashboard + fetch user components

**Day 5:** Create component form (text fields first)

**Day 6:** Add image upload + compression

**Day 7:** Implement update/delete

**Day 8:** Add low-stock highlighting, search, polish UI

---

✅ End Result:

A **full-stack MERN-style app** where:

- Users sign up & log in
- Each user manages their own parts inventory
- Images are compressed client-side → uploaded to Cloudinary via backend
- Repairers instantly see if a part is **low in stock**

Awesome — here’s a **copy-paste friendly, step-by-step guide** a total newbie can follow to build the React frontend that matches your backend (auth, CRUD, Cloudinary images, low-stock, and client-side image compression).

---

# 🧱 0) Prereqs (once)

- Install **Node.js LTS** from nodejs.org
- Editor: **VS Code**
- Know your backend base URL (e.g. `http://localhost:5000`)

---

# 🚀 1) Create the React app

```bash
# make the project
npm create vite@latest component-tracker-frontend -- --template react
cd component-tracker-frontend

# install deps
npm i react-router-dom axios browser-image-compression

# start the app
npm run dev

```

Open the URL Vite shows (usually `http://localhost:5173`).

---

# ⚙️ 2) Configure environment

Create a file **`./.env`** at project root:

```
VITE_API_URL=http://localhost:5000

```

> This is your backend URL.
> 

---

# 🗂 3) Project structure (create these files)

```
src/
  api.js
  main.jsx
  App.jsx
  styles.css
  context/
    AuthContext.jsx
  components/
    ProtectedRoute.jsx
    Navbar.jsx
    ComponentCard.jsx
  pages/
    Login.jsx
    Signup.jsx
    Dashboard.jsx
    ComponentForm.jsx   # used for Create + Edit

```

---

# 🔌 4) API helper (Axios with token + 401 handling)

**`src/api.js`**

```jsx
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token expired → logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;

```

---

# 🔐 5) Auth context (login/signup/logout + token storage)

**`src/context/AuthContext.jsx`**

```jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", { email, password });
      const t = res.data.data.token;
      localStorage.setItem("token", t);
      setToken(t);
      return { ok: true };
    } catch (e) {
      return { ok: false, msg: e?.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password });
      return { ok: true };
    } catch (e) {
      return { ok: false, msg: e?.response?.data?.message || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

```

---

# 🧭 6) Router + App shell

**`src/main.jsx`**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ComponentForm from "./pages/ComponentForm";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="components/new"
              element={
                <ProtectedRoute>
                  <ComponentForm mode="create" />
                </ProtectedRoute>
              }
            />
            <Route
              path="components/:id/edit"
              element={
                <ProtectedRoute>
                  <ComponentForm mode="edit" />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

```

**`src/App.jsx`**

```jsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

```

**`src/components/ProtectedRoute.jsx`**

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

```

**`src/components/Navbar.jsx`**

```jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  return (
    <nav className="nav">
      <Link to="/dashboard" className="brand">Component Tracker</Link>
      <div>
        {token ? (
          <>
            <Link to="/components/new" className="btn">+ Add</Link>
            <button onClick={logout} className="btn secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn secondary">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

```

---

# 🔑 7) Auth pages (simple forms)

**`src/pages/Login.jsx`**

```jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.ok) nav("/dashboard");
    else setMsg(res.msg);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Login</h2>
      {msg && <div className="error">{msg}</div>}
      <label>Email</label>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
      <label>Password</label>
      <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
      <button className="btn" disabled={loading}>{loading ? "..." : "Login"}</button>
      <p>New here? <Link to="/signup">Create an account</Link></p>
    </form>
  );
}

```

**`src/pages/Signup.jsx`**

```jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, loading } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await signup(name, email, password);
    if (res.ok) nav("/login");
    else setMsg(res.msg);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Signup</h2>
      {msg && <div className="error">{msg}</div>}
      <label>Name</label>
      <input value={name} onChange={(e)=>setName(e.target.value)} required />
      <label>Email</label>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
      <label>Password</label>
      <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
      <button className="btn" disabled={loading}>{loading ? "..." : "Create account"}</button>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}

```

---

# 📋 8) Dashboard (list components + actions)

**`src/pages/Dashboard.jsx`**

```jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ComponentCard from "../components/ComponentCard";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/components");
      setItems(res.data.data || []);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Failed to load components");
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this component?")) return;
    await api.delete(`/components/${id}`);
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="header-row">
        <h2>Your Components</h2>
        <Link to="/components/new" className="btn">+ Add Component</Link>
      </div>
      {msg && <div className="error">{msg}</div>}
      <div className="grid">
        {items.map((c) => (
          <ComponentCard key={c.id} item={c} onDelete={() => remove(c.id)} />
        ))}
        {items.length === 0 && <p>No components yet. Click “Add Component”.</p>}
      </div>
    </div>
  );
}

```

**`src/components/ComponentCard.jsx`**

```jsx
import { Link } from "react-router-dom";

export default function ComponentCard({ item, onDelete }) {
  return (
    <div className={`card ${item.lowStock ? "warning" : ""}`}>
      <img src={item.image_url} alt={item.name} className="thumb" />
      <h3>{item.name}</h3>
      <p>Type: {item.type || "-"}</p>
      <p>Qty: {item.quantity ?? 0}</p>
      <p>Price: {item.price ?? "-"}</p>
      {item.lowStock && <div className="badge">Low Stock</div>}
      <div className="row">
        <Link className="btn secondary" to={`/components/${item.id}/edit`}>Edit</Link>
        <button className="btn danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

```

---

# 🖼 9) Create/Edit form with **image compression**

**`src/pages/ComponentForm.jsx`**

```jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import api from "../api";

export default function ComponentForm({ mode = "create" }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "", type: "", quantity: 0, supplier: "", price: "", status: "", description: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Load existing component for edit
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await api.get(`/components/${id}`);
        const data = res.data.data;
        setForm({
          name: data.name || "", type: data.type || "", quantity: data.quantity || 0,
          supplier: data.supplier || "", price: data.price || "", status: data.status || "",
          description: data.description || ""
        });
        setPreview(data.image_url);
      } catch {
        setMsg("Failed to load component");
      }
    })();
  }, [id, isEdit]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "quantity" || name === "price" ? Number(value) : value }));
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg(""); setSaving(true);

    try {
      const fd = new FormData();

      // 🔻 compress if a new file is selected (create requires it)
      if (imageFile) {
        const compressed = await imageCompression(imageFile, {
          maxSizeMB: 1,               // ~1MB
          maxWidthOrHeight: 800,      // resize
          useWebWorker: true
        });
        fd.append("image", compressed);
      } else if (!isEdit) {
        setMsg("Image is required"); setSaving(false); return;
      }

      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));

      if (isEdit) {
        await api.put(`/components/${id}`, fd);
      } else {
        await api.post("/components", fd);
      }

      nav("/dashboard");
    } catch (e2) {
      setMsg(e2?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{isEdit ? "Edit Component" : "Add Component"}</h2>
      {msg && <div className="error">{msg}</div>}

      <label>Name *</label>
      <input name="name" value={form.name} onChange={onChange} required />

      <label>Type</label>
      <input name="type" value={form.type} onChange={onChange} />

      <label>Quantity</label>
      <input name="quantity" type="number" value={form.quantity} onChange={onChange} min="0" />

      <label>Supplier</label>
      <input name="supplier" value={form.supplier} onChange={onChange} />

      <label>Price</label>
      <input name="price" type="number" step="0.01" value={form.price} onChange={onChange} min="0" />

      <label>Status</label>
      <input name="status" value={form.status} onChange={onChange} />

      <label>Description</label>
      <textarea name="description" value={form.description} onChange={onChange} />

      <label>Image {isEdit ? "(leave empty to keep current)" : "*"}</label>
      <input type="file" accept="image/*" onChange={onFile} />
      {preview && <img src={preview} alt="preview" className="preview" />}

      <button className="btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
    </form>
  );
}

```

---

# 🎨 10) Minimal styles (optional but handy)

**`src/styles.css`**

```css
*{box-sizing:border-box} body{font-family:system-ui,Segoe UI,Arial;margin:0;background:#f6f7fb;color:#222}
.app .container{max-width:960px;margin:24px auto;padding:0 16px}
.nav{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#fff;border-bottom:1px solid #e7e7e7;position:sticky;top:0}
.brand{font-weight:700;text-decoration:none;color:#111}
.btn{padding:8px 12px;border:1px solid #111;background:#111;color:#fff;border-radius:8px;text-decoration:none;margin-left:8px;cursor:pointer}
.btn.secondary{background:#fff;color:#111}
.btn.danger{background:#c62828;border-color:#c62828}
.card{background:#fff;padding:16px;border:1px solid #e5e7eb;border-radius:12px;max-width:560px;margin:16px auto}
.error{background:#ffe8e8;color:#b00020;padding:8px;border-radius:8px;margin-bottom:12px;border:1px solid #ffcdd2}
.header-row{display:flex;justify-content:space-between;align-items:center;margin:16px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.card h3{margin:8px 0}
.thumb{width:100%;height:160px;object-fit:cover;border-radius:10px;border:1px solid #eee}
.preview{width:200px;display:block;margin-top:8px;border-radius:10px;border:1px solid #eee}
.badge{display:inline-block;margin-top:8px;background:#ffb300;color:#111;padding:4px 8px;border-radius:20px;font-size:12px}
.warning{border-color:#ffcc80}
label{display:block;margin-top:10px;font-size:14px}
input, textarea{width:100%;padding:10px;border:1px solid #d1d5db;border-radius:8px;margin-top:4px}
.row{display:flex;gap:8px;margin-top:10px}

```

---

# ✅ 11) How to run & test

1. **Start backend** (with your Express/SQLite/Cloudinary server).
2. **Start frontend**:

```bash
npm run dev

```

1. **Flow**:
- Go to **/signup** → create account
- Go to **/login** → sign in
- You’ll land on **Dashboard** (protected)
- Click **Add Component**, fill fields, choose an image (it’s **compressed** in the browser), submit
- You’ll see the component card with image and **Low Stock** badge if `quantity < 5`
- Edit/Delete from the card

---

# ⛑ Tips & common gotchas

- **CORS**: backend must have `cors()` enabled (you already do).
- **Auth header**: Axios interceptor adds `Authorization: Bearer <token>` automatically.
- **Image field name** must be `"image"` (matches `upload.single("image")` in backend).
- **Create requires image**: the form enforces this; edit keeps old image if you don’t pick a new one.
- If a request fails, check the **Network** tab in DevTools for the exact error.