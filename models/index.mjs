import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';

import initGameModel from './game.mjs';
import initUserModel from './user.mjs';
import initGameUserModel from './gameUser.mjs'

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.Game = initGameModel(sequelize, Sequelize.DataTypes);
db.User = initUserModel(sequelize, Sequelize.DataTypes);
db.GameUser = initGameUserModel(sequelize, Sequelize.DataTypes);

// Define the many-to-many join table 
db.User.belongsToMany(db.Game, { through: db.GameUser })
db.Game.belongsToMany(db.User, { through: db.GameUser })

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;