const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const { engine } = require("express-handlebars");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
);

app.set("view engine", "ejs");
app.set("views", "views");
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findById("622f5f71cadefcf02bea7827")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRouter);
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
