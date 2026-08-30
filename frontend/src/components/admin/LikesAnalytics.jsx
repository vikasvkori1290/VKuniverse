import React, { useState, useEffect } from 'react';
import { FaHeart, FaUser, FaProjectDiagram, FaBookOpen, FaSearch, FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '../../services/api';
import styles from '../../styles/components/LikesAnalytics.module.css';

const LikesAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedUser, setExpandedUser] = useState(null);
    const [viewMode, setViewMode] = useState('supporters'); // 'supporters' | 'projects' | 'blogs'

    const fetchLikesData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/analytics/likes');
            setData(res.data);
        } catch (err) {
            console.error('Error loading likes analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLikesData();
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading likes and supporters analytics...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className={styles.empty}>
                <p>Failed to load likes analytics.</p>
                <button onClick={fetchLikesData} className={styles.retryBtn}>Retry</button>
            </div>
        );
    }

    const { summary, supporters = [], projects = [], blogs = [] } = data;

    const filteredSupporters = supporters.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpand = (name) => {
        setExpandedUser(expandedUser === name ? null : name);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Likes & Supporters Analytics</h2>
                    <p className={styles.subtitle}>
                        Overview of community engagement across your projects and blog publications.
                    </p>
                </div>
                <button onClick={fetchLikesData} className={styles.refreshBtn} title="Refresh data">
                    ↻ Refresh
                </button>
            </div>

            {/* Stat KPI Cards */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statTotal}`}>
                    <div className={styles.statIconWrapper}>
                        <FaHeart />
                    </div>
                    <div>
                        <span className={styles.statLabel}>Total Likes</span>
                        <h3 className={styles.statValue}>{summary.totalLikes}</h3>
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.statUsers}`}>
                    <div className={styles.statIconWrapper}>
                        <FaUser />
                    </div>
                    <div>
                        <span className={styles.statLabel}>Unique Supporters</span>
                        <h3 className={styles.statValue}>{summary.uniqueSupporters}</h3>
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.statProjects}`}>
                    <div className={styles.statIconWrapper}>
                        <FaProjectDiagram />
                    </div>
                    <div>
                        <span className={styles.statLabel}>Project Likes</span>
                        <h3 className={styles.statValue}>{summary.projectLikes}</h3>
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.statBlogs}`}>
                    <div className={styles.statIconWrapper}>
                        <FaBookOpen />
                    </div>
                    <div>
                        <span className={styles.statLabel}>Blog Likes</span>
                        <h3 className={styles.statValue}>{summary.blogLikes}</h3>
                    </div>
                </div>
            </div>

            {/* View Switcher */}
            <div className={styles.viewControls}>
                <div className={styles.tabButtons}>
                    <button
                        className={`${styles.tabBtn} ${viewMode === 'supporters' ? styles.tabActive : ''}`}
                        onClick={() => setViewMode('supporters')}
                    >
                        <FaUser /> Supporter Leaderboard ({supporters.length})
                    </button>
                    <button
                        className={`${styles.tabBtn} ${viewMode === 'projects' ? styles.tabActive : ''}`}
                        onClick={() => setViewMode('projects')}
                    >
                        <FaProjectDiagram /> By Project ({projects.length})
                    </button>
                    <button
                        className={`${styles.tabBtn} ${viewMode === 'blogs' ? styles.tabActive : ''}`}
                        onClick={() => setViewMode('blogs')}
                    >
                        <FaBookOpen /> By Blog Article ({blogs.length})
                    </button>
                </div>

                {viewMode === 'supporters' && (
                    <div className={styles.searchBox}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by supporter name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                )}
            </div>

            {/* VIEW 1: Supporters Table */}
            {viewMode === 'supporters' && (
                <div className={styles.tableCard}>
                    {filteredSupporters.length === 0 ? (
                        <div className={styles.noResults}>
                            {searchQuery ? `No supporters found matching "${searchQuery}"` : 'No likes recorded yet.'}
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Supporter Name</th>
                                        <th>Total Likes</th>
                                        <th>Project Likes</th>
                                        <th>Blog Likes</th>
                                        <th>Last Activity</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSupporters.map((supporter, idx) => (
                                        <React.Fragment key={supporter.name}>
                                            <tr className={expandedUser === supporter.name ? styles.rowExpanded : ''}>
                                                <td className={styles.rankCell}>
                                                    <span className={`${styles.rankBadge} ${idx === 0 ? styles.goldRank : idx === 1 ? styles.silverRank : idx === 2 ? styles.bronzeRank : ''}`}>
                                                        #{idx + 1}
                                                    </span>
                                                </td>
                                                <td className={styles.nameCell}>
                                                    <div className={styles.userAvatar}>
                                                        {supporter.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className={styles.userName}>{supporter.name}</span>
                                                </td>
                                                <td>
                                                    <span className={styles.totalLikesPill}>
                                                        <FaHeart /> {supporter.totalLikes}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={styles.projectLikesPill}>
                                                        {supporter.projectLikes}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={styles.blogLikesPill}>
                                                        {supporter.blogLikes}
                                                    </span>
                                                </td>
                                                <td className={styles.dateCell}>
                                                    <FaCalendarAlt /> {new Date(supporter.lastLikedAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => toggleExpand(supporter.name)}
                                                        className={styles.expandBtn}
                                                        title="View liked items"
                                                    >
                                                        {expandedUser === supporter.name ? <FaChevronUp /> : <FaChevronDown />}
                                                        <span>{expandedUser === supporter.name ? 'Hide' : 'View'}</span>
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expandable Liked Items Sub-table */}
                                            {expandedUser === supporter.name && (
                                                <tr className={styles.detailRow}>
                                                    <td colSpan="7">
                                                        <div className={styles.detailCard}>
                                                            <h4 className={styles.detailTitle}>
                                                                Items Liked by <span className={styles.highlightName}>{supporter.name}</span> ({supporter.likedItems.length}):
                                                            </h4>
                                                            <div className={styles.itemsList}>
                                                                {supporter.likedItems.map((item, itemIdx) => (
                                                                    <div key={itemIdx} className={styles.likedItemCard}>
                                                                        <span className={`${styles.itemTypeBadge} ${item.type === 'Project' ? styles.typeProject : styles.typeBlog}`}>
                                                                            {item.type}
                                                                        </span>
                                                                        <span className={styles.itemTitle}>{item.title}</span>
                                                                        <span className={styles.itemDate}>
                                                                            {new Date(item.date).toLocaleDateString('en-US', {
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                year: 'numeric'
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* VIEW 2: By Project Breakdown */}
            {viewMode === 'projects' && (
                <div className={styles.gridSection}>
                    {projects.map((proj) => (
                        <div key={proj.id} className={styles.itemBreakdownCard}>
                            <div className={styles.itemCardHeader}>
                                <div>
                                    <span className={styles.itemCardType}>Project</span>
                                    <h3 className={styles.itemCardTitle}>{proj.title}</h3>
                                </div>
                                <span className={styles.itemCardCount}>
                                    <FaHeart /> {proj.likes}
                                </span>
                            </div>

                            <div className={styles.itemSupportersSection}>
                                <h4>Liked by {proj.likedBy.length} {proj.likedBy.length === 1 ? 'user' : 'users'}:</h4>
                                {proj.likedBy.length === 0 ? (
                                    <p className={styles.noLikesMsg}>No likes yet for this project.</p>
                                ) : (
                                    <div className={styles.userTags}>
                                        {proj.likedBy.map((u, idx) => (
                                            <span key={idx} className={styles.userTag}>
                                                <FaUser className={styles.tagUserIcon} /> {u.name}
                                                <small>{new Date(u.date).toLocaleDateString()}</small>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* VIEW 3: By Blog Article Breakdown */}
            {viewMode === 'blogs' && (
                <div className={styles.gridSection}>
                    {blogs.map((blog) => (
                        <div key={blog.id} className={styles.itemBreakdownCard}>
                            <div className={styles.itemCardHeader}>
                                <div>
                                    <span className={`${styles.itemCardType} ${styles.typeBlog}`}>Blog Article</span>
                                    <h3 className={styles.itemCardTitle}>{blog.title}</h3>
                                </div>
                                <span className={styles.itemCardCount}>
                                    <FaHeart /> {blog.likes}
                                </span>
                            </div>

                            <div className={styles.itemSupportersSection}>
                                <h4>Liked by {blog.likedBy.length} {blog.likedBy.length === 1 ? 'user' : 'users'}:</h4>
                                {blog.likedBy.length === 0 ? (
                                    <p className={styles.noLikesMsg}>No likes yet for this article.</p>
                                ) : (
                                    <div className={styles.userTags}>
                                        {blog.likedBy.map((u, idx) => (
                                            <span key={idx} className={styles.userTag}>
                                                <FaUser className={styles.tagUserIcon} /> {u.name}
                                                <small>{new Date(u.date).toLocaleDateString()}</small>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikesAnalytics;
