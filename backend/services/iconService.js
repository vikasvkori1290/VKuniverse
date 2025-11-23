const axios = require('axios');

/**
 * Service to fetch technology icons from various CDNs
 */

// DevIcon mapping for common technologies
const deviconMap = {
    // Frontend
    'react': 'react/react-original.svg',
    'vue': 'vuejs/vuejs-original.svg',
    'angular': 'angularjs/angularjs-original.svg',
    'javascript': 'javascript/javascript-original.svg',
    'typescript': 'typescript/typescript-original.svg',
    'html': 'html5/html5-original.svg',
    'css': 'css3/css3-original.svg',
    'sass': 'sass/sass-original.svg',
    'tailwind': 'tailwindcss/tailwindcss-plain.svg',
    'bootstrap': 'bootstrap/bootstrap-original.svg',

    // Backend
    'node': 'nodejs/nodejs-original.svg',
    'nodejs': 'nodejs/nodejs-original.svg',
    'express': 'express/express-original.svg',
    'python': 'python/python-original.svg',
    'django': 'django/django-plain.svg',
    'flask': 'flask/flask-original.svg',
    'java': 'java/java-original.svg',
    'spring': 'spring/spring-original.svg',
    'php': 'php/php-original.svg',
    'laravel': 'laravel/laravel-plain.svg',

    // Databases
    'mongodb': 'mongodb/mongodb-original.svg',
    'mysql': 'mysql/mysql-original.svg',
    'postgresql': 'postgresql/postgresql-original.svg',
    'redis': 'redis/redis-original.svg',
    'firebase': 'firebase/firebase-plain.svg',

    // Tools & Others
    'git': 'git/git-original.svg',
    'github': 'github/github-original.svg',
    'docker': 'docker/docker-original.svg',
    'kubernetes': 'kubernetes/kubernetes-plain.svg',
    'aws': 'amazonwebservices/amazonwebservices-original-wordmark.svg',
    'azure': 'azure/azure-original.svg',
    'figma': 'figma/figma-original.svg',
    'vscode': 'vscode/vscode-original.svg',
    'webpack': 'webpack/webpack-original.svg',
    'vite': 'vitejs/vitejs-original.svg',
    'nextjs': 'nextjs/nextjs-original.svg',
    'graphql': 'graphql/graphql-plain.svg',
};

/**
 * Fetch icon URL for a given technology name
 * @param {string} skillName - Name of the technology/skill
 * @returns {Promise<{url: string, source: string}>}
 */
async function fetchIconUrl(skillName) {
    const normalizedName = skillName.toLowerCase().trim();

    // Check DevIcon CDN first
    if (deviconMap[normalizedName]) {
        const iconPath = deviconMap[normalizedName];
        const url = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${iconPath}`;

        // Verify the icon exists
        try {
            await axios.head(url);
            return {
                url,
                source: 'devicon'
            };
        } catch (error) {
            console.log(`DevIcon not found for ${skillName}, trying alternatives...`);
        }
    }

    // Try Simple Icons as fallback
    try {
        const simpleIconsUrl = `https://cdn.simpleicons.org/${normalizedName}`;
        await axios.head(simpleIconsUrl);
        return {
            url: simpleIconsUrl,
            source: 'simpleicons'
        };
    } catch (error) {
        console.log(`Simple Icons not found for ${skillName}`);
    }

    // Return null if no icon found
    return {
        url: null,
        source: 'none'
    };
}

/**
 * Get list of available DevIcon technologies
 * @returns {Array<string>}
 */
function getAvailableTechnologies() {
    return Object.keys(deviconMap).sort();
}

/**
 * Search for technologies by name
 * @param {string} query - Search query
 * @returns {Array<string>}
 */
function searchTechnologies(query) {
    const normalizedQuery = query.toLowerCase();
    return Object.keys(deviconMap)
        .filter(tech => tech.includes(normalizedQuery))
        .sort();
}

module.exports = {
    fetchIconUrl,
    getAvailableTechnologies,
    searchTechnologies,
    deviconMap
};
