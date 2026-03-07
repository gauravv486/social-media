import React, { useState } from 'react';
import API from '../api/axios.js';
import useAuthStore from '../store/authStore.js';

const FollowButton = ({ targetUsername, targetUserId }) => {
  const { user: currentUser, setUser } = useAuthStore();

  const isFollowing = currentUser?.following?.some(
    (f) => f._id === targetUserId || f === targetUserId
  );

  const [loading, setLoading] = useState(false);

  // Don't render button for own profile
  if (currentUser?._id === targetUserId) return null;

  const handleClick = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        await API.post(`/users/unfollow/${targetUsername}`);
        setUser({
          ...currentUser,
          following: currentUser.following.filter(
            (f) => f._id !== targetUserId && f !== targetUserId
          ),
        });
      } else {
        await API.post(`/users/follow/${targetUsername}`);
        setUser({
          ...currentUser,
          following: [...currentUser.following, { _id: targetUserId }],
        });
      }
    } catch (error) {
      console.error('Follow toggle error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-sm font-semibold rounded-full px-4 py-1.5 transition disabled:opacity-50"
      style={
        isFollowing
          ? {
              border: '1px solid #666666',
              color: '#666666',
              backgroundColor: 'transparent',
            }
          : {
              border: '1px solid #0a66c2',
              color: '#0a66c2',
              backgroundColor: 'transparent',
            }
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f3f2ef';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {loading ? '...' : isFollowing ? 'Following' : '+ Follow'}
    </button>
  );
};

export default FollowButton;
