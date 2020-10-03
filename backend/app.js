const express = require('express');

const app = express();

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
