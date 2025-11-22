const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    const projects = await Project.find({ isPublished: true }).sort({ createdAt: -1 });
    res.status(200).json(projects);
};

// @desc    Get all projects (Admin)
// @route   GET /api/projects/admin
// @access  Private
const getAdminProjects = async (req, res) => {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.status(200).json(projects);
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(404).json({ message: 'Project not found' });
    }
}

// @desc    Set project
// @route   POST /api/projects
// @access  Private
const setProject = async (req, res) => {
    if (!req.body.title) {
        res.status(400).json({ message: 'Please add a title' });
        return;
    }

    const project = await Project.create({
        title: req.body.title,
        description: req.body.description,
        techStack: req.body.techStack, // Expecting array or string
        liveLink: req.body.liveLink,
        githubLink: req.body.githubLink,
        images: req.body.images,
        status: req.body.status,
        isPublished: req.body.isPublished
    });

    res.status(200).json(project);
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(400).json({ message: 'Project not found' });
        return;
    }

    const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedProject);
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(400).json({ message: 'Project not found' });
        return;
    }

    await project.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getProjects,
    getAdminProjects,
    getProject,
    setProject,
    updateProject,
    deleteProject,
};
