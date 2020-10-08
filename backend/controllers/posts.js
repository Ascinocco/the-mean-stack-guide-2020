const Post = require('../models/post');

// multer will attempt to extract single file from request
const createFolder = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId,
  });

  post.save().then((newPost) => {
    res
      .status(201)
      .json({
        message: 'Post added successfully',
        post: {
          id: newPost._id,
          title: newPost.title,
          content: newPost.content,
          imagePath: newPost.imagePath,
        },
      });
  })
  .catch((error) => {
    res.status(500).json({
      message: 'Creating a post failed!',
    });
  });
};

const updateFolder = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }


  const creator = req.userData.userId;
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creator,
  });

  Post.updateOne({ _id: req.params.id, creator, }, post).then((post) => {
    if (!post.nModified) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      message: 'Update successful',
      post,
    });
  })
  .catch((error) => {
    res.status(500).json({
      message: 'Could not update post.'
    });
  });
};

const deleteFolder = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    if (!result.n) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      message: 'Post deleted',
    });
  })
  .catch((error) => {
    res.status(500).json({
      message: 'Failed to delete post.',
    });
  });
};


const getFolders = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchPosts;

  if (pageSize && currentPage) {
    // inefficient for large data sets as it scans every item
    postQuery
      .skip(pageSize * (currentPage - 1)) // skips the first n posts
      .limit(pageSize); // limit number of items returned
  }

  postQuery
    .then((posts) => {
      fetchPosts = posts;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching posts failed',
      });
    });
};

const getFolderById = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!',
      })
    }
  })
  .catch((error) => {
    res.status(500).json({
      message: 'Fetching post failed',
    });
  });;
}

module.exports = {
  createFolder,
  updateFolder,
  deleteFolder,
  getFolders,
  getFolderById,
};
