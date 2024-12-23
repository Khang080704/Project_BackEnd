const  {getType} = require('../Util/SendingMoney')

getListTypes = async () => {
    try {
        const data = await getType();  // Đợi Promise hoàn thành
        return data  // Kiểm tra dữ liệu
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
    }
};


showChangeRulesPage = (req, res) =>{
    res.render('thaydoiquidinh.ejs')
}

showSecondChange = async (req, res) =>{
    var listOfTypes = await getListTypes()
    res.render('quidinh2.ejs', {listOfTypes})
}

showFirstChange = async (req, res) =>{
    var listOfTypes = await getListTypes()
    res.render('quidinh1.ejs', {listOfTypes})
}

module.exports = {
    showChangeRulesPage,
    showFirstChange,
    showSecondChange
}