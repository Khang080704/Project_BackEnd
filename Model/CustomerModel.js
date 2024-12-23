const { resolve } = require("path");
const config = require("../Database/Config/Config");
const { Connection, TYPES } = require('tedious');
const { rejects } = require("assert");
var Request = require('tedious').Request


function changeCusInfor(req, res) {
    const data = req.body
    console.log(data)  
    
    var connection = new Connection(config);
    connection.on('connect', async (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Connected");
            await updateCustomer(data, connection)
            res.status(200).send("Update Success!")
        }
    })
    connection.connect();
}

function updateCustomer(info, connection){
    return new Promise((resolve, reject) => {
            const query = `Update Customer set cus_name = @name, cus_address = @address where id_card = @id`
            const request = new Request(query, (err) => {
                if (err) {
                    return reject(err);
                }
            });
    
            request.addParameter('name', TYPES.NVarChar, info.cus_name);
            request.addParameter('address', TYPES.NVarChar, info.cus_address);
            request.addParameter('id', TYPES.VarChar, info.cus_id);
    
            request.on('requestCompleted', resolve)
            request.on('error', reject);
    
            connection.execSql(request);
    })
}

module.exports = {
    changeCusInfor
}