const config = require("../Database/Config/Config");
const { Connection, TYPES, Request } = require('tedious');

async function getCustomer() {
    var connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', async (err) => {
            if (err) {
                console.error('Lỗi khi kết nối:', err.message);
                return reject(err);
            }

            console.log("Data connected");
            try {
                const result = await getListCustomer(connection);
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                connection.close();
            }
        });

        connection.connect();
    });
}

getListCustomer = (connection) =>{
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Customer`;
        const request = new Request(query, (err) => {
            if (err) {
                console.error('Lỗi khi kiểm tra tồn tại khách hàng:', err.message);
                return reject(err);
            }
        });

        let result = [];

        request.on('row', (columns) => {
            let row = {}
            columns.forEach(element => {
                row[element.metadata.colName] = element.value;
            });

            result.push(row)
        });

        request.on('requestCompleted', () => resolve(result));
        request.on('error', reject);

        connection.execSql(request);
    });
}

module.exports = {
    getCustomer
}