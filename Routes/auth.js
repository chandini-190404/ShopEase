const express = require("express");
const bcrypt = require("bcryptjs");
const { db } = require("../config/firebaseConfig");
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("signup"); 
});

router.get("/register", (req, res) => {
    res.redirect("/signup"); 
});

router.post("/register", async (req, res) => {
    console.log("📥 Incoming request to /register", req.body);

    const { fullname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        console.log("❌ Passwords do not match.");
        return res.status(400).send("Passwords do not match");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").add({ fullname, email, password: hashedPassword });

        console.log("✅ User registered successfully:", email);
        res.redirect("/login");  
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).send("Error registering user");
    }
});

router.get("/login", (req, res) => {
    res.render("login"); 
});

router.post("/login", async (req, res) => {
    console.log("📥 Login request received:", req.body);

    const { email, password } = req.body;

    try {
        const snapshot = await db.collection("users").where("email", "==", email).get();

        if (snapshot.empty) {
            console.log("⚠️ User not found.");
            return res.status(400).send("User not found. Please sign up first.");
        }

        const user = snapshot.docs[0].data();
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("❌ Invalid credentials.");
            return res.status(400).send("Invalid email or password.");
        }

        req.session.user = { email: user.email, fullname: user.fullname };

        console.log("✅ Login successful:", user.email);
        res.redirect("/dashboard");  
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).send("Error logging in.");
    }
});

router.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");  
    }
    res.render("dashboard", { user: req.session.user });
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");  
    });
});

module.exports = router;
