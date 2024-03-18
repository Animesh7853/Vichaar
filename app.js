require("dotenv").config();

const path =require("path")
const express = require("express");
const mongoose= require("mongoose");
const cookieParser = require('cookie-parser');

const { checkForAuthenticationCookie } = require("./middleware/authentication");

const Blog = require('./models/blog')

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');


const app =express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then((e)=> console.log('MongoDB Connected'));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(cookieParser());

app.get("/", checkForAuthenticationCookie('token'), async(req, res) => {
    try {
        const allBlogs = await Blog.find({}); // Change allBlog to allBlogs
        res.render("home", {
            user: req.user,
            allBlogs: allBlogs, // Change allBlog to allBlogs
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).send("Internal Server Error");
    }
});



app.use(express.urlencoded({extended:false}));

app.use(checkForAuthenticationCookie('token'));

app.use(express.static(path.resolve('./public')))
app.use('/user',userRouter);
app.use('/blog',blogRouter);

app.listen(PORT,()=>console.log(`Server Started at PORT:${PORT}`));