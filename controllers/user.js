import User from "../models/user.js";
import { createTokenForUser } from "../services/auth.js";


const handleUserSignup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const user = await User.create({ fullName, email, password });
        if (user) {
            console.log(`User created successfully ${user}`);
            const token = createTokenForUser(user); // Generate a token for the user
            res.cookie('token', token, { httpOnly: true }).redirect('/'); // Set the token as a cookie and redirect to home
        } else {
            res.status(400).send('Error in creating user');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};


const handleUserSignin =  async (req , res) => {
    const { email , password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email , password);
        console.log(`Token generated and signed in successfully.`);
        res.cookie('token' , token).redirect('/');
    } catch (error) {
        console.log(error);
        return res.render('signin', {
            errorMessage: 'Invalid email or password'
        });
    }
};

const handleUserSignout = (req , res) => {
    res.clearCookie('token');   
    console.log('User logged out successfully');
    res.redirect('/');}

export { handleUserSignup , handleUserSignin, handleUserSignout};