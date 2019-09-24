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
  res.send("pv_supplier api working");
});
// ............................................................................... add supplier
router.post(
  "/addsupplier",
  [
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
        business_name,
        fname,
        lname,
        mobile,
        email,
        address,
        status
      } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_supplier ( business_name, fname, lname, mobile, email, address, status, created_at, updated_at, deleted ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING * ",
        [
          business_name,
          fname,
          lname,
          mobile,
          email,
          address,
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
  "/updatesupplier",
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
        status
      } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_supplier SET  business_name=$2,fname=$3,lname=$4,mobile=$5,email=$6,address=$7,status=$8,updated_at=$9 WHERE supplier_id =$1  ",
        [
          supplier_id,
          business_name,
          fname,
          lname,
          mobile,
          email,
          address,
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
// .............................................................................remove user
router.post(
  "/deletesupplier",
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
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_supplier SET  deleted= $2 ,updated_at=$3 WHERE supplier_id =$1  ",
        [supplier_id, deleted, updated_at],
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
//   ......................................................................fetch all supplier
router.post(
  "/allsupplier",

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
        "SELECT * FROM pv_supplier WHERE   deleted = $1",
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
// ..............................................................allorderofsupplier
router.post(
  "/allorderofsupplier",
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
      let vendor_data = [];
      let order_data = [];
      let finaldatalenth = 0;
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
              result.rows.map(re => {
                console.log(re.vendor_id);
                vendor_data.push(re.vendor_id);
                // pool.query(
                //   "SELECT * FROM pv_order_history WHERE deleted = $1 AND vendor_id=$2",
                //   ["no", re.vendor_id],
                //   (error1, result1) => {
                //     if (error1) {
                //       return res.status(300).json({
                //         success: false,
                //         data: null,
                //         message: error
                //       });
                //     }
                //     if (result1) {
                //       if (result1.rowCount !== 0) {
                //         result1.rows.map(rr => {
                //           vendor_data.push(rr);
                //         });
                //       }
                //     }
                //   }
                // );
              });
            } else {
              res.status(200).json({
                success: false,
                data: null,
                message: "data not found"
              });
            }
          }

          if (vendor_data !== []) {
            vendor_data.map((id, index) => {
              pool.query(
                "SELECT * FROM pv_order_history WHERE deleted = $1 AND vendor_id=$2",
                ["no", id],
                async (error1, result1) => {
                  if (error1) {
                    return res.status(300).json({
                      success: false,
                      data: null,
                      message: error
                    });
                  }
                  if (result1) {
                    if (result1.rowCount !== 0) {
                      await result1.rows.map(rr => {
                        order_data.push(rr);
                        finaldatalenth = finaldatalenth + 1;
                      });
                      if (vendor_data.length - 1 === index) {
                        res.status(200).json({
                          success: true,
                          data: order_data,
                          message: "orders"
                        });
                      }
                    }
                  }
                }
              );
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
// .................................................................

module.exports = router;
