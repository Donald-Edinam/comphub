const express = require("express");
const router = express.Router();
const db = require("../db/database");
const validateFields = require("../middleware/validateFields");
const { successResponse, errorResponse } = require("../utils/response");

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
          return successResponse(res, "Component created successfully", {
      id: this.lastID,
      name,
      type,
      quantity,
      supplier,
      price,
      status,
      description,
    }, 201);
    });
  } catch (error) {
    next(error);
  }
});

// Get All Components
router.get("/", (req, res) => {
  db.all("SELECT * FROM components", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return successResponse(res, "Components retrieved successfully", rows);
  });
});

// Get Component by ID
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  db.get("SELECT * FROM components WHERE id = ?", [id], (err, row) => {
    if (err) return next(err);
       if (!row) return errorResponse(res, "Component not found", 404);
        return successResponse(res, "Component retrieved successfully", row);

  });
});

router.put("/:id", validateFields(componentRequiredFields), (req, res, next) => {
  const { id } = req.params;
  const { name, type, quantity, supplier, price, status, description } = req.body;
  const sql = `UPDATE components 
               SET name=?, type=?, quantity=?, supplier=?, price=?, status=?, description=?, last_updated=CURRENT_TIMESTAMP 
               WHERE id=?`;
  db.run(sql, [name, type, quantity, supplier, price, status, description, id], function (err, row) {
    if (err) return next(err);
    if (this.changes === 0) return errorResponse(res, "Component not found", 404);
    return successResponse(res, "Component updated successfully", row);
  });
});

// Delete Component
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  db.run("DELETE FROM components WHERE id = ?", [id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) return errorResponse(res, "Component not found", 404);
    return successResponse(res, "Component deleted successfully");
  });
});

module.exports = router;
