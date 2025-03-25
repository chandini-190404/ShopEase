const express = require("express");
const { db } = require("../config/firebaseConfig");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const productsSnapshot = await db.collection("products").get();
        const productList = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("📦 Products fetched:", productList); 

        res.render("products", { products: productList }); 
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).send("Error fetching products");
    }
});

router.get("/:category", async (req, res) => {
    const category = req.params.category;
    try {
        const productsSnapshot = await db.collection("products").where("category", "==", category).get();
        const products = productsSnapshot.docs.map(doc => doc.data());
        res.render("products", { products, category });
    } catch (error) {
        res.status(500).send("Error fetching products: " + error.message);
    }
});

module.exports = router;
