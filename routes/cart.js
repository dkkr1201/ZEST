const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const User = require('../models/user');
const Product = require('../models/product');


router.post('/user/:productId/cart/add', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    const userId = req.user._id;
    const user = await User.findById(userId);

    let ind = -1;
    const item = user.cart.find((item, index) => {
        if (item.productId.equals(product._id)) {
            ind = index;
            return item;
        }
    });

    if (item) {
        user.cart[ind].quantity++;
    } else {
        user.cart.push({ productId: product._id });
    }

    await user.save();

    req.flash('success', 'Item added to cart');
    if (req.query.buyNow) {
        return res.redirect('/checkout');
    }
    res.redirect('/user/cart');
})


router.get('/user/cart', isLoggedIn, async (req, res) => {
    if (req.query.payment === 'success') {
        req.flash('success', 'Payment Successful! Your order has been placed.');
    } else if (req.query.payment === 'failed') {
        req.flash('error', 'Payment Failed! Please try again.');
    } else if (req.query.payment === 'cancelled') {
        req.flash('error', 'Payment was cancelled.');
    }
    const userId = req.user._id;
    const user = await User.findById(userId).populate('cart.productId');

    res.render('cart/index', { cart: user.cart });
})

router.get('/checkout', isLoggedIn, async (req, res) => {
    console.log("GET /checkout requested by user:", req.user._id);
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('cart.productId');

        // Filter out items where the product might have been deleted
        const validCart = user.cart.filter(item => item.productId);

        if (validCart.length === 0) {
            req.flash('error', 'Your cart is empty or products are no longer available.');
            return res.redirect('/user/cart');
        }

        // Calculate totals on the server for security/consistency
        let subtotal = 0;
        validCart.forEach(item => {
            subtotal += item.productId.price * item.quantity;
        });
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        res.render('cart/checkout', {
            cart: validCart,
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        });
    } catch (e) {
        console.error("Checkout Error:", e);
        req.flash('error', 'Something went wrong during checkout. Please try again.');
        res.redirect('/user/cart');
    }
})

router.post('/user/:productId/cart/remove', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);

    user.cart = user.cart.filter(item => !item.productId.equals(productId));
    await user.save();

    req.flash('success', 'Item removed from cart');
    res.redirect('/user/cart');
})

router.post('/user/:productId/cart/decrease', isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);

    const item = user.cart.find(item => item.productId.equals(productId));
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
            await user.save();
            req.flash('success', 'Item quantity decreased');
        } else {
            user.cart = user.cart.filter(i => !i.productId.equals(productId));
            await user.save();
            req.flash('success', 'Item removed from cart');
        }
    }
    res.redirect('/user/cart');
})

const Order = require('../models/order');

router.get('/user/orders', isLoggedIn, async (req, res) => {
    const orders = await Order.find({ user: req.user._id, paymentStatus: true })
        .populate('products.productId')
        .sort({ createdAt: -1 });
    res.render('cart/orders', { orders });
});

module.exports = router;
