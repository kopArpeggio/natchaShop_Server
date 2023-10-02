const {
  sequelize,
  Order,
  OrderDetail,
  Member,
  Product,
} = require("../../models");
const { Op } = require("sequelize");
const uuidv4 = require("uuid");
const path = require("path");
const fs = require("fs");

// สร้างออเดอร์
exports.createOrder = async (req, res, next) => {
  const { file } = req?.files;

  // กำหนด Transaction
  const t = await sequelize.transaction();

  try {
    // เก็บนามสกุลไฟล์
    const ext = path.extname(file?.name).toLowerCase();

    // สุ่มชื่อไฟล์
    const filename = `${uuidv4.v4()}${ext}`;

    // ย้ายไฟล์รูปไปที่ฐานข้อมูล
    file?.mv(`${__dirname}/../../assets/img/${filename}`);

    // เตรียมข้อมูลก่อนสร้าง order
    const createOrder = {
      ...req?.body,
      slipPicture: filename,
      order_by: req?.user?.id,
    };

    // สร้างออเดอร์
    const order = await Order.create(createOrder);

    // ใช้สำหรับเก็บรายการในตะกร้า
    const cartItemsArray = [];

    // วนลูป แยกเอาสินค้าในตะกล้ามาไว้ในตัวแปล cartItemsArray
    for (const key in req?.body) {
      if (key.startsWith("cartItems")) {
        const itemIndex = key.match(/\[(\d+)\]/)[1];
        const property = key.match(/\]\[(\w+)\]/)[1];
        const value = req?.body[key];

        if (!cartItemsArray[itemIndex]) {
          cartItemsArray[itemIndex] = { order_id: order?.id };
        }

        if (!cartItemsArray[itemIndex].quantity) {
          cartItemsArray[itemIndex].quantity = 0;
        }

        cartItemsArray[itemIndex][property] = value;
      }
    }

    // จัด format ให้สามารถนำมา querry ได้
    const bulkCreateData = cartItemsArray
      .filter((item) => item)
      .map((item) => ({ ...item }));

    // สร้าง order detail
    await OrderDetail.bulkCreate(bulkCreateData);

    // Commit Transaction
    await t.commit();

    // ส่ง status 200 กลับไป
    await res.status(200);
  } catch (error) {
    // Rollback Transaction
    await t.rollback();
    // กำหนดค่าให้ error
    error.controller = "createOrder";
    // ส่งค่า error กลับไป
    next(error);
  }
};

// ค้นหาออเดอร์ทั้งหมด
exports.getAllOrder = async (req, res, next) => {
  try {
    // ค้นหาออเดอร์ทั้งหมด และ Join OrderDetail, Product, Member
    const orders = await Order.findAll({
      include: [
        {
          model: OrderDetail,
          include: [
            {
              model: Product,
              attributes: ["name"],
            },
          ],
          attributes: ["quantity", "size"],
        },
        {
          model: Member,
        },
      ],
    });

    // ส่งข้อมูลกลับไป
    res.status(200).send({ data: orders }); // Assuming you'll send the orders as JSON in the response
  } catch (error) {
    error.controller = "getAllOrder";
    next(error);
  }
};

// ค้นหาออเดอร์โดยใช้ Id
exports.getOrderById = async (req, res, next) => {
  const { id } = req?.params;

  try {
    // ค้นหาออเดอร์เดียว โดยใช้ Id และ Join OrderDetail, Product, Member
    const order = await Order.findOne({
      where: {
        id,
      },
      include: [
        {
          model: OrderDetail,
          include: [
            {
              model: Product,
              attributes: ["name"],
            },
          ],
          attributes: ["quantity", "size"],
        },
        {
          model: Member,
        },
      ],
    });

    // ส่งข้อมูลกลับ
    res?.status(200).send({ data: order });
  } catch (error) {
    // กำหนดค่าให้ error
    error.controller = "getOrderById";
    // ส่งค่า error กลับไป
    next(error);
  }
};
