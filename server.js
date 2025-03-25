const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");

const app = express();

app.set("views", __dirname + "/views"); 

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/images', express.static('public/images'));

app.use(express.urlencoded({ extended: true }));

app.use(session({ 
    secret: "mysecret", 
    resave: false, 
    saveUninitialized: false 
}));

//  Home Route
app.get("/", (req, res) => {
    res.render("index");
});


//  Routes
app.use("/", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

app.get("/checkout", (req, res) => {
    res.redirect("/cart/checkout");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
