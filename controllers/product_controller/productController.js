const { sequelize, Product } = require("../../models");
const { Op } = require("sequelize");
const uuidv4 = require("uuid");
const path = require("path");
const fs = require("fs");

//เรียกดูข้อมูลสินค้าทั้งหมด
exports.getAllProduct = async (req, res, next) => {
  try {
    // ค้นหาสินค้าทั้งหมด
    const products = await Product.findAll();

    // ส่งข้อมูล products ไป
    res.status(200).send({
      message: "Get all products succesful.",
      data: products,
    });
  } catch (error) {
    // กำหนัดค่า error
    error.controller = "getAllProduct";

    // ส่ง error ไป
    next(error);
  }
};

//ค้นหาสินค้า
exports.searchProduct = async (req, res, next) => {
  const { name } = req?.body;

  try {
    // ค้นหาสินค้าที่ตรงกันและเก็บลงในตัวแปล products
    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });

    // ส่งข้อมูล products ไป
    res.status(200).send({
      message: "Get all products succesful.",
      data: products,
    });
  } catch (error) {
    // กำหนัดค่า error
    error.controller = "getAllProduct";

    // ส่ง error กลั้บไป
    next(error);
  }
};

//เรียกดูข้อมูลสินค้าทั้งหมดโดยใช้ID
exports.getAllProductById = async (req, res, next) => {
  const { id } = req?.body;

  try {
    // ค้นหาสินค้าทั้งหมดที่มี id ตามที่ส่งไป
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: id,
        },
      },
    });
    // ส่งข้อมูลสินค้าไป
    res.status(200).send({
      message: "Get all products succesful.",
      data: products,
    });
  } catch (error) {
    //กำหนดค่าให้ error
    error.controller = "getAllProductById";
    // ส่ง error ไป
    next(error);
  }
};

//เพิ่มสินค้า
exports.createProduct = async (req, res, next) => {
  //กำหนด Transaction เพื่อใช้ดักจับ error
  const t = await sequelize.transaction();
  const { picture } = req?.files;
  try {
    //เก็บนามสกุลไฟล์
    const ext = path.extname(picture?.name).toLowerCase();

    //สุ่มชื่อไฟล์ใหม่
    const filename = `${uuidv4.v4()}${ext}`;

    //เก็บรูปไว้ในฝั่ง server
    picture?.mv(`${__dirname}/../../assets/img/${filename}`);

    //เพิ่มสินค้า และเก็บชื่อรูปสินค้าไว้
    const createdProduct = await Product.create(
      {
        ...req?.body,
        picture: filename,
      },
      {
        transaction: t,
      }
    );

    // Commit Transaction
    await t.commit();

    // ส่งข้อมูลไป
    res.status(201).send({
      message: "Create Product succesful.",
      data: createdProduct,
    });
  } catch (error) {
    // Rollback Transaction
    await t.rollback();
    // กำหนดค่า error
    error.controller = "createProduct";
    // ส่ง error กลับ
    next(error);
  }
};

// ลบสินค้า
exports.deleteProduct = async (req, res, next) => {
  // กำหนด Transaction เพื่อใช้ดักจับ error
  const t = await sequelize.transaction();

  const { select } = req?.body;

  try {
    // ลบสินค้าตาม id ที่ป้อนไป
    await Product.destroy({
      where: { id: select },
      transaction: t,
    });

    // Commit Transaction
    await t.commit();

    // ส่งข้อมูลกลับ
    res.status(200).send({ message: "Delete Product By Id Successful." });
  } catch (error) {
    // Rollback Transaction
    await t.rollback();
    // กำหนดค่าให้ error
    error.controller = "deleteProduct";
    // ส่งค่า error กลับ
    next(error);
  }
};

// อัพเดดสินค้าโดยใช้ ID
exports.updateProduct = async (req, res, next) => {
  // กำหนด Transaction เพื่อใช้ดักจับ error
  const t = await sequelize.transaction();
  const { id } = req?.params;
  if (req?.files?.picture) {
    var { picture } = req?.files;
  }

  try {
    // ค้นหาสินค้าตาม id ที่กรอก
    const product = await Product.findOne({ where: { id } });

    if (picture) {
      // ถ้ามีรูปภาพเดิมอยู่แล้วให้ลบออก
      if (product?.picture !== picture) {
        fs.unlink(
          `${__dirname}/../../assets/img/${product?.picture}`,
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
          }
        );

        // นามสกุลไฟล์
        const ext = path.extname(picture?.name).toLowerCase();

        // สุ่มชื่อไฟล์
        var filename = `${uuidv4.v4()}${ext}`;

        // ย้ายไฟล์ไปที่ server
        picture?.mv(`${__dirname}/../../assets/img/${filename}`);
      }
    }

    // update สินค้า ตามข้อมูลที่กรอกไป
    await Product.update(
      {
        ...req?.body,
        picture: filename,
      },
      { where: { id }, transaction: t }
    );

    // Commit Transaction
    await t.commit();

    // ส่งข้อความกลับไป
    res.status(200).send({ message: "Update Product By Id Successful." });
  } catch (error) {
    // Rollback Transaction
    await t.rollback();
    // กำหนดค่าให้ error
    error.controller = "updateProduct";
    // ส่งค่า error กลับ
    next(error);
  }
};

//เรียกดูข้อมูลสินค้าอย่างเดียวโดยใช้ID
exports.getProductById = async (req, res, next) => {
  const { id } = req?.params;

  try {
    // ค้นหาสินค้าตาม id ที่ส่งไป
    const product = await Product.findOne({
      where: { id },
    });

    // ส่งข้อมูลกลับ
    res
      .status(200)
      .send({ message: "Get Product By Id Succesful", data: product });
  } catch (error) {
    // กำหนดค่าให้ error
    error.controller = " getProductById";
    // ส่งข้อมูล error กลับไป
    next(error);
  }
};
