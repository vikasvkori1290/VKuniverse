import React, { useEffect, useState, useRef } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '../styles/components/LeetCodeActivity.css';
import api from '../services/api';

const LeetCodeActivity = ({ username }) => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/leetcode/${username}`);
                const calendarData = response.data;

                // Calculate total
                const total = Object.values(calendarData).reduce((a, b) => a + b, 0);
                setTotalSubmissions(total);

                // Prepare 12 months data
                const today = new Date();
                const months = [];

                // We want the last 12 months, ending with current month
                for (let i = 11; i >= 0; i--) {
                    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    const year = d.getFullYear();
                    const month = d.getMonth();

                    const startDate = new Date(year, month, 1);
                    const endDate = new Date(year, month + 1, 0); // Last day of month

                    months.push({
                        monthLabel: d.toLocaleString('default', { month: 'short' }),
                        startDate: startDate,
                        endDate: endDate,
                        values: []
                    });
                }

                // Populate values into respective months
                Object.keys(calendarData).forEach(timestamp => {
                    const date = new Date(parseInt(timestamp) * 1000);
                    const dateStr = date.toISOString().split('T')[0];
                    const count = calendarData[timestamp];

                    months.forEach(m => {
                        if (date >= m.startDate && date <= m.endDate) {
                            m.values.push({ date: dateStr, count: count });
                        }
                    });
                });

                setMonthlyData(months);

            } catch (error) {
                console.error("Error fetching LeetCode data:", error);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username]);

    // Auto-scroll animation to the right when data loads AND component is in view
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && monthlyData.length > 0 && !hasScrolled && scrollRef.current) {

                    // Trigger scroll
                    setTimeout(() => {
                        scrollRef.current.scrollTo({
                            left: scrollRef.current.scrollWidth,
                            behavior: 'smooth'
                        });
                        setHasScrolled(true); // Ensure it only runs once
                    }, 500); // Slight delay for visual effect
                }
            },
            { threshold: 0.3 } // Trigger when 30% visible
        );

        if (scrollRef.current) {
            observer.observe(scrollRef.current);
        }

        return () => {
            if (scrollRef.current) {
                observer.unobserve(scrollRef.current);
            }
        };
    }, [monthlyData, hasScrolled]);

    return (
        <div className="leetcode-container">
            <div className="leetcode-header">
                <h3>LeetCode Activity</h3>
                <div className="header-actions">
                    <span>{totalSubmissions} submissions in the past year</span>
                    <a
                        href={`https://leetcode.com/u/${username}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-profile-btn"
                    >
                        View Profile ↗
                    </a>
                </div>
            </div>

            <div className="months-grid" ref={scrollRef}>
                {/* Weekday Labels Column */}
                <div className="weekday-labels">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                </div>

                {monthlyData.map((month, index) => (
                    <div key={index} className="month-block">
                        <span className="month-name">
                            {month.monthLabel}
                        </span>
                        <CalendarHeatmap
                            startDate={month.startDate}
                            endDate={month.endDate}
                            values={month.values}
                            classForValue={(value) => {
                                if (!value || value.count === 0) return 'color-empty';
                                return `color-github-${Math.min(value.count, 4)}`;
                            }}
                            titleForValue={(value) => {
                                if (!value) return 'No submissions';
                                return `${value.count} submissions on ${value.date}`;
                            }}
                            horizontal={true}
                            showWeekdayLabels={false}
                            showMonthLabels={false}
                            gutterSize={3}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeetCodeActivity;
