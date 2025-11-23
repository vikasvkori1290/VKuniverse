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
        images: req.body.images,
        collageLayout: req.body.collageLayout,
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

// @desc    Get recently uploaded achievements
// @route   GET /api/achievements/recent
// @access  Private
const getRecentAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find({})
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update collage layout for achievement
// @route   PUT /api/achievements/:id/collage
// @access  Private
const updateCollage = async (req, res) => {
    try {
        const { collageLayout } = req.body;
        const achievement = await Achievement.findById(req.params.id);

        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        achievement.collageLayout = collageLayout;
        await achievement.save();

        res.status(200).json(achievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAchievements,
    setAchievement,
    updateAchievement,
    deleteAchievement,
    getRecentAchievements,
    updateCollage,
};
