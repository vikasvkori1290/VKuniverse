import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendar } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import styles from '../styles/components/RecentBlogs.module.css';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

const RecentBlogs = () => {
    const { recentBlogs: posts, loadingBlogs: loading } = useData();

    if (loading || !posts || posts.length === 0) {
        return null;
    }

    return (
        <section className={styles.recentBlogs}>
            <div className={styles.container}>
                <h2 className={styles.title}>Recent Thoughts</h2>

                <div className={styles.grid}>
                    {posts.map(post => (
                        <Link key={post._id} to={`/blog/${post.slug}`} className={styles.card}>
                            {post.coverImage && (
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={getFileURL(post.coverImage)}
                                        alt={post.title}
                                        className={styles.coverImage}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = FALLBACK_IMAGE;
                                        }}
                                    />
                                </div>
                            )}
                            <div className={styles.content}>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                <p className={styles.excerpt}>{post.excerpt}</p>
                                <div className={styles.footer}>
                                    <span className="flex items-center gap-2">
                                        <FaCalendar className="text-xs" />
                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className={styles.readMore}>
                                        Read Article <FaArrowRight />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className={styles.viewAllWrapper}>
                    <Link to="/blog" className={styles.viewAllBtn}>
                        View All Articles
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecentBlogs;
