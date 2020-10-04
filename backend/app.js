const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const dbConnString =
  'mongodb+srv://'
  + process.env.MONGO_DB_USER
  + ':'
  + process.env.MONGO_DB_PASSWORD
  + '@the-mean-stack-guide-20.mj3hi.mongodb.net/'
  + process.env.MONGO_DB_NAME
  + '?retryWrites=true&w=majority';

const app = express();
mongoose.connect(dbConnString)
  .then(() => {
    console.log('db running...');
  })
  .catch((err) => {
    console.log('Connection to db failed!');
    console.error(err);
    process.exit(1);
  });

// express middleware for parses json data, body parses supports many data formats
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // allow and client to access resources
  res.setHeader('Access-Control-Allow-Origin', '*');
  // allow these non default headers if the request contains them
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  // allow these http methods
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  )
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
