import React from 'react';
import useAuthStore from '../../store/authStore.js';

const Logout = () => {
  const { logout } = useAuthStore();

  const handleClick = () => {
      localStorage.setItem("token" , '');
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Logout
    </button>
  );
};

export default Logout;
