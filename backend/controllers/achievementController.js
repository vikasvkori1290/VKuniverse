const Achievement = require('../models/Achievement');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = async (req, res) => {
    const achievements = await Achievement.find().sort({ date: -1 });
    res.status(200).json(achievements);
};

// @desc    Set achievement
// @route   POST /api/achievements
// @access  Private
const setAchievement = async (req, res) => {
    if (!req.body.title) {
        res.status(400).json({ message: 'Please add a title' });
        return;
    }

    const achievement = await Achievement.create({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        category: req.body.category,
        image: req.body.image,
    });

    res.status(200).json(achievement);
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private
const updateAchievement = async (req, res) => {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
        res.status(400).json({ message: 'Achievement not found' });
        return;
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedAchievement);
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private
const deleteAchievement = async (req, res) => {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
        res.status(400).json({ message: 'Achievement not found' });
        return;
    }

    await achievement.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getAchievements,
    setAchievement,
    updateAchievement,
    deleteAchievement,
};
