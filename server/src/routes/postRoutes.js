import express from 'express';
import { isAutherized } from '../middleware/auth.js';
import { addComment, createPost, deletePost, getPosts, toggleLike } from '../controllers/postController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/createpost', isAutherized, upload.single('image') , createPost);
router.get('/getpost', isAutherized, getPosts);
router.delete('/deletepost/:postId', isAutherized, deletePost);
router.post('/likepost/:id/like', isAutherized, toggleLike);
router.post('/:id/comment', isAutherized, addComment);

export default router;