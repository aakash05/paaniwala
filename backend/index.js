const express = require("express");

const app = express();

const cors = require("cors");
const bodyparser = require("body-parser");

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
// .............................................................................................

app.use("/pv_users", require("./routes/pv_users"));
app.use("/pv_users_address", require("./routes/pv_users_address"));
app.use("/pv_cart", require("./routes/pv_cart"));
app.use("/pv_wallet_history", require("./routes/pv_wallet_history"));
app.use("/pv_payment_method", require("./routes/pv_payment_method"));
app.use("/pv_supplier", require("./routes/pv_supplier"));
app.use("/pv_vendor", require("./routes/pv_vendor"));
app.use("/pv_vendor_reviews", require("./routes/pv_vendor_reviews"));
app.use("/pv_products", require("./routes/pv_products"));
app.use("/pv_products_reviews", require("./routes/pv_products_reviews"));
app.use("/pv_delivery_person", require("./routes/pv_delivery_person"));
app.use(
  "/pv_delivery_person_area",
  require("./routes/pv_delivery_person_area")
);
app.use(
  "/pv_delivery_person_review",
  require("./routes/pv_delivery_person_review")
);
app.use("/pv_order_status", require("./routes/pv_order_status"));
app.use("/pv_order_history", require("./routes/pv_order_history"));
app.use(
  "/pv_delivery_person_attendance",
  require("./routes/pv_delivery_person_attendance")
);
// ///////////////////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Panivala api working");
});
// ..............................................................................................
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server running in ${PORT}`);
});
