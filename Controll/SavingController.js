// Hiển thị trang mở sổ
const  {getType} = require('../Util/SendingMoney')

test = async () => {
    try {
        const data = await getType();  // Đợi Promise hoàn thành
        return data  // Kiểm tra dữ liệu
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
    }
};


async function showMosoPage(req, res) {    
    var listOfTypes = await test()
    res.render('moso.ejs', {listOfTypes});
    
}

module.exports = {
    showMosoPage
};
