const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Pool = require("pg").Pool;

const pool = new Pool({
  database: "postgres",
  host: "paanivaale.cjmj5fed3jgu.ap-south-1.rds.amazonaws.com",
  user: "paanivaale",
  password: "paanivaale123",
  port: 5432
});

router.get("/", (req, res) => {
  res.send("pv_cart api working");
});
// ...............................................................................add cart

router.post(
  "/addcart",
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
        status
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_cart ( user_mobile, product_id, vendor_id, quantity, promo_code, status, created_at, updated_at, deleted ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING * ",
        [
          user_mobile,
          product_id,
          vendor_id,
          quantity,
          promo_code,
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
              message: "added in cart"
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
// ...................................................................update cart

router.post(
  "/updatecart",
  [
    check("cart_id")
      .not()
      .isEmpty(),
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
        cart_id,
        user_mobile,
        product_id,
        vendor_id,
        quantity,
        promo_code,
        status
      } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_cart SET  product_id=$3,vendor_id=$4,quantity=$5,promo_code=$6,status=$7,updated_at=$8 WHERE cart_id =$1 AND user_mobile = $2  ",
        [
          cart_id,
          user_mobile,
          product_id,
          vendor_id,
          quantity,
          promo_code,
          status,
          updated_at
        ],
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
                message: "data updated"
              });
            } else {
              res.status(200).json({
                success: false,
                message: "data updated fail / some rong information"
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
// ......................................................................remove single cart
router.post(
  "/deletesinglecart",
  [
    check("cart_id")
      .not()
      .isEmpty(),
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
      const { cart_id, user_mobile } = req.body;
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_cart SET  deleted= $3 ,updated_at=$4 WHERE cart_id =$1 AND user_mobile = $2  ",
        [cart_id, user_mobile, deleted, updated_at],
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
// ......................................................................remove all cart
router.post(
  "/deletesallcart",
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
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_cart SET  deleted= $2 ,updated_at=$3 WHERE  user_mobile = $1  ",
        [user_mobile, deleted, updated_at],
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
//   ......................................................................fetch all cart
router.post(
  "/allcart",
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
        "SELECT * FROM pv_cart WHERE  user_mobile = $1 AND deleted = $2",
        [user_mobile, "no"],
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
module.exports = router;
