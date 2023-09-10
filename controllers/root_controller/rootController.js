const db = require("../../models");

exports.migrate = async (req, res, next) => {
  try {
    db.sequelize.sync({ alter: true }).then(() => {
      res.status(200).send({ message: "Migrate Succesful" });
    });
  } catch (error) {
    error.controller = "migrate";
    next(error);
  }
};
