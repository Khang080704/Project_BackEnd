showHomePage = (req, res)=>{
    res.render('HomePage.ejs');
}

showLoginPage = (req, res) => {
    res.render('login_c.ejs');
};

module.exports = {
    showHomePage,
    showLoginPage
}