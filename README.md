# Twitter Clone Backend

This is the backend repository for a Twitter-like application, built using the **MEN stack**: MongoDB, Express, and Node.js. This backend provides all essential functionalities for managing authentication, users, profiles, posts, and interactions (like, comment, follow) through various API endpoints.

Feel free to create a frontend to connect with this backend.

## Table of Contents

- [Twitter Clone Backend](#twitter-clone-backend)
  - [Table of Contents](#table-of-contents)
  - [Main Features](#main-features)
    - [authRouter](#authrouter)
    - [userRouter](#userrouter)
    - [profileRouter](#profilerouter)
    - [postRouter](#postrouter)
  - [Running Locally](#running-locally)
  - [Environment Variables](#environment-variables)

## Main Features

### authRouter

This module handles user authentication using **Token-based Authentication** (AccessToken & RefreshToken). It includes:

- **Login**: Authenticate users and generate access and refresh tokens.
- **Signup**: Create a new user account.
- **Logout**: Invalidate tokens to log users out.

### userRouter

The user management module allows you to:

- **Search for users**: Look up other users by their usernames or other criteria.

### profileRouter

Profile management features include:

- **Follow/Unfollow users**: Follow or unfollow other users.
- **Get & Edit profile**: Retrieve or update your user profile.
- **Get followers & following**: Retrieve the lists of users who follow you or whom you follow.
- **Get posts by profile**: Fetch all posts made by a specific user.

### postRouter

Post-related functionalities include:

- **Upload posts**: Share a new post.
- **Like/Dislike posts**: Like or dislike a post.
- **Create comments on posts**: Add comments to a post.
- **Get posts**: Fetch a feed of posts.
- **Get post by ID**: Retrieve a specific post using its ID.

## Running Locally

To set up the project locally:

1. Clone the repository:
```bash
git clone https://github.com/sushihentaime/twitter-clone-backend.git
cd twitter-clone-backend
```

2. Install the dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory based on the `.env.example` file:
```bash
cp .env.example .env
```

4. Add your environment-specific variables in the `.env` file.

5. Run the development server:
```bash
npm run dev
```

6. The API will be available at `http://localhost:8000`.

## Environment Variables

The following environment variables are required to run this application:
- `DATABASE_URL`: Connection string for MongoDB.
- `PORT`: Server port number.
- `ACCESS_TOKEN_EXPIRATION_MINUTES`: Expiration time for access tokens (e.g., 15m, 60m).
- `REFRESH_TOKEN_EXPIRATION_MINUTES`: Expiration time for refresh tokens (e.g., 15m, 60m).
