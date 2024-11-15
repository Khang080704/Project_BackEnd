const {getInforFromURL,addAccount} = require('../Util/urlUtils')

showMosoPage = (req, res) => {
    res.render('moso.ejs');
};
AddAccountWithURL = (req, res) =>{
    const info = req.body;
    console.log(req.body);
    addAccount(info)
}

module.exports = {
    showMosoPage,
    AddAccountWithURL
}