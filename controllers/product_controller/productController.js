const { sequelize, Product } = require("../../models");
const { Op } = require("sequelize");
const uuidv4 = require("uuid");
const path = require("path");
const fs = require("fs");

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
  const { picture } = req?.files;
  try {
    const ext = path.extname(picture?.name).toLowerCase();

    const filename = `${uuidv4.v4()}${ext}`;

    picture?.mv(`${__dirname}/../../assets/img/${filename}`);

    const createdProduct = await Product.create(
      {
        ...req?.body,
        picture: filename,
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
  const { select } = req?.body;

  try {
    await Product.destroy({
      where: { id: select },
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
  const { picture } = req?.files;

  try {
    const product = await Product.findOne({ where: { id } });
    if (product?.picture) {
      fs.unlink(`${__dirname}/../../assets/img/${product?.picture}`, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    }

    const ext = path.extname(picture?.name).toLowerCase();

    const filename = `${uuidv4.v4()}${ext}`;

    picture?.mv(`${__dirname}/../../assets/img/${filename}`);

    await Product.update(
      {
        ...req?.body,
        picture: filename,
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

exports.getProductById = async (req, res, next) => {
  const { id } = req?.params;

  try {
    const product = await Product.findOne({
      where: { id },
    });

    res
      .status(200)
      .send({ message: "Get Product By Id Succesful", data: product });
  } catch (error) {
    error.controller = " getProductById";
    next(error);
  }
};
