const express = require('express');
const app = express();

app.set('view engine', 'ejs');
const port = process.env.PORT || 3001

app.listen(port);

app.use(express.json());

const db = require('./configs/Database');
const User = require('./models/User');
const Report = require('./models/Report');
const Local = require('./models/Local');
const Feedba = require('./models/Feedback');

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    User.findAll().then(users => {
        res.render('index', {users: users});
    }).catch(err => console.log('dota'));
})

app.post('/registar', (req, res) => {
    console.log(req.body)
    const regis = {
        cargo: req.body.car,
        nome: req.body.nom,
        email: req.body.ema,
        pass: req.body.pas,
        contacto: req.body.con,
        cc: req.body.cci
    };

    const regista = new User(regis);
    regista.save().then(result => {console.log(result), res.json({status: "Success"})}).catch(err => {console.log(err), res.json({status: "Fail"})})

})

app.post('/login', (req, res) => {
    const a = req.body.user
    const b = req.body.pass

    console.log(a)
    console.log(b)

    User.findAll({
        where:{
            email: a
        }
    }).then(user => res.send(user)).catch(err => console.log(err));


   /* User.findAll({
        where:{
            email: req.urlencoded({extended : true})
        }
    }).then(user => res.send(user)).catch(err => console.log(err));*/
})

app.post('/reportPost', (req, res) => {
    console.log(req.body)
    const reportData = {
        idu: req.body.idu,
        idl: req.body.idl,
        latr: req.body.latitude,
        longr: req.body.longitude,
        nivel: req.body.nivel,
        data: req.body.data
    };

    const report = new Report(reportData);
    report.save().then(result => console.log(result)).catch(err => console.log(err))
    
})

app.post('/feedbackPost', (req, res) => {
    console.log(req.body)
    const feedbackData = {
        idu: req.body.idu,
        idr: req.body.idr,
        feedback: req.body.feedb
    };

    const feedbac = new Feedback(feedbackData);
    feedbac.save().then(result => console.log(result)).catch(err => console.log(err))
})

app.get('/user', (req, res) => {
    User.findAll({
        where:{
            cc: 123456789
        }
    }).then(user => res.send({user})).catch(err => console.log(err));
})

app.get('/reports', (req, res) => {
    Report.findAll().then(reports => res.send({reports})).catch(err => console.log(err));
})

app.get('/locals', (req, res) => {
    Local.findAll().then(locals => {
        res.send({locals})
    }).catch(err => console.log(err));
})


app.post('/userData', (req, res) => {
    const a = req.body.id

    console.log(a)

    User.findAll({
        where:{
            idu: a
        }
    }).then(user => res.send(user)).catch(err => console.log(err));


   /* User.findAll({
        where:{
            email: req.urlencoded({extended : true})
        }
    }).then(user => res.send(user)).catch(err => console.log(err));*/
})