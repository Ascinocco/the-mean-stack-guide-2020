const express = require('express');

const app = express();

app.use((req, res, next) => {
  // allow and client to access resources
  res.setHeader('Access-Control-Allow-Origin', '*');
  // allow these non default headers if the request contains them
  res.setHeader(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  // allow these http methods
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  )
  next();
});

app.use('/api/posts', (req, res, next) => {
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
