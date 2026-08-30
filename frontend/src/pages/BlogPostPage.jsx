import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaClock, FaTag, FaArrowLeft, FaCalendarAlt, FaUser, FaShareAlt, FaLinkedin, FaGithub, FaTwitter, FaHeart, FaTimes } from 'react-icons/fa';
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
    const [lightboxImage, setLightboxImage] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/blog/${slug}`);
                setPost(data);

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

    // Handle Escape key to close lightbox and prevent background scroll
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setLightboxImage(null);
            }
        };
        if (lightboxImage) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [lightboxImage]);

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
                // handled in toast
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

    // Click handler on content to open any clicked image in Lightbox
    const handleContentClick = (e) => {
        const target = e.target;
        if (target.tagName === 'IMG') {
            e.preventDefault();
            setLightboxImage({
                src: target.src,
                alt: target.alt || post.title
            });
        }
    };

    const getHtmlContent = (content) => {
        if (!content) return '';
        try {
            const rawHtml = marked.parse(content);
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawHtml, 'text/html');
            const bodyChildren = Array.from(doc.body.children);

            const isImageOnlyNode = (node) => {
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
                if (isImageOnlyNode(el)) {
                    const groupImgs = [];
                    let j = i;
                    while (j < bodyChildren.length && isImageOnlyNode(bodyChildren[j])) {
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

                    // If 2 or more consecutive images, bundle them into a side-by-side row
                    if (groupImgs.length >= 2) {
                        const gridDiv = doc.createElement('div');
                        const rowClass = groupImgs.length === 2 ? styles.imageRow2 : groupImgs.length === 3 ? styles.imageRow3 : styles.imageGrid;
                        gridDiv.className = `${styles.imageRow} ${rowClass}`;

                        groupImgs.forEach(img => {
                            const itemWrap = doc.createElement('div');
                            itemWrap.className = styles.imageRowItem;
                            itemWrap.appendChild(img);
                            gridDiv.appendChild(itemWrap);
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
            console.error('Error processing blog content HTML:', e);
            try {
                return marked.parse(content);
            } catch (err) {
                return content.replace(/\n/g, '<br/>');
            }
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

                            {/* Featured Cover Image (Clickable for Lightbox) */}
                            {post.coverImage && (
                                <div
                                    className={styles.coverFrame}
                                    onClick={() => setLightboxImage({ src: getFileURL(post.coverImage), alt: post.title })}
                                    title="Click to enlarge cover image"
                                >
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

                            {/* Markdown Rendered Content with Image Lightbox delegated click */}
                            <div
                                className={styles.contentBody}
                                onClick={handleContentClick}
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

            {/* Image Lightbox Viewer Modal */}
            {lightboxImage && (
                <div
                    className={styles.lightboxOverlay}
                    onClick={() => setLightboxImage(null)}
                    title="Click anywhere to close"
                >
                    <button
                        className={styles.lightboxCloseBtn}
                        onClick={() => setLightboxImage(null)}
                        aria-label="Close image preview"
                    >
                        <FaTimes />
                    </button>
                    <div className={styles.lightboxContainer} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={lightboxImage.src}
                            alt={lightboxImage.alt}
                            className={styles.lightboxImage}
                        />
                        {lightboxImage.alt && lightboxImage.alt !== 'Image' && lightboxImage.alt !== post.title && (
                            <div className={styles.lightboxCaption}>
                                {lightboxImage.alt}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogPostPage;
