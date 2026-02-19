import React, { useState, useEffect } from 'react';
import { getPosts, createPost, likePost, deletePost } from '../api/posts.js';
import useAuthStore from '../store/authStore.js';
import Logout from '../components/auth/Logout.jsx';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();

    // Fetch posts on page load
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setLoading(true);
        try {
            await createPost({ content: newPost });
            setNewPost('');
            fetchPosts(); // Refresh feed
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            await likePost(postId);
            fetchPosts(); // Refresh to show updated likes
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Delete this post?')) return;

        try {
            await deletePost(postId);
            fetchPosts(); // Refresh feed
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">Social Media</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Hi, {user?.fullName}</span>
                        <Logout />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-6">
                {/* Create Post */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <form onSubmit={handleCreatePost}>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="3"
                        />
                        <button
                            type="submit"
                            disabled={loading || !newPost.trim()}
                            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </form>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No posts yet. Create the first one!
                        </p>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="bg-white rounded-lg shadow p-6">
                                {/* Post Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {post.author?.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {post.author?.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                @{post.author?.username}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Delete Button (only for own posts) */}
                                    {post.author?._id === user?._id && (
                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                                {/* Post Content */}
                                <p className="text-gray-800 mb-4">{post.content}</p>

                                {/* Post Actions */}
                                <div className="flex items-center gap-6 text-gray-600">
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center gap-1 hover:text-red-500 transition ${post.likes?.includes(user?._id) ? 'text-red-500' : ''
                                            }`}
                                    >
                                        <span className="text-xl">
                                            {post.likes?.includes(user?._id) ? '❤️' : '🤍'}
                                        </span>
                                        <span className="text-sm">{post.likes?.length || 0}</span>
                                    </button>

                                    <button className="flex items-center gap-1 hover:text-blue-500 transition">
                                        <span className="text-xl">💬</span>
                                        <span className="text-sm">{post.comments?.length || 0}</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Feed;
