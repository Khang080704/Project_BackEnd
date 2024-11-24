const Connection = require('tedious').Connection;
const config = {
    server: '127.0.0.1',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'sa', //update me
                password: 'SqlServer@123'  //update me
            }
        },
        options: {
            port: 1433, // Số cổng của SQL Server
            encrypt: false, // Bật mã hóa SSL
            trustServerCertificate: true, // Bỏ qua xác thực chứng chỉ
            database: 'QLSTK'
        },
}
module.exports = config;