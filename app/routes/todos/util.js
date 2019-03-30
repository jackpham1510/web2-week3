const {Todo,User} = require('../../postgres');

class TodoUtil {
  static getAll(username) {
    return new Promise(async resolve => {
      resolve(await Todo.findAll({
        include: [{
          model: User,
          where: { name: username }
        }]
      }));
    });
  }

  static add(text, user) {
    return new Promise(async resolve => {
      resolve(await Todo.create({
        text, active: true, UserId: user.id
      }));
    });
  }

  static remove(id) {
    return new Promise(async resolve => {
      resolve(await Todo.destroy({
        where: { id }
      }));
    })
  }

  static toggle(id) {
    return new Promise(async resolve => {
      let todo = await Todo.findOne({
        where: { id }
      });
      resolve(await todo.update({ active: !todo.dataValues.active })); 
    })
  }
}

module.exports = TodoUtil;