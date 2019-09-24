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
  res.send("pv_products api working");
});
// ...............................................................................add product
router.post(
  "/addproduct",
  [
    check("vendor_id")
      .not()
      .isEmpty(),
    check("product_name")
      .not()
      .isEmpty(),
    check("discount_price")
      .not()
      .isEmpty(),
    check("orignal_price")
      .not()
      .isEmpty(),
    check("product_type")
      .not()
      .isEmpty(),
    check("discount")
      .not()
      .isEmpty(),
    check("delivery_time")
      .not()
      .isEmpty(),
    check("product_details")
      .not()
      .isEmpty(),
    check("pic1")
      .not()
      .isEmpty(),
    check("pic2")
      .not()
      .isEmpty(),
    check("pic3")
      .not()
      .isEmpty(),
    check("brand_name")
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
        vendor_id,
        product_name,
        discount_price,
        orignal_price,
        product_type,
        discount,
        delivery_time,
        product_details,
        pic1,
        pic2,
        pic3,
        status,
        brand_name
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_products ( vendor_id, product_name, discount_price, orignal_price, product_type, discount, delivery_time, product_details, pic1, pic2, pic3, status, created_at, updated_at, deleted,brand_name ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING * ",
        [
          vendor_id,
          product_name,
          discount_price,
          orignal_price,
          product_type,
          discount,
          delivery_time,
          product_details,
          pic1,
          pic2,
          pic3,
          status,
          created_at,
          updated_at,
          deleted,
          brand_name
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
              message: "product added"
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
// ...................................................................update product

router.post(
  "/updateproduct",
  [
    check("product_id")
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
        product_id,
        vendor_id,
        product_name,
        discount_price,
        orignal_price,
        product_type,
        discount,
        delivery_time,
        product_details,
        pic1,
        pic2,
        pic3,
        status,
        brand_name
      } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_products SET  vendor_id =$2 ,product_name=$3,discount_price=$4,orignal_price=$5,product_type=$6,discount=$7,delivery_time=$8,product_details=$9,pic1=$10,pic2=$11,pic3=$12,status=$13,updated_at=$14,brand_name=$15 WHERE product_id = $1 ",
        [
          product_id,
          vendor_id,
          product_name,
          discount_price,
          orignal_price,
          product_type,
          discount,
          delivery_time,
          product_details,
          pic1,
          pic2,
          pic3,
          status,
          updated_at,
          brand_name
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
// .............................................................................remove
router.post(
  "/deleteproduct",
  [
    check("product_id")
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
      const { product_id } = req.body;
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_products SET  deleted= $2 ,updated_at=$3 WHERE product_id =$1  ",
        [product_id, deleted, updated_at],
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
  "/allproduct",

  async (req, res) => {
    try {
      const error = await validationResult(req);
      if (!error.isEmpty()) {
        return res.status(300).json({
          success: false,
          message: error
        });
      }

      pool.query(
        "SELECT * FROM pv_products WHERE   deleted = $1",
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
  }
);

router.post(
  "/singleproduct",
  [
    check("vendor_id")
      .not()
      .isEmpty(),
    check("product_id")
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
      const { vendor_id, product_id } = req.body;
      pool.query(
        "SELECT * FROM pv_products WHERE vendor_id = $1 AND product_id = $2 AND deleted = $3",
        [vendor_id, product_id, "no"],
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
                message: "data updated"
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
