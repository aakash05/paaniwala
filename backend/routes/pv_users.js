const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Pool = require("pg").Pool;

const pool = new Pool({
  database: "postgres",
  host: "postgres",
  user: "paanivaale",
  password: "123",
  port: 5432
});

router.get("/", (req, res) => {
  res.send("pv_users api working");
});

// ...................................................................api (1) create user
router.post(
  "/signup",
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
    check("email").isEmail(),
    check("city")
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
        city,
        otp,
        wallet_bal,
        status
      } = req.body;
      const verify = "no";
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "SELECT * FROM pv_users WHERE mobile = $1 AND deleted=$2 ",
        [mobile, "no"],
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
                message: "number all ready registered"
              });
            } else {
              pool.query(
                "INSERT INTO pv_users (fname,lname,mobile,email,otp,city,wallet_bal,verify,status,created_at,updated_at,deleted) VALUES ($1, $2 , $3 ,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING * ",
                [
                  fname,
                  lname,
                  mobile,
                  email,
                  otp,
                  city,
                  wallet_bal,
                  verify,
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
                      message: "data inserted"
                    });
                  }
                }
              );
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
    // ...................................................................api (1) create user end
  }
); // ................................................................... update user
router.post(
  "/updateuser",
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
    check("email").isEmail(),
    check("city")
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
      const { fname, lname, mobile, email, city } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_users SET fname=$1 , lname = $2,email=$3,city=$4,updated_at=$5 WHERE mobile = $6 ",
        [fname, lname, email, city, updated_at, mobile],
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
              message: "data updated"
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
// ................................................................... select users
router.post(
  "/user",
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
      const mobile = req.body.mobile;
      pool.query(
        "SELECT * FROM pv_users WHERE mobile = $1 AND deleted = $2",
        [mobile, "no"],
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
// ................................................................... delete users
router.post(
  "/delete",
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
      const deleted = "yes";
      const mobile = req.body.mobile;
      pool.query(
        "UPDATE pv_users SET deleted = $1  WHERE mobile = $2 ",
        [deleted, mobile],
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
              message: "user deleted"
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

module.exports = router;
