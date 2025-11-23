import React, { useState, useEffect } from 'react';
import { FaSearch, FaCloudUploadAlt, FaCheck } from 'react-icons/fa';
import api from '../../services/api';
import styles from '../../styles/components/admin/SkillIconPicker.module.css';

const SkillIconPicker = ({ value, onChange, onSourceChange }) => {
    const [mode, setMode] = useState('search'); // 'search' or 'upload'
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customFile, setCustomFile] = useState(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2 && mode === 'search') {
                searchIcons(query);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [query, mode]);

    const searchIcons = async (q) => {
        try {
            const res = await api.get(`/skills/search-tech?q=${q}`);
            setResults(res.data);
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    const handleSelectIcon = async (techName) => {
        setLoading(true);
        try {
            const res = await api.post('/skills/fetch-icon', { skillName: techName });
            onChange(res.data.iconUrl);
            if (onSourceChange) onSourceChange(res.data.iconSource);
            setQuery(''); // Clear query but keep selection
            setResults([]);
        } catch (err) {
            console.error('Fetch icon error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onChange(res.data); // URL
            if (onSourceChange) onSourceChange('custom');
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pickerContainer}>
            <div className={styles.tabs}>
                <button
                    type="button"
                    className={`${styles.tab} ${mode === 'search' ? styles.active : ''}`}
                    onClick={() => setMode('search')}
                >
                    <FaSearch /> Search Icons
                </button>
                <button
                    type="button"
                    className={`${styles.tab} ${mode === 'upload' ? styles.active : ''}`}
                    onClick={() => setMode('upload')}
                >
                    <FaCloudUploadAlt /> Upload Custom
                </button>
            </div>

            <div className={styles.content}>
                {mode === 'search' ? (
                    <div className={styles.searchMode}>
                        <input
                            type="text"
                            placeholder="Type technology name (e.g. React, Docker)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className={styles.searchInput}
                        />

                        {results.length > 0 && (
                            <div className={styles.resultsList}>
                                {results.map(tech => (
                                    <div
                                        key={tech}
                                        className={styles.resultItem}
                                        onClick={() => handleSelectIcon(tech)}
                                    >
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.uploadMode}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className={styles.fileInput}
                        />
                    </div>
                )}

                {/* Preview Selected Icon */}
                {value && (
                    <div className={styles.preview}>
                        <p>Selected Icon:</p>
                        <div className={styles.iconBox}>
                            <img src={value} alt="Selected Icon" />
                        </div>
                    </div>
                )}

                {loading && <p className={styles.loading}>Processing...</p>}
            </div>
        </div>
    );
};

export default SkillIconPicker;
