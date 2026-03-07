import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import { BsBookmark, BsPeople, BsGear } from 'react-icons/bs';
import { HiOutlineUsers } from 'react-icons/hi';

const LeftSidebar = () => {
  const { user } = useAuthStore();

  return (
    <div className="w-64 sticky top-16 h-fit">

      {/* ── Profile Card ── */}
      <div
        className="bg-white rounded-lg overflow-hidden mb-2"
        style={{ border: '1px solid #e0ddd6' }}
      >
        {/* Cover */}
        <div className="h-14 bg-gradient-to-r from-blue-300 to-blue-500" />

        {/* Avatar + Info */}
        <div className="px-3 pb-3">
          <div className="-mt-7 mb-2">
            <img
              src={user?.profilePicture ||
                `https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`}
              alt={user?.fullName}
              className="w-14 h-14 rounded-full border-2 border-white object-cover"
            />
          </div>

          <Link to={`/profile/${user?.username}`}>
            <h2
              className="text-sm font-semibold hover:underline"
              style={{ color: '#000000e0' }}
            >
              {user?.fullName}
            </h2>
          </Link>
          <p className="text-xs mt-0.5" style={{ color: '#00000099' }}>
            {user?.bio || 'Add a bio'}
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e0ddd6' }} />


        {/* Divider */}
        <div style={{ borderTop: '1px solid #e0ddd6' }} />

        {/* Followers / Following */}
        <div className="px-3 py-2 space-y-1">
          <div className="flex justify-between text-xs">
            <span style={{ color: '#00000099' }}>Followers</span>
            <span
              className="font-semibold"
              style={{ color: '#0a66c2' }}
            >
              {user?.followers?.length || 0}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: '#00000099' }}>Following</span>
            <span
              className="font-semibold"
              style={{ color: '#0a66c2' }}
            >
              {user?.following?.length || 0}
            </span>
          </div>
        </div>

      </div>

      {/* ── Nav Links ── */}
      <div
        className="bg-white rounded-lg py-2"
        style={{ border: '1px solid #e0ddd6' }}
      >
        {[
          { label: 'Saved Posts',  path: '/saved',       Icon: BsBookmark   },
          { label: 'Suggestions',  path: '/suggestions', Icon: HiOutlineUsers },
          { label: 'Settings',     path: '/settings',    Icon: BsGear       },
        ].map(({ label, path, Icon }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded transition"
            style={{ color: '#00000099' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f2ef'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Icon size={18} style={{ color: '#00000099' }} />
            <span>{label}</span>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default LeftSidebar;
