module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define('User', {
    uuid: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return User;
}
