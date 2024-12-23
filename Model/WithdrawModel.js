const { Connection, Request, TYPES } = require('tedious');
const config = require('../Database/Config/Config');
const {checkCustomerExits, checkIDPassbookExits} = require('./DepositModel');

function WithDrawMoney(req, res) {
    const connection = new Connection(config);
    const info = req.body;
    //console.log(info)
 
    connection.on('connect', async (err) => {
        if(err){
            console.log(err)
        }
        else{
            const passbookIDExits = await checkIDPassbookExits(info, connection);
            if(!passbookIDExits){
                return res.send({
                    status: false,
                    message: "Mã sổ không tồn tại"
                })
            }
            const customerExits = await checkCustomerExits(info, connection);
            if(!customerExits){
                return res.send({
                    status: false,
                    message: "Không tồn tại khách hàng ứng với mã sổ "
                })
            }
            
            const moneyValid = await checkMoney(info, connection);
            if(!moneyValid){
                return res.send({
                    status: false,
                    message: 'Số tiền rút không hợp lệ, vui lòng nhập lại số tiền'
                })
            }

            const withDrawlDate = await checkWithDrawDate(info,connection);
            const userDate = new Date(info.openDate)
            const systemDate = new Date(withDrawlDate)

            if(userDate < systemDate){
                return res.send({
                    status: false,
                    message: "Chưa đến ngày rút tiền" 
                })
            }

            try {
                const balance = await GetPassbookBalance(info, connection)
                console.log(balance)
                const id = await insertWithDrawnBill(info, connection);
                const withdrawlMoney = await getInterestMoney(balance, connection)
                var money = 0
                if(withdrawlMoney.cur_term != 0){ 
                    const monthsDifference = calculateMonthsDifference(withdrawlMoney.withdrawl_date, withdrawlMoney.open_date);
                    const SoLanDaoHan = monthsDifference / withdrawlMoney.cur_term
                    money = Number(withdrawlMoney.withdrawl_money) 
                    + withdrawlMoney.interest * SoLanDaoHan * Number(withdrawlMoney.cur_term) * withdrawlMoney.passbook_balance

                }
                else{
                    //kiem tra ngay rut sau ngay gui 1 thang
                    const differenceInDays = isWithdrawlOneMonthAfterOpen(withdrawlMoney.withdrawl_date, withdrawlMoney.open_date)
                    console.log(differenceInDays)
                    if(differenceInDays){ //Neu lech 1 thang, ap dung lai suat
                        const month = calculateMonthsDifference(withdrawlMoney.withdrawl_date, withdrawlMoney.open_date)
                        //withdrawlMoney.withdrawl_money = Number(withdrawlMoney.withdrawl_money) + withdrawlMoney.interest
                        money = Number(withdrawlMoney.withdrawl_money) 
                        + withdrawlMoney.interest * month * Number(withdrawlMoney.passbook_balance) 
                    }
                    else{
                        //do nothing
                        money = Number(withdrawlMoney.withdrawl_money)
                    }
                }

                res.send({
                    status : true,
                    message: `Rút tiền thành công! Số tiền bạn nhận được là ${money}`
                })
            } catch (error) {
                console.log(error)
                res.send({
                    status: false,
                    message: JSON.stringify(error)
                })
            }
            
            
        }
    })

    connection.connect();
}

function GetPassbookBalance(info, connection){
    return new Promise((resolve, reject) => {
        const query = `select passbook_balance 
                       from passbook 
                       where id = @id`;
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.addParameter('id', TYPES.Int, Number(info.id));

        let balance;

        request.on('row', (columns) => {
            balance = columns[0].value
        });

        request.on('requestCompleted', () => resolve(balance));
        request.on('error', reject);

        connection.execSql(request);
    })
}

