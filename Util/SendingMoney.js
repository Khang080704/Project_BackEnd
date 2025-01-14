const config = require("../Database/Config/Config");
const { Connection, TYPES, Request } = require('tedious');

async function getType() {
    var connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', async (err) => {
            if (err) {
                console.error('Lỗi khi kết nối:', err.message);
                return reject(err);
            }

            console.log("Connected");
            try {
                const result = await getListType(connection);
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

getListType = (connection) =>{
    return new Promise((resolve, reject) => {
        const query = `SELECT id, typename, interest_rate ,term ,min_deposit_money FROM typepassbook`;
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
    getType
}