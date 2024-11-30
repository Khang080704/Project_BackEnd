

function showReport(req, res){
    res.render("chonbaocao.ejs")
}

function showMonthlyReport(req, res){
    res.render("baocaothang.ejs")
}



module.exports = { 
    showReport,
    showMonthlyReport
}