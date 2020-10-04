const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

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

app.post('/api/posts', (req, res, next) => {
  console.log('posts post req data', req.body);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then((newPost) => {
    res
      .status(201)
      .json({
        message: 'Post added successfully',
        postId: newPost._id,
      });
  });
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.updateOne({ _id: req.params.id }, post).then((post) => {
    res.status(200).json({
      message: 'Update successful',
      post,
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts,
      });
    });
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!',
      })
    }
  });
})

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: 'Post deleted',
    });
  });
});

module.exports = app;
