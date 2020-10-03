const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// express middleware for parses json data, body parses supports many data formats
app.use(bodyParser.json());

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
    'GET, POST, PATCH, DELETE, OPTIONS'
  )
  next();
});

app.post('/api/posts', (req, res, next) => {
  console.log('posts post req data', req.body);
  res
    .status(201)
    .json({
      message: 'Post added successfully',
    });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    { id: 'woiegjiew', title: 'Post 1', content: 'some content 1' },
    { id: 'wioehhwme', title: 'Post 2', content: 'some content 2' },
    { id: 'pperotgss', title: 'Post 3', content: 'some content 3' },
  ];

  res
    .status(200)
    .json({
      message: 'Posts fetched successfully',
      posts,
    });
});

module.exports = app;
