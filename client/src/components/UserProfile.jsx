import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import API from '../api/axios.js';
import PostCard from '../components/post/PostCard.jsx';
import { BsGrid3X3, BsPersonBoundingBox } from 'react-icons/bs';
import { MdOutlineBookmarkBorder } from 'react-icons/md';
import Logout from '../components/auth/Logout.jsx';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();

  const [profileUser, setProfileUser]   = useState(null);
  const [posts, setPosts]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('posts'); // 'posts' | 'followers' | 'following'

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
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

  // ✅ Fetch all posts by this user
  const fetchUserPosts = async () => {
    try {
      const { data } = await API.get(`/posts/user/${username}`);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
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

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f3f2ef' }}>
        <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#0a66c2' }} />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f3f2ef' }}>
        <p style={{ color: '#00000099' }}>User not found</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profileUser._id;
  const isFollowing  = profileUser.followers.some(f => f._id === currentUser?._id);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f2ef' }}>

      {/* ── Header (matches Feed) ── */}
      <header className="bg-white sticky top-0 z-10" style={{ borderBottom: '1px solid #e0ddd6' }}>
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold" style={{ color: '#0a66c2' }}>Nexus</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to={`/profile/${currentUser?.username}`}
              className="flex flex-col items-center text-gray-500 hover:text-black transition"
            >
              <img
                src={currentUser?.profilePicture ||
                  `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=0D8ABC&color=fff`}
                className="w-6 h-6 rounded-full object-cover"
                alt="me"
              />
              <span className="text-xs mt-0.5">Me</span>
            </Link>
            <Logout />
          </div>
        </div>
      </header>

      {/* ── Page Body ── */}
      <div className="max-w-3xl mx-auto px-4 py-5">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-lg mb-3 overflow-hidden" style={{ border: '1px solid #e0ddd6' }}>

          {/* Cover */}
          <div className="h-24 bg-gradient-to-r from-blue-300 to-blue-500" />

          {/* Avatar row */}
          <div className="px-5 pb-4">
            <div className="-mt-12 mb-3 flex items-end justify-between">
              <img
                src={profileUser.profilePicture ||
                  `https://ui-avatars.com/api/?name=${profileUser.fullName}&background=0D8ABC&color=fff&size=150`}
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
                alt={profileUser.fullName}
              />

              {/* Action Buttons */}
              <div className="flex gap-2 mb-1">
                {isOwnProfile ? (
                  <button
                    className="px-4 py-1.5 rounded-full text-sm font-semibold transition"
                    style={{ border: '1px solid #0a66c2', color: '#0a66c2' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f2ef'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Edit profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold text-white transition"
                      style={{ backgroundColor: '#0a66c2' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#004182'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0a66c2'}
                    >
                      {isFollowing ? 'Following' : '+ Follow'}
                    </button>
                    {/* <button
                      className="px-4 py-1.5 rounded-full text-sm font-semibold transition"
                      style={{ border: '1px solid #0a66c2', color: '#0a66c2' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f2ef'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Message
                    </button> */}
                  </>
                )}
              </div>
            </div>

            {/* Name + Bio */}
            <h2 className="text-xl font-semibold" style={{ color: '#000000e0' }}>
              {profileUser.fullName}
              {profileUser.isVerified && (
                <span className="ml-1 text-sm" style={{ color: '#0a66c2' }}>✔</span>
              )}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#00000099' }}>
              @{profileUser.username}
            </p>
            {profileUser.bio && (
              <p className="text-sm mt-1" style={{ color: '#000000e0' }}>{profileUser.bio}</p>
            )}

            {/* Stats row */}
            <div
              className="flex gap-5 mt-3 pt-3"
              style={{ borderTop: '1px solid #e0ddd6' }}
            >
              <div className="text-sm">
                <span className="font-semibold" style={{ color: '#000000e0' }}>{posts.length}</span>
                <span className="ml-1" style={{ color: '#00000099' }}>posts</span>
              </div>

              <button
                onClick={() => setActiveTab(activeTab === 'followers' ? 'posts' : 'followers')}
                className="text-sm hover:underline"
              >
                <span className="font-semibold" style={{ color: '#000000e0' }}>
                  {profileUser.followers?.length || 0}
                </span>
                <span className="ml-1" style={{ color: '#00000099' }}>followers</span>
              </button>

              <button
                onClick={() => setActiveTab(activeTab === 'following' ? 'posts' : 'following')}
                className="text-sm hover:underline"
              >
                <span className="font-semibold" style={{ color: '#000000e0' }}>
                  {profileUser.following?.length || 0}
                </span>
                <span className="ml-1" style={{ color: '#00000099' }}>following</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Followers List ── */}
        {activeTab === 'followers' && (
          <div className="bg-white rounded-lg mb-3 px-4 py-3" style={{ border: '1px solid #e0ddd6' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#000000e0' }}>Followers</p>
            {profileUser.followers.length === 0 ? (
              <p className="text-sm" style={{ color: '#00000066' }}>No followers yet</p>
            ) : (
              profileUser.followers.map((f) => (
                <Link
                  to={`/profile/${f.username}`}
                  key={f._id}
                  className="flex items-center gap-3 py-2 px-2 rounded-lg transition"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f2ef'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img
                    src={f.profilePicture ||
                      `https://ui-avatars.com/api/?name=${f.fullName}&background=0D8ABC&color=fff`}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={f.fullName}
                  />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#000000e0' }}>{f.fullName}</p>
                    <p className="text-xs" style={{ color: '#00000099' }}>@{f.username}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* ── Following List ── */}
        {activeTab === 'following' && (
          <div className="bg-white rounded-lg mb-3 px-4 py-3" style={{ border: '1px solid #e0ddd6' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#000000e0' }}>Following</p>
            {profileUser.following.length === 0 ? (
              <p className="text-sm" style={{ color: '#00000066' }}>Not following anyone yet</p>
            ) : (
              profileUser.following.map((f) => (
                <Link
                  to={`/profile/${f.username}`}
                  key={f._id}
                  className="flex items-center gap-3 py-2 px-2 rounded-lg transition"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f2ef'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img
                    src={f.profilePicture ||
                      `https://ui-avatars.com/api/?name=${f.fullName}&background=0D8ABC&color=fff`}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={f.fullName}
                  />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#000000e0' }}>{f.fullName}</p>
                    <p className="text-xs" style={{ color: '#00000099' }}>@{f.username}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* ── Posts Tab Bar ── */}
        <div
          className="bg-white rounded-lg mb-3 flex"
          style={{ border: '1px solid #e0ddd6' }}
        >
          {[
            { id: 'posts',   icon: <BsGrid3X3 size={16} />,            label: 'Posts'  },
            { id: 'saved',   icon: <MdOutlineBookmarkBorder size={16} />, label: 'Saved'  },
          ].map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 flex-1 justify-center py-3 text-xs font-semibold tracking-widest uppercase transition"
              style={{
                color: activeTab === id ? '#000000e0' : '#00000066',
                borderBottom: activeTab === id ? '2px solid #000000e0' : '2px solid transparent',
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* ── Posts Feed ── */}
        {activeTab === 'posts' && (
          <>
            {posts.length === 0 ? (
              <div
                className="bg-white rounded-lg flex flex-col items-center justify-center py-16 gap-3"
                style={{ border: '1px solid #e0ddd6' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ border: '2px solid #00000099' }}
                >
                  <BsGrid3X3 size={28} style={{ color: '#00000099' }} />
                </div>
                <p className="text-lg font-bold" style={{ color: '#000000e0' }}>No Posts Yet</p>
                <p className="text-sm text-center" style={{ color: '#00000099' }}>
                  When {isOwnProfile ? 'you share posts' : `${profileUser.fullName} shares posts`}, they'll appear here.
                </p>
                {isOwnProfile && (
                  <Link
                    to="/"
                    className="text-sm font-semibold"
                    style={{ color: '#0a66c2' }}
                  >
                    Share your first post
                  </Link>
                )}
              </div>
            ) : (
              // ✅ Render full PostCards just like Feed
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  fetchPosts={fetchUserPosts}
                />
              ))
            )}
          </>
        )}

        {/* Saved / Tagged placeholders */}
        {(activeTab === 'saved' || activeTab === 'tagged') && (
          <div
            className="bg-white rounded-lg flex items-center justify-center py-16"
            style={{ border: '1px solid #e0ddd6' }}
          >
            <p className="text-sm" style={{ color: '#00000099' }}>Coming soon...</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
