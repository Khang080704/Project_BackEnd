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


//post api 
const SavingModel = require('./Model/savingModel')
const SearchModel = require('./Model/SearchModel')
const ReportModel = require('./Model/ReportModel')
const DepositModel = require('./Model/DepositModel');

app.post('/search', SearchModel.searchAccount);
app.post('/moso', SavingModel.AddAccountWithURL)
app.post('/baocaothang', ReportModel.MonthlyReportResult)
app.post('/guitien', DepositModel.DepositMoney)


app.listen(PORT, () =>{
    console.log('app is listening on port ' + PORT)
})

