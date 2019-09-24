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
  res.send("pv_delivery_person_review api working");
});
// ...............................................................................
router.post(
  "/add",
  [
    check("delivery_person_id")
      .not()
      .isEmpty(),
    check("user_mobile")
      .not()
      .isEmpty(),
    check("rating")
      .not()
      .isEmpty(),
    check("details")
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
        delivery_person_id,
        user_mobile,
        rating,
        details,
        status
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_delivery_person_review ( delivery_person_id, user_mobile, rating, details, status,created_at,updated_at,deleted) VALUES ($1, $2 , $3 ,$4,$5,$6,$7,$8) RETURNING * ",
        [
          delivery_person_id,
          user_mobile,
          rating,
          details,
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
// ...................................................................

//   ......................................................................fetch all address
router.post("/all", async (req, res) => {
  try {
    const error = await validationResult(req);
    if (!error.isEmpty()) {
      return res.status(300).json({
        success: false,
        message: error
      });
    }
    const { delivery_person_id } = req.body;

    pool.query(
      "SELECT * FROM pv_delivery_person_review WHERE   deleted = $1",
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
// ............................................................................update address
router.post(
  "/update",
  [
    check("delivery_person_review_id")
      .not()
      .isEmpty(),
    check("delivery_person_id")
      .not()
      .isEmpty(),
    check("user_mobile")
      .not()
      .isEmpty(),
    check("rating")
      .not()
      .isEmpty(),
    check("details")
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
        delivery_person_review_id,
        delivery_person_id,
        user_mobile,
        rating,
        details,
        status
      } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_delivery_person_review SET  delivery_person_id=$2,user_mobile=$3,rating=$4,details=$5,status=$6,updated_at=$7 WHERE delivery_person_review_id =$1  ",
        [
          delivery_person_review_id,
          delivery_person_id,
          user_mobile,
          rating,
          details,
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
// ......................................................................remove single adress
router.post(
  "/deletes",
  [
    check("delivery_person_review_id")
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
      const { delivery_person_review_id } = req.body;
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_delivery_person_review SET  deleted= $2 ,updated_at=$3 WHERE delivery_person_review_id = $1  ",
        [delivery_person_review_id, deleted, updated_at],
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

module.exports = router;
