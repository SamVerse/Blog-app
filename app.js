import { configDotenv } from 'dotenv';
import express from 'express';
import path from 'path';
import userRouter from './routes/user.js';
import blogRouter from './routes/blog.js';
import dbConnection from './dbConnection/connection.js';
import cookieParser from 'cookie-parser';
import { checkForAuthenticationCookie } from './middlewares/auth.js';
import Blog from './models/blog.js';
import methodOverride from 'method-override';


configDotenv();

const app = express();
const PORT = process.env.PORT || 8000;

//Database Connection
dbConnection(process.env.MONGO_URL);

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

//Routes
app.use('/user', userRouter)
app.use('/blog', blogRouter)

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find().sort({ createdAt: 'desc' });
    res.render('home', {
        user: req.user,
        blogs: allBlogs,
        currentPath: req.path
    });
});

app.get('/my-blogs', async (req, res) => {
    const myBlogs = await Blog.find({ createdBy: req.user._id }).sort({ createdAt: 'desc' });
    res.render('myBlogs', {
        user: req.user,
        blogs: myBlogs,
    });
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));