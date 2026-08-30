const BlogPost = require('../models/BlogPost');

// Get all published blog posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find({ published: true })
            .sort({ createdAt: -1 })
            .select('-content'); // Exclude full content for list view
        res.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
};

// Get single blog post by slug
exports.getPostBySlug = async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, published: true });

        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
};

// Get all posts (including unpublished) - Admin only
exports.getAllPostsAdmin = async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
};

// Create new blog post
exports.createPost = async (req, res) => {
    try {
        const { title, content, excerpt, coverImage, tags, published } = req.body;

        if (!title || !content || !excerpt) {
            return res.status(400).json({ error: 'Title, content, and excerpt are required' });
        }

        // Calculate read time (rough estimate: 200 words per minute)
        const wordCount = content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);

        const newPost = new BlogPost({
            title,
            content,
            excerpt,
            coverImage,
            tags: tags || [],
            published: published || false,
            readTime
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: error.message || 'Failed to create blog post' });
    }
};

// Update blog post
exports.updatePost = async (req, res) => {
    try {
        const { title, content, excerpt, coverImage, tags, published } = req.body;

        // Recalculate read time if content changed
        let readTime;
        if (content) {
            const wordCount = content.split(/\s+/).length;
            readTime = Math.ceil(wordCount / 200);
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            { title, content, excerpt, coverImage, tags, published, readTime },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ error: error.message || 'Failed to update blog post' });
    }
};

// Delete blog post
exports.deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
};

// Get recent posts
exports.getRecentPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find({ published: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-content');
        res.json(posts);
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        res.status(500).json({ error: 'Failed to fetch recent posts' });
    }
};

// Like blog post (One like per unique name)
exports.likePost = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Please enter your name to like this article.' });
        }

        const cleanName = name.trim();
        let post = await BlogPost.findById(req.params.id);
        if (!post) {
            post = await BlogPost.findOne({ slug: req.params.id });
        }

        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        // Check if name has already liked
        const alreadyLiked = post.likedBy && post.likedBy.some(
            (item) => item.name.toLowerCase() === cleanName.toLowerCase()
        );

        if (alreadyLiked) {
            return res.status(400).json({
                error: `"${cleanName}" has already liked this article!`,
                alreadyLiked: true,
                likes: post.likes || 0
            });
        }

        post.likedBy = post.likedBy || [];
        post.likedBy.push({ name: cleanName, date: new Date() });
        post.likes = (post.likes || 0) + 1;
        await post.save();

        res.json({
            success: true,
            message: `Thank you, ${cleanName}! Liked successfully.`,
            likes: post.likes,
            likedBy: post.likedBy
        });
    } catch (error) {
        console.error('Error liking blog post:', error);
        res.status(500).json({ error: 'Failed to record like' });
    }
};
