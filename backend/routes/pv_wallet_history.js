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
  res.send("pv_wallet_history api working");
});
// ...............................................................................
router.post(
  "/wallet",
  [
    check("user_mobile")
      .not()
      .isEmpty(),
    check("amount")
      .not()
      .isEmpty(),
    check("trans_type")
      .not()
      .isEmpty(),
    check("payment_method")
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
        amount,
        trans_type,
        payment_method,
        status
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_wallet_history ( user_mobile,amount,trans_type,payment_method,status,created_at,updated_at,deleted) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING * ",
        [
          user_mobile,
          amount,
          trans_type,
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
              message: "wallet data added"
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
// ........................................................fetch all wallet
router.post(
  "/fetchwallet",
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
        "SELECT * FROM pv_wallet_history WHERE  user_mobile = $1 AND deleted = $2",
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
