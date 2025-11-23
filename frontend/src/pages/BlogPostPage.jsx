import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaClock, FaEye, FaTag, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import styles from '../styles/pages/BlogPostPage.module.css';

const BlogPostPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/blog/${slug}`);
                setPost(data);
            } catch (error) {
                console.error('Error fetching blog post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className={styles.blogPostPage}>
                <Navbar />
                <div className={styles.loading}>Loading post...</div>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.blogPostPage}>
                <Navbar />
                <div className={styles.notFound}>
                    <h1>Post Not Found</h1>
                    <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.blogPostPage}>
            <ScrollProgress />
            <Navbar />
            <main className={styles.main}>
                <div className="container">
                    <Link to="/blog" className={styles.backLink}>
                        <FaArrowLeft /> Back to Blog
                    </Link>

                    <article className={styles.article}>
                        {post.coverImage && (
                            <div className={styles.coverImageWrapper}>
                                <img
                                    src={post.coverImage.startsWith('http') ? post.coverImage : `http://localhost:5000${post.coverImage}`}
                                    alt={post.title}
                                    className={styles.coverImage}
                                />
                            </div>
                        )}

                        <div className={styles.header}>
                            <h1 className={styles.title}>{post.title}</h1>

                            <div className={styles.meta}>
                                <span className={styles.metaItem}>
                                    <FaClock /> {post.readTime} min read
                                </span>
                                <span className={styles.metaItem}>
                                    <FaEye /> {post.views} views
                                </span>
                                <span className={styles.metaItem}>
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            {post.tags && post.tags.length > 0 && (
                                <div className={styles.tags}>
                                    {post.tags.map((tag, index) => (
                                        <span key={index} className={styles.tag}>
                                            <FaTag /> {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div
                            className={styles.content}
                            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
                        />
                    </article>
                </div>
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default BlogPostPage;
