const { Member } = require("../../models");
const db = require("../../models");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createToken } = require("../../middleware/utils");

exports.migrate = async (req, res, next) => {
  try {
    await db.sequelize.sync({ alter: true }).then(() => {
      res.status(200).send({ message: "Migrate Succesful" });
    });
  } catch (error) {
    error.controller = "migrate";
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req?.body;
  try {
    const user = await Member.findOne({
      where: { username },
    });

    if (!user) {
      const error = new Error("User not exist");
      error.statusCode = 400;
      throw error;
    }

    const isValid = await bcrypt.compare(password, user?.password);

    if (!isValid) {
      const error = new Error("Wrong Password");
      error.statusCode = 400;
      throw error;
    }

    const token = createToken(user?.id, user?.username, user?.role);

    const { exp } = jwt.decode(token);

    res.status(200).json({
      accessToken: token,
      expiredIn: exp,
      tokenType: "Bearer",
    });
  } catch (error) {
    error.controller = "login";
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    res.status(200).send({
      message: "connect to controller and Route Succesful!",
      data: req?.user,
    });
  } catch (error) {
    error.controller = "getUser";
    next(error);
  }
};
