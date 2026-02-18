import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingAchievements, setLoadingAchievements] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Projects first
                const projectsResponse = await api.get('/projects');
                setProjects(projectsResponse.data);
                setLoadingProjects(false);

                // Then fetch Achievements
                const achievementsResponse = await api.get('/achievements');
                setAchievements(achievementsResponse.data);
                setLoadingAchievements(false);
            } catch (error) {
                console.error('Error mechanism fetching data:', error);
                // Even if error, stop loading to prevent infinite spinners
                setLoadingProjects(false);
                setLoadingAchievements(false);
            }
        };

        // Add a small delay to prioritize initial page load (e.g., Home animations)
        const timer = setTimeout(() => {
            fetchData();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const value = {
        projects,
        achievements,
        loadingProjects,
        loadingAchievements
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
