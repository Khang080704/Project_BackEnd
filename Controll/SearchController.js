const {findByID, accounts} = require('../Model/savingModel')

showSearchPage = (req, res) => {
    res.render('Search.ejs');
    console.log(accounts);
};

searchAccount = (req, res) => {
    const data = req.body;
    console.log(data)
    const result = findByID(data, accounts);
    
    if (result) {
        res.json({
            success: true,
            data: result
        });
    } else {
        res.json({
            success: false,
            text: "Không tìm thấy sổ tiết kiệm"
        });
    }
}

module.exports = {
    showSearchPage,
    searchAccount
}