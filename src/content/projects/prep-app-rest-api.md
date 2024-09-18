---
title: Preparation App REST API
pubDate: 2024-02-04
author: Melnard De Jesus
image:
  src: './images/prepRestApi.jpg'
  alt: 'Preparation App REST API'
description: This REST API serves as the backend for the Preparation App, enabling secure user authentication, session participation, and data management.
slug: prep-app-rest-api
technology:
  - src: './tech/node.svg'
    alt: 'Node.js logo'
  - src: './tech/mongodb.svg'
    alt: 'MongoDB logo'
tags: ['backend', 'api', 'nodejs', 'express']
link: ''
repo: ''
shortDesc: REST API backend for the Preparation App, featuring secure user authentication, session participation, and data management using Node.js and MongoDB.
---

The Preparation App REST API serves as the backend for the Preparation App, allowing users to authenticate, participate in themed sessions, and manage relevant data. Built with Node.js and Express, this API uses MongoDB for data storage, ensuring a secure and efficient backend solution.
<br>
<br>

- <i class="fab fa-node-js text-lblue"></i> User Authentication: Secure sign-up, login, and logout functionalities with JWT tokens.
  <br>
  <br>

- <i class="fas fa-vote-yea text-lblue"></i> Session Participation: Allows users to participate in themed sessions, with results stored in MongoDB.
  <br>
  <br>

- <i class="fas fa-shield-alt text-lblue"></i> API Security: Includes error handling, CSRF protection, and secure headers via Helmet.
  <br>
  <br>

- <i class="fas fa-database text-lblue"></i> Data Management: CRUD operations for themes and session data.
  <br>
  <br>

- <i class="fas fa-user-cog text-lblue"></i> Session Management: Uses Express-session for managing user sessions.
  <br>
  <br>
  Tech Stack 🛠️

- <i class="fab fa-node-js text-lblue"></i> Node.js
- <i class="fas fa-server text-lblue"></i> Express.js
- <i class="fas fa-database text-lblue"></i> Mongoose (MongoDB)
- <i class="fas fa-key text-lblue"></i> JWT for Authentication
- <i class="fas fa-shield-alt text-lblue"></i> Helmet for Security
- <i class="fas fa-ban text-lblue"></i> CSRF Protection

<br>
<a href="https://github.com/mdejesus23/prep-app" target="_black" class="text-lblue"><u>Github Repo</u></a>
