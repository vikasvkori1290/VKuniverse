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

export const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%231a1a2e"/><rect x="250" y="150" width="300" height="150" rx="10" ry="10" fill="%230f3460" opacity="0.6"/><path d="M380 200 L420 220 L380 240 Z" fill="%2300D8FF"/><text x="400" y="340" fill="%238a8a8a" font-family="sans-serif" font-size="20" text-anchor="middle">Loading Asset...</text></svg>';
