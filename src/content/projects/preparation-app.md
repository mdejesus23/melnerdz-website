---
title: Preparation App
pubDate: 2024-09-20
author: Melnard De Jesus
image:
  src: './images/prepApp.jpg'
  alt: 'A person coding on a laptop'
description: A full-stack web application for managing Bible themes within our church. It offers secure CRUD functionality, allowing users to create, update, and explore themes in a collaborative environment.
slug: preparation-app
tags: ['coding', 'tips', 'technology']
technology:
  - src: './tech/node.svg'
    alt: 'Node.js logo'
  - src: './tech/mongodb.svg'
    alt: 'MongoDB logo'
  - src: './tech/css.svg'
    alt: 'CSS logo'
  - src: './tech/js.svg'
    alt: 'JavaScript logo'
  - src: './tech/html.svg'
    alt: 'HTML logo'
  - src: './tech/css.svg'
    alt: 'CSS logo'
link: 'https://preparation-app.onrender.com/'
repo: 'https://github.com/mdejesus23/preparation-app'
shortDesc: Full-stack web app for our church to streamline preparation for
  activities, featuring user authentication, session management,
  and secure data handling
---

I've developed a simple Preparation App for our church organization. This full-stack web application is designed to streamline the process of preparation for various church activities.

## Features:

- <i class="fab fa-node-js text-lblue"></i> Node.js with Express Backend: The backend is powered by Node.js with Express, providing a robust and scalable environment for handling server-side operations.

- <i class="fas fa-database text-lblue"></i> MongoDB for Data Storage: All data, including user information and preparation themes, is securely stored in a MongoDB database, ensuring efficient data retrieval and management.

- <i class="fas fa-file-code text-lblue"></i> EJS Templating: The app uses EJS for rendering dynamic HTML pages, making it easy to integrate data into the user interface.

- <i class="fas fa-paint-brush text-lblue"></i> CSS for Styling: The frontend is styled using CSS, offering a clean and user-friendly design.

- <i class="fas fa-lock text-lblue"></i> User Authentication and Session Management: The app includes user signup and login features, with session management handled via Express-session. Session data is stored in the database, and session IDs are maintained in browser cookies for user authentication.

- <i class="fas fa-shield-alt text-lblue"></i> Security Enhancements: Security is a top priority, with features like Content Security Policy (CSP) implemented through Node Helmet, and CSRF protection to prevent cross-site request forgery.
- <i class="fas fa-user-check  text-lblue"></i> Test Login Credentials: You can log in
  using the following test credentials:

  - Email: <span class="text-lblue">test123@gmail.com</span>
  - Password: <span class="text-lblue">Test123</span>
  - Theme Passcode: <span class="text-lblue">asdf</span>

    _Note: The app is hosted on a free tier of Render.com, so it may take a moment for the initial load._

    <a href="https://preparation-app.onrender.com/" target="_blank" class="text-lblue"><u>Live Site</u></a>

    <a href="https://github.com/mdejesus23/preparation-app" target="_blank" class="text-lblue"><u>Github Repo</u></a>
