import mongoose from "mongoose";
import {createHmac, randomBytes} from 'crypto'
import { createTokenForUser } from "../services/auth.js";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    }
    ,
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });


// Pre save hook to hash the password
userSchema.pre('save', function (next) {
    const user = this;
    if(!user.isModified('password')) return;
    
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static('matchPasswordAndGenerateToken',async function(email, password ){
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest('hex'); 
    
    if(userProvidedHash !== hashedPassword) throw new Error('Invalid password');

    const token = createTokenForUser(user);
    return token;
})

const User = mongoose.model("user", userSchema);

export default User;