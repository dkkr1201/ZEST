const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');

router.get('/', isLoggedIn, (req, res) => {
    res.render('shopper/index');
});

module.exports = router;
