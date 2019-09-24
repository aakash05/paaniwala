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
  res.send("pv_delivery_person_attendance api working");
});

// ...............................................................................

router.post(
  "/attendance",
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
      const { delivery_person_id, status } = req.body;
      const today_date = new Date();
      const h = new Date().getHours();
      const m = new Date().getMinutes();
      const s = new Date().getSeconds();
      const today_time = `${h}:${m}:${s}`;
      const created_at = new Date();
      const updated_at = new Date();

      const deleted = "no";
      pool.query(
        "INSERT INTO pv_delivery_person_attendance (delivery_person_id, today_date , today_time, status, created_at, updated_at, deleted) VALUES ($1, $2 , $3, $4, $5, $6, $7) RETURNING * ",
        [
          delivery_person_id,
          today_date,
          today_time,
          status,
          created_at,
          updated_at,
          deleted
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
            res.status(200).json({
              success: true,
              message: "attendance inserted"
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

router.post(
  "/update",
  [
    check("del_per_att_id")
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
      const { del_per_att_id, status } = req.body;
      const h = new Date().getHours();
      const m = new Date().getMinutes();
      const s = new Date().getSeconds();
      const today_time = `${h}:${m}:${s}`;
      const today_date = new Date();
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_delivery_person_attendance SET today_date=$2, today_time=$3, updated_at=$4, status=$5 WHERE del_per_att_id =$1 ",
        [del_per_att_id, today_date, today_time, updated_at, status],
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
                message: "data updation failed / some wrong information"
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
  "/alloneperson",
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
      pool.query(
        "SELECT * FROM pv_delivery_person_attendance WHERE delivery_person_id = $1 AND   deleted = $2",
        [delivery_person_id, "no"],
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
                message: "data found"
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
  "/alltoday",

  async (req, res) => {
    try {
      const error = await validationResult(req);
      if (!error.isEmpty()) {
        return res.status(300).json({
          success: false,
          message: error
        });
      }
      const date = new Date();

      pool.query(
        "SELECT * FROM pv_delivery_person_attendance WHERE today_date = $1 AND   deleted = $2 ",
        [date, "no"],
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
                message: "data found"
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
