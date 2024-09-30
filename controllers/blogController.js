const Blog = require('../model/blogModel');
const fs = require('fs').promises;
const path = require('path');

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


module.exports = {
    viewAllBlogs,
    viewMyBlogs,
    addBlogForm,
    addBlog,
    editBlogForm,
    updateBlog,
    deleteBlog
};
