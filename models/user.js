const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:[true, 'Username is required'],
        unique:[true, 'Username already exists'],
        minlength:[3, 'Username must be at least 3 characters']
    },
    email:{
        type:String,
        trim:true,
        required:[true, 'Email is required'],
        unique:[true, 'Email already registered'],
        match:[/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    role:{
        type:String,
        enum:['buyer', 'seller'],
        required:[true, 'Please select a role']
    },
    wishList: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    cart:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;