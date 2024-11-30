const getInforFromURL = require("../Util/urlUtils")
const {accounts} = require('../Model/savingModel')
var config = require('../Database/Config/Config');
const { resolve } = require("path");
const { rejects } = require("assert");
var Connection = require('tedious').Connection;  
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;
var connection = new Connection(config); 

ShowSendingMoneyPage = (req, res) =>{
    res.render('GuiTien.ejs')
     
}

function executeStatement(){
    return new Promise((resolve, rejects) =>{
        var request = new Request("Select id,passbook_type, passbook_balance from Passbook where id='MS01'", (err)=>{
            if(err){
                console.log(err)
                rejects(err)
            }
        })
        var result = [];  
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
receivedURL = (req, res) =>{
    const a = req.body;
    console.log(a);
    connection = new Connection(config); 
    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        if(err){
            console.log(err)
        }
        else{
            console.log("Connected");  
            executeStatement().then((data) => res.json({data}))
            .catch((err) => console.log(err))           
        }        
    });
    connection.connect();    
}


module.exports = {
    ShowSendingMoneyPage,
    receivedURL
}