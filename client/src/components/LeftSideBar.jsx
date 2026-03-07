import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

const LeftSidebar = () => {
  const { user } = useAuthStore();

  return (
    <div className="w-64 sticky top-16 h-fit">

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-3">

        {/* Cover Picture */}
        <div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600" />

        {/* Avatar */}
        <div className="px-4 pb-4">
          <div className="-mt-8 mb-3">
            <img
              src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`}
              alt={user?.fullName}
              className="w-16 h-16 rounded-full border-2 border-white object-cover"
            />
          </div>

          {/* User Info */}
          <Link to={`/profile/${user?.username}`}>
            <h2 className="font-semibold text-gray-900 hover:underline hover:text-blue-600 cursor-pointer">
              {user?.fullName}
            </h2>
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">{user?.bio || 'No bio yet'}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Stats */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Followers</span>
            <span className="font-semibold text-blue-600">{user?.followers?.length || 0}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Following</span>
            <span className="font-semibold text-blue-600">{user?.following?.length || 0}</span>
          </div>
        </div>

      </div>

      {/* Nav Links */}
      <div className="bg-white rounded-xl shadow-sm p-3 space-y-1">
        {[
          { label: '🔖 Saved Posts', path: '/saved' },
          { label: '👥 Suggestions', path: '/suggestions' },
          { label: '⚙️ Settings', path: '/settings' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            {item.label}
          </Link>
        ))}
      </div>

    </div>
  );
};

export default LeftSidebar;
