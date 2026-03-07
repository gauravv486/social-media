import React, { useState } from 'react';
import API from '../api/axios.js';
import useAuthStore from '../store/authStore.js';

const PostComment = ({ postId, comments = [] }) => {

    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [commentList, setCommentList] = useState(comments);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            setLoading(true);
            const { data } = await API.post(`/posts/${postId}/comment`, { content: text });
            setCommentList(prev => [data, ...prev]);
            setText('');
        } catch (error) {
            console.error('Comment error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">

            {/* ── Comment Count + Toggle (same level as Like/Share) ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
            >
                Add Comment
            </button>

            {/* ── Expanded Section ── */}
            {isOpen && (
                <div className="w-full mt-3 border-t border-gray-100 pt-3 space-y-3">

                    {/* ── Input Row ── */}
                    <div className="flex items-center gap-2 w-full">
                        <img
                            src={user?.profilePicture ||
                                `https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                            alt="avatar"
                        />
                        <form
                            onSubmit={handleAddComment}
                            className="flex flex-1 items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5"
                        >
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 text-sm bg-transparent outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!text.trim() || loading}
                                className="text-sm font-semibold text-blue-600 disabled:opacity-40 shrink-0"
                            >
                                {loading ? '...' : 'Post'}
                            </button>
                        </form>
                    </div>

                    {/* ── Comments List ── */}
                    {commentList.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-2">
                            No comments yet. Be the first!
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {commentList.map((comment, index) => (
                                <div key={comment._id || index} className="flex gap-2 w-full">

                                    {/* Small Avatar */}
                                    <img
                                        src={comment.author?.profilePicture ||
                                            `https://ui-avatars.com/api/?name=${comment.author?.fullName || 'User'}&background=0D8ABC&color=fff`}
                                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                                        alt="avatar"
                                    />

                                    {/* Full Width Bubble */}
                                    <div className="flex-1">
                                        <div className="bg-gray-100 rounded-2xl px-4 py-2 w-full">

                                            {/* Name - small */}
                                            <p className="text-xs font-semibold text-gray-800">
                                                {comment.author?.fullName || 'Unknown'}
                                            </p>

                                            {/* Comment text - full width */}
                                            <p className="text-sm text-gray-700 mt-0.5 leading-snug">
                                                {comment.content}
                                            </p>
                                        </div>
                                        
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Load More ── */}
                    {commentList.length >= 3 && (
                        <button className="text-sm font-semibold text-gray-500 hover:text-blue-600">
                            Load more comments
                        </button>
                    )}

                </div>
            )}
        </div>
    );
};

export default PostComment;
