import React, { useState, useRef } from 'react';
import API from '../../api/axios.js';
import useAuthStore from '../../store/authStore.js';

const CreatePost = ({ fetchPosts }) => {
    const { user } = useAuthStore();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);       // actual file
    const [preview, setPreview] = useState(null);   // preview URL
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);              // to trigger file input click

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));  // instant preview
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        fileInputRef.current.value = '';            // reset file input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // ✅ FormData instead of JSON (needed for file upload)
            const formData = new FormData();
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            await API.post('/posts/createpost', formData);

            console.log("reached")

            // Reset
            setContent('');
            setImage(null);
            setPreview(null);
            fileInputRef.current.value = '';
            fetchPosts();

        } catch (error) {
            console.error('Error creating post:', error);          // already have this
            console.error('Response:', error.response?.data);      // ← add this
            console.error('Status:', error.response?.status);      // ← add this
            console.error('Message:', error.message);              // ← add this
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <form onSubmit={handleSubmit}>

                {/* ── Top Row: Avatar + Textarea ── */}
                <div className="flex gap-3">
                    <img
                        src={user?.profilePicture ||
                            `https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        alt="avatar"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 pt-2"
                        rows="3"
                    />
                </div>

                {/* ── Image Preview ── */}
                {preview && (
                    <div className="relative mt-3 ml-13">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full max-h-72 object-cover rounded-xl"
                        />
                        {/* Remove image button */}
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-opacity-70"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* ── Divider ── */}
                <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">

                    {/* Image Upload Button */}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition"
                        >
                            🖼️ Photo
                        </button>
                    </div>

                    {/* Post Button */}
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="px-5 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default CreatePost;
