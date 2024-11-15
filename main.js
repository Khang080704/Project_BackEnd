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
const WithDrawController = require('./Controll/WithDrawController')
const SendingController = require('./Controll/SendingController')

app.set('views',path.join(__dirname,'./views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true}))

//Routes / get API 
app.get('/HomePage',HomeController.showHomePage)
app.get('/moso', SavingController.showMosoPage);
//app.get('/search',SearchController.showSearchPage);
app.get('/ruttien', WithDrawController.showWithDrawPage);
app.get('/guitien',SendingController.ShowSendingMoneyPage);

//post api
app.post('/search', SearchController.searchAccount)
app.post('/moso', SavingController.AddAccountWithURL)
app.post('/guitien', SendingController.receivedURL)





app.listen(PORT, () =>{
    console.log('app is listening on port ' + PORT)
})

