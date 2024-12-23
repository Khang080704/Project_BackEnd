const { Connection, Request, TYPES } = require('tedious');
const config = require('../Database/Config/Config');
const { resolve } = require('path');
const { rejects } = require('assert');

DepositMoney = (req, res) => {
    const connection = new Connection(config);
    const info = req.body;
    console.log(info)
 
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

            const checkType = await checkTypePassbook(info, connection);
            if(!checkType){
                return res.send({
                    status: false,
                    message: "Không phải kì hạn vình viễn "
                })
            }
            await insertDepositBill(info, connection);
            res.send({status: true})
        }
    })

    connection.connect();
}
 
function insertDepositBill(info, connection){
    return new Promise((resolve, reject) => {
        const query = `exec sp_insert_deposit_bill @passbook, @money, @date`  
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });
        request.addParameter('passbook', TYPES.Int,Number(info.id));
        request.addParameter('money', TYPES.BigInt, BigInt(info.amount.replace(/\./g, '')));
        request.addParameter('date', TYPES.DateTime, info.openDate);

        request.on('requestCompleted', resolve)
        request.on('error', reject);

        connection.execSql(request); 
    })
}


function checkIDPassbookExits(info, connection){
    return new Promise((resolve, reject) => {
        const query = `SELECT id FROM passbook WHERE id = @id`;
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.addParameter('id', TYPES.Int, Number(info.id));

        let exists = false;

        request.on('row', (columns) => {
            exists = true; // Nếu có kết quả, mã sổ tồn tại
        });

        request.on('requestCompleted', () => resolve(exists));
        request.on('error', reject);

        connection.execSql(request);
    })
}

function checkCustomerExits(info, connection){
    return new Promise((resolve, reject) => {
        const query = `SELECT * 
                       FROM passbook p join customer c on p.passbook_customer = c.id_card
                       WHERE p.id = @id and c.cus_name = @name`;
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.addParameter('id', TYPES.Int, Number(info.id));
        request.addParameter('name', TYPES.NVarChar, info.customer);

        let exists = false;

        request.on('row', (columns) => {
            exists = true; // Nếu có kết quả, mã sổ tồn tại
        });

        request.on('requestCompleted', () => resolve(exists));
        request.on('error', reject);

        connection.execSql(request);
    })
}

function checkTypePassbook(info, connection){
    return new Promise((resolve, reject) => {
        const query = `SELECT t.id 
                       FROM passbook p join typepassbook t on p.passbook_type = t.id
                       WHERE p.id = @id`;
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.addParameter('id', TYPES.Int, Number(info.id));

        let exists = false;

        request.on('row', (columns) => {
            columns.forEach(element => {
                console.log(element.value)
                if(element.value == 3){
                    exists = true; // Nếu có kết quả 
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


module.exports = {
    DepositMoney,
    checkCustomerExits,
    checkIDPassbookExits 
}