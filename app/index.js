const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('/public'));

app.set('view engine', 'ejs');
app.use(require('./redis')); // redis-session

app.use(require('./routes/todos')); // Routing

const PORT = process.env.PORT || 8989;

app.listen(PORT, function (){
  console.log('Listen on port :' + PORT);
});
