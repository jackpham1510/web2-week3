const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const app = express();

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const TodoUtil = require('./todoutil.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.set('trust proxy', 1);
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { }
}));

app.use(express.static('/public'));

app.get('/', (req, res) => {
  if (req.session.auth) {
    res.redirect('/todos');
  }
  else {
    res.render('index');
  }
});

app.post('/', (req, res) => {
  if (req.body.username === config["username"] && req.body.password === config["password"]) {
    req.session.auth = true;
    res.redirect('/todos');
  }
  else {
    res.redirect('/');
  }
});

app.get('/todos', (req, res) => {
  if (!req.session.auth){
    res.redirect('/');
  }
  if (!req.session.todos) {
    req.session.todos = [];
  }
  res.render('todos', { todos: req.session.todos });
});

app.post('/todos', (req, res) => {
  let sess = req.session;
  sess.todos = TodoUtil.toggle(sess.todos, req.query.id);
  res.end(JSON.stringify(sess.todos));
});

app.put('/todos', (req, res) => {
  let text = req.body.text;
  let sess = req.session;
  sess.todos = TodoUtil.add(sess.todos, text);
  res.end(JSON.stringify(sess.todos));
});


app.delete('/todos', (req, res) => {
  let id = req.query.id;
  let sess = req.session;
  sess.todos = TodoUtil.remove(sess.todos, id);
  res.end(JSON.stringify(sess.todos));
});

const PORT = process.env.PORT || 8989;

app.listen(PORT, function (){
  console.log('Listen on port :8989');
});