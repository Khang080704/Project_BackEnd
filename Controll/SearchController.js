const { accounts} = require('../Model/savingModel')
const config = require("../Database/Config/Config");
const { Connection, TYPES } = require('tedious');
var Request = require('tedious').Request


showSearchPage = (req, res) => {
    res.render('Tracuu.ejs');
};

searchAccount = (req, res) => {
    const data = req.body;
    console.log(data.id)
    var connection = new Connection(config);
    connection.on('connect', (err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Connected");
            findByID(data.id, connection)
            .then((data) => {
                res.json(data[0] || {});
            })
            .catch(err =>{
                console.log(err)
            })
        }
    }) 
    connection.connect(); 
}

function findByID(id, connection){
    return new Promise((resolve, rejects) =>{
        var request = new Request(`Select p.id, tp.typename, c.cus_name, p.passbook_balance
                                    from Passbook p join customer c on p.passbook_customer = c.id_card
                                                    join typepassbook tp on tp.id = p.passbook_type
                                    where p.id=@id
                                    ` , (err)=>{
            if(err){
                console.log(err)
                rejects(err)
            }
        })
        var result = [];  
        request.addParameter('id',TYPES.VarChar, id);
        request.on('row', function(columns) {  
            let row = {};
            columns.forEach(column => {
                row[column.metadata.colName] = column.value;
            });
            result.push(row); 
        }); 
        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
            resolve(result)
        });
        connection.execSql(request);  
    })

}

module.exports = {
    showSearchPage,
    searchAccount
}