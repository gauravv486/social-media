import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import API from '../api/axios.js';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/users/profile/${username}`);
      setProfileUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const isFollowing = profileUser.followers.some(f => f._id === currentUser._id);
      if (isFollowing) {
        await API.post(`/users/unfollow/${profileUser.username}`);
      } else {
        await API.post(`/users/follow/${profileUser.username}`);
      }
      fetchProfile();
    } catch (error) {
      console.error('Follow toggle error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profileUser._id;
  const isFollowing = profileUser.followers.some(f => f._id === currentUser?._id);

  return (
    <div className="min-h-screen bg-white max-w-3xl mx-auto px-4">

      {/* ── Header ── */}
      <header className="flex items-center justify-between py-4 border-b">
        <Link to="/" className="text-blue-600 font-bold text-lg">SocialMedia</Link>
        <Link to={`/profile/${currentUser?.username}`}>
          <img
            src={currentUser?.profilePicture ||
              `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=0D8ABC&color=fff`}
            className="w-8 h-8 rounded-full object-cover"
            alt="me"
          />
        </Link>
      </header>

      {/* ── Profile Section ── */}
      <div className="py-8">

        {/* ── Top Row: Avatar + Info ── */}
        <div className="flex items-center gap-12 mb-6">

          {/* Big Avatar */}
          <div className="shrink-0">
            <img
              src={profileUser.profilePicture ||
                `https://ui-avatars.com/api/?name=${profileUser.fullName}&background=CCCCCC&color=555&size=150`}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-200"
              alt={profileUser.fullName}
            />
          </div>

          {/* Right side info */}
          <div className="flex-1">

            {/* Username + Buttons row */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h2 className="text-xl font-light text-gray-900">
                {profileUser.username}
                {profileUser.isVerified && (
                  <span className="ml-1 text-blue-500 text-sm">✔</span>
                )}
              </h2>

              {isOwnProfile ? (
                <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Edit profile
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition ${
                    isFollowing
                      ? 'border border-gray-300 text-gray-800 hover:bg-gray-50'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            {/* Stats row */}
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <span className="font-semibold text-gray-900">{posts.length}</span>
                <span className="text-gray-600 ml-1 text-sm">posts</span>
              </div>

              <button
                onClick={() => setActiveTab(activeTab === 'followers' ? null : 'followers')}
                className="hover:opacity-70"
              >
                <span className="font-semibold text-gray-900">{profileUser.followers?.length || 0}</span>
                <span className="text-gray-600 ml-1 text-sm">followers</span>
              </button>

              <button
                onClick={() => setActiveTab(activeTab === 'following' ? null : 'following')}
                className="hover:opacity-70"
              >
                <span className="font-semibold text-gray-900">{profileUser.following?.length || 0}</span>
                <span className="text-gray-600 ml-1 text-sm">following</span>
              </button>
            </div>

            {/* Full Name + Bio */}
            <div>
              <p className="font-semibold text-gray-900 text-sm">{profileUser.fullName}</p>
              {profileUser.bio && (
                <p className="text-sm text-gray-700 mt-0.5">{profileUser.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Followers List (toggle) ── */}
        {activeTab === 'followers' && (
          <div className="border rounded-xl px-4 py-3 mb-4">
            <p className="font-semibold text-sm text-gray-800 mb-2">Followers</p>
            {profileUser.followers.length === 0 ? (
              <p className="text-sm text-gray-400">No followers yet</p>
            ) : (
              profileUser.followers.map((f) => (
                <Link
                  to={`/profile/${f.username}`}
                  key={f._id}
                  className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2"
                >
                  <img
                    src={f.profilePicture ||
                      `https://ui-avatars.com/api/?name=${f.fullName}&background=CCCCCC&color=555`}
                    className="w-9 h-9 rounded-full object-cover"
                    alt={f.fullName}
                  />
                  <div>
                    <p className="text-sm font-medium">{f.username}</p>
                    <p className="text-xs text-gray-400">{f.fullName}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* ── Following List (toggle) ── */}
        {activeTab === 'following' && (
          <div className="border rounded-xl px-4 py-3 mb-4">
            <p className="font-semibold text-sm text-gray-800 mb-2">Following</p>
            {profileUser.following.length === 0 ? (
              <p className="text-sm text-gray-400">Not following anyone yet</p>
            ) : (
              profileUser.following.map((f) => (
                <Link
                  to={`/profile/${f.username}`}
                  key={f._id}
                  className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2"
                >
                  <img
                    src={f.profilePicture ||
                      `https://ui-avatars.com/api/?name=${f.fullName}&background=CCCCCC&color=555`}
                    className="w-9 h-9 rounded-full object-cover"
                    alt={f.fullName}
                  />
                  <div>
                    <p className="text-sm font-medium">{f.username}</p>
                    <p className="text-xs text-gray-400">{f.fullName}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* ── Posts Grid Tabs ── */}
        <div className="border-t flex justify-center gap-12 mt-2">
          <button className="flex items-center gap-1 text-xs font-semibold text-gray-800 py-3 border-t border-gray-800 -mt-px">
            ⊞ POSTS
          </button>
        </div>

        {/* ── Posts Grid ── */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-xl font-bold text-gray-900">Share Photos</p>
            <p className="text-sm text-gray-500 text-center">
              When you share photos, they will appear on your profile.
            </p>
            {isOwnProfile && (
              <Link to="/" className="text-blue-500 text-sm font-semibold hover:text-blue-600">
                Share your first photo
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 mt-1">
            {posts.map((post) => (
              <div key={post._id} className="aspect-square bg-gray-100 overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer"
                    alt="post"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <p className="text-xs text-gray-400 text-center px-2 line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
