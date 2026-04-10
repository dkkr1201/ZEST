const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../../middlewares');
const Product = require('../../models/product');
const User = require('../../models/user');

router.post('/products/:productId/like', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    const isExist = req.user.wishList.includes(product._id);

    if (isExist) {
        req.user = await User.findByIdAndUpdate({ _id: req.user._id }, { $pull: { wishList: productId } }, { new: true });
    }
    else {
        req.user = await User.findByIdAndUpdate({ _id: req.user._id }, { $addToSet: { wishList: productId } }, { new: true });
    }

    res.status(200).json({
        success: true
    })

})

module.exports = router;                                                                                                                                                