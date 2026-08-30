import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [recentBlogs, setRecentBlogs] = useState([]);
    
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingAchievements, setLoadingAchievements] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);

    const refreshProjects = useCallback(async () => {
        try {
            const projectsResponse = await api.get('/projects');
            if (projectsResponse.data) {
                setProjects(projectsResponse.data);
            }
        } catch (e) {
            console.error('Error refreshing projects:', e);
        }
    }, []);

    const updateProjectLikes = useCallback((projectId, newLikes, likedBy) => {
        setProjects((prev) =>
            prev.map((p) =>
                p._id === projectId
                    ? { ...p, likes: newLikes, likedBy: likedBy || p.likedBy }
                    : p
            )
        );
    }, []);

    useEffect(() => {
        let isMounted = true;

        // Sequential background preloader pipeline:
        // 1. Projects -> 2. Achievements -> 3. Blogs
        const fetchSequentialData = async () => {
            try {
                // Step 1: Fetch Projects
                const projectsResponse = await api.get('/projects');
                if (isMounted) {
                    setProjects(projectsResponse.data || []);
                    setLoadingProjects(false);
                }

                // Step 2: Fetch Achievements immediately after Projects
                const achievementsResponse = await api.get('/achievements');
                if (isMounted) {
                    setAchievements(achievementsResponse.data || []);
                    setLoadingAchievements(false);
                }

                // Step 3: Fetch Blogs & Recent Blogs immediately after Achievements
                try {
                    const [blogsResponse, recentBlogsResponse] = await Promise.all([
                        api.get('/blog'),
                        api.get('/blog/recent')
                    ]);
                    if (isMounted) {
                        setBlogs(blogsResponse.data || []);
                        setRecentBlogs(recentBlogsResponse.data || []);
                        setLoadingBlogs(false);
                    }
                } catch (blogErr) {
                    console.error('Error prefetching blogs:', blogErr);
                    if (isMounted) setLoadingBlogs(false);
                }
            } catch (error) {
                console.error('Error in sequential data preloader:', error);
                if (isMounted) {
                    setLoadingProjects(false);
                    setLoadingAchievements(false);
                    setLoadingBlogs(false);
                }
            }
        };

        fetchSequentialData();

        return () => {
            isMounted = false;
        };
    }, []);

    const value = {
        projects,
        achievements,
        blogs,
        recentBlogs,
        loadingProjects,
        loadingAchievements,
        loadingBlogs,
        setProjects,
        setBlogs,
        setRecentBlogs,
        refreshProjects,
        updateProjectLikes
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
