const Skill = require('../models/Skill');
const { fetchIconUrl, searchTechnologies } = require('../services/iconService');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
    const skills = await Skill.find().sort({ category: 1 });
    res.status(200).json(skills);
};

// @desc    Set skill
// @route   POST /api/skills
// @access  Private
const setSkill = async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ message: 'Please add a name' });
        return;
    }

    const skill = await Skill.create({
        name: req.body.name,
        category: req.body.category,
        proficiency: req.body.proficiency,
        icon: req.body.icon,
    });

    res.status(200).json(skill);
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        res.status(400).json({ message: 'Skill not found' });
        return;
    }

    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedSkill);
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        res.status(400).json({ message: 'Skill not found' });
        return;
    }

    await skill.deleteOne();

    res.status(200).json({ id: req.params.id });
};

// @desc    Get recently uploaded skills
// @route   GET /api/skills/recent
// @access  Private
const getRecentSkills = async (req, res) => {
    try {
        const skills = await Skill.find({})
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch icon for skill
// @route   POST /api/skills/fetch-icon
// @access  Private
const fetchIcon = async (req, res) => {
    try {
        const { skillName } = req.body;

        if (!skillName) {
            return res.status(400).json({ message: 'Skill name is required' });
        }

        const { url, source } = await fetchIconUrl(skillName);

        res.status(200).json({ iconUrl: url, iconSource: source });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search available technologies
// @route   GET /api/skills/search-tech
// @access  Public
const searchTech = async (req, res) => {
    try {
        const { q } = req.query;
        const results = searchTechnologies(q || '');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSkills,
    setSkill,
    updateSkill,
    deleteSkill,
    getRecentSkills,
    fetchIcon,
    searchTech,
};
