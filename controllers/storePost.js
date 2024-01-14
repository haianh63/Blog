const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const path = require("path");
module.exports = async (req, res) => {
    if (req.files == null) {
        try{
            await BlogPost.create({
                ...req.body,
                userid: req.session.userId,
            });
        } catch (error) {
            const validatorErrors = Object.keys(error.errors).map(key => error.errors[key].message);
            req.flash('validatorErrors', validatorErrors);
            req.flash('data', req.body);
            return res.redirect('/posts/new');
        }
    } else {
        let image = req.files.image;
        console.log(req.files);
        try{
            await BlogPost.create({
                ...req.body,
                userid: req.session.userId,
                image: '/assets/img/' + image.name
            });
            image.mv(path.resolve(process.cwd(), 'public/assets/img', image.name));
        } catch (error) {
            console.log(path.resolve(process.cwd(), 'public/assets/img', image.name));
            const validatorErrors = Object.keys(error.errors).map(key => error.errors[key].message);
            req.flash('validatorErrors', validatorErrors);
            req.flash('data', req.body);
            return res.redirect('/posts/new');
        }
    }
    res.redirect('/');
}