const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET /api/leetcode/:username
// @desc    Get LeetCode submission data
// @access  Public
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    // LeetCode GraphQL Query
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submissionCalendar
        }
      }
    `;

    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { username }
        }, {
            headers: {
                // User-Agent is often required to avoid 403 Forbidden from LeetCode
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            }
        });

        if (response.data.errors) {
            console.error('LeetCode Errors:', response.data.errors);
            return res.status(404).json({ error: 'User not found or LeetCode API error' });
        }

        const calendarString = response.data.data.matchedUser.submissionCalendar;
        // The data comes as a JSON string like '{"1709424000": 5, ...}', so we parse it
        const calendarData = JSON.parse(calendarString);

        res.json(calendarData);
    } catch (error) {
        console.error('LeetCode Proxy Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
