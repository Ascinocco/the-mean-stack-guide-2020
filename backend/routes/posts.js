const express = require('express');
const checkAuth = require('../middleware/check-auth');
const processImage = require('../middleware/multer-storage-single-image');
const PostsController = require('../controllers/posts');

const router = express.Router();

router.post('', checkAuth, processImage, PostsController.createFolder);

router.put('/:id', checkAuth, processImage, PostsController.updateFolder);

router.delete('/:id', checkAuth, PostsController.deleteFolder);

router.get('', PostsController.getFolders);

router.get('/:id', PostsController.getFolderById);

module.exports = router;
