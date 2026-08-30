import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaClock, FaTag, FaArrowLeft, FaCalendarAlt, FaUser, FaShareAlt, FaLinkedin, FaGithub, FaTwitter, FaHeart } from 'react-icons/fa';
import { marked } from 'marked';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import LikeModal from '../components/common/LikeModal';
import styles from '../styles/pages/BlogPostPage.module.css';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

marked.setOptions({
    gfm: true,
    breaks: true,
});

const BlogPostPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeSuccessToast, setLikeSuccessToast] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/blog/${slug}`);
                setPost(data);

                // Check if current user name previously liked this post
                const savedName = localStorage.getItem('viewer_name');
                if (savedName && data.likedBy) {
                    const already = data.likedBy.some(
                        (item) => item.name.toLowerCase() === savedName.toLowerCase()
                    );
                    setHasLiked(already);
                }
            } catch (error) {
                console.error('Error fetching blog post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleLikeClick = async () => {
        const savedName = localStorage.getItem('viewer_name');
        if (savedName && savedName.trim()) {
            try {
                await handleLikeSubmit(savedName.trim());
            } catch (err) {
                // error is handled inside handleLikeSubmit toast
            }
        } else {
            setIsLikeModalOpen(true);
        }
    };

    const handleLikeSubmit = async (name) => {
        if (!post) return;
        try {
            const res = await api.post(`/blog/${post._id || post.slug}/like`, { name });
            if (res.data.likes !== undefined) {
                setPost((prev) => ({
                    ...prev,
                    likes: res.data.likes,
                    likedBy: res.data.likedBy || prev.likedBy
                }));
                setHasLiked(true);
                setLikeSuccessToast(`Thanks for the like, ${name}! ❤️`);
                setTimeout(() => setLikeSuccessToast(''), 3500);
            }
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message || 'Already liked or error occurred';
            setLikeSuccessToast(errMsg);
            setTimeout(() => setLikeSuccessToast(''), 3500);
            throw err;
        }
    };

    const getHtmlContent = (content) => {
        if (!content) return '';
        try {
            return marked.parse(content);
        } catch (e) {
            return content.replace(/\n/g, '<br/>');
        }
    };

    if (loading) {
        return (
            <div className={styles.blogPostPage}>
                <Navbar />
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Loading article...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.blogPostPage}>
                <Navbar />
                <div className={styles.notFound}>
                    <h1>Article Not Found</h1>
                    <p>The post you are looking for does not exist or has been moved.</p>
                    <Link to="/blog" className={styles.backBtn}>
                        <FaArrowLeft /> Back to Blog
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const formattedDate = new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className={styles.blogPostPage}>
            <ScrollProgress />
            <Navbar />
            <main className={styles.main}>
                <div className="container">
                    <div className={styles.articleWrapper}>
                        {/* Top Nav & Breadcrumb */}
                        <div className={styles.topNav}>
                            <Link to="/blog" className={styles.backLink}>
                                <FaArrowLeft /> <span>Back to Articles</span>
                            </Link>
                            <span className={styles.breadcrumbDivider}>/</span>
                            <span className={styles.breadcrumbCurrent}>{post.category || 'Article'}</span>
                        </div>

                        <article className={styles.article}>
                            {/* Article Header */}
                            <header className={styles.header}>
                                {post.tags && post.tags.length > 0 && (
                                    <div className={styles.tagList}>
                                        {post.tags.map((tag, idx) => (
                                            <span key={idx} className={styles.tagPill}>
                                                <FaTag className={styles.tagIcon} /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <h1 className={styles.title}>{post.title}</h1>

                                {/* Author & Metadata Bar */}
                                <div className={styles.metaCard}>
                                    <div className={styles.authorInfo}>
                                        <div className={styles.authorAvatar}>
                                            <FaUser />
                                        </div>
                                        <div className={styles.authorDetails}>
                                            <span className={styles.authorName}>Vikas V</span>
                                            <span className={styles.authorRole}>Software & AI Developer</span>
                                        </div>
                                    </div>

                                    <div className={styles.metaDivider}></div>

                                    <div className={styles.metaItems}>
                                        <span className={styles.metaItem}>
                                            <FaCalendarAlt /> {formattedDate}
                                        </span>
                                        <span className={styles.metaItem}>
                                            <FaClock /> {post.readTime || 5} min read
                                        </span>
                                        
                                        {/* Like Button on Top Bar */}
                                        <button
                                            type="button"
                                            onClick={handleLikeClick}
                                            className={`${styles.likeBtnHeader} ${hasLiked ? styles.likedActive : ''}`}
                                            title="Like this article"
                                        >
                                            <FaHeart className={styles.likeHeartIcon} />
                                            <span>{post.likes || 0} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                                        </button>
                                    </div>
                                </div>

                                {likeSuccessToast && (
                                    <div className={styles.toast}>
                                        {likeSuccessToast}
                                    </div>
                                )}
                            </header>

                            {/* Featured Cover Image */}
                            {post.coverImage && (
                                <div className={styles.coverFrame}>
                                    <img
                                        src={getFileURL(post.coverImage)}
                                        alt={post.title}
                                        className={styles.coverImage}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = FALLBACK_IMAGE;
                                        }}
                                    />
                                </div>
                            )}

                            {/* Markdown Rendered Content */}
                            <div
                                className={styles.contentBody}
                                dangerouslySetInnerHTML={{ __html: getHtmlContent(post.content) }}
                            />

                            {/* Article Footer Card */}
                            <footer className={styles.articleFooter}>
                                <div className={styles.shareSection}>
                                    <div className={styles.bottomLikeWrapper}>
                                        <button
                                            type="button"
                                            onClick={handleLikeClick}
                                            className={`${styles.bigLikeBtn} ${hasLiked ? styles.likedActive : ''}`}
                                        >
                                            <FaHeart /> {hasLiked ? 'Liked' : 'Like Article'} ({post.likes || 0})
                                        </button>
                                    </div>

                                    <div className={styles.shareButtons}>
                                        <button onClick={handleShare} className={styles.shareBtn} title="Copy link">
                                            <FaShareAlt /> {copied ? 'Link Copied!' : 'Copy Link'}
                                        </button>
                                        <a
                                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.shareSocialIcon}
                                            aria-label="Share on LinkedIn"
                                        >
                                            <FaLinkedin />
                                        </a>
                                        <a
                                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.shareSocialIcon}
                                            aria-label="Share on Twitter"
                                        >
                                            <FaTwitter />
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.authorCard}>
                                    <div className={styles.authorCardHeader}>
                                        <div className={styles.cardAvatar}>VK</div>
                                        <div>
                                            <h4 className={styles.cardAuthorName}>Written by Vikas V</h4>
                                            <p className={styles.cardAuthorBio}>
                                                Full-stack engineer passionate about modern web technologies, AI integrations, and high-performance applications.
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.authorSocials}>
                                        <a href="https://github.com/vikasvkori1290" target="_blank" rel="noopener noreferrer">
                                            <FaGithub /> GitHub
                                        </a>
                                        <a href="https://www.linkedin.com/in/vikas-v-4a4749330/" target="_blank" rel="noopener noreferrer">
                                            <FaLinkedin /> LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </footer>
                        </article>
                    </div>
                </div>
            </main>
            <Footer />
            <ScrollToTop />

            {/* Like Modal Popup */}
            <LikeModal
                isOpen={isLikeModalOpen}
                onClose={() => setIsLikeModalOpen(false)}
                onLike={handleLikeSubmit}
                title="Like This Article"
                itemName={`"${post.title}"`}
            />
        </div>
    );
};

export default BlogPostPage;
