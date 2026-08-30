import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash, FaImage, FaBold, FaItalic, FaHeading, FaCode, FaColumns } from 'react-icons/fa';
import { marked } from 'marked';
import api from '../../services/api';
import ImageUploader from './ImageUploader';
import { getFileURL, FALLBACK_IMAGE } from '../../utils/urlHelper';
import styles from '../../styles/pages/AdminDashboard.module.css';

marked.setOptions({
    gfm: true,
    breaks: true,
});

const BlogManager = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [editorTab, setEditorTab] = useState('edit'); // 'edit' or 'preview'
    const [uploadingInline, setUploadingInline] = useState(false);

    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        coverImage: '',
        tags: '',
        published: false
    });

    const [coverImages, setCoverImages] = useState([]);

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

    // Paste Image at Cursor Position (Ctrl + V)
    const handleContentPaste = async (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;

        const items = Array.from(clipboardData.items);
        const imageItems = items.filter(item => item.type && item.type.startsWith('image/'));

        if (imageItems.length === 0) return; // Standard text paste

        e.preventDefault();

        const textarea = textareaRef.current;
        const startPos = textarea ? textarea.selectionStart : formData.content.length;
        const endPos = textarea ? textarea.selectionEnd : formData.content.length;
        const originalContent = formData.content;

        const placeholder = `\n\n![Uploading image...]()\n\n`;
        const updatedWithPlaceholder = originalContent.slice(0, startPos) + placeholder + originalContent.slice(endPos);
        setFormData(prev => ({ ...prev, content: updatedWithPlaceholder }));
        setUploadingInline(true);

        try {
            for (const item of imageItems) {
                const file = item.getAsFile();
                if (!file) continue;

                const uploadData = new FormData();
                uploadData.append('image', file);

                const res = await api.post('/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const rawUrl = typeof res.data === 'string' ? res.data : (res.data?.url || res.data?.path);
                const fullImageUrl = getFileURL(rawUrl);

                setFormData(prev => {
                    const replaced = prev.content.replace(
                        '![Uploading image...]()',
                        `![Image](${fullImageUrl})`
                    );
                    return { ...prev, content: replaced };
                });
            }
        } catch (err) {
            console.error('Failed to upload pasted image:', err);
            setFormData(prev => ({
                ...prev,
                content: prev.content.replace('![Uploading image...]()', '')
            }));
            setMessage('Failed to upload pasted image. Please try again.');
        } finally {
            setUploadingInline(false);
        }
    };

    // Insert Image from File Picker at Cursor Position
    const handleFileInputChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const textarea = textareaRef.current;
        const startPos = textarea ? textarea.selectionStart : formData.content.length;
        const endPos = textarea ? textarea.selectionEnd : formData.content.length;
        const originalContent = formData.content;

        const placeholder = `\n\n![Uploading image...]()\n\n`;
        setFormData(prev => ({
            ...prev,
            content: originalContent.slice(0, startPos) + placeholder + originalContent.slice(endPos)
        }));
        setUploadingInline(true);

        try {
            for (const file of files) {
                const uploadData = new FormData();
                uploadData.append('image', file);

                const res = await api.post('/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const rawUrl = typeof res.data === 'string' ? res.data : (res.data?.url || res.data?.path);
                const fullImageUrl = getFileURL(rawUrl);

                setFormData(prev => {
                    const replaced = prev.content.replace(
                        '![Uploading image...]()',
                        `![Image](${fullImageUrl})`
                    );
                    return { ...prev, content: replaced };
                });
            }
        } catch (err) {
            console.error('Failed to upload chosen image:', err);
            setFormData(prev => ({
                ...prev,
                content: prev.content.replace('![Uploading image...]()', '')
            }));
            setMessage('Failed to upload selected image.');
        } finally {
            setUploadingInline(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Insert formatting snippet at cursor
    const insertSnippet = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);
        const replacement = before + (selected || 'text') + after;

        const newContent = text.substring(0, start) + replacement + text.substring(end);
        setFormData(prev => ({ ...prev, content: newContent }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + (selected ? selected.length : 4));
        }, 0);
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
            tags: post.tags ? post.tags.join(', ') : '',
            published: post.published
        });
        if (post.coverImage) {
            setCoverImages([{ url: post.coverImage, isThumbnail: true }]);
        } else {
            setCoverImages([]);
        }
        setView('form');
        setEditorTab('edit');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
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
            await api.put(`/blog/${post._id}`, {
                published: !post.published
            });
            fetchPosts();
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    };

    // Helper for rendering preview with side-by-side consecutive images
    const renderPreviewHtml = (markdownText) => {
        if (!markdownText) return '<p><em>No content written yet.</em></p>';
        try {
            const rawHtml = marked.parse(markdownText);
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawHtml, 'text/html');
            const bodyChildren = Array.from(doc.body.children);

            const isImageP = (node) => {
                if (!node) return false;
                if (node.tagName === 'P') {
                    const text = node.textContent.trim();
                    const imgs = node.querySelectorAll('img');
                    return imgs.length > 0 && text === '';
                }
                return node.tagName === 'IMG';
            };

            let i = 0;
            while (i < bodyChildren.length) {
                const el = bodyChildren[i];
                if (isImageP(el)) {
                    const groupImgs = [];
                    let j = i;
                    while (j < bodyChildren.length && isImageP(bodyChildren[j])) {
                        const current = bodyChildren[j];
                        if (current.tagName === 'IMG') {
                            groupImgs.push(current.cloneNode(true));
                        } else {
                            current.querySelectorAll('img').forEach(img => {
                                groupImgs.push(img.cloneNode(true));
                            });
                        }
                        j++;
                    }

                    if (groupImgs.length >= 2) {
                        const gridDiv = doc.createElement('div');
                        gridDiv.style.display = 'grid';
                        gridDiv.style.gridTemplateColumns = `repeat(${Math.min(groupImgs.length, 3)}, 1fr)`;
                        gridDiv.style.gap = '14px';
                        gridDiv.style.margin = '20px 0';

                        groupImgs.forEach(img => {
                            const wrap = doc.createElement('div');
                            wrap.style.borderRadius = '10px';
                            wrap.style.overflow = 'hidden';
                            wrap.style.background = '#0b0f19';
                            wrap.style.border = '1px solid rgba(255,255,255,0.1)';
                            img.style.width = '100%';
                            img.style.height = '100%';
                            img.style.maxHeight = '320px';
                            img.style.objectFit = 'cover';
                            img.style.display = 'block';
                            wrap.appendChild(img);
                            gridDiv.appendChild(wrap);
                        });

                        bodyChildren[i].parentNode.insertBefore(gridDiv, bodyChildren[i]);
                        for (let k = i; k < j; k++) {
                            if (bodyChildren[k].parentNode) {
                                bodyChildren[k].parentNode.removeChild(bodyChildren[k]);
                            }
                        }
                        i = j;
                        continue;
                    }
                }
                i++;
            }
            return doc.body.innerHTML;
        } catch (e) {
            return marked.parse(markdownText);
        }
    };

    return (
        <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Blog Posts</h2>
                {view === 'list' ? (
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
                            setEditorTab('edit');
                        }}
                    >
                        <FaPlus /> New Post
                    </button>
                ) : (
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

                    {/* Content Section with Toolbar, Ctrl+V Upload, and Preview Tab */}
                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                            <label style={{ margin: 0, fontWeight: '700' }}>
                                Content (Markdown Supported &bull; Ctrl+V anywhere to Paste Images)
                            </label>

                            {/* View Switcher: Edit vs Live Preview */}
                            <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setEditorTab('edit')}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: editorTab === 'edit' ? '#0284c7' : 'transparent',
                                        color: '#fff',
                                        fontSize: '0.82rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Write
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditorTab('preview')}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: editorTab === 'preview' ? '#0284c7' : 'transparent',
                                        color: '#fff',
                                        fontSize: '0.82rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FaEye /> Live Preview
                                </button>
                            </div>
                        </div>

                        {/* Markdown Formatting Toolbar */}
                        {editorTab === 'edit' && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#131926',
                                padding: '8px 12px',
                                borderRadius: '8px 8px 0 0',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderBottom: 'none',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => insertSnippet('**', '**')}
                                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer' }}
                                    title="Bold"
                                >
                                    <FaBold />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertSnippet('*', '*')}
                                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer' }}
                                    title="Italic"
                                >
                                    <FaItalic />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertSnippet('### ')}
                                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer' }}
                                    title="Heading"
                                >
                                    <FaHeading />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertSnippet('`', '`')}
                                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '4px 8px', borderRadius: '5px', cursor: 'pointer' }}
                                    title="Inline Code"
                                >
                                    <FaCode />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    style={{
                                        background: 'rgba(56,189,248,0.15)',
                                        border: '1px solid rgba(56,189,248,0.3)',
                                        color: '#38bdf8',
                                        padding: '4px 10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.82rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}
                                    title="Choose image file from device"
                                >
                                    <FaImage /> Insert Image
                                </button>

                                <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#94a3b8' }}>
                                    {uploadingInline ? '⏳ Uploading pasted image...' : '💡 Press Ctrl+V to paste images anywhere in text'}
                                </span>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileInputChange}
                                />
                            </div>
                        )}

                        {editorTab === 'edit' ? (
                            <textarea
                                ref={textareaRef}
                                className={styles.textarea}
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                onPaste={handleContentPaste}
                                required
                                rows="18"
                                placeholder="Write your article content here in Markdown... Tip: Press Ctrl + V with any image in your clipboard to upload and place it directly where your cursor is!"
                                style={{
                                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    borderRadius: '0 0 8px 8px'
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    background: '#0a0e17',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: '8px',
                                    padding: '24px',
                                    minHeight: '360px',
                                    color: '#e2e8f0',
                                    fontSize: '1rem',
                                    lineHeight: '1.7'
                                }}
                                dangerouslySetInnerHTML={{ __html: renderPreviewHtml(formData.content) }}
                            />
                        )}

                        <small style={{ color: '#94a3b8', marginTop: '0.6rem', display: 'block', lineHeight: '1.4' }}>
                            ✨ <strong>Side-by-Side Images:</strong> Paste 2 images one after the other in your text; they will automatically render side-by-side in a 2-column grid for viewers!
                        </small>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Tags (comma separated)</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="React, AI, Web Development"
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
                        <button type="submit" className="btn btn-primary" disabled={uploadingInline}>
                            {editingId ? 'Update Post' : 'Create Post'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BlogManager;
