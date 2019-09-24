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
  res.send("pv_order_status api working");
});
// ...............................................................................
router.post(
  "/add",
  [
    check("vendor_id")
      .not()
      .isEmpty(),
    check("delivery_person_id")
      .not()
      .isEmpty(),
    check("user_mobile")
      .not()
      .isEmpty(),
    check("order_status")
      .not()
      .isEmpty(),
    check("vendor_status")
      .not()
      .isEmpty(),
    check("delivery_status")
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
        vendor_id,
        delivery_person_id,
        user_mobile,
        order_status,
        vendor_status,
        delivery_status,
        status
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_order_status ( vendor_id, delivery_person_id, user_mobile, order_status, vendor_status, delivery_status, status,created_at,updated_at,deleted) VALUES ($1, $2 , $3 ,$4,$5,$6,$7,$8,$9,$10) RETURNING * ",
        [
          vendor_id,
          delivery_person_id,
          user_mobile,
          order_status,
          vendor_status,
          delivery_status,
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
      "SELECT * FROM pv_order_status WHERE  deleted = $1",
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
// ............................................................................update
router.post(
  "/updatevendor",
  [
    check("order_status_id")
      .not()
      .isEmpty(),
    check("vendor_id")
      .not()
      .isEmpty(),
    check("vendor_status")
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
      const { order_status_id, vendor_status, vendor_id } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_order_status SET  vendor_status=$3 , updated_at=$4 WHERE order_status_id =$1 AND vendor_id=$2  ",
        [order_status_id, vendor_id, vendor_status, updated_at],
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
router.post(
  "/updatedelivery",
  [
    check("order_status_id")
      .not()
      .isEmpty(),
    check("delivery_person_id")
      .not()
      .isEmpty(),
    check("delivery_status")
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
      const { order_status_id, delivery_person_id, delivery_status } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_order_status SET  delivery_status=$3,updated_at=$4 WHERE order_status_id =$1 AND delivery_person_id=$2  ",
        [order_status_id, delivery_person_id, delivery_status, updated_at],
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

module.exports = router;
