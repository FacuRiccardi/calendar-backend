'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Event.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  Event.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: 'The length of your name must be between 1 and 100'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 150],
          msg: 'The length of your name must be between 1 and 150'
        }
      }
    },
    utc_date: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'The date is not valid'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event'
  })
  return Event
}
