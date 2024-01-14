module.exports = (req, res) => {
    var username = "";
    const error = req.flash("error");
    const data = req.flash("data")[0];
    if (typeof data != "undefined") {
        username = data.username;
    }
    res.render('login', {
        error: error,
        username: username
    });
}