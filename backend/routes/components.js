const express = require("express");
const router = express.Router();
const db = require("../db/database");
const validateFields = require("../middleware/validateFields");

// Fields we want to require for Component
const componentRequiredFields = ["name"];

// Create Component
router.post("/", validateFields(componentRequiredFields), (req, res, next) => {
  try {
    const { name, type, quantity, supplier, price, status, description } = req.body;
    const sql = `INSERT INTO components (name, type, quantity, supplier, price, status, description)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [name, type, quantity, supplier, price, status, description], function (err) {
      if (err) return next(err); 
      res.status(201).json({
        success: true,
        message: "Component created successfully",
        data: { id: this.lastID, name, type, quantity, supplier, price, status, description }
      });
    });
  } catch (error) {
    next(error);
  }
});


// Get All Components
router.get("/", (req, res) => {
  db.all("SELECT * FROM components", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
        "response": "ok",
        "message": "Components fetched successfully",
        "data": rows
    });
  });
});

// Get Component by ID
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  db.get("SELECT * FROM components WHERE id = ?", [id], (err, row) => {
    if (err) return next(err);
    if (!row) {
      return res.status(404).json({ success: false, error: "Component not found" });
    }
    res.json({ success: true, data: row });
  });
});


router.put("/:id", validateFields(componentRequiredFields), (req, res, next) => {
  const { id } = req.params;
  const { name, type, quantity, supplier, price, status, description } = req.body;

  const sql = `UPDATE components 
               SET name=?, type=?, quantity=?, supplier=?, price=?, status=?, description=?, last_updated=CURRENT_TIMESTAMP 
               WHERE id=?`;

  db.run(sql, [name, type, quantity, supplier, price, status, description, id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: "Component not found" });
    }
    res.json({ success: true, message: "Component updated successfully" });
  });
});


// Delete Component
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  db.run("DELETE FROM components WHERE id = ?", [id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: "Component not found" });
    }
    res.json({ success: true, message: "Component deleted successfully" });
  });
});


module.exports = router;
