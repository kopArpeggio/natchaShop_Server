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

exports.createOrder = async (req, res, next) => {
  const { file } = req?.files;

  const t = await sequelize.transaction();

  const cartItems = [];

  try {
    // console.log(req?.body);

    const ext = path.extname(file?.name).toLowerCase();

    const filename = `${uuidv4.v4()}${ext}`;

    file?.mv(`${__dirname}/../../assets/img/${filename}`);

    const createOrder = {
      ...req?.body,
      slipPicture: filename,
      orderBy: req?.user?.id,
    };

    const order = await Order.create(createOrder);
    const cartItemsArray = [];
    for (const key in req?.body) {
      if (key.startsWith("cartItems")) {
        const itemIndex = key.match(/\[(\d+)\]/)[1];
        const property = key.match(/\]\[(\w+)\]/)[1];
        const value = req?.body[key];

        if (!cartItemsArray[itemIndex]) {
          cartItemsArray[itemIndex] = { order_id: order?.id };
        }

        // Ensure the item has an 'id' property

        // Ensure the item has a 'quantity' property
        if (!cartItemsArray[itemIndex].quantity) {
          cartItemsArray[itemIndex].quantity = 0;
        }

        cartItemsArray[itemIndex][property] = value;
      }
    }

    // Remove empty slots in the array and convert to bulkCreate format
    const bulkCreateData = cartItemsArray
      .filter((item) => item)
      .map((item) => ({ ...item }));

    const detail = await OrderDetail.bulkCreate(bulkCreateData);

    await t.commit();

    await res.status(200);
  } catch (error) {
    await t.rollback();
    error.controller = "createOrder";
    next(error);
  }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    const order = await Order.findAll({
      include: [
        {
          model: OrderDetail,
          include: [
            {
              model: Product,
              attributes: ["name"], // Include only the 'name' attribute from Product
            },
          ],
          attributes: ["quantity"], // Include only the 'quantity' attribute from OrderDetail
        },
        {
          model: Member,
        },
      ],
    });

    res?.status(200).send({ data: order });
  } catch (error) {
    error.controller = "getAllOrder";
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  const { id } = req?.params;
  console.log(id);

  try {
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
              attributes: ["name"], // Include only the 'name' attribute from Product
            },
          ],
          attributes: ["quantity"], // Include only the 'quantity' attribute from OrderDetail
        },
        {
          model: Member,
        },
      ],
    });


    res?.status(200).send({ data: order });
  } catch (error) {
    error.controller = "getOrderById";
  }
};
