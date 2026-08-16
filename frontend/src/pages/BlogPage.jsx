import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaEye, FaTag } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import styles from '../styles/pages/BlogPage.module.css';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

const BlogPage = () => {
    const { blogs: posts, loadingBlogs: loading, setBlogs } = useData();

    // Fallback direct fetch if user navigates directly before background preloader finishes
    useEffect(() => {
        if (posts.length === 0 && loading) {
            const fetchDirect = async () => {
                try {
                    const { data } = await api.get('/blog');
                    if (setBlogs) setBlogs(data);
                } catch (error) {
                    console.error('Error fetching blog posts directly:', error);
                }
            };
            fetchDirect();
        }
    }, [posts.length, loading, setBlogs]);

    return (
        <div className={styles.blogPage}>
            <ScrollProgress />
            <Navbar />
            <main className={styles.main}>
                <div className="container">
                    <div className={styles.header}>
                        <h1 className={styles.title}>Blog & Articles</h1>
                        <p className={styles.subtitle}>Thoughts, tutorials, and insights on web development</p>
                    </div>

                    {loading && posts.length === 0 ? (
                        <div className={styles.loading}>Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No blog posts yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className={styles.postsGrid}>
                            {posts.map((post) => (
                                <Link
                                    key={post._id}
                                    to={`/blog/${post.slug}`}
                                    className={styles.postCard}
                                >
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
                                        <div className={styles.meta}>
                                            <span className={styles.metaItem}>
                                                <FaClock /> {post.readTime || '3'} min read
                                            </span>
                                            <span className={styles.metaItem}>
                                                <FaEye /> {post.views || 0} views
                                            </span>
                                        </div>
                                        <h2 className={styles.postTitle}>{post.title}</h2>
                                        <p className={styles.excerpt}>{post.excerpt}</p>
                                        <div className={styles.tags}>
                                            {post.tags?.slice(0, 3).map((tag, index) => (
                                                <span key={index} className={styles.tag}>
                                                    <FaTag /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className={styles.date}>
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default BlogPage;
