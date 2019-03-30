const TodoUtil = require('./util.js');
const router = require('express-promise-router')();
const { User } = require('../../postgres');

router.get('/', (req, res) => {
  if (req.session.username) {
    res.redirect('/todos');
  }
  else {
    res.render('index');
  }
});

router.post('/', async (req, res) => {
  let { username, password } = req.body;
  let user = await User.findOne({ 
    where: {
      name: username,
      password: password
    }
  });
  if (!!user) {
    req.session.user = user;
    res.redirect('/todos');
  }
  else {
    res.redirect('/');
  }
});

router.get('/todos', async (req, res) => {
  const { user } = req.session;
  if (!user){
    res.redirect('/');
    return;
  }
  const todos = await TodoUtil.getAll(user.name);
  res.render('todos', { todos: todos.map(todo => {
      delete todo.dataValues.User;
      return todo; 
    }) 
  });
});

router.post('/todos', async (req, res) => {
  const { id } = req.query;
  res.end(JSON.stringify(await TodoUtil.toggle(id)));
});

router.put('/todos', async (req, res) => {
  const { text } = req.body;
  res.end(JSON.stringify(await TodoUtil.add(text, req.session.user)));
});


router.delete('/todos', async (req, res) => {
  let { id } = req.query;
  await TodoUtil.remove(id)
  res.end(id);
});

module.exports = router;
