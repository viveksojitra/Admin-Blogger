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

_Preview images and videos of the project will be here._
## 🎥 Demo Video
https://github.com/user-attachments/assets/ae769c1f-2811-4077-94af-cd9b1b73b1c0

## 📷 Images
![Registration]
![registration](https://github.com/user-attachments/assets/7f51d98f-4d35-414a-869f-c34f91f84792)

![Sign-in]
![signin](https://github.com/user-attachments/assets/fdc81ee1-5135-4838-a485-ec4d7099e4b3)

![Forget Password Validation]
![forget-password](https://github.com/user-attachments/assets/d9ded8cc-fe72-4331-911f-000f1ce9a937)

![Dashboard]
![dashboard](https://github.com/user-attachments/assets/caf1facc-b56a-4511-b070-731011dde43d)

![Flash Message Alert]
![flashMessage](https://github.com/user-attachments/assets/049383fa-02ca-492d-a5eb-186abdc78232)

![Create Blog]
![blog-create-page](https://github.com/user-attachments/assets/16d76a73-9176-41ed-be30-7a0376f335d8)

![User's Blogs]
![myblogs](https://github.com/user-attachments/assets/60005b9f-ec37-4872-9bc4-d978dc180234)

![All User's Blogs (Update, Delete)]
![explorePage](https://github.com/user-attachments/assets/942b7645-c971-423a-b904-d8101f2ebfb1)

![Comments Area (Update, Delete only current user's blogs)]
![explore-comments](https://github.com/user-attachments/assets/38ed83ee-d978-454e-9e78-d139b73a2e54)

![Topics]
![topics](https://github.com/user-attachments/assets/50bbf9e2-a71e-4bcd-866a-aaeba2500f69)

![Sub Topics]
![sub-topics](https://github.com/user-attachments/assets/d4a3511a-b226-469a-b2e0-460ba8fc727d)

![View Topics/Sub-Topics]
![view-topics-subtopics](https://github.com/user-attachments/assets/cb296293-ecb8-4aab-af0c-359963a7aa87)

![Profile Page]
![profile](https://github.com/user-attachments/assets/56642a3d-d2ff-453e-9fb4-8dfc75bedc45)

![Change Password]
![change-password](https://github.com/user-attachments/assets/54cbf5b2-0ce5-4697-a0e0-e5f4b572e175)
![change-password-form](https://github.com/user-attachments/assets/383507dc-e0fc-45dc-9904-26da69c67712)

![Logout]
![logout](https://github.com/user-attachments/assets/6767ff05-9635-4164-85ed-52cb1836168b)

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
    git clone https://github.com/viveksojitra/Admin-Blogger.git
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
```

## Partial Credit (UI):
https://www.creative-tim.com/
