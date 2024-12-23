const { error } = require('console');
const express = require('express');
const { request } = require('http');
const path = require('path')
const app = express();
const PORT = 3000
const bodyParser = require('body-parser')


app.get('/', (req, res)=>{
    res.send("Hello word");
})


const HomeController = require('./Controll/HomeController')
const SavingController = require('./Controll/SavingController');
const SearchController = require('./Controll/SearchController')
const DepositController = require('./Controll/DepositController')
const ReportController = require('./Controll/ReportController')
const changeRulesController = require('./Controll/ChangeRulesController') 
const WithDrawController = require('./Controll/WithDrawController')
const CutomerController = require('./Controll/ChangeCusInfor')

app.set('views',path.join(__dirname,'./views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

//Routes / get API 
app.get('/HomePage',HomeController.showHomePage)
app.get('/moso', SavingController.showMosoPage); 
app.get('/search',SearchController.showSearchPage);
app.get('/guitien',DepositController.ShowSendingMoneyPage);
app.get('/baocao',ReportController.showReport)
app.get('/baocaothang', ReportController.showMonthlyReport)
app.get('/baocaongay', ReportController.showDailyReport);
app.get('/thaydoiquidinh', changeRulesController.showChangeRulesPage)
app.get('/ruttien', WithDrawController.showWithDrawPage)
app.get('/quidinh_1', changeRulesController.showFirstChange)
app.get('/quidinh_2', changeRulesController.showSecondChange)
app.get('/thaydoithongtin', CutomerController.showCustomer) 


//post api 
const SavingModel = require('./Model/savingModel')
const SearchModel = require('./Model/SearchModel')
const ReportModel = require('./Model/ReportModel')
const DepositModel = require('./Model/DepositModel');
const RulesModel = require('./Model/RulesModel')
const WithDrawModel = require('./Model/WithdrawModel')
const CustomerModel = require('./Model/CustomerModel')

app.post('/search', SearchModel.searchAccount);
app.post('/moso', SavingModel.AddAccountWithURL)
app.post('/baocaothang', ReportModel.MonthlyReportResult)
app.post('/guitien', DepositModel.DepositMoney)
app.post('/ruttien', WithDrawModel.WithDrawMoney)
app.post('/baocaongay', ReportModel.DailyReport) 
app.post('/quidinh_2', RulesModel.updateType2)
app.post('/quidinh_1', RulesModel.insertNewTypePassbook) 

//PUT API
app.put('/quidinh_1', RulesModel.updateAmountOfType) 
app.put('/thaydoithongtin', CustomerModel.changeCusInfor)

//DELETE API
app.delete('/quidinh_1', RulesModel.DeleteTypePassBook)


app.listen(PORT, () =>{
    console.log('app is listening on port ' + PORT) 
})

