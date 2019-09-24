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
  res.send("pv_users_address api working");
});
// ...............................................................................
router.post(
  "/address",
  [
    check("user_mobile")
      .not()
      .isEmpty(),
    check("address")
      .not()
      .isEmpty(),
    check("address_type")
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
      const { user_mobile, address, address_type, status } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_users_address ( user_mobile , address , address_type,status,created_at,updated_at,deleted) VALUES ($1, $2 , $3 ,$4,$5,$6,$7) RETURNING * ",
        [
          user_mobile,
          address,
          address_type,
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
              message: "address inserted"
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
// ...................................................................fetch single address
router.post(
  "/singleaddress",
  [
    check("user_mobile")
      .not()
      .isEmpty(),
    check("user_add_id")
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
      const { user_add_id, user_mobile } = req.body;
      pool.query(
        "SELECT * FROM pv_users_address WHERE user_add_id = $1 AND user_mobile = $2 AND deleted = $3",
        [user_add_id, user_mobile, "no"],
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
//   ......................................................................
//   ......................................................................fetch all address
router.post(
  "/alladdress",
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
        "SELECT * FROM pv_users_address WHERE  user_mobile = $1 AND deleted = $2",
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
// ............................................................................update address
router.post(
  "/updateadd",
  [
    check("user_add_id")
      .not()
      .isEmpty(),
    check("user_mobile")
      .not()
      .isEmpty(),
    check("address")
      .not()
      .isEmpty(),
    check("address_type")
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
      const { user_add_id, user_mobile, address, address_type } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_users_address SET  address=$3,address_type=$4,updated_at=$5 WHERE user_add_id =$1 AND user_mobile = $2  ",
        [user_add_id, user_mobile, address, address_type, updated_at],
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
  "/deletesingle",
  [
    check("user_add_id")
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
      const { user_add_id, user_mobile } = req.body;
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_users_address SET  deleted= $3 ,updated_at=$4 WHERE user_add_id =$1 AND user_mobile = $2  ",
        [user_add_id, user_mobile, deleted, updated_at],
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
// ......................................................................remove all adress
router.post(
  "/deleteall",
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
        "UPDATE pv_users_address SET  deleted= $2 ,updated_at=$3 WHERE user_mobile = $1  ",
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
// ...................................................................fetch last address
router.post(
  "/lastaddress",
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
        "SELECT * FROM pv_users_address WHERE  user_mobile = $1 AND deleted = $2 ORDER BY updated_at DESC ",
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
                data: result.rows[0],
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
