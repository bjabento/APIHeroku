const Sequelize = require('sequelize');
module.exports = new Sequelize('dev328vhnt35e3','whqdjlzepmofwd','af20458b924ecfed25896e111dc3217d837ba53e8b6fca741883f0f7b2bb97d4',{
    host: 'ec2-52-19-96-181.eu-west-1.compute.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});