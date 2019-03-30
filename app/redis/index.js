const redis = require('redis');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const config = require('../config');
const { REDIS_URL } = process.env;

const redisClient = redis.createClient(REDIS_URL);

redisClient.on('error', err => {
  console.log('Redis error:', err);
});

module.exports = session({
  secret: config.secret,
  name: "web2_week3",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new redisStore({
    url: REDIS_URL,
    client: redisClient
  })
})