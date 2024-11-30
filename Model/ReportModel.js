const { Connection, Request, TYPES } = require('tedious');
const config = require('../Database/Config/Config');
const { resolve } = require('path');
const { rejects } = require('assert');

MonthlyReportResult = (req, res) => {
    var connection = new Connection(config);
    connection.on('connect', async (err) => {
        if(err){
            console.log(err);
        }
        else{
            var filter = req.body;
            try{
                var result = await GetMonthlyReport(filter, connection)
                res.json(result)
            }
            catch(err){
                console.log(err)
            }
            finally{
                connection.close()
            }
            
        }
    })
    connection.connect()
}

function GetMonthlyReport(data, connection){
    return new Promise((resolve, rejects) =>{
        const query = `select day(open_date) as day, sum(case when status = 1 then 1 else 0 end) as SoMo,
                              sum(case when status = 0 then 1 else 0 end) as SoDong,
                              abs(sum(case when status = 1 then 1 else 0 end) - sum(case when status = 0 then 1 else 0 end))
                              as ChenhLech
                       from Passbook
                       where passbook_type = @type and month(open_date) = @month
                       group by open_date`
        var request = new Request(query, (err) =>{
            if(err){
                console.log(err);
                rejects(err);
            }
        })
        request.addParameter('type', TYPES.VarChar, data.type);
        request.addParameter('month', TYPES.Int, parseInt(data.date, 10))
        var result = []
        request.on('row' , (colums) =>{
            const row = {};
            colums.forEach(column => {
                row[column.metadata.colName] = column.value;
            });
            result.push(row);
        })

        request.on('requestCompleted', () =>{
            resolve(result)
        })
        request.on('error', rejects)
        connection.execSql(request);
    })
}

module.exports = {
    MonthlyReportResult
}