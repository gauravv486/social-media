import React, { useState, useEffect } from 'react';
import { getPosts } from '../api/posts.js';
import useAuthStore from '../store/authStore.js';
import CreatePost from '../components/post/CreatePost';
import PostCard from '../components/post/PostCard';
import LeftSidebar from '../components/LeftSideBar.jsx';


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

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">SocialMedia</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.fullName}</span>
            <img
              src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`}
              className="w-8 h-8 rounded-full object-cover"
              alt="avatar"
            />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">

        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <LeftSidebar />
        </aside>

        {/* Center Feed */}
        <main className="flex-1 max-w-2xl">
          <CreatePost fetchPosts={fetchPosts} />

          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No posts yet. Create the first one!
            </p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                fetchPosts={fetchPosts}
              />
            ))
          )}
        </main>

        {/* Right Sidebar - placeholder */}
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">People you may know</h3>
            <p className="text-xs text-gray-400">Coming soon...</p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Feed;
