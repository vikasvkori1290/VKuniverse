import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../services/api';
import ImageUploader from './ImageUploader';
import styles from '../../styles/pages/AdminDashboard.module.css'; // Reusing dashboard styles

const BlogManager = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [view, setView] = useState('list'); // 'list' or 'form'

    const [formData, setFormData] = useState({
        title: '',
        content: '', // Simple textarea for now
        excerpt: '',
        coverImage: '',
        tags: '',
        published: false
    });

    const [coverImages, setCoverImages] = useState([]); // For ImageUploader

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/blog/admin/all');
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setMessage('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (images) => {
        setCoverImages(images);
        if (images.length > 0) {
            setFormData({ ...formData, coverImage: images[0].url });
        } else {
            setFormData({ ...formData, coverImage: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t)
            };

            if (editingId) {
                await api.put(`/blog/${editingId}`, payload);
                setMessage('Post updated successfully');
            } else {
                await api.post('/blog', payload);
                setMessage('Post created successfully');
            }

            // Reset and refresh
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                coverImage: '',
                tags: '',
                published: false
            });
            setCoverImages([]);
            setEditingId(null);
            setView('list');
            fetchPosts();
        } catch (error) {
            console.error('Error saving post:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Failed to save post';
            setMessage(errorMsg);
        }
    };

    const handleEdit = (post) => {
        setEditingId(post._id);
        setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            tags: post.tags.join(', '),
            published: post.published
        });
        if (post.coverImage) {
            setCoverImages([{ url: post.coverImage, isThumbnail: true }]);
        } else {
            setCoverImages([]);
        }
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/blog/${id}`);
                setMessage('Post deleted successfully');
                fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
                setMessage('Failed to delete post');
            }
        }
    };

    const togglePublish = async (post) => {
        try {
            await api.put(`/blog/${post._id}`, { ...post, published: !post.published });
            fetchPosts(); // Refresh list to see update
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    };

    return (
        <div className={styles.section}>
            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2>Blog Management</h2>
                {view === 'list' && (
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                title: '',
                                content: '',
                                excerpt: '',
                                coverImage: '',
                                tags: '',
                                published: false
                            });
                            setCoverImages([]);
                            setView('form');
                        }}
                    >
                        <FaPlus /> New Post
                    </button>
                )}
                {view === 'form' && (
                    <button
                        className="btn btn-secondary"
                        onClick={() => setView('list')}
                    >
                        Cancel
                    </button>
                )}
            </div>

            {message && <div className={styles.message}>{message}</div>}

            {view === 'list' ? (
                <div className={styles.tableContainer} style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Title</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post._id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '1rem' }}>{post.title}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span
                                            style={{
                                                color: post.published ? '#4caf50' : '#ff9800',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => togglePublish(post)}
                                            title="Click to toggle"
                                        >
                                            {post.published ? <FaEye /> : <FaEyeSlash />}
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            style={{ marginRight: '0.5rem' }}
                                            onClick={() => handleEdit(post)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            style={{ background: '#ff4d4d', color: 'white' }}
                                            onClick={() => handleDelete(post._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                        No blog posts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Cover Image</label>
                        <ImageUploader
                            images={coverImages}
                            onImagesChange={handleImageChange}
                            maxFiles={1}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Excerpt (Short summary)</label>
                        <textarea
                            className={styles.textarea}
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            required
                            rows="3"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Content (Full article)</label>
                        <textarea
                            className={styles.textarea}
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            required
                            rows="15"
                            style={{ fontFamily: 'monospace' }}
                        />
                        <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                            HTML tags are supported. Use &lt;br/&gt; for line breaks, &lt;strong&gt; for bold, etc.
                        </small>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Tags (comma separated)</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="React, Tutorial, Web"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', paddingTop: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={e => setFormData({ ...formData, published: e.target.checked })}
                                    style={{ width: 'auto' }}
                                />
                                Publish immediately
                            </label>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Update Post' : 'Create Post'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BlogManager;
