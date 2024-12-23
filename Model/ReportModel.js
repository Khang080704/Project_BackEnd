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
    console.log(data)
    var time = data.date.split('-')
    return new Promise((resolve, rejects) =>{
        const query = ` select isNULL(sum(case when p.open_date = c.calendar_date and p.passbook_type = @type then 1 else 0 end),0) SoMo,
		                    isNULL(sum(case when p.close_date = c.calendar_date and p.passbook_type = @type then 1 else 0 end),0) SoDong,
		                    CONVERT(varchar, c.calendar_date, 23) as date,
                            abs(isNULL(sum(case when p.open_date = c.calendar_date and p.passbook_type = @type then 1 else 0 end),0)
                            - isNULL(sum(case when p.close_date = c.calendar_date and p.passbook_type = @type then 1 else 0 end),0)) as ChenhLech
                        
                        from Calendar c left join Passbook p on p.close_date = c.calendar_date 
                                or p.open_date = c.calendar_date
                        where MONTH(c.calendar_date) = @month and YEAR(c.calendar_date) = @year
                        group by c.calendar_date

                    HAVING 
                        ISNULL(SUM(CASE WHEN p.open_date = c.calendar_date and p.passbook_type = @type THEN 1 ELSE 0 END), 0) > 0 
                        OR ISNULL(SUM(CASE WHEN p.close_date = c.calendar_date and p.passbook_type = @type then 1 ELSE 0 END), 0) > 0
                        ORDER BY c.calendar_date;`
        var request = new Request(query, (err) =>{
            if(err){
                console.log(err);
                rejects(err);
            }
        })
        request.addParameter('type', TYPES.Int, data.type);
        request.addParameter('month', TYPES.Int, parseInt(time[1], 10))
        request.addParameter('year', TYPES.Int, parseInt(time[0], 10)) 
        var result = []
        request.on('row' , (colums) =>{
            const row = {};
            colums.forEach(column => {
                row[column.metadata.colName] = column.value.toString();
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


DailyReport = (req, res) => {
    const info = req.body
    var connection = new Connection(config);
    connection.on('connect', async (err) => {
        if(err){
            console.log(err);
        }
        else{
            const depositReport = await getReportForDeposit(info, connection)
            const withdrawlReport = await getReportForWithDrawl(info, connection)
            const dailyReport = filterData(depositReport, withdrawlReport)
            console.log(dailyReport);
            res.json(dailyReport)
        }
    })
    connection.connect()
}

function filterData(depositReport, withdrawlReport){
    const withdrawlMap = withdrawlReport.reduce((acc, obj) => {
        acc[obj.typename] = obj.chi;
        return acc;
    }, {});
    
    // Nếu depositReport rỗng, tạo từ withdrawlReport với thu mặc định là 0
    const depositMap = depositReport.reduce((acc, obj) => {
        acc[obj.typename] = obj.thu;
        return acc;
    }, {});
    
    const allTypenames = new Set([
        ...depositReport.map(obj => obj.typename),
        ...withdrawlReport.map(obj => obj.typename)
    ]);
    
    // Kết hợp dữ liệu từ cả hai mảng
    const result = Array.from(allTypenames).map(typename => ({
        typename,
        thu: depositMap[typename] || 0,
        chi: withdrawlMap[typename] || 0,
        ChenhLech: (depositMap[typename] || 0) - (withdrawlMap[typename] || 0)
    }));
    return result
}

function getReportForDeposit(info, connection){
    return new Promise((resolve, rejects) =>{
        const query = `select t.typename, sum(d.deposit_money) as thu
                       from DepositBill d left join passbook p on d.deposit_passbook = p.id
                                          left join typepassbook t on p.passbook_type = t.id
                        where d.deposit_date = @date
                       group by t.typename`
        var request = new Request(query, (err) =>{
            if(err){
                console.log(err);
                rejects(err);
            }
        })
        request.addParameter('date', TYPES.Date, info.date);
        var result = []
        request.on('row' , (colums) =>{
            const row = {};
            colums.forEach(column => {
                row[column.metadata.colName] = column.value.toString();
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


function getReportForWithDrawl(info, connection){
    return new Promise((resolve, rejects) =>{
        const query = `select t.typename, sum(w.withdrawl_money) as chi
                       from Withdrawlbill w left join passbook p on w.withdrawl_passbook = p.id
                                          left join typepassbook t on p.passbook_type = t.id
                        where w.withdrawl_date = @date
                       group by t.typename`
        var request = new Request(query, (err) =>{
            if(err){
                console.log(err);
                rejects(err);
            }
        })
        request.addParameter('date', TYPES.Date, info.date);
        var result = []
        request.on('row' , (colums) =>{
            const row = {};
            colums.forEach(column => {
                row[column.metadata.colName] = column.value.toString();
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
    MonthlyReportResult,
    DailyReport
}