const express = require("express");
const router = express.Router();
const db = require("../db/database");
const validateFields = require("../middleware/validateFields");
const { successResponse, errorResponse } = require("../utils/response");
const authenticateToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const componentRequiredFields = ["name"];
router.use(authenticateToken);

// Create Component
router.post("/", authenticateToken, upload.single("image"), validateFields(componentRequiredFields), (req, res, next) => {
  const { name, type, quantity, supplier, price, status, description } = req.body;
  const userId = req.user.id;

  const imageUrl = req.file ? req.file.path : null; // Cloudinary gives file.path as URL

  const sql = `INSERT INTO components (name, type, quantity, supplier, price, status, description, image_url, user_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [name, type, quantity, supplier, price, status, description, imageUrl, userId], function (err) {
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
      image_url: imageUrl,
      user_id: userId,
    }, 201);
  });
});

// 👁️ Get all components for logged-in user
router.get("/", (req, res, next) => {
  const userId = req.user.id;
  db.all("SELECT * FROM components WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return next(err);
    return successResponse(res, "Your components retrieved successfully", rows);
  });
});

// 👁️ Get one component (only if owned)
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  db.get("SELECT * FROM components WHERE id = ? AND user_id = ?", [id, userId], (err, row) => {
    if (err) return next(err);
    if (!row) return errorResponse(res, "Component not found or not yours", 404);
    return successResponse(res, "Component retrieved successfully", row);
  });
});

// Update component (only if owned)
router.put("/:id", authenticateToken, upload.single("image"), validateFields(componentRequiredFields), (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { name, type, quantity, supplier, price, status, description } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  // Build dynamic SQL based on whether image is provided
  let sql, params;
  if (imageUrl) {
    sql = `UPDATE components 
           SET name=?, type=?, quantity=?, supplier=?, price=?, status=?, description=?, 
               image_url=?, last_updated=CURRENT_TIMESTAMP
           WHERE id=? AND user_id=?`;
    params = [name, type, quantity, supplier, price, status, description, imageUrl, id, userId];
  } else {
    sql = `UPDATE components 
           SET name=?, type=?, quantity=?, supplier=?, price=?, status=?, description=?, 
               last_updated=CURRENT_TIMESTAMP
           WHERE id=? AND user_id=?`;
    params = [name, type, quantity, supplier, price, status, description, id, userId];
  }

  db.run(sql, params, function (err) {
    if (err) return next(err);
    if (this.changes === 0) return errorResponse(res, "Component not found or not yours", 404);

    return successResponse(res, "Component updated successfully");
  });
});

// Delete component (only if owned)
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.run("DELETE FROM components WHERE id = ? AND user_id = ?", [id, userId], function (err) {
    if (err) return next(err);
    if (this.changes === 0) return errorResponse(res, "Component not found or not yours", 404);
    return successResponse(res, "Component deleted successfully");
  });
});


module.exports = router;
