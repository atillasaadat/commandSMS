var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  config = require('../config/default');

var sequelize = new Sequelize(
  config['database'].database,
  config['database'].user,
  config['database'].password
);

var db = {};

fs
.readdirSync(__dirname)
.filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
})
.forEach(function(file) {
  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync({ force: false });
module.exports = db;
