const { Router } = require("express");
const multer = require('multer');
const path = require('path');

const Blog = require("../models/blog");

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render('add-Blog', {
        user: req.user,
    });
});

router.get('/:id',async(req,res)=>{
    const blog = await Blog.findById(req.params.id) 
});

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    });
    // console.log(req.body);
    // console.log(req.file);
    return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;