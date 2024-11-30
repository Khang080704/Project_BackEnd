const { Connection, Request, TYPES } = require('tedious');
const config = require('../Database/Config/Config');

// Xử lý thêm tài khoản và sổ tiết kiệm
function AddAccountWithURL(req, res) {
    const connection = new Connection(config);
    const info = req.body;

    connection.on('connect', async (err) => {
        if (err) {
            console.error('Kết nối thất bại:', err.message);
            return res.status(500).send('Kết nối thất bại');
        }

        console.log('Kết nối thành công!');

        try {
            const passbookExitst = await checkPassbookExist(info.id, connection)
            if(passbookExitst){
                return res.send({
                    status: false,
                    message: 'Mã sổ đã tồn tại'
                })
            }

            const customerExists = await checkExist(info, connection);

            if (!customerExists) {
                // Thêm khách hàng mới
                await insertToCustomer(info, connection);
            }

            // Thêm sổ tiết kiệm
            await insertToPassbook(info, connection);

            res.send({status: true})
        } catch (error) {
            console.error('Lỗi:', error.message);
            res.status(500).send('Lỗi khi xử lý yêu cầu.');
        } finally {
            connection.close();
        }
    });

    connection.connect();
}

// Kiểm tra sự tồn tại của khách hàng
function checkExist(info, connection) {
    return new Promise((resolve, reject) => {
        const query = `SELECT id_card FROM customer WHERE id_card = @cmnd`;
        const request = new Request(query, (err) => {
            if (err) {
                console.error('Lỗi khi kiểm tra tồn tại khách hàng:', err.message);
                return reject(err);
            }
        });

        request.addParameter('cmnd', TYPES.VarChar, info.cmnd);

        let exists = false;

        request.on('row', (columns) => {
            exists = true; // Nếu có kết quả, khách hàng đã tồn tại
        });

        request.on('requestCompleted', () => resolve(exists));
        request.on('error', reject);

        connection.execSql(request);
    });
}

// Thêm khách hàng mới
function insertToCustomer(info, connection) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO Customer (cus_name, cus_address, id_card) 
            VALUES (@name, @address, @card)
        `;
        const request = new Request(query, (err) => {
            if (err) {
                console.error('Lỗi khi thêm khách hàng:', err.message);
                return reject(err);
            }
        });

        request.addParameter('name', TYPES.NVarChar, info.customer);
        request.addParameter('address', TYPES.NVarChar, info.address);
        request.addParameter('card', TYPES.VarChar, info.cmnd);

        request.on('requestCompleted', resolve);
        request.on('error', reject);

        connection.execSql(request);
    });
}

// Thêm sổ tiết kiệm
function insertToPassbook(info, connection) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO Passbook (id, passbook_balance, passbook_type, passbook_customer, open_date, status)
            VALUES (@ID, @balance, @type, @pass_cus, @opendate, @status)
        `;
        const request = new Request(query, (err) => {
            if (err) {
                console.error('Lỗi khi thêm sổ tiết kiệm:', err.message);
                return reject(err);
            }
        });

        request.addParameter('ID', TYPES.VarChar, info.id);
        request.addParameter('balance', TYPES.BigInt, BigInt(info.amount.replace(/\./g, '')));
        request.addParameter('type', TYPES.VarChar, info.savingType);
        request.addParameter('pass_cus', TYPES.VarChar, info.cmnd);
        request.addParameter('opendate', TYPES.Date, info.openDate);
        request.addParameter('status', TYPES.Int, 1);

        request.on('requestCompleted', resolve);
        request.on('error', reject);

        connection.execSql(request);
    });
}

//Check sổ tiết kiệm tồn tại
async function checkPassbookExist(id, connection) {
    return new Promise((resolve, reject) => {
        const query = `SELECT id FROM Passbook WHERE id = @id`;
        const request = new Request(query, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            }
        });

        request.addParameter('id', TYPES.VarChar, id);
        let result = false;

        request.on('row', () => {
            result = true; // Nếu có kết quả, tức là tồn tại
        });

        request.on('requestCompleted', () => resolve(result));
        request.on('error', (err) => reject(err));

        connection.execSql(request);
    });
}

module.exports = {
    AddAccountWithURL
}