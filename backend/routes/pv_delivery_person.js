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
  res.send("pv_delivery_person api working");
});
// ...............................................................................add
router.post(
  "/add",
  [
    check("fname")
      .not()
      .isEmpty(),
    check("lname")
      .not()
      .isEmpty(),
    check("mobile")
      .not()
      .isEmpty(),
    check("pic")
      .not()
      .isEmpty(),
    check("doc1")
      .not()
      .isEmpty(),
    check("temp_address")
      .not()
      .isEmpty(),
    check("per_address")
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
        fname,
        lname,
        mobile,
        email,
        pic,
        doc1,
        doc2,
        doc3,
        doc4,
        doc5,
        temp_address,
        per_address,
        status
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_delivery_person  (  fname, lname, mobile, email, pic, doc1, doc2, doc3, doc4, doc5, temp_address, per_address,status, created_at, updated_at, deleted ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING * ",
        [
          fname,
          lname,
          mobile,
          email,
          pic,
          doc1,
          doc2,
          doc3,
          doc4,
          doc5,
          temp_address,
          per_address,
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
              message: "data added"
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
// ...............................................update
router.post(
  "/update",
  [
    check("delivery_person_id")
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
    check("pic")
      .not()
      .isEmpty(),
    check("doc1")
      .not()
      .isEmpty(),
    check("temp_address")
      .not()
      .isEmpty(),
    check("per_address")
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
        fname,
        lname,
        mobile,
        email,
        pic,
        doc1,
        doc2,
        doc3,
        doc4,
        doc5,
        temp_address,
        per_address,
        status
      } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_delivery_person  SET fname=$2, lname=$3, mobile=$4,email=$5, pic=$6, doc1=$7, doc2=$8, doc3=$9, doc4=$10, doc5=$11, temp_address=$12, per_address=$13, status=$14,updated_at=$15 WHERE delivery_person_id =$1   ",
        [
          delivery_person_id,
          fname,
          lname,
          mobile,
          email,
          pic,
          doc1,
          doc2,
          doc3,
          doc4,
          doc5,
          temp_address,
          per_address,
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
//.................................................remove
router.post(
  "/deletes",
  [
    check("delivery_person_id")
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
      const { delivery_person_id } = req.body;
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_delivery_person  SET  deleted= $2 ,updated_at=$3 WHERE delivery_person_id =$1  ",
        [delivery_person_id, deleted, updated_at],
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
//   ......................................................................fetch all
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
      "SELECT * FROM pv_delivery_person  WHERE deleted = $1",
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
module.exports = router;
