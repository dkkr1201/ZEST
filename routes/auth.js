const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/register', async (req, res) => {
    try {
        const { username, password, passwordConfirm, role, email } = req.body;

        // Validation
        if (!username || !password || !role || !email) {
            req.flash('error', 'All fields are required');
            return res.redirect('/register');
        }

        if (password !== passwordConfirm) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/register');
        }

        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters');
            return res.redirect('/register');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });

        if (existingUser) {
            if (existingUser.username === username) {
                req.flash('error', 'Username already taken. Choose another.');
            } else {
                req.flash('error', 'Email already registered.');
            }
            return res.redirect('/register');
        }

        // Create new user
        const user = new User({ username, email, role });
        const registeredUser = await User.register(user, password);
        await registeredUser.save();

        req.flash('success', `Welcome ${username}! Registered successfully. Please login.`);
        res.redirect('/login');
    } catch (err) {
        console.error('Registration error:', err);
        req.flash('error', err.message || 'Registration failed');
        res.redirect('/register');
    }
});

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Invalid username or password' }),
    function (req, res) {
        try {
            const { role } = req.body;
            
            if (role && role !== req.user.role) {
                req.flash('error', `Account is registered as ${req.user.role}. Select correct role.`);
                req.logout((err) => res.redirect('/login'));
                return;
            }
            
            req.flash('success', `Welcome ${req.user.username}! Logged in as ${req.user.role}.`);
            res.redirect('/products');
        } catch (err) {
            console.error('Login error:', err);
            req.flash('error', 'Login failed');
            res.redirect('/login');
        }
    });

router.get('/logout', (req, res) => {
    const username = req.user?.username || 'User';
    req.logout(function (err) {
        if (err) {
            console.error('Logout error:', err);
            req.flash('error', 'Logout failed');
            return res.redirect('/products');
        }
        req.flash('success', `${username}, you have logged out successfully!`);
        res.redirect('/');
    });
})

module.exports = router;