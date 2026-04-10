const Product = require('../models/product')

module.exports.showAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        console.log(req.session);
        res.render('products/index', { products });
    }
    catch (e) {
        res.render('error', { err: e.message });
    }

}

module.exports.productForm = (req, res) => {
    res.render('products/new');
}

module.exports.createNewProduct = async (req, res) => {
    try {
        const { name, image, price, desc } = req.body;
        await Product.create({ name, image, price, desc, author: req.user._id });

        req.flash('success', 'Successfully added your product!');
        res.redirect('/products/seller');
    }
    catch (e) {
        res.render('err', { err: e.message });
    }
}

module.exports.showProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('reviews').populate('author');

    res.render('products/show', { product });
}

module.exports.showSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ author: req.user._id });
        res.render('products/seller', { products });
    } catch (e) {
        res.render('error', { err: e.message });
    }
}

module.exports.editProductForm = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    res.render('products/edit', { product });
}

module.exports.editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, image, price, desc } = req.body;

    await Product.findByIdAndUpdate(id, { name, image, price, desc });

    req.flash('success', 'Changes saved!');
    res.redirect(`/products/${id}`);
}

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted your product!');
    res.redirect('/products');
}