const {addAccount} = require('../Model/savingModel')
const getURL = require('../Util/urlUtils');

showMosoPage = (req, res) => {
    res.render('moso.ejs');
};
AddAccountWithURL = (req, res) =>{
    const info = req.body.url
    addAccount(info)
}

module.exports = {
    showMosoPage,
    AddAccountWithURL
}