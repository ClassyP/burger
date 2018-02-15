
module.exports = function(sequelize, DataTypes) {
    var burger = sequelize.define("burger", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        burger_name: { type: DataTypes.TEXT, allowNull: false },
        user_created: DataTypes.STRING,
        is_eaten: { type: DataTypes.BOOLEAN, defaultValue: false }
    });
    return burger;
  };
