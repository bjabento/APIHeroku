const express = require('express');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
const port = process.env.PORT || 3001

app.listen(port);

app.use(express.json());

const Sequelize = require('sequelize');
const moment = require('moment');
const db = require('./configs/Database');
const User = require('./models/User');
const Report = require('./models/Report');
const Locals = require('./models/Locals')
const Feedback = require('./models/Feedback');
const Admin = require('./models/Admins');

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: new Date(Date.now() + 3600000)
    }
}))

const redirectLogin = (req, res, next) => {
    if(req.session.adminType >= 2){
        res.redirect('/login')
    }else{
        next()
    }
}

app.post('/addLocation', (req, res) => {
    console.log(req.body);
    const localData = {
        nome: req.body.nome,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    };

    const local = new Locals(localData);

    local.save().then((result) => {
        res.redirect('/');
    }).catch(err => console.log(err));
})

app.post('/loginRequest', (req, res) => {
    var lMail = req.body.email;
    var lPass = req.body.pass;

    Admin.findAll({
        where: {
            email: lMail
        }
    }).then(user => {
        console.log(typeof(user[0].dataValues.pass))
        console.log(typeof(lPass))
        if (user.length == 1 && user[0].dataValues.pass.trim() == lPass.trim()){
            if(user[0].dataValues.tipo == 0){
                req.session.adminType = 0
            }else{
                req.session.adminType = 1
            }
            res.redirect('/');
        }else{
            res.redirect('/login');
        }
    }).catch(err => console.log(err))
})

app.post('/addAdmin', (req, res) => {
    
    const adminData = {
        nome: req.body.nome,
        email: req.body.email,
        pass: req.body.pass,
        contacto: req.body.contacto,
        cc: req.body.cc,
        tipo: 1
    }

    const admin = new Admin(adminData);

    admin.save().then(result => res.redirect('/adminDashboard')).catch(err => console.log(err))
})


app.post('/registar', (req, res) => {
    const regis = {
        cargo: req.body.car,
        nome: req.body.nom,
        email: req.body.ema,
        pass: req.body.pas,
        contacto: req.body.con,
        cc: req.body.cci,
        idgoogle: req.body.idg
    };

    const regista = new User(regis);
    regista.save().then(result => console.log("Sucesso")).catch(err => console.log("Falhei"))

})

app.post('/registarGoo', (req, res) => {
    const regisG = {
        cargo: req.body.car,
        nome: req.body.nom,
        email: req.body.ema,
        idgoogle: req.body.idg
    };

    const registaG = new User(regisG);
    registaG.save().then(result => console.log("Sucesso")).catch(err => console.log("Falhei"))

})

app.post('/login', (req, res) => {
    const a = req.body.user

    User.findAll({
        where:{
            email: a
        }
    }).then(user => res.send(user)).catch(err => console.log(err));
})

