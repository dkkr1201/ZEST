require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Product = require('./models/product');
const MongoStore = require('connect-mongo');
const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/zest-db';
const secret = process.env.SECRET || 'thisshouldbeabettersecret';

mongoose.connect(db_url)
    .then(() => { console.log('zest-db connected!!') })
    .catch((err) => console.log(err));

// Global crash logger
const fs = require('fs');
process.on('unhandledRejection', (reason, promise) => {
    const msg = `Unhandled Rejection at: ${promise} reason: ${reason}\n`;
    fs.appendFileSync('crash.log', msg);
    console.error(msg);
});
process.on('uncaughtException', (err) => {
    const msg = `Uncaught Exception: ${err.message}\n${err.stack}\n`;
    fs.appendFileSync('crash.log', msg);
    console.error(msg);
    process.exit(1);
});


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
    store: MongoStore.create({ mongoUrl: db_url }),
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    next();
})

app.get('/', async (req, res) => {
    try {
        const productCount = await Product.countDocuments({});
        res.render('home', { productCount });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});


// ------------- routes
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');

// -------------- APIs
const productAPI = require('./routes/api/productapi');
const paymentAPI = require('./routes/api/paymentapi');
const statsAPI = require('./routes/api/statsapi');

app.use('/products', productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(productAPI);
app.use(cartRoutes);
app.use(paymentAPI);
app.use('/api', statsAPI);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Zest Server is Up at Port ', PORT);
});