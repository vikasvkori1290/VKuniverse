import React, { useEffect, useState, useRef } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '../styles/components/LeetCodeActivity.css';

const LeetCodeActivity = ({ username }) => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const scrollRef = useRef(null);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Call public alfa-leetcode-api directly from frontend (CORS-enabled, not blocked)
                const res = await fetch(`https://alfa-leetcode-api.onrender.com/userCalendar?username=${username}`);
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const json = await res.json();

                // The API returns submissionCalendar as a JSON string
                const calendarData = typeof json.submissionCalendar === 'string'
                    ? JSON.parse(json.submissionCalendar)
                    : json.submissionCalendar;

                if (!calendarData || Object.keys(calendarData).length === 0) {
                    throw new Error('Empty calendar data returned');
                }

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
                        year: year,
                        monthIndex: month,
                        startDate: startDate,
                        endDate: endDate,
                        values: []
                    });
                }

                // Populate values into respective months
                Object.keys(calendarData).forEach(timestamp => {
                    // LeetCode timestamps are in seconds (UTC)
                    const date = new Date(parseInt(timestamp) * 1000);

                    const year = date.getFullYear();
                    const month = date.getMonth();
                    const day = date.getDate();

                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const count = calendarData[timestamp];

                    // Find matching month container
                    const targetMonth = months.find(m => m.year === year && m.monthIndex === month);
                    if (targetMonth) {
                        targetMonth.values.push({ date: dateStr, count: count });
                    }
                });

                setMonthlyData(months);
                setError(null);

            } catch (error) {
                console.error("Error fetching LeetCode data:", error);
                setError("Could not load LeetCode data. Please check the username.");
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
            {error ? (
                <div className="error-message" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                    {error}
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

export default LeetCodeActivity;

