# 🍋 Zest E-Commerce App 🛍️

🚀 A full-featured e-commerce application built with Node.js, Express.js, MongoDB, Mongoose, Passport.js, and EJS.

## ✨ Features

- 🔐 **User Authentication**: Register and login with Passport.js local strategy
- 📦 **Product Management**: Browse products, add/edit/delete (sellers only)
- 🛒 **Shopping Cart**: Add to cart, manage quantities
- ⭐ **Reviews & Ratings**: Leave reviews with star ratings
- ❤️ **Wishlist**: Like/unlike products
- 💳 **Payment Integration**: Razorpay gateway with robust success/failure simulation and handling.
- ✨ **AI Personal Shopper Agent**: Direct `@google/genai` powered chat assistant that constructs product summaries and suggests items which can be directly added to your cart!
- 🛡️ **Session Management**: Secure session handling with MongoDB store
- 💬 **Flash Messages**: User feedback on actions

## 📂 Project Structure

```text
Zest/
├── controllers/       # Business logic
├── models/           # Database schemas (User, Product, Review, Order)
├── routes/           # API and page routes
├── routes/api/       # Payment and product APIs
├── views/            # EJS templates
├── public/           # CSS, JS assets
├── app.js            # Express app entry point
├── seed.js           # Database seeder with sample products
├── middlewares.js    # Authentication & validation middlewares
├── joiSchema.js      # Joi validation schemas
├── package.json      # Dependencies
└── .env             # Environment variables
```

## 📋 Prerequisites

- **Node.js**: v14+ (includes npm)
- **MongoDB**: Local or Atlas instance
- **npm**: Comes with Node.js

## 💻 Installation & Setup

### 1️⃣ Prerequisites Setup

**Install MongoDB Community Edition:**
- **Windows**: Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **macOS**: `brew tap mongodb/brew && brew install mongodb-community`
- **Linux**: Follow [official docs](https://docs.mongodb.com/manual/installation/)

Start MongoDB:
```bash
# Windows (run in cmd as Admin)
mongod

# macOS/Linux
brew services start mongodb-community
# OR
mongod
```

Verify MongoDB is running (in another terminal):
```bash
mongosh  # or 'mongo'
```

### 2️⃣ Install Dependencies

```bash
cd Zest
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the Zest directory:
```env
DB_URL=mongodb://127.0.0.1:27017/zest-db
SECRET=zest_secret_session_key_2026
PORT=5000
RAZORPAY_KEY_ID=rzp_test_i1wlOQxtaGQQzK
RAZORPAY_SECRET_KEY=test_secret_key
GEMINI_API_KEY=your_gemini_api_key_here
```

**For MongoDB Atlas** (cloud):
```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/zest-db
```

### 4️⃣ Seed Database with Sample Products

```bash
npm run seed
```

Expected output: `DB seeded!`

This creates 6 sample products:
- Drone (₹200)
- Smartphone (₹750)
- Laptop (₹1200)
- Running Shoes (₹120)
- Smart Watch (₹199)
- Headphones ($99)

### 5️⃣ Start the Server

```bash
npm start
```

Server will run on `http://localhost:5000` 🌐

## 🎮 Usage

### 🏠 Navigate to Homepage
```text
http://localhost:5000
```

### 📝 Register a New User

1. Click **Login** in navbar → **Register here**
2. Fill form:
   - Username: `seller1`
   - Email: `seller1@zest.com`
   - Role: `seller` (for product creation) or `buyer`
   - Password: `password123`
3. Click **Register**

### 🔑 Login
1. Go to **Login** page
2. Enter credentials from registration
3. Click **Login**

### 🔍 Browse Products
- **Home** → **Products**
- View all products with ratings and reviews
- Click **Buy Now** to see product details
- Heart icon ❤️ to add to wishlist (if logged in)

### ➕ Add Product (Sellers Only)
1. Login as seller
2. Click **New** in navbar
3. Fill product details:
   - Name
   - Image URL
   - Price
   - Description
4. Click **Create**

### 🛍️ Add to Cart
1. Go to product details
2. Click **Add to Cart**
3. Click cart icon 🛒 in navbar to view cart

### 🌟 Leave a Review
1. On product detail page, scroll to review section
2. Select star rating (1-5)
3. Add comment
4. Click **Submit**

## 🌐 API Endpoints

### 🔐 Authentication
- `GET /register` - Register page
- `POST /register` - Create user
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - Logout

### 📦 Products
- `GET /products` - List all products
- `GET /products/new` - New product form (sellers)
- `POST /products` - Create product
- `GET /products/:id` - Product details
- `GET /products/:id/edit` - Edit form
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### 🛒 Shopping
- `POST /user/:productId/cart/add` - Add to cart
- `GET /user/cart` - View cart

### ⭐ Reviews
- `POST /products/:productId/review` - Add review

### ❤️ Wishlist
- `POST /products/:productId/like` - Toggle wishlist

### 💳 Payment (Optional)
- `POST /order` - Create Razorpay order
- `POST /payment-verify` - Verify payment

### ✨ AI Agent
- `GET /shopper` - AI Personal Shopper UI
- `POST /api/shopper/chat` - Interact with the Google Gemini LLM API

## 🛠️ Troubleshooting

### ❌ MongoDB Connection Error
```text
MongooseError: Operation buffering timed out
```
**Solution**: Ensure MongoDB is running
```bash
mongod  # Start MongoDB server
```

### ❌ Port 5000 Already in Use
```bash
npm start -- --port 3000
# OR kill process using port
# Windows: netstat -ano | findstr :5000
# Linux/Mac: lsof -i :5000
```

### ❌ Session Store Issues
Clear browser cookies and restart server:
```bash
npm start
```

### ❌ Missing Dependencies
Reinstall packages:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🏗️ Technology Stack

- **Backend**: Express.js 4.18 🟩
- **Database**: MongoDB 7.4 + Mongoose 🍃
- **Authentication**: Passport.js (local strategy) 🛂
- **Sessions**: express-session + connect-mongo 📝
- **Templating**: EJS with ejs-mate 📄
- **Validation**: Joi 🛡️
- **Payment**: Razorpay 2.9 💳
- **AI Integration**: @google/genai (Gemini API) 🤖 
- **Frontend**: Bootstrap 5.3, FontAwesome 🎨
- **Other**: dotenv, method-override, connect-flash 🔧

## 🧪 Sample Test Data

Once seeded, test with:

**Seller Account:**
- Username: `seller1`
- Password: `password123`
- Role: `seller`

**Buyer Account:**
- Username: `buyer1`
- Password: `password123`
- Role: `buyer`

## 📝 Notes

- Passwords are hashed with bcrypt via passport-local-mongoose
- Sessions expire after 7 days
- Product images use Unsplash URLs (update in seed.js for custom images)
- Razorpay keys are test credentials (get production keys from Razorpay dashboard)

## 📄 License

ISC

---

**Enjoy building with Zest!** 🚀🍋
