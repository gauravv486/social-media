import React, { useState } from 'react';
import API from '../api/axios.js';
import useAuthStore from '../store/authStore.js';

const EditProfile = ({ user, onProfileUpdated }) => {
    const { setUser } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [bio, setBio] = useState(user?.bio || '');
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await API.put('/users/update-profile', {
                bio,
                fullName,
            });
            setUser(data);
            if (onProfileUpdated) onProfileUpdated(data);
            setIsOpen(false);
        } catch (error) {
            console.error('Update profile error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition"
                style={{ border: '1px solid #0a66c2', color: '#0a66c2' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f2ef'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                Edit profile
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Edit Profile</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    maxLength={200}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">{bio.length}/200</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-2 rounded-full text-sm font-semibold border"
                                    style={{ borderColor: '#0a66c2', color: '#0a66c2' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-50"
                                    style={{ backgroundColor: '#0a66c2' }}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;
