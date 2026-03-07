import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import API from '../api/axios.js'
import FollowButton from './FollowButton.jsx';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null); // 'followers' | 'following' | null

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
      const isFollowing = profileUser.followers.some(
        f => f._id === currentUser._id
      );

      if (isFollowing) {
        await API.post(`/users/unfollow/${profileUser.username}`);
      } else {
        await API.post(`/users/follow/${profileUser.username}`);
      }

      // Refetch to get updated data
      fetchProfile();

    } catch (error) {
      console.error('Follow toggle error:', error);
    }
  };

  // ── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Not Found ───────────────────────────────────────────
  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">User not found</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profileUser._id;
  const isFollowing = profileUser.followers.some(f => f._id === currentUser?._id);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Header ── */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">SocialMedia</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{currentUser?.fullName}</span>
            <img
              src={currentUser?.profilePicture ||
                `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=0D8ABC&color=fff`}
              className="w-8 h-8 rounded-full object-cover"
              alt="avatar"
            />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">

          {/* Cover */}
          <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600" />

          <div className="px-6 pb-6">
            <div className="flex justify-between items-end -mt-12 mb-4">

              {/* Avatar */}
              <img
                src={profileUser.profilePicture ||
                  `https://ui-avatars.com/api/?name=${profileUser.fullName}&background=0D8ABC&color=fff&size=128`}
                alt={profileUser.fullName}
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
              />

              {/* Follow / Edit Button */}
              {!isOwnProfile && (
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-1.5 rounded-full text-sm font-semibold transition ${isFollowing
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {isFollowing ? 'Unfollow' : '+ Follow'}
                </button>
              )}
            </div>

            {/* Name & Bio */}
            <h1 className="text-2xl font-bold text-gray-900">{profileUser.fullName}</h1>
            <p className="text-gray-400 text-sm mt-0.5">@{profileUser.username}</p>
            {profileUser.bio && (
              <p className="text-gray-700 mt-2">{profileUser.bio}</p>
            )}

            {/* ── Stats with Toggle ── */}
            <div className="flex gap-8 mt-5 pt-4 border-t border-gray-100">

              <div className="text-center">
                <p className="font-bold text-gray-900 text-lg">0</p>
                <p className="text-gray-500 text-xs">Posts</p>
              </div>

              {/* Followers - clickable */}
              <button
                onClick={() => setActiveTab(activeTab === 'followers' ? null : 'followers')}
                className="text-center hover:opacity-70 transition"
              >
                <p className="font-bold text-gray-900 text-lg">{profileUser.followers?.length || 0}</p>
                <p className={`text-xs ${activeTab === 'followers' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  Followers
                </p>
              </button>

              {/* Following - clickable */}
              <button
                onClick={() => setActiveTab(activeTab === 'following' ? null : 'following')}
                className="text-center hover:opacity-70 transition"
              >
                <p className="font-bold text-gray-900 text-lg">{profileUser.following?.length || 0}</p>
                <p className={`text-xs ${activeTab === 'following' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  Following
                </p>
              </button>

            </div>
          </div>

          {/* ── Followers List (toggle) ── */}
          {activeTab === 'followers' && (
            <div className="border-t border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-800 mb-3">Followers</h3>
              {profileUser.followers.length === 0 ? (
                <p className="text-gray-400 text-sm">No followers yet</p>
              ) : (
                profileUser.followers.map((follower) => (
                  <Link
                    to={`/profile/${follower.username}`}
                    key={follower._id}
                    className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition"
                  >
                    <img
                      src={follower.profilePicture ||
                        `https://ui-avatars.com/api/?name=${follower.fullName}&background=0D8ABC&color=fff`}
                      className="w-9 h-9 rounded-full object-cover"
                      alt={follower.fullName}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{follower.fullName}</p>
                      <p className="text-xs text-gray-400">@{follower.username}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* ── Following List (toggle) ── */}
          {activeTab === 'following' && (
            <div className="border-t border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-800 mb-3">Following</h3>
              {profileUser.following.length === 0 ? (
                <p className="text-gray-400 text-sm">Not following anyone yet</p>
              ) : (
                profileUser.following.map((followed) => (
                  <Link
                    to={`/profile/${followed.username}`}
                    key={followed._id}
                    className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition"
                  >
                    <img
                      src={followed.profilePicture ||
                        `https://ui-avatars.com/api/?name=${followed.fullName}&background=0D8ABC&color=fff`}
                      className="w-9 h-9 rounded-full object-cover"
                      alt={followed.fullName}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{followed.fullName}</p>
                      <p className="text-xs text-gray-400">@{followed.username}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}


          <FollowButton
            targetUsername={profileUser.username}
            targetUserId={profileUser._id}
          />



        </div>

        {/* ── Posts Placeholder ── */}
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-500">No posts yet</p>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
