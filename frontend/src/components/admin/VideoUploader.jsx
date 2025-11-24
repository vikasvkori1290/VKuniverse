import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTrash, FaVideo } from 'react-icons/fa';
import api from '../../services/api';
import styles from '../../styles/components/admin/ImageUploader.module.css'; // Reusing styles

const VideoUploader = ({ video, onVideoChange }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        if (file.size > 50 * 1024 * 1024) {
            setError('Video size must be less than 50MB');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('video', file);

        try {
            const res = await api.post('/upload-video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onVideoChange(res.data); // Returns the video URL
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload video. Please try again.');
        } finally {
            setUploading(false);
        }
    }, [onVideoChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.webm', '.ogg']
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
                        <p>Uploading video...</p>
                    ) : (
                        <p>Drag & drop video here, or click to select (MP4, WebM, OGG)</p>
                    )}
                    <span className={styles.limitInfo}>(Max 50MB)</span>
                </div>
            ) : (
                <div className={styles.imageCard} style={{ width: '100%', maxWidth: '300px', height: 'auto', aspectRatio: '16/9' }}>
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
