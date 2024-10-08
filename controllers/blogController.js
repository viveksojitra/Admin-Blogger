const Blog = require('../model/blogModel');
const fs = require('fs').promises;
const path = require('path');
const Topic = require('../model/topicModel');
const Subtopic = require('../model/subtopicModel');

// View All blogs
const viewAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate('author');
        res.render('explore', { blogs: blogs || [], currentUser: req.user }); // Pass the current user to the view
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.render('explore', { blogs: [], currentUser: req.user });
    }
};

// View logged-in user's blogs
const viewMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id }).populate('author'); // Ensure you populate the author
        console.log("author", req.user._id);
        res.render('my-blogs', { blogs: blogs || [] });
    } catch (err) {
        console.error('Error fetching my blogs:', err);
        res.render('my-blogs', { blogs: [] });
    }
};

// Add blog form
const addBlogForm = (req, res) => {
    res.render('create-blog');
};

// Add a new blog
const addBlog = async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    if (!title || !content) {
        console.log('Title and content are required.');
        return res.redirect('/create-blog');
    }

    try {
        const newBlog = new Blog({ title, content, image, author: req.user._id });
        await newBlog.save();
        res.redirect('/my-blogs');
    } catch (err) {
        console.error('Error saving blog', err);
        res.redirect('/create-blog');
    }
};

// Edit blog form
const editBlogForm = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        // if (!blog || blog.author.toString() !== req.user._id.toString()) {
        //     return res.redirect('my-blogs');
        // }

        res.render('edit-blog', { blog });
    } catch (err) {
        console.error('Error fetching blog', err);
    }
};

// Update a blog
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        // if (!blog || blog.author.toString() !== req.user._id.toString()) {
        //     req.flash('error_msg', 'Blog not found or you are not authorized to edit this blog.');
        //     return res.redirect('my-blogs');
        // }

        // Delete old image if a new one is uploaded
        if (req.file) {
            if (blog.image) {
                try {
                    await fs.unlink(path.join(__dirname, '..', blog.image));
                    console.log('Old image deleted successfully');
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            blog.image = `uploads/${req.file.filename}`;
        }

        blog.title = req.body.title;
        blog.content = req.body.content;

        await blog.save();
        res.redirect('/my-blogs');
    } catch (err) {
        console.error('Error updating blog', err);
    }
};

// Delete a blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        // Check if blog exists and the user is the author
        if (!blog || blog.author.toString() !== req.user._id.toString()) {
            return res.redirect('/my-blogs');
        }

        // Delete the associated image from the file system
        if (blog.image) {
            try {
                await fs.unlink(path.join(__dirname, '..', blog.image));
                console.log('Image deleted successfully');
            } catch (err) {
                console.error('Error deleting image:', err);
            }
        }

        // Correctly delete the blog using the Blog model
        await Blog.findByIdAndDelete(req.params.id);

        // Redirect to the 'my-blogs' page after successful deletion
        res.redirect('/my-blogs');
    } catch (err) {
        console.error('Error deleting blog', err);
        res.redirect('/my-blogs');
    }
};

// ----- TOPIC -----
// Topic Controller
const addTopicController = async (req, res) => {
    // try {
    //     const topics = await Topic.find().populate('user');
    //     res.render('topic', { topics, currentUser: req.user });
    // } catch (error) {
    //     console.error('Error fetching topics:', error);
    //     req.flash('error', 'Something went wrong while fetching topics.');
    //     res.redirect('/');
    // }

    res.render('add-topic', { currentUser: req.user });
};

// Topic Post Controller
const addTopicPostController = async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic || topic.trim() === "") {
            req.flash('error', 'Topic cannot be empty.');
            return res.redirect('/topic');
        }

        const newTopic = new Topic({
            topic,
            user: req.user._id
        });

        await newTopic.save();

        req.flash('success', 'Topic added successfully!');
        res.redirect('/add-topic');

    } catch (err) {
        console.error('Error saving topic:', err);
        req.flash('error', 'Something went wrong, please try again.');
        res.redirect('/add-topic');
    }
};

// Delete Topic Controller
const deleteaddTopicController = async (req, res) => {
    try {
        const topicId = req.params.id;
        const userId = req.user._id; // Get the ID of the currently logged-in user

        // Find the topic by ID
        const topic = await Topic.findById(topicId);

        // Check if topic exists
        if (!topic) {
            req.flash('error', 'Topic not found');
            return res.redirect('/topic');
        }

        // Check if the logged-in user is the creator of the topic
        if (topic.user.toString() !== userId.toString()) {
            req.flash('error', 'You are not authorized to delete this topic');
            return res.redirect('/topic');
        }

        // Delete the topic if authorized
        await Topic.findByIdAndDelete(topicId);
        req.flash('success', 'Topic deleted successfully');
        res.redirect('/topic');
    } catch (error) {
        console.error('Error deleting topic:', error);
        req.flash('error', 'Error deleting topic');
        res.redirect('/topic');
    }
};

// ----- SUBTOPIC -----
// Subtopic Controller
const addSubtopicController = async (req, res) => {

    try {
        // only user's topics
        // const topics = await Topic.find().populate('user');
        // res.render('topic', { topics, currentUser: req.user });

        // all topics
        const topics = await Topic.find({});
        res.render('add-subtopic', { topics });

    } catch (error) {
        console.error('Error fetching topics:', error);
        req.flash('error', 'Something went wrong while fetching topics.');
        res.redirect('/');
    }
}

// Subtopic Post Controller
const addSubtopicPostController = async (req, res) => {
    try {
        const { topic, subtopic } = req.body;

        // Validate the subtopic
        if (!subtopic || subtopic.trim() === "") {
            req.flash('error', 'Subtopic cannot be empty.');
            return res.redirect('/add-subtopic');
        }

        // Find topic by ID
        const selectedTopic = await Topic.findById(topic);
        if (!selectedTopic) {
            req.flash('error', 'Invalid Topic.');
            return res.redirect('/add-subtopic');
        }

        // Created new subtopic
        const newSubtopic = new Subtopic({
            subtopic,
            topic: selectedTopic._id,
            user: req.user._id
        });

        await newSubtopic.save();

        req.flash('success', 'Subtopic added successfully!');
        res.redirect('/add-subtopic');

    } catch (err) {
        console.error('Error saving subtopic:', err);
        req.flash('error', 'Something went wrong, please try again.');
        res.redirect('/add-subtopic');
    }
};

// Get Subtopic Controller
// const getSubtopics = async (req, res) => {
//     try {
//         // Fetch subtopics and populate the associated topic data
//         const subtopics = await Subtopic.find().populate('topic', 'topic'); // Populate the 'topic' field with the 'topic' name

//         res.render('subtopics', { subtopics });
//     } catch (err) {
//         console.error('Error fetching subtopics:', err);
//         res.status(500).send('Server Error');
//     }
// };

module.exports = {
    viewAllBlogs,
    viewMyBlogs,
    addBlogForm,
    addBlog,
    editBlogForm,
    updateBlog,
    deleteBlog,
    addTopicController,
    addTopicPostController,
    deleteaddTopicController,
    addSubtopicController,
    addSubtopicPostController
};
