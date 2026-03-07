import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import uploadImage from '../utils/uploadImage.js';
import User from '../models/User.js';


// POST /api/posts  (create post)

export const createPost = async (req, res) => {

  try {
    const { content } = req.body;
    let imageUrl = '';

    if (req.file) {
      console.log('Uploading to cloudinary...');
      imageUrl = await uploadImage(req.file.buffer, 'posts');
      console.log('Cloudinary URL →', imageUrl);
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      image: imageUrl,
    });

    const populated = await post.populate('author', 'username fullName profilePicture');
    res.status(201).json(populated);

  } catch (error) {
    console.error('FULL ERROR →', error);  // ← this will show real error
    res.status(500).json({ message: 'Server error' });
  }
};



// GET /api/posts  (feed: latest posts)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username fullName profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        }
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

// DELETE /api/posts/:id  (delete own post)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete this post' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};

// POST /api/posts/:id/like  (toggle like)
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.some(
      (likeId) => likeId.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const populated = await post
      .populate('author', 'username fullName profilePicture')

    res.json(populated);

  } catch (err) {
    console.error('Toggle like error:', err);
    res.status(500).json({ message: 'Server error liking post' });
  }
};

// POST /api/posts/:id/comment  (add comment)
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
    });

    post.comments.push(comment._id);
    await post.save();

    // ✅ Populate author before sending back
    const populatedComment = await comment.populate('author', 'username fullName profilePicture');

    res.status(201).json(populatedComment);  // ✅ send single populated comment

  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};


export const getMyPosts = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const posts = await Post.find({ author: user._id })
    .populate('author', 'fullName username profilePicture bio')
    .populate('comments.user', 'fullName username profilePicture')
    .sort({ createdAt: -1 });

  res.json(posts);
}