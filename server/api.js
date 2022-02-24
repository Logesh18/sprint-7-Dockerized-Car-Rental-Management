const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const port=process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    'node_project', 
    'sgroot', 
    '7&VhKXTLCZK4RNI5', 
    {
        host: 'SG-mysql1-5763-mysql-master.servers.mongodirector.com',
        dialect: 'mysql',
        port: 3306,
        operatorsAliases: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 4000,
            idle: 2000
        }
    }
)

sequelize.authenticate()
 .then(() => {
   console.log('Connection has been established successfully.');
 })
 .catch(err => {
   console.error('Unable to connect to the database:', err);
 });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const CarManagement = sequelize.define("carmanagement", {
    carId:{
        type: Sequelize.STRING,
        primaryKey: true
    },  
    carModel: {
        type: Sequelize.STRING
    },
    carNo: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    }
});

db.carmanagement = CarManagement;

db.sequelize.sync({ force: false }).then(() => {
    console.log("Table created");
});

const carmanagement = db.carmanagement;


app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});


const showData=(req,res)=>{
    return carmanagement.findAll().then(result => {
         res.json(result);
    })
    .catch(err => {
         res.json({response: err});
    });
}

app.post('/saveCar',(req,res)=>{
    if(req.body.carId!==""){
        const carDetail={
            carId:req.body.carId,
            carModel:req.body.carModel,
            carNo:req.body.carNo,
            status:req.body.status
        }
        carmanagement.create(carDetail)
        .then(result => {
            showData(req,res);
        })
        .catch(err => {
            res.json({response: err});
        });
    }
    else{
        res.json({response: "Id should not be an empty field"});
    }  
})

app.post('/editCar',(req,res)=>{
    if(req.query.id!==""){
        carmanagement.update(req.body, {
            where: { carId: req.query.id }
        })
        .then(result => {
            showData(req,res);
        })
        .catch(err => {
            res.json({response: err});
        });
    }
    else{
        res.json({response: "Id should not be an empty field"});
    }
})

app.get('/deleteCar',(req,res)=>{
    if(req.query.id!==""){
        carmanagement.destroy({
            where: { carId: req.query.id }
        })
        .then(result => {
            showData(req,res);
        })
        .catch(err => {
            res.json({response: err});
        });
    }
    else{
        res.json({response: "Id should not be an empty field"});
    }
})

app.get('/getCars',(req,res)=>{
    carmanagement.findAll({})
    .then(data => {
        showData(req,res);
    })
    .catch(err => {
        res.json({response: err});
    });
})

app.get('/getCar',(req,res)=>{
    if(typeof req.query.id != "undefined")
    {
        return carmanagement.findOne({where: { carId: req.query.id } })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json({response: err});
        });
    }
    else{
        res.json({response: "Id should not be an empty field"});
    }
})

app.listen(port,()=>console.log(`server is listening in port ${port}`));