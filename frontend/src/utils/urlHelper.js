export const getBaseURL = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

export const getFileURL = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;

    // Get the base URL (e.g., http://localhost:5000/api)
    const apiUrl = getBaseURL();

    // Remove '/api' from the end to get the server root (e.g., http://localhost:5000)
    const serverRoot = apiUrl.replace(/\/api\/?$/, '');

    // Ensure url starts with /
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;

    return `${serverRoot}${normalizedPath}`;
};
