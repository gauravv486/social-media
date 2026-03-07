import React, { useState } from 'react';
import { createPost } from '../../api/posts.js';

const CreatePost = ({ fetchPosts }) => {
    const [formData, setFormData] = useState({
        content: '',
        image: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content.trim()) return;

        // setLoading(true);
        try {
            await createPost(formData);
            setFormData({ content: '', image: '' }); // Reset form
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Content */}
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="What's on your mind?"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                    required
                />

                {/* Image URL (optional) */}
                <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Image URL (optional)"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Image Preview (shows if URL is entered) */}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => e.target.style.display = 'none'} // Hide if invalid URL
                    />
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    // disabled={loading || !formData.content.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Post
                    {/* {loading ? 'Posting...' : 'Post'} */}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