app.post('/loginGoo', (req, res) => {
    const a = req.body.google

    User.findAll({
        where:{
            idgoogle: a
        }
    }).then(user => res.send(user)).catch(err => console.log(err));
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

app.post('/updateUser/:id', (req, res) => {
    const idu = req.params.id;

    const userUpdate = {
        cargo: req.body.cargo,
        nome: req.body.nome,
        email: req.body.email,
        pass: req.body.pass,
        contacto: req.body.contacto,
        cc: req.body.cc
    }

    User.find({
        where:{
            idu: idu
        }
    }).then(user => user.update(userUpdate)).catch(err => console.log(err))
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

app.get('/', redirectLogin, (req, res) => {
    console.log(req.session)
    User.findAll().then(users => {
        var userIds = []
        for(var i = 0; i < users.length; i++){
            userIds.push(users[i].dataValues.idu);
        }
        Feedback.findAll({
            where: {
                idu: {
                    [Sequelize.Op.or]: userIds
                }         
            }
        }).then(feedback => {
            var points = new Array(userIds.length).fill(0);
            for(var i = 0; i < userIds.length; i++){
                for(var j = 0; j < feedback.length; j++){
                    if(feedback[j].dataValues.idu == userIds[i]){
                        if(feedback[j].dataValues.feedback == true){
                            points[i] += 1
                        }else{
                            points[i] -= 1
                        }
                    }
                }
            }
            Locals.findAll().then(locals => {
                var localData = []
                for(var i = 0; i < locals.length; i++){
                    localData.push([0,0,0,0,0])
                }
                Report.findAll({
                    where: {
                        data: {
                            [Sequelize.Op.gte]: moment().subtract(1,'day')
                        }
                    }
                }).then(reports => {
                    console.log(reports)
                    for(var i = 0; i < locals.length; i++){
                        localData[i][0] = locals[i].dataValues.nome;
                        for(var j = 0; j < reports.length; j++){
                            if(locals[i].dataValues.idl == reports[j].dataValues.idl){ 
                                if(reports[j].dataValues.nivel == 1){
                                    localData[i][1] += 1
                                    localData[i][4] += 1
                                }else if(reports[j].dataValues.nivel == 2){
                                    localData[i][2] += 1
                                    localData[i][4] += 2
                                }else{
                                    localData[i][3] += 1
                                    localData[i][4] += 3
                                }
                            }
                        }
                    }
                    localData.sort((a,b) => {
                        return b[4] - a[4];
                    })
                    
                    Report.findAll({
                        where: {
                            nivel: 3,
                            data:{
                                [Sequelize.Op.gte]: moment().subtract(1,'day') 
                            }  
                        }
                    }).then(possibleNotif => {
                        var p = {}
                        var dota = possibleNotif
                        for(var m = 0; m < dota.length; m++){
                            if(dota[m].dataValues.idl in p){
                                p[dota[m].dataValues.idl] += 1
                            }else{
                                p[dota[m].dataValues.idl] = 1
                            }
                        }
                        var locationNeeded = []
                        for(var key in p){
                            if (p[key] >= 10){
                                locationNeeded.push(key)
                            }
                        }
                        if(locationNeeded.length != 0){
                            Locals.findAll({
                                attributes:['nome'],
                                where:{
                                    idl:{
                                        [Sequelize.Op.or]: locationNeeded
                                    }
                                }
                            }).then(finalResults => {
                                console.log(finalResults)
                                console.log(req.session);
                                res.render('index', {users: users, points: points, localData: localData.slice(0,5),finalResults: finalResults, session: req.session});
                            })
                        }else {
                            res.render('index', {users: users, points: points, localData: localData.slice(0,5),finalResults: locationNeeded, session: req.session});
                        }
                        
                    }).catch(err => console.log(err))  
                }).catch(err => console.log());  
            })
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})


app.get('/user', (req, res) => {
    User.findAll({
        where:{
            cc: 123456789
        }
    }).then(user => res.send({user})).catch(err => console.log(err));
})

app.get('/adminDashboard', redirectLogin, (req, res) => {
    Admin.findAll({
        where:{
            tipo: 1
        }
    }).then(admins => {
        res.render('adminList',{admins:admins})
    }).catch(err => console.log(err));
})

app.delete('/adminDashboard/:id', (req, res) => {
    const ida = req.params.id;
    console.log(ida);
    Admins.destroy({
        where: {
            ida: ida
        }
    }).then(result => res.json({status: "success"})).catch(err => console.log(err))
    
})

app.get('/adminForm', redirectLogin, (req, res) => {
    res.render('adminForm');
})

app.get('/reports', (req, res) => {
    Report.findAll().then(reports => res.send({reports})).catch(err => console.log(err));
})

app.get('/login', (req, res) =>{

    req.session.adminType = 2
    console.log(req.session.adminType)
    res.render('login')
})

app.post('/reportsData', (req, res) => {
    const a = req.body.idr

    console.log(a)

    Report.findAll({
        where:{
            idr: a
        }
    }).then(reports => res.send({reports})).catch(err => console.log(err));
})


app.get('/locals', (req, res) => {
    Local.findAll().then(locals => {
        res.send({locals})
    }).catch(err => console.log(err));
})

app.get('/getReports/:tempo', (req, res) => {
    const temp = req.params.tempo;
    console.log(temp)

    Locals.findAll().then(locals => {
        var localData = []
        for(var i = 0; i < locals.length; i++){
            localData.push([0,0,0,0,0])
        }
        Report.findAll({
            where: {
                data: {
                    [Sequelize.Op.gte]: moment().subtract(1,temp)
                }
            }
        }).then(reports => {
            console.log(reports)
            for(var i = 0; i < locals.length; i++){
                localData[i][0] = locals[i].dataValues.nome;
                for(var j = 0; j < reports.length; j++){
                    if(locals[i].dataValues.idl == reports[j].dataValues.idl){ 
                        if(reports[j].dataValues.nivel == 1){
                            localData[i][1] += 1
                            localData[i][4] += 1
                        }else if(reports[j].dataValues.nivel == 2){
                            localData[i][2] += 1
                            localData[i][4] += 2
                        }else{
                            localData[i][3] += 1
                            localData[i][4] += 3
                        }
                    }
                }
            }
            localData.sort((a,b) => {
                return b[4] - a[4];
            })
            console.log(localData.slice(0,5));
            res.json(localData.slice(0,5));  
        }).catch(err => console.log());  
    })
})

app.post('/userData', (req, res) => {
    const a = req.body.id

    console.log(a)

    User.findAll({
        where:{
            idu: a
        }
    }).then(user => res.send(user)).catch(err => console.log(err));

})

app.get('/localForm', redirectLogin, (req, res) => {
    Locals.findAll().then(locals => {
        console.log(locals)
        res.render('locationForm');
    }).catch(err => console.log(err))})
