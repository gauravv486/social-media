import { useState, useRef } from 'react';
import API from '../../api/axios.js';
import useAuthStore from '../../store/authStore.js';
import { BsImage } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';

const CreatePost = ({ onPostCreated }) => {
    const { user } = useAuthStore();
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('content', content);
            if (image) formData.append('image', image);
            const { data } = await API.post('/posts/createpost', formData);
            setContent('');
            setImage(null);
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            // Real-time: add post to parent state immediately
            if (onPostCreated) onPostCreated(data);
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="bg-white rounded-lg mb-2"
            style={{ border: '1px solid #e0ddd6' }}
        >
            <form onSubmit={handleSubmit}>

                {/* ── Top Row: Avatar + Trigger ── */}
                <div className="flex items-center gap-2 px-3 sm:px-4 pt-3 pb-2">
                    <img
                        src={user?.profilePicture ||
                            `https://ui-avatars.com/api/?name=${user?.fullName}&background=0D8ABC&color=fff`}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                        alt="avatar"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start a post"
                        rows={1}
                        className="flex-1 resize-none text-sm rounded-full px-4 py-2.5 outline-none"
                        style={{
                            border: '1px solid #b0aca4',
                            color: '#000000e0',
                            backgroundColor: '#fff',
                            lineHeight: '1.5',
                        }}
                    />
                </div>

                {/* ── Image Preview ── */}
                {preview && (
                    <div className="relative mx-3 sm:mx-4 mb-3">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full max-h-80 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center transition"
                            style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}
                        >
                            <IoCloseOutline size={18} />
                        </button>
                    </div>
                )}

                {/* ── Divider ── */}
                <div style={{ borderTop: '1px solid #e0ddd6' }} />

                {/* ── Bottom Actions ── */}
                <div className="flex items-center justify-between px-2 py-1">

                    {/* Action Buttons */}
                    <div className="flex items-center">

                        {/* Photo */}
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
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition"
                                style={{ color: '#666666' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = '#f3f2ef';
                                    e.currentTarget.style.color = '#0a66c2';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#666666';
                                }}
                            >
                                <BsImage size={18} style={{ color: '#70b5f9' }} />
                                <span className="hidden sm:inline">Photo</span>
                            </button>
                        </div>


                    </div>

                    {/* Post Button — only visible when content is typed */}
                    {(content.trim() || image) && (
                        <button
                            type="submit"
                            disabled={loading || !content.trim()}
                            className="px-4 py-1.5 text-sm font-semibold rounded-full transition disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                                backgroundColor: '#0a66c2',
                                color: '#fff',
                            }}
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    )}

                </div>
            </form>
        </div>
    );
};

export default CreatePost;
