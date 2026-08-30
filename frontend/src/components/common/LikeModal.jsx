import React, { useState, useEffect } from 'react';
import { FaHeart, FaTimes } from 'react-icons/fa';
import styles from '../../styles/components/LikeModal.module.css';

const LikeModal = ({ isOpen, onClose, onLike, title = "Like this" }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const savedName = localStorage.getItem('viewer_name') || '';
            setName(savedName);
            setError('');
            setSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please enter your name');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            localStorage.setItem('viewer_name', trimmed);
            await onLike(trimmed);
            onClose();
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message || 'Already liked or invalid name';
            setError(errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <FaTimes />
                </button>

                <div className={styles.header}>
                    <FaHeart className={styles.heartIcon} />
                    <span className={styles.title}>{title}</span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            placeholder="Your name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            autoFocus
                            maxLength={40}
                            disabled={submitting}
                        />
                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? '...' : 'Like'}
                        </button>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default LikeModal;
