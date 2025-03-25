const express = require("express");
const router = express.Router(); 
router.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

router.post("/add", (req, res) => {
    const { productId, productName, productPrice, productImage } = req.body;

    if (!productId || !productName || !productPrice || !productImage) {
        console.error("Missing product details:", req.body);
        return res.redirect("/products"); 
    }

    let cart = req.session.cart || [];

    let existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice), 
            image: productImage, 
            quantity: 1
        });
    }

    req.session.cart = cart;
    console.log("Cart Updated:", req.session.cart); 
    res.redirect("/cart");
});

router.get("/", (req, res) => {
    res.render("cart", { cart: req.session.cart });
});

router.get("/checkout", (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect("/cart"); 
    }
    res.render("checkout", { cart: req.session.cart });
});

module.exports = router; 
