import React, { useState } from 'react';
import { likePost, deletePost } from '../../api/posts.js';
import useAuthStore from '../../store/authStore.js';
import { Link } from 'react-router-dom';
import FollowButton from '../FollowButton.jsx';
import PostComment from '../PostComment.jsx';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { BiComment } from 'react-icons/bi';
import { RiSendPlaneLine } from 'react-icons/ri';
import { BsThreeDots } from 'react-icons/bs';
import { IoTrashOutline } from 'react-icons/io5';

const PostCard = ({ post, onPostDeleted }) => {

  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);

  const isLiked = likes.includes(user?._id);
  const isOwner = post.author?._id === user?._id;

  const handleLike = async () => {
    // Optimistic update
    if (isLiked) {
      setLikes((prev) => prev.filter((id) => id !== user._id));
    } else {
      setLikes((prev) => [...prev, user._id]);
    }
    try {
      await likePost(post._id);
    } catch (error) {
      // Rollback on error
      if (isLiked) {
        setLikes((prev) => [...prev, user._id]);
      } else {
        setLikes((prev) => prev.filter((id) => id !== user._id));
      }
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(post._id);
      // Real-time: remove from parent state
      if (onPostDeleted) onPostDeleted(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <div
      className="bg-white rounded-lg mb-2"
      style={{ border: '1px solid #e0ddd6' }}
    >

      <div className="flex items-start justify-between px-3 sm:px-4 pt-3 pb-2">

        <div className="flex items-start gap-2 min-w-0">

          <Link to={`/profile/${post.author?.username}`} className="shrink-0">
            <img
              src={
                post.author?.profilePicture ||
                `https://ui-avatars.com/api/?name=${post.author?.fullName}&background=0D8ABC&color=fff`
              }
              alt={post.author?.fullName}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
          </Link>

          <div className="flex flex-col min-w-0">

            <div className="flex items-center gap-1.5 flex-wrap">
              <Link to={`/profile/${post.author?.username}`}>
                <span
                  className="text-sm font-semibold hover:underline leading-tight"
                  style={{ color: '#000000e0' }}
                >
                  {post.author?.fullName}
                </span>
              </Link>

              {!isOwner && (
                <>
                  <span style={{ color: '#00000040' }}>·</span>
                  <FollowButton
                    targetUsername={post.author.username}
                    targetUserId={post.author._id}
                  />
                </>
              )}
            </div>

            <span
              className="text-xs truncate max-w-[200px] sm:max-w-xs"
              style={{ color: '#00000099' }}
            >
              {post.author?.bio || post.author?.username}
            </span>

            <span className="text-xs" style={{ color: '#00000066' }}>
              {new Date(post.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="relative shrink-0 ml-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full transition"
            style={{ color: '#00000099' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f2ef')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <BsThreeDots size={20} />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl z-20 py-1"
              style={{ border: '1px solid #e0ddd6' }}
            >
              {isOwner && (
                <button
                  onClick={() => { handleDelete(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition"
                >
                  <IoTrashOutline size={16} />
                  Delete post
                </button>
              )}
              <button
                onClick={() => setShowMenu(false)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition"
                style={{ color: '#00000099' }}
              >
                Not interested
              </button>
            </div>
          )}
        </div>
      </div>

      <p
        className="px-3 sm:px-4 pb-3 text-sm leading-relaxed break-words"
        style={{ color: '#000000e0' }}
      >
        {post.content}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full object-cover max-h-[500px]"
        />
      )}

      {(likes.length > 0 || comments.length > 0) && (
        <div
          className="flex items-center justify-between px-3 sm:px-4 py-1.5 text-xs"
          style={{ color: '#00000099' }}
        >
          {likes.length > 0 && (
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#0a66c2' }}
              >
                <AiFillLike size={10} color="#fff" />
              </div>
              <span>{likes.length}</span>
            </div>
          )}
          {comments.length > 0 && (
            <span
              className="ml-auto hover:underline cursor-pointer"
              onClick={() => setShowComments(!showComments)}
            >
              {comments.length} comment{comments.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      <div className="mx-3 sm:mx-4" style={{ borderTop: '1px solid #e0ddd6' }} />

      <div className="flex items-center px-1 sm:px-2 py-1">
        {[
          {
            icon: isLiked
              ? <AiFillLike size={20} style={{ color: '#0a66c2' }} />
              : <AiOutlineLike size={20} />,
            label: 'Like',
            onClick: handleLike,
            active: isLiked,
          },
          {
            icon: <BiComment size={20} />,
            label: 'Comment',
            onClick: () => setShowComments(!showComments),
            active: showComments,
          },
          {
            icon: <RiSendPlaneLine size={20} />,
            label: 'Send',
            onClick: () => { },
            active: false,
          },
        ].map(({ icon, label, onClick, active }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-center py-2 rounded-lg text-xs sm:text-sm font-semibold transition"
            style={{ color: active ? '#0a66c2' : '#666666' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f2ef')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {showComments && (
        <div
          className="px-3 sm:px-4 pt-3 pb-2"
          style={{ borderTop: '1px solid #e0ddd6' }}
        >
          <PostComment
            postId={post._id}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}

    </div>
  );
};

export default PostCard;
