const { sequelize, Product } = require("../../models");
const { Op } = require("sequelize");

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll();

    res.status(200).send({
      message: "Get all products succesful.",
      data: products,
    });
  } catch (error) {
    error.controller = "getAllProduct";
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { product } = req?.body;
  try {
    const createdProduct = await Product.create(
      {
        product,
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    res.status(201).send({
      message: "Create Product succesful.",
      data: createdProduct,
    });
  } catch (error) {
    await t.rollback();
    error.controller = "createProduct";
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { id } = req?.params;

  try {
    await Product.delete({
      where: { id },
      transaction: t,
    });

    await t.commit();

    res.status(200).send({ message: "Delete Product By Id Successful." });
  } catch (error) {
    await t.rollback();
    error.controller = "deleteProduct";
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { id } = req?.params;
  try {
    await Product.update(
      {
        ...req?.body,
      },
      { where: { id }, transaction: t }
    );

    await t.commit();

    res.status(200).send({ message: "Update Product By Id Successful." });
  } catch (error) {
    await t.rollback();
    error.controller = "updateProduct";
    next(error);
  }
};