//kiem tra so tien rut <= So tien trong so
function checkMoney(info, connection){
    return new Promise((resolve, reject) => {
        const query = `select passbook_balance from passbook where id = @id`;
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.addParameter('id', TYPES.Int, Number(info.id));

        let exists = false;

        request.on('row', (columns) => {
            columns.forEach(element => {
                if(element.value >= Number(info.amount.replace(/\./g, ''))){
                    exists = true; // Nếu số tiền rút <= số tiền có trong sổ 
                }    
                else{
                    exists = false
                }
            });
            
        });

        request.on('requestCompleted', () => resolve(exists));
        request.on('error', reject);

        connection.execSql(request);
    })
}

function insertWithDrawnBill(info, connection){
    return new Promise((resolve, reject) => {
        const query = `exec sp_insert_withdrawl_bill @passbook, @money, @date`  
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });
        request.addParameter('passbook', TYPES.Int,Number(info.id));
        request.addParameter('money', TYPES.Money, parseFloat(info.amount.replace(/\./g, ''))); 
        request.addParameter('date', TYPES.Date, info.openDate);
        
        var insertedID
        request.on('row', (columns) => {
            insertedID = columns[0]
        })

        request.on('requestCompleted', () => resolve(insertedID)) 
        request.on('error', reject);

        connection.execSql(request);
    })
}

function getInterestMoney(balance, connection) {
    //info: withdrawl bill infor
    return new Promise((resolve, reject) => {
        const query = `select w.withdrawl_money, p.cur_term, p.interest ,w.withdrawl_date, p.open_date
                        from Withdrawlbill w left join Passbook p on w.withdrawl_passbook = p.id
                                             left join Typepassbook t on t.id = p.passbook_type
                        group by w.id, w.withdrawl_money, p.cur_term, p.interest ,w.withdrawl_date, p.open_date
                        having w.id = (select max(id) from Withdrawlbill) `  
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });
        let withdrawlMoney = {}
        withdrawlMoney["passbook_balance"] = balance
        request.on('row', (columns) => {
            columns.forEach((column) => {
                withdrawlMoney[column.metadata.colName] = column.value; 
            })
        });

        
        request.on('requestCompleted', function () {
            resolve(withdrawlMoney)
        })
        request.on('error', reject);

        connection.execSql(request);
    })
}

//function calculate difference betweem 2 months
function calculateMonthsDifference(withdrawlDate, openDate){
    const withdrawl = new Date(withdrawlDate);
    const open = new Date(openDate);

    const yearsDifference = withdrawl.getFullYear() - open.getFullYear();
    const monthsDifference = withdrawl.getMonth() - open.getMonth();
    return yearsDifference * 12 + monthsDifference;
}

function checkWithDrawDate(info, connection){
    return new Promise((resolve, reject) => {
        const query = `select CONVERT(varchar, withdrawl_date, 23) from passbook where id = @id`
        const request = new Request(query, (err) => {
            if(err){
                reject(err);
            }
        })

        request.addParameter('id', TYPES.Int, Number(info.id))

        var withDrawlDate;
        request.on('row' ,(columns) => {
            columns.forEach(column => {
                withDrawlDate = column.value
            });
        })

        request.on('requestCompleted',() => resolve(withDrawlDate))
        connection.execSql(request)
    })
}

const isWithdrawlOneMonthAfterOpen = (withdrawlDate, openDate) => {
    const withdrawl = new Date(withdrawlDate);
    const open = new Date(openDate);
  
    // Tính sự khác biệt về năm và tháng
    const yearsDifference = withdrawl.getFullYear() - open.getFullYear();
    const monthsDifference = withdrawl.getMonth() - open.getMonth();
  
    // Tổng số tháng giữa hai ngày
    const totalMonthsDifference = yearsDifference * 12 + monthsDifference;
    
    if (totalMonthsDifference > 1) return true; // Lớn hơn 1 tháng
    if (totalMonthsDifference === 1) {
    // Kiểm tra ngày của tháng nếu tổng tháng đúng 1
        return withdrawl.getDate() >= open.getDate();
    }
    return false;
    
};

module.exports = {
    WithDrawMoney
}