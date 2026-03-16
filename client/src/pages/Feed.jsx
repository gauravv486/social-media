import React, { useState, useEffect, useCallback } from 'react';
import { getPosts } from '../api/posts.js';
import useAuthStore from '../store/authStore.js';
import CreatePost from '../components/post/CreatePost';
import PostCard from '../components/post/PostCard';
import LeftSidebar from '../components/LeftSideBar.jsx';
import { Link } from 'react-router-dom';
import Logout from '../components/auth/Logout.jsx';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Real-time: prepend new post to local state
  const handlePostCreated = useCallback((newPost) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  // Real-time: update a post in local state (likes, comments)
  const handlePostUpdated = useCallback((updatedPost) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  }, []);

  // Real-time: remove a post from local state
  const handlePostDeleted = useCallback((postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f2ef' }}>

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold" style={{ color: '#0a66c2' }}>Nexus</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">

            {/* Avatar + Name */}
            <Link
              to={`/profile/${user?.username}`}
              className="flex flex-col items-center text-gray-500 hover:text-black transition"
            >
              <img
                src={user?.profilePicture ||
                  `https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`}
                className="w-6 h-6 rounded-full object-cover"
                alt="avatar"
              />
              <span className="text-xs mt-0.5 hidden sm:inline">Me</span>
            </Link>

            {/* Logout */}
            <Logout />
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-5 flex gap-5">

        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <LeftSidebar />
        </aside>

        {/* Center Feed */}
        <main className="flex-1 min-w-0 max-w-xl mx-auto lg:mx-0">
          <CreatePost onPostCreated={handlePostCreated} />

          {posts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-sm">No posts yet. Create the first one!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Nexus</h3>
            </div>
            <div className="space-y-3">
              {[
                'People you may know',
                'Trending in Tech',
                'Jobs near you',
              ].map((item) => (
                <div key={item} className="flex items-start gap-1">
                  <span className="text-gray-800 text-xs mt-0.5">•</span>
                  <p className="text-xs font-medium text-gray-800 hover:underline cursor-pointer">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Feed;
