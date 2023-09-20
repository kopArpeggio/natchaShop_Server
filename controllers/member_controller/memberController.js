const { Member, sequelize } = require("../../models");
const bcrypt = require("bcryptjs");


exports.getAllMember = async (req, res, next) => {
  try {
    const members = await Member.findAll();

    res
      .status(200)
      .send({ message: "Get All Members Succesful.", data: members });
  } catch (error) {
    error.controller = "getAllMember";
    next(error);
  }
};

exports.createMember = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { password, username } = req?.body;

  try {
    const duplicate = await Member.findOne({
      where: { username },
    });

    if (duplicate) {
      const error = new Error("This user already Exist !");
      error.statusCode = 400;
      throw error;
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const member = await Member.create(
      {
        ...req.body,
        password: hasedPassword,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).send({ message: "Register Succesful.", data: member });
  } catch (error) {
    await t.rollback();
    error.controller = "createMember";
    next(error);
  }
};

exports.deleteMemberById = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { id } = req?.params;
  try {
    const exist = await Member.findOne({ where: { id } });

    if (!exist) {
      const error = new Error("This Member not exist !");
      error.statusCode = 400;
      throw error;
    }

    await Member.delete({ transaction: t, where: { id } });

    await t.commit();

    res.status(200).send({ message: "Delete member by Id Successful." });
  } catch (error) {
    await t.rollback();
    error.controller = "deleteMemberById";
    next(error);
  }
};

exports.updateMemberById = async (req, res, next) => {
  const t = await sequelize.transaction();

  const { id } = req?.params;

  try {
    const exist = await Member.findOne({ where: { id } });

    if (!exist) {
      const error = new Error("This Member not exist !");
      error.statusCode = 400;
      throw error;
    }

    await Member.update(
      {
        ...req.body,
      },
      {
        transaction: t,
        where: { id },
      }
    );

    await t.commit();

    res.status(200).send({ message: "Update member by Id Successful." });
  } catch (error) {
    await t.rollback();
    error.controller = "updateMemberById";
    next(error);
  }
};
