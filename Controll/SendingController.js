const getInforFromURL = require("../Util/urlUtils")
const {accounts} = require('../Model/savingModel')

ShowSendingMoneyPage = (req, res) =>{
    res.render('GuiTien.ejs')
}
receivedURL = (req, res) =>{
    const info = getInforFromURL(req.body.url);
    var flag = false;

    for(var i in accounts){
        if(info.id == accounts.id && info.customer == accounts.customer){
            flag = true;
            break;
        }
    }

    if(flag){
        getInforFromURL.addAccount(info)
        res.json({
            status : true
        })
    }
    else{
        res.json({
            status : false
        })
    }

    
}


module.exports = {
    ShowSendingMoneyPage,
    receivedURL
}