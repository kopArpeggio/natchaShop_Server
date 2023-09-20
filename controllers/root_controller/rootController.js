const { db, Member } = require("../../models");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createToken } = require("../../middleware/utils");

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

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req?.body;
    var user;

    user = await Member.findOne({
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

    console.log(process.env.JWT_SECRET);

    const token = createToken(user?.id, user?.username);

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
