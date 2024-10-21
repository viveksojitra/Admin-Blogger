# 📝 Blogger Admin Panel

A comprehensive Blogger Admin Panel designed for managing blog content effectively. This project is built using Node.js, Express, MongoDB, and EJS, featuring user authentication, blog management, and topic categorization.

## 📑 Features

- **User Authentication:**
  - **Registration:** Users can create an account to access the admin panel.
  - **Sign-In:** Secure login required to manage blogs and topics.
  - **Logout:** Users can safely log out of the system.
  - **Forget Password:** Users can reset their password via email.
  - **Change Password:** Users can change their password after logging in.

- **Blog Management:**
  - **Create Blogs:** Users can write and publish new blog posts.
  - **Edit Blogs:** Users can update their existing blog posts.
  - **View Blogs:** Users can browse blogs from multiple users.
  - **Comments:** Users can comment on blogs to facilitate discussion.
  - **Delete Blogs:** Users can remove their blog posts when necessary.

- **Topic Management:**
  - **Add/Delete Topics:** Users can categorize their blogs by adding or deleting topics.
  - **Add/Delete Subtopics:** Users can manage subtopics under each main topic.
  - **View All Topics/Subtopics:** Users can view all topics and subtopics created by multiple users.

## 🎞 Demo Video

[Watch Demo Video]

## 🎥 Preview

_Preview images and videos of the project will be here._

![Registration]
![Sign-in]
![Dashboard]
![Profile Page]

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend:** EJS, Bootstrap 5
- **File Uploads:** Multer
- **Authentication:** Passport.js
- **Email Services:** Nodemailer for password resets
- **Dev Tools:** Nodemon, Body-parser

## 📦 Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/viveksojitra/blogger-admin.git
    ```
2. Navigate to the project directory:
    ```bash
    cd blogger-admin
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    npm start
    ```
5. Open your browser and go to `http://localhost:3002` to access the Blogger Admin Panel.

## 📂 Project Structure

```bash
blogger-admin/
│
├── assets/           # All the necessary resources (css, images, js, etc.).
├── config/           # Configuration files (multer, nodeMailer, passport, etc.)
├── controllers/      # Request handlers and business logic (authController, blogController, etc)
├── database/         # Database connection setup (MongoDB - Compass)
├── models/           # Mongoose schemas
├── public/           # Static files (CSS, images)
├── routes/           # Express routes
├── uploads/          # Uploaded files (e.g., Blog Images)
├── views/            # EJS templates for rendering pages with better UI
├── index.js          # Main entry point of the app
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
