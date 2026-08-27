import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTrash, FaVideo } from 'react-icons/fa';
import axios from 'axios';
import api from '../../services/api';
import styles from '../../styles/components/admin/ImageUploader.module.css';

const VideoUploader = ({ video, onVideoChange }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        if (file.size > 100 * 1024 * 1024) {
            setError('Video size must be less than 100MB');
            return;
        }

        setUploading(true);
        setProgress(0);
        setError('');

        try {
            // Step 1: Request signed upload signature from backend (bypasses Vercel 4.5MB limit)
            const sigRes = await api.get('/upload/signature?folder=vk_portfolio/videos');
            const { signature, timestamp, folder, apiKey, cloudName } = sigRes.data;

            if (signature && apiKey && cloudName) {
                // Step 2: Upload directly to Cloudinary from browser
                const cloudinaryData = new FormData();
                cloudinaryData.append('file', file);
                cloudinaryData.append('api_key', apiKey);
                cloudinaryData.append('timestamp', timestamp);
                cloudinaryData.append('signature', signature);
                cloudinaryData.append('folder', folder);

                const uploadRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
                    cloudinaryData,
                    {
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                setProgress(percent);
                            }
                        }
                    }
                );

                onVideoChange(uploadRes.data.secure_url);
            } else {
                // Fallback to backend route if signature not configured
                const formData = new FormData();
                formData.append('video', file);
                const res = await api.post('/upload-video', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                onVideoChange(res.data);
            }
        } catch (err) {
            console.error('Video upload error:', err);
            const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to upload video. Please try again.';
            setError(msg);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [onVideoChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.webm', '.ogg', '.mov']
        },
        multiple: false
    });

    const handleRemove = () => {
        onVideoChange('');
    };

    return (
        <div className={styles.uploaderContainer}>
            {!video ? (
                <div
                    {...getRootProps()}
                    className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
                >
                    <input {...getInputProps()} />
                    <FaCloudUploadAlt className={styles.uploadIcon} />
                    {uploading ? (
                        <p style={{ fontWeight: 600, color: '#38bdf8' }}>
                            Uploading video... {progress > 0 ? `${progress}%` : ''}
                        </p>
                    ) : (
                        <p>Drag & drop video here, or click to select (MP4, WebM, OGG, MOV)</p>
                    )}
                    <span className={styles.limitInfo}>(Max 100MB)</span>
                </div>
            ) : (
                <div className={styles.imageCard} style={{ width: '100%', maxWidth: '340px', height: 'auto', aspectRatio: '16/9' }}>
                    <video src={video} controls className={styles.previewVideo} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={handleRemove}
                            title="Remove video"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            )}

            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default VideoUploader;
