import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from '../../styles/components/admin/Messages.module.css';
import { FaEnvelope, FaEnvelopeOpen, FaTrash } from 'react-icons/fa';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/messages');
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/messages/${id}/read`);
            fetchMessages();
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/messages/${id}`);
                fetchMessages();
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading messages...</div>;
    }

    if (messages.length === 0) {
        return <div className={styles.empty}>No messages yet.</div>;
    }

    return (
        <div className={styles.messagesContainer}>
            <h2>Contact Messages</h2>
            <div className={styles.messagesList}>
                {messages.map((msg) => (
                    <div key={msg._id} className={`${styles.messageCard} ${msg.isRead ? styles.read : styles.unread}`}>
                        <div className={styles.messageHeader}>
                            <div className={styles.senderInfo}>
                                <h3>{msg.name}</h3>
                                <span className={styles.email}>{msg.email}</span>
                            </div>
                            <div className={styles.messageActions}>
                                {!msg.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(msg._id)}
                                        className={styles.actionBtn}
                                        title="Mark as read"
                                    >
                                        <FaEnvelopeOpen />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(msg._id)}
                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                        <div className={styles.messageSubject}>
                            <strong>Subject:</strong> {msg.subject}
                        </div>
                        <div className={styles.messageBody}>
                            {msg.message}
                        </div>
                        <div className={styles.messageFooter}>
                            <span className={styles.date}>
                                {new Date(msg.createdAt).toLocaleString()}
                            </span>
                            {!msg.isRead && <span className={styles.unreadBadge}>New</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Messages;
