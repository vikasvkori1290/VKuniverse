import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaCloudUploadAlt, FaTrash, FaStar, FaGripVertical } from 'react-icons/fa';
import api from '../../services/api';
import styles from '../../styles/components/admin/ImageUploader.module.css';

const ImageUploader = ({ images = [], onImagesChange, maxFiles = 10 }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;
        if (images.length + acceptedFiles.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} images.`);
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const res = await api.post('/upload-multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Add new images to the list
            // Backend returns array of { url, order }
            // We need to map them to our format if needed, but { url, order } is good.
            // We also need to handle 'isThumbnail'. First image is default thumbnail if none exists.

            const newImages = res.data.map((img, index) => ({
                url: img.url,
                isThumbnail: false,
                order: images.length + index, // Set proper order based on existing images
            }));

            const updatedImages = [...images, ...newImages];

            // If no thumbnail set, set the first one
            if (!updatedImages.some(img => img.isThumbnail) && updatedImages.length > 0) {
                updatedImages[0].isThumbnail = true;
            }

            onImagesChange(updatedImages);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
        }
    }, [images, maxFiles, onImagesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: true
    });

    const handleRemove = (index) => {
        const newImages = [...images];
        const wasThumbnail = newImages[index].isThumbnail;
        newImages.splice(index, 1);

        // If we removed the thumbnail, set a new one if images remain
        if (wasThumbnail && newImages.length > 0) {
            newImages[0].isThumbnail = true;
        }

        onImagesChange(newImages);
    };

    const handleSetThumbnail = (index) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isThumbnail: i === index
        }));
        onImagesChange(newImages);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        onImagesChange(items);
    };

    return (
        <div className={styles.uploaderContainer}>
            <div
                {...getRootProps()}
                className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
            >
                <input {...getInputProps()} />
                <FaCloudUploadAlt className={styles.uploadIcon} />
                {uploading ? (
                    <p>Uploading...</p>
                ) : (
                    <p>Drag & drop images here, or click to select</p>
                )}
                <span className={styles.limitInfo}>(Max {maxFiles} images)</span>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {images.length > 0 && (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="image-list" direction="horizontal">
                        {(provided) => (
                            <div
                                className={styles.imageGrid}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {images.map((img, index) => (
                                    <Draggable key={img.url} draggableId={img.url} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`${styles.imageCard} ${img.isThumbnail ? styles.thumbnail : ''}`}
                                            >
                                                <img src={img.url} alt={`Upload ${index}`} />
                                                <div className={styles.actions}>
                                                    <button
                                                        type="button"
                                                        className={`${styles.actionBtn} ${img.isThumbnail ? styles.activeStar : ''}`}
                                                        onClick={() => handleSetThumbnail(index)}
                                                        title="Set as thumbnail"
                                                    >
                                                        <FaStar />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={styles.deleteBtn}
                                                        onClick={() => handleRemove(index)}
                                                        title="Remove image"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                                {img.isThumbnail && <span className={styles.thumbLabel}>Cover</span>}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </div>
    );
};

export default ImageUploader;
