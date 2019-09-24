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
  res.send("pv_delivery_person_area api working");
});
// ...............................................................................
router.post(
  "/add",
  [
    check("delivery_person_id")
      .not()
      .isEmpty(),
    check("area")
      .not()
      .isEmpty(),
    check("pin_code")
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
      const { delivery_person_id, area, pin_code, status } = req.body;
      const created_at = new Date();
      const updated_at = new Date();
      const deleted = "no";
      pool.query(
        "INSERT INTO pv_delivery_person_area ( delivery_person_id, area, pin_code, status,created_at,updated_at,deleted) VALUES ($1, $2 , $3 ,$4,$5,$6,$7) RETURNING * ",
        [
          delivery_person_id,
          area,
          pin_code,
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
// ...................................................................fetch single address
router.post(
  "/single",
  [
    check("delivery_person_id")
      .not()
      .isEmpty(),
    check("delivery_person_area_id")
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
      const { delivery_person_id, delivery_person_area_id } = req.body;
      pool.query(
        "SELECT * FROM pv_delivery_person_area WHERE delivery_person_id = $1 AND delivery_person_area_id = $2 AND deleted = $3",
        [delivery_person_id, delivery_person_area_id, "no"],
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
  "/all",
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
        "SELECT * FROM pv_delivery_person_area WHERE  delivery_person_id = $1 AND deleted = $2",
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
  "/update",
  [
    check("delivery_person_area_id")
      .not()
      .isEmpty(),
    check("delivery_person_id")
      .not()
      .isEmpty(),
    check("area")
      .not()
      .isEmpty(),
    check("pin_code")
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
        delivery_person_area_id,
        delivery_person_id,
        area,
        pin_code,
        status
      } = req.body;
      const updated_at = new Date();
      pool.query(
        "UPDATE pv_delivery_person_area SET  delivery_person_id=$2,area=$3,pin_code=$4,status=$5,updated_at=$6 WHERE delivery_person_area_id =$1  ",
        [
          delivery_person_area_id,
          delivery_person_id,
          area,
          pin_code,
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
    check("delivery_person_area_id")
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
      const { delivery_person_area_id } = req.body;
      const updated_at = new Date();
      const deleted = "yes";
      pool.query(
        "UPDATE pv_delivery_person_area SET  deleted= $2 ,updated_at=$3 WHERE delivery_person_area_id = $1  ",
        [delivery_person_area_id, deleted, updated_at],
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
