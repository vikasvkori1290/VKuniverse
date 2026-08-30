import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaHeart, FaTag, FaArrowRight } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import styles from '../styles/pages/BlogPage.module.css';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

const BlogPage = () => {
    const { blogs: contextBlogs, setBlogs } = useData();
    const [posts, setPosts] = useState(contextBlogs || []);
    const [loading, setLoading] = useState(contextBlogs ? contextBlogs.length === 0 : true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await api.get('/blog');
                const list = data || [];
                setPosts(list);
                if (setBlogs) setBlogs(list);
            } catch (error) {
                console.error('Error fetching blog posts on BlogPage:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
        window.scrollTo(0, 0);
    }, [setBlogs]);

    return (
        <div className={styles.blogPage}>
            <ScrollProgress />
            <Navbar />
            <main className={styles.main}>
                <div className="container">
                    <div className={styles.header}>
                        <span className={styles.badge}>Articles & Guides</span>
                        <h1 className={styles.title}>Blog & Insights</h1>
                        <p className={styles.subtitle}>
                            Thoughts, deep dives, architecture breakdowns, and tech tutorials.
                        </p>
                    </div>

                    {loading && posts.length === 0 ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading articles...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No blog posts published yet. Check back soon!</p>
                            <Link to="/" className={styles.homeBtn}>Back to Home</Link>
                        </div>
                    ) : (
                        <div className={styles.postsGrid}>
                            {posts.map((post) => (
                                <Link
                                    key={post._id || post.slug}
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
                                                <FaClock /> {post.readTime || 5} min read
                                            </span>
                                            <span className={styles.metaLike}>
                                                <FaHeart className={styles.heartIcon} /> {post.likes || 0}
                                            </span>
                                        </div>
                                        <h2 className={styles.postTitle}>{post.title}</h2>
                                        <p className={styles.excerpt}>{post.excerpt}</p>
                                        
                                        <div className={styles.cardBottom}>
                                            <div className={styles.tags}>
                                                {post.tags?.slice(0, 2).map((tag, index) => (
                                                    <span key={index} className={styles.tag}>
                                                        <FaTag /> {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className={styles.readMore}>
                                                Read Article <FaArrowRight />
                                            </span>
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
