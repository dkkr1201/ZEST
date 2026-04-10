const express = require('express');
const router = express.Router();
const Product = require('../../models/product');

router.get('/product-count', async (req, res) => {
    try {
        const count = await Product.countDocuments({});
        res.json({ count });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
