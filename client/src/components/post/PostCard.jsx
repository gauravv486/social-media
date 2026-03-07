import React, { useState } from 'react';
import { likePost, deletePost } from '../../api/posts';
import useAuthStore from '../../store/authStore.js';
import { Link } from 'react-router-dom';
import FollowButton from '../FollowButton.jsx';
import PostComment from '../PostComment.jsx';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { BiComment } from 'react-icons/bi';
import { RiSendPlaneLine } from 'react-icons/ri';
import { BsThreeDots } from 'react-icons/bs';
import { IoTrashOutline } from 'react-icons/io5';

const PostCard = ({ post, fetchPosts }) => {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // ── Real-time optimistic state ──
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);

  const isLiked = likes.includes(user?._id);
  const isOwner = post.author?._id === user?._id;

  // ── Optimistic Like (instant UI, no fetchPosts) ──
  const handleLike = async () => {
    // Optimistically update UI first
    if (isLiked) {
      setLikes((prev) => prev.filter((id) => id !== user._id));
    } else {
      setLikes((prev) => [...prev, user._id]);
    }
    try {
      await likePost(post._id);
    } catch (error) {
      // Revert on failure
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
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Called by PostComment after adding a new comment
  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  return (
    <div
      className="bg-white rounded-lg mb-2"
      style={{ border: '1px solid #e0ddd6' }}
    >

      {/* ── Author Header ── */}
      <div className="flex items-start justify-between px-4 pt-3 pb-2">

        {/* Left: Avatar + Info */}
        <div className="flex items-start gap-2 min-w-0">

          {/* Avatar */}
          <Link to={`/profile/${post.author?.username}`} className="shrink-0">
            <img
              src={
                post.author?.profilePicture ||
                `https://ui-avatars.com/api/?name=${post.author?.fullName}&background=0D8ABC&color=fff`
              }
              alt={post.author?.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          </Link>

          {/* Name + Follow + Bio + Date */}
          <div className="flex flex-col min-w-0">

            {/* Row 1: Name · Follow */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link to={`/profile/${post.author?.username}`}>
                <span
                  className="text-sm font-semibold hover:underline leading-tight"
                  style={{ color: '#000000e0' }}
                >
                  {post.author?.fullName}
                </span>
              </Link>

              {/* ✅ Inline · Follow — only for others */}
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

            {/* Row 2: Bio */}
            <span
              className="text-xs truncate max-w-xs"
              style={{ color: '#00000099' }}
            >
              {post.author?.bio || post.author?.username}
            </span>

            {/* Row 3: Date */}
            <span className="text-xs" style={{ color: '#00000066' }}>
              {new Date(post.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })} · 🌐
            </span>
          </div>
        </div>

        {/* Right: Three-dot menu */}
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

      {/* ── Post Content ── */}
      <p
        className="px-4 pb-3 text-sm leading-relaxed"
        style={{ color: '#000000e0' }}
      >
        {post.content}
      </p>

      {/* ── Post Image ── */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full object-cover max-h-[500px]"
        />
      )}

      {/* ── Likes & Comments Count ── */}
      {(likes.length > 0 || comments.length > 0) && (
        <div
          className="flex items-center justify-between px-4 py-1.5 text-xs"
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

      {/* ── Divider ── */}
      <div className="mx-4" style={{ borderTop: '1px solid #e0ddd6' }} />

      {/* ── Action Buttons ── */}
      <div className="flex items-center px-2 py-1">
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
            onClick: () => {},
            active: false,
          },
        ].map(({ icon, label, onClick, active }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-lg text-sm font-semibold transition"
            style={{ color: active ? '#0a66c2' : '#666666' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f2ef')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Comments Section ── */}
      {showComments && (
        <div
          className="px-4 pt-3 pb-2"
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
