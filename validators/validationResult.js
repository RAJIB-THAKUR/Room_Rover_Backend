const { validationResult } = require("express-validator");
const res_Status = false;

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      res_Status,
      error: errors.array()[0].msg,
    });
  }
  next();
};

module.exports = runValidation;
