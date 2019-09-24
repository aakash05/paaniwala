const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Pool = require("pg").Pool;
const uuid = require("uuidv4").default;

const pool = new Pool({
  database: "postgres",
  host: "paanivaale.cjmj5fed3jgu.ap-south-1.rds.amazonaws.com",
  user: "paanivaale",
  password: "paanivaale123",
  port: 5432
});

router.get("/", (req, res) => {
  res.send("pv_order_history api working");
});
// ...............................................................................
router.post(
  "/add",
  [
    check("user_mobile")
      .not()
      .isEmpty(),
    check("product_id")
      .not()
      .isEmpty(),
    check("vendor_id")
      .not()
      .isEmpty(),
    check("quantity")
      .not()
      .isEmpty(),
    check("delivered_address")
      .not()
      .isEmpty(),
    check("payment_method")
      .not()
      .isEmpty(),
    check("status")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      const error = await validationResult(req);
      if (!error.isEmpty()) {
        return res.status(300).json({
          success: false,
          message: error
        });
      }
      const {
        user_mobile,
        product_id,
        vendor_id,
        quantity,
        promo_code,
        delivered_address,
        payment_method,
        status
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_order_history ( user_mobile, product_id, vendor_id, quantity, promo_code, delivered_address, payment_method, status,created_at,updated_at,deleted) VALUES ($1, $2 , $3 ,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING * ",
        [
          user_mobile,
          product_id,
          vendor_id,
          quantity,
          promo_code,
          delivered_address,
          payment_method,
          status,
          created_at,
          updated_at,
          deleted
        ],
        (error, result) => {
          if (error) {
            res.status(300).json({
              success: false,
              message: error
            });
          }
          if (result) {
            res.status(200).json({
              success: true,
              message: " inserted"
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(300).json({
        success: false,
        error: error,
        message: "server side error"
      });
    }
  }
);
// .....................................................all
router.post("/all", async (req, res) => {
  try {
    const error = await validationResult(req);
    if (!error.isEmpty()) {
      return res.status(300).json({
        success: false,
        message: error
      });
    }

    pool.query(
      "SELECT * FROM pv_order_history WHERE  deleted = $1",
      ["no"],
      (error, result) => {
        if (error) {
          return res.status(300).json({
            success: false,
            data: null,
            message: error
          });
        }
        if (result) {
          if (result.rowCount !== 0) {
            res.status(200).json({
              success: true,
              data: result,
              message: "data selected"
            });
          } else {
            res.status(200).json({
              success: true,
              data: null,
              message: "data not found"
            });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(300).json({
      success: false,
      error: error,
      message: "server side error"
    });
  }
});

router.post(
  "/allorder",
  [
    check("user_mobile")
      .not()
      .isEmpty()
  ],

  async (req, res) => {
    try {
      const error = await validationResult(req);
      if (!error.isEmpty()) {
        return res.status(300).json({
          success: false,
          message: error
        });
      }
      const { user_mobile } = req.body;
      pool.query(
        "SELECT * FROM pv_order_history WHERE   deleted = $1 AND user_mobile=$2",
        ["no", user_mobile],
        (error, result) => {
          if (error) {
            return res.status(300).json({
              success: false,
              data: null,
              message: error
            });
          }
          if (result) {
            if (result.rowCount !== 0) {
              res.status(200).json({
                success: true,
                data: result,
                message: "data selected"
              });
            } else {
              res.status(200).json({
                success: true,
                data: null,
                message: "data not found"
              });
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(300).json({
        success: false,
        error: error,
        message: "server side error"
      });
    }
  }
);

router.post(
  "/allorder2",
  [
    check("user_mobile")
      .not()
      .isEmpty()
  ],

  async (req, res) => {
    try {
      const error = await validationResult(req);
      if (!error.isEmpty()) {
        return res.status(300).json({
          success: false,
          message: error
        });
      }
      const { user_mobile } = req.body;
      pool.query(
        "SELECT order_id,delivered_date,delivered_time,status FROM pv_order_history WHERE   deleted = $1 AND user_mobile=$2",
        ["no", user_mobile],
        (error, result) => {
          if (error) {
            return res.status(300).json({
              success: false,
              data: null,
              message: error
            });
          }
          if (result) {
            if (result.rowCount !== 0) {
              res.status(200).json({
                success: true,
                data: result,
                message: "data selected"
              });
            } else {
              res.status(200).json({
                success: true,
                data: null,
                message: "data not found"
              });
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(300).json({
        success: false,
        error: error,
        message: "server side error"
      });
    }
  }
);

router.post(
  "/allorderbyorderid",
  [
    check("order_id")
      .not()
      .isEmpty()
  ],

  async (req, res) => {
    try {
      const error = await validationResult(req);
      if (!error.isEmpty()) {
        return res.status(300).json({
          success: false,
          message: error
        });
      }
      const { order_id } = req.body;
      let allprice = 0;
      let productprice = 0;
      pool.query(
        "SELECT * FROM pv_order_history INNER JOIN pv_products ON pv_order_history.product_id = pv_products.product_id WHERE pv_order_history.deleted = $1 AND pv_order_history.order_id=$2",
        ["no", order_id],
        (error, result) => {
          if (error) {
            return res.status(300).json({
              success: false,
              data: null,
              message: error
            });
          }
          if (result) {
            if (result.rowCount !== 0) {
              result.rows.map(re => {
                productprice = re.discount_price * re.quantity;
                allprice = allprice + productprice;
              });
              res.status(200).json({
                success: true,
                Total_price: allprice,
                data: result,
                message: "data selected"
              });
            } else {
              res.status(200).json({
                success: true,
                data: null,
                message: "data not found"
              });
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(300).json({
        success: false,
        error: error,
        message: "server side error"
      });
    }
  }
);

router.post(
  "/delete",
  [
    check("order_his_id")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      const error = await validationResult(req);
      if (!error.isEmpty()) {
        return res.status(300).json({
          success: false,
          message: error
        });
      }
      const { order_his_id } = req.body;
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_order_history SET  deleted= $2 ,updated_at=$3 WHERE order_his_id =$1  ",
        [order_his_id, deleted, updated_at],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(300).json({
              success: false,
              message: error
            });
          }
          if (result) {
            if (result.rowCount !== 0) {
              res.status(200).json({
                success: true,
                message: "data deleted"
              });
            } else {
              res.status(200).json({
                success: false,
                message: "data deleted fail / some rong information"
              });
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.status(300).json({
        success: false,
        error: error,
        message: "server side error"
      });
    }
  }
);
router.post(
  "/addallorder",
  [
    check("user_mobile")
      .not()
      .isEmpty(),
    check("promo_code")
      .not()
      .isEmpty(),
    check("delivered_address")
      .not()
      .isEmpty(),
    check("payment_method")
      .not()
      .isEmpty(),
    check("status")
      .not()
      .isEmpty(),
    check("delivered_date")
      .not()
      .isEmpty(),
    check("delivered_time")
      .not()
      .isEmpty(),
    check("allorder")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    try {
      const error = await validationResult(req);
      if (!error.isEmpty()) {
        return res.status(300).json({
          success: false,
          message: error
        });
      }
      const {
        user_mobile,
        product_id,
        vendor_id,
        quantity,
        promo_code,
        delivered_address,
        payment_method,
        status,
        delivered_date,
        delivered_time,
        allorder
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const order_id = `Paanivaale-${uuid()}`;
      const deleted = "no";
      // { product_id: , vendor_id: ,quantity: }
      allorder.map(re => {
        pool.query(
          "INSERT INTO pv_order_history ( user_mobile, product_id, vendor_id, quantity, promo_code, delivered_address, payment_method, status,created_at,updated_at,deleted,delivered_date,delivered_time,order_id) VALUES ($1, $2 , $3 ,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING * ",
          [
            user_mobile,
            re.product_id,
            re.vendor_id,
            re.quantity,
            promo_code,
            delivered_address,
            payment_method,
            status,
            created_at,
            updated_at,
            deleted,
            delivered_date,
            delivered_time,
            order_id
          ],
          (error, result) => {
            if (error) {
              res.status(300).json({
                success: false,
                message: error
              });
            }
          }
        );
      });
      console.log("i am called");
      res.status(200).json({
        success: true,
        message: " inserted"
      });
    } catch (error) {
      console.log(error);
      res.status(300).json({
        success: false,
        error: error,
        message: "server side error"
      });
    }
  }
);
module.exports = router;
