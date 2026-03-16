import React, { useState } from 'react';
import useAuthStore from '../../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';

const Logout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();                // clear Zustand store
    navigate('/login');
  };

  return (
    <>
      {/* ── Logout Button ── */}
      <button
        onClick={() => setShowConfirm(true)}
        className="flex flex-col items-center gap-0.5 text-xs transition"
        style={{ color: '#00000099' }}
        onMouseEnter={e => e.currentTarget.style.color = '#000000e0'}
        onMouseLeave={e => e.currentTarget.style.color = '#00000099'}
      >
        <BiLogOut size={22} />
        <span>Logout</span>
      </button>

      {/* ── Confirm Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">

            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Logout of Nexus?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-full text-sm font-semibold border"
                style={{ borderColor: '#0a66c2', color: '#0a66c2' }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: '#0a66c2' }}
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
