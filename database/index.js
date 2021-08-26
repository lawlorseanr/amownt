const { Sequelize, DataTypes } = require('Sequelize');
const { database, user, password, host, dialect } = require('./config/config')

const sequelize = new Sequelize(database, user, password, {
  host, dialect, logging: false
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unqiue: true,
    primaryKey: true,
  },
  link_token: {
    type: DataTypes.STRING,
  },
  expiration: {
    type: DataTypes.STRING,
  },
  public_token: {
    type: DataTypes.STRING,
  },
  access_token: {
    type: DataTypes.STRING,
  }
});

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  account: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  reconciled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
})

sequelize.sync();

module.exports = { User, Transaction }