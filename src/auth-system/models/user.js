var Sequelize = require('sequelize');
//import Sequelize as * from 'sequelize';
//import { Crypto } from '../../helpers/hash';

var bcrypt = require('bcrypt');

//var sequelize = new Sequelize('postgres://postgres@localhost:5432/auth-system');

const sequelize = new Sequelize('postgres://postgres:parola123@localhost:5432/auth-system', {
    host: 'localhost',
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
  });

var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    instanceMethods: {
        validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
          }
    }    
});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch((error) => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;