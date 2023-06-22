const { findById } = require("./scheme-model.js");
const checkSchemeId = async (req, res, next) => {
  const { scheme_id } = req.params;
  try {
    let query = await findById(scheme_id);
    if (Object.values(query).length > 0) {
      next();
    } else {
      next({ status: 404, message: `scheme_id ${scheme_id} id li şema bulunamadı` });
    }
  } catch (e) {
    next(e);
  }
};

const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body;
  scheme_name && typeof scheme_name === "string" ? next() : next({ status: 400, message: `Geçersiz scheme_name` });
};

const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;
  if (typeof instructions === "string" && instructions !== undefined && instructions !== "" && typeof step_number === "number" && step_number > 0) {
    next();
  } else {
    next({ status: 400, message: "Hatalı step" });
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
