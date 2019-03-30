const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  define: {
    timestamps: false
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class Todo extends Sequelize.Model {}
Todo.init({
  text: {
    type: Sequelize.STRING
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize
});

class User extends Sequelize.Model {}
User.init({
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize
});

User.hasMany(Todo);
Todo.belongsTo(User);

sequelize.sync().then(() => {
  User.findOrCreate({
    where: {
      name: '1660125',
      password: 'kocopass'
    }
  })
});

module.exports = {
  Todo,
  User
}