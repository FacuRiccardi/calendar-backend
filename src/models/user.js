'use strict'
const {
  Model
} = require('sequelize')

const bcrypt = require('bcrypt')
const authConfig = require('../../config/auth')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasMany(models.Event, {
        as: 'events',
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await bcrypt.hash(
          user.password,
          Number.parseInt(authConfig.rounds)
        )
      },
      beforeUpdate: async (user, options) => {
        if (user.password !== user._previousDataValues.password) {
          options.validate = false
          user.password = await bcrypt.hash(
            user.password,
            Number.parseInt(authConfig.rounds)
          )
        }
      }
    },
    sequelize,
    modelName: 'User'
  })

  User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  return User
}
