import express from 'express';
import { handleUserSignin, handleUserSignout, handleUserSignup } from '../controllers/user.js';

const router = express.Router();

router.get('/signin', (req , res) => {
    res.render('signin');
})

router.get('/signup', (req , res) =>{
    res.render('signup');
})

router.post('/signup', handleUserSignup);
router.post('/signin', handleUserSignin);
router.get('/signout', handleUserSignout)

export default router;