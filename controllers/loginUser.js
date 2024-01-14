const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res) => {
    const {username, password} = req.body;
    req.flash('data', req.body);
    if (username === "" || password === "") {
        var error = [];
        if (username === "") {
            error.push("Please provide username");
        }
        if (password === "") {
            error.push("please provide password");
        }
        req.flash('error', error);
        return res.redirect('/auth/login');
    }
    const user = await User.findOne({username:username});
    if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
            if (same) {
                req.session.userId = user._id;
                res.redirect('/');
            } else {
                req.flash('error', 'Password is incorrect');
                res.redirect('/auth/login');
            }
        })
    } else {
        req.flash('error', 'Username does not exist');
        res.redirect('/auth/login');
    }
}