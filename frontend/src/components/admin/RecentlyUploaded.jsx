import React, { useState, useEffect } from 'react';
import { FaProjectDiagram, FaCode, FaTrophy, FaTrash, FaExternalLinkAlt, FaEdit, FaStar } from 'react-icons/fa';
import api from '../../services/api';
import styles from '../../styles/components/admin/RecentlyUploaded.module.css';

const RecentlyUploaded = ({ onEdit }) => {
    const [activeTab, setActiveTab] = useState('projects');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRecentItems();
    }, [activeTab]);

    const fetchRecentItems = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/${activeTab}/recent`);
            setItems(res.data);
        } catch (err) {
            console.error('Error fetching recent items:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(`/${activeTab}/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete item');
        }
    };

    const renderItem = (item) => {
        // Determine image to show
        let imageUrl = '';
        if (activeTab === 'projects') {
            const thumb = item.images?.find(img => img.isThumbnail) || item.images?.[0];
            imageUrl = thumb?.url;
        } else if (activeTab === 'achievements') {
            imageUrl = item.images?.[0]?.url || item.image; // Fallback to old field
        } else if (activeTab === 'skills') {
            imageUrl = item.iconUrl || item.icon;
        }

        return (
            <div key={item._id} className={styles.itemCard}>
                <div className={styles.itemImage}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={item.title || item.name} />
                    ) : (
                        <div className={styles.placeholder}>No Image</div>
                    )}
                </div>
                <div className={styles.itemInfo}>
                    <h4>{item.title || item.name}</h4>
                    <p className={styles.date}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    {activeTab === 'skills' && (
                        <span className={styles.badge}>{item.category}</span>
                    )}
                </div>
                <div className={styles.actions}>
                    <button
                        className={styles.actionBtn}
                        title="Favourite"
                        onClick={() => alert('Favourite feature coming soon!')}
                    >
                        <FaStar />
                    </button>
                    <button
                        className={styles.actionBtn}
                        title="Edit"
                        onClick={() => onEdit && onEdit(item, activeTab)}
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(item._id)}
                        className={styles.deleteBtn}
                        title="Delete"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`}
                    onClick={() => setActiveTab('projects')}
                >
                    <FaProjectDiagram /> Projects
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'skills' ? styles.active : ''}`}
                    onClick={() => setActiveTab('skills')}
                >
                    <FaCode /> Skills
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`}
                    onClick={() => setActiveTab('achievements')}
                >
                    <FaTrophy /> Achievements
                </button>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <p className={styles.loading}>Loading recent items...</p>
                ) : items.length > 0 ? (
                    <div className={styles.grid}>
                        {items.map(renderItem)}
                    </div>
                ) : (
                    <p className={styles.empty}>No recently uploaded items found.</p>
                )}
            </div>
        </div>
    );
};

export default RecentlyUploaded;
