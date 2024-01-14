const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const BlogPost = require('./models/BlogPost');
const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');
const expressSession = require('express-session');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const flash = require('connect-flash');
const app = express();
global.loggedIn = null;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressSession({
    secret: 'keyboard cat'
}));
app.use("*", (req,res,next) => {
    loggedIn = req.session.userId;
    next();
});
app.use(flash());
mongoose.connect("mongodb+srv://ngohaianh8dtd:2051990Aa@cluster0.gctb3tf.mongodb.net/my_database");

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, () => {
    console.log("App running...");
});

app.get('/', homeController);

app.get('/about', (req, res) => {
    //res.sendFile(path.resolve(__dirname,'pages/about.html'));
    res.render('about');
});

app.get('/contact', (req, res) => {
    //res.sendFile(path.resolve(__dirname,'pages/contact.html'));
    res.render('contact');
});

app.get('/post', (req, res) => {
    res.render('post');
});

app.get('/post/:id', getPostController);

app.get('/posts/new', authMiddleware, newPostController);

app.post('/posts/store',authMiddleware, storePostController);

app.post('/search', async (req, res) => {
    const title = req.body.title;
    const blogposts = await BlogPost.find({title: {$regex: title}});
    res.render('index', {blogposts : blogposts});
})

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);

app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);

app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

app.get('/auth/logout', logoutController);

app.use((req,res) => {
    res.render('notfound');
})
