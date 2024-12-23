const { resolve } = require("path");
const config = require("../Database/Config/Config");
const { Connection, TYPES } = require('tedious');
const { rejects } = require("assert");
var Request = require('tedious').Request

updateAmountOfType = (req, res) => {
    const data = req.body;

    var connection = new Connection(config);
    connection.on('connect', async (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Connected");
            await updateAmount(data, connection)
            res.send("Update Success!")
        }
    })
    connection.connect();
}

updateAmount = (data, connection) => {
    return new Promise((resolve, reject) => {
        const query = `Update Typepassbook set min_deposit_money = @money where id = @id`
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.addParameter('money', TYPES.Int, data.min_deposit_money);
        request.addParameter('id', TYPES.Int, Number(data.id));

        request.on('requestCompleted', resolve)
        request.on('error', reject);

        connection.execSql(request);
    })
}

insertNewTypePassbook = (req, res) => {
    const data = req.body;

    var connection = new Connection(config);
    connection.on('connect', async (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Connected");
            await insertType(data, connection)
        }
    })
    connection.connect();
}

function insertType(data, connection) {
    return new Promise((resolve, reject) => {
        const query = `exec sp_insert_type_passbook ${data.rate}, ${data.term}, 100000, ${data.amount}`
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.on('requestCompleted', resolve)
        request.on('error', reject);

        connection.execSql(request);
    })
}

DeleteTypePassBook = (req, res) => {
    const data = req.body

    var connection = new Connection(config);
    connection.on('connect', async (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Connected");
            const checkPassBook = await IsPassBookExits(data, connection);
            if(checkPassBook){
                return res.send({
                    status: false,
                    message: 'Vẫn còn sổ sử dụng loại tiết kiệm này'
                })
            }

            await removeTypePassBook(data,connection)
            res.send({
                status: true
            })
        }
    })
    connection.connect();
}

function removeTypePassBook(data, connection){
    return new Promise((resolve, reject) => {
        const query = `exec sp_remove_type_passbook ${Number(data.id)}`
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.on('requestCompleted', resolve)
        request.on('error', reject);

        connection.execSql(request);
    })
}

function IsPassBookExits(data, connection) {
    return new Promise((resolve, reject) => {
        const query = `select count(*) from passbook where passbook_type = @id and status_passbook = 1`
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.addParameter('id', TYPES.Int, Number(data.id));

        let exists = false;

        request.on('row', (columns) => {
            columns.forEach(column => {
                if(column.value == 0){
                    console.log(true)
                    exists = false
                }
                else{
                    exists = true
                }
            });
        });

        request.on('requestCompleted', () => resolve(exists))
        request.on('error', reject);

        connection.execSql(request);
    })
}


updateType2 = async (req, res) => {
    const data = req.body;

    var connection = new Connection(config);
    connection.on('connect', async (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Connected");
            await updateInterestAndMonth(data, connection)
        }
    })
    connection.connect();
}

function updateInterestAndMonth(info, connection) {
    return new Promise((resolve, reject) => {
        const query = `Update Typepassbook set term = ${info.month}, interest_rate = ${info.interest} where id = ${info.savingtype}`
        const request = new Request(query, (err) => {
            if (err) {
                return reject(err);
            }
        });

        request.on('requestCompleted', resolve)
        request.on('error', reject);

        connection.execSql(request);
    })
}

module.exports = {
    updateAmountOfType,
    updateType2,
    insertNewTypePassbook,
    DeleteTypePassBook
}