import React, { useState, useEffect } from 'react';
import API from '../api/axios.js';
import useAuthStore from '../store/authStore.js';

const FollowButton = ({ targetUsername, targetUserId }) => {

    const { user: currentUser, setUser } = useAuthStore();

    // Derive isFollowing directly from currentUser's following list
    const isFollowing = currentUser?.following?.some(
        (f) => f._id === targetUserId || f === targetUserId
    );

    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);

            if (isFollowing) {
                await API.post(`/users/unfollow/${targetUsername}`);

                // Remove targetUserId from currentUser's following list
                setUser({
                    ...currentUser,
                    following: currentUser.following.filter(
                        (f) => f._id !== targetUserId && f !== targetUserId
                    )
                });

            } else {
                await API.post(`/users/follow/${targetUsername}`);

                // Add targetUserId to currentUser's following list
                setUser({
                    ...currentUser,
                    following: [...currentUser.following, { _id: targetUserId }]
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
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${isFollowing
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
        >
            {loading ? '...' : isFollowing ? 'Unfollow' : '+ Follow'}
        </button>
    );
};

export default FollowButton;
