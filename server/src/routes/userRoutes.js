import express from 'express'
import { followUser, getFollower, getFollowing, getUserProfile, unfollowUser, updateUserProfile } from '../controllers/userController.js';
import { isAutherized } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);
router.get('/:userId/followers', getFollower);
router.get('/:userId/following', getFollowing);


router.put('/update-profile', isAutherized, updateUserProfile);
router.post('/follow/:userId', isAutherized, followUser);
router.post('/unfollow/:userId', isAutherized, unfollowUser);

export default router;