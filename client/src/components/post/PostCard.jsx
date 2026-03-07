import React, { useState } from 'react';
import { likePost, deletePost } from '../../api/posts';
import useAuthStore from '../../store/authStore.js';
import { Link } from 'react-router-dom';
import FollowButton from '../FollowButton.jsx';
import PostComment from '../PostComment.jsx';

const PostCard = ({ post, fetchPosts }) => {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      await likePost(post._id);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(post._id);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const isLiked = post.likes?.includes(user?._id);
  const isOwner = post.author?._id === user?._id;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">

      {/* Author Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {post.author?.profilePicture ? (
              <img
                src={post.author.profilePicture}
                alt={post.author.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              post.author?.fullName?.charAt(0).toUpperCase()
            )}
          </div>

          {/* Author Info */}
          <div>
            <Link to={`/profile/${post.author?.username}`}>
              <p className="font-semibold text-gray-900 text-sm">
                {post.author?.fullName}
              </p>
            </Link>

            <p className="text-xs text-gray-500">@{post.author?.username}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className='pl-60'>
            <FollowButton
              targetUsername={post.author.username}
              targetUserId={post.author._id}
            />
          </div>

        </div>

        {/* Delete button (owner only) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>

      {/* Post Content */}
      <p className="text-gray-800 text-sm mb-3 leading-relaxed">
        {post.content}
      </p>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-lg object-cover mb-3 max-h-96"
        />
      )}

      {/* Likes & Comments Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 py-2 border-t border-b border-gray-100 mb-2">
        <span>
          {post.likes?.length > 0 && `❤️ ${post.likes.length} likes`}
        </span>
        <span
          onClick={() => setShowComments(!showComments)}
          className="cursor-pointer hover:underline"
        >
          {post.comments?.length > 0 && `${post.comments.length} comments`}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition flex-1 justify-center ${isLiked ? 'text-red-500' : 'text-gray-600'
            }`}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span>Like</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition flex-1 justify-center"
        >
          {/* <PostComment
            postId={post._id}
            comments={post.comments}
          /> */}
          Comments
        </button>

        {/* Share Button */}
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition flex-1 justify-center"
        >
          <span>↗️</span>
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section (toggle) */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {post.comments?.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-2">
              No comments yet. Be the first!
            </p>
          ) : (
            <p className="text-xs text-gray-400 text-center py-2">
              <PostComment
            postId={post._id}
            comments={post.comments}
          />
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
