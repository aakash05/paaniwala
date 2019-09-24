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
  res.send("pv_vendor api working");
});
// ...............................................................................add vendor

router.post(
  "/addvendor",
  [
    check("supplier_id")
      .not()
      .isEmpty(),
    check("business_name")
      .not()
      .isEmpty(),
    check("fname")
      .not()
      .isEmpty(),
    check("lname")
      .not()
      .isEmpty(),
    check("mobile")
      .not()
      .isEmpty(),
    check("email")
      .not()
      .isEmpty(),
    check("address")
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
        supplier_id,
        business_name,
        fname,
        lname,
        mobile,
        email,
        address,
        pic1,
        pic2,
        pic3,
        status
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_vendor ( supplier_id, business_name, fname, lname, mobile, email, address, pic1, pic2, pic3, status, created_at, updated_at, deleted ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING * ",
        [
          supplier_id,
          business_name,
          fname,
          lname,
          mobile,
          email,
          address,
          pic1,
          pic2,
          pic3,
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
              message: "supplier added"
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
// ...................................................................update supplier

router.post(
  "/updatevendor",
  [
    check("supplier_id")
      .not()
      .isEmpty(),
    check("business_name")
      .not()
      .isEmpty(),
    check("fname")
      .not()
      .isEmpty(),
    check("lname")
      .not()
      .isEmpty(),
    check("mobile")
      .not()
      .isEmpty(),
    check("email")
      .not()
      .isEmpty(),
    check("address")
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
        supplier_id,
        business_name,
        fname,
        lname,
        mobile,
        email,
        address,
        pic1,
        pic2,
        pic3,
        status
      } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_vendor SET  supplier_id =$2 ,business_name=$3,fname=$4,lname=$5,mobile=$6,email=$7,address=$8,pic1=$9,pic2=$10,pic3=$11,status=$12,updated_at=$13 WHERE vendor_id = $1 ",
        [
          vendor_id,
          supplier_id,
          business_name,
          fname,
          lname,
          mobile,
          email,
          address,
          pic1,
          pic2,
          pic3,
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
// .............................................................................remove vendor
router.post(
  "/deletevendor",
  [
    check("vendor_id")
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
      const { vendor_id } = req.body;
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_vendor SET  deleted= $2 ,updated_at=$3 WHERE vendor_id =$1  ",
        [vendor_id, deleted, updated_at],
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
//   ......................................................................fetch all vendor
router.post(
  "/allvendor",

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
        "SELECT * FROM pv_vendor WHERE   deleted = $1",
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
// ...............................................................fetch all vendor of supplier
router.post(
  "/allvendorofsupplier",
  [
    check("supplier_id")
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
      const { supplier_id } = req.body;
      pool.query(
        "SELECT * FROM pv_vendor WHERE   deleted = $1 AND supplier_id=$2",
        ["no", supplier_id],
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
// ...............................................................fetch all order of vendor
router.post(
  "/allordervendor",
  [
    check("vendor_id")
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
      const { vendor_id } = req.body;
      pool.query(
        "SELECT * FROM pv_order_history WHERE   deleted = $1 AND vendor_id=$2",
        ["no", vendor_id],
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
// ...............................................................fetch all review of vendor
router.post(
  "/allreviewvendor",
  [
    check("vendor_id")
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
      const { vendor_id } = req.body;
      pool.query(
        "SELECT * FROM pv_vendor_reviews WHERE   deleted = $1 AND vendor_id=$2",
        ["no", vendor_id],
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
// ...............................................................fetch all product review of vendor
router.post(
  "/allproductreviewvendor",
  [
    check("vendor_id")
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
      const { vendor_id } = req.body;
      pool.query(
        "SELECT pv_products_reviews.products_reviews_id, pv_products_reviews.product_id, pv_products_reviews.user_mobile, pv_products_reviews.rating, pv_products_reviews.details, pv_products_reviews.status, pv_products_reviews.created_at, pv_products_reviews.updated_at, pv_products_reviews.deleted FROM public.pv_products right OUTER JOIN public.pv_products_reviews ON pv_products.product_id = pv_products_reviews.product_id   WHERE pv_products.vendor_id=$2 AND pv_products_reviews.deleted=$1 AND pv_products.deleted='no' ;",
        ["no", vendor_id],
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
// ..................................get data using mobile
router.post(
  "/vendorbymobile",
  [
    check("mobile")
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
      const { mobile } = req.body;
      pool.query(
        "SELECT * FROM pv_vendor WHERE   deleted = $1 AND mobile=$2",
        ["no", mobile],
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
