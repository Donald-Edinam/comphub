function validateFields(requiredFields = []) {
  return (req, res, next) => {
    const errors = [];

    requiredFields.forEach((field) => {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") {
        errors.push(`${field} is required`);
      }
    });

    // Example of extra numeric validations
    if (req.body.quantity !== undefined && req.body.quantity < 0) {
      errors.push("Quantity cannot be negative");
    }
    if (req.body.price !== undefined && req.body.price < 0) {
      errors.push("Price cannot be negative");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    next(); // All good, move on
  };
}

module.exports = validateFields;
