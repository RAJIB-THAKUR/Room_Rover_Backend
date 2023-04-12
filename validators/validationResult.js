const { validationResult } = require("express-validator");
const success = false;

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success,
      error: errors.array()[0].msg,
    });
  }
  next();
};

module.exports = runValidation;
