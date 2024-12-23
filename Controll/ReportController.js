const  {getType} = require('../Util/SendingMoney')

test = async () => {
    try {
        const data = await getType();  // Đợi Promise hoàn thành
        return data  // Kiểm tra dữ liệu
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
    }
};

function showReport(req, res){
    res.render("chonbaocao.ejs")
}

async function showMonthlyReport(req, res){
    var listOfTypes = await test();
    res.render("baocaothang.ejs", {listOfTypes})
}

function showDailyReport(req, res) {
    res.render("baocaongay.ejs")
}


module.exports = { 
    showReport,
    showMonthlyReport,
    showDailyReport
}