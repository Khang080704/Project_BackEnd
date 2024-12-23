const {getCustomer} = require('../Util/CustomerInfor')

ListCustomer = async () => {
    try {
        const data = await getCustomer();  // Đợi Promise hoàn thành
        return data  // Kiểm tra dữ liệu
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
    }
};

showCustomer = async (req, res) => {
    var listCustomer = await ListCustomer()
    res.render('ThongTinKH.ejs', {listCustomer})
}

module.exports = {
    showCustomer
}