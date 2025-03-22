const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Article = require('../models/Article');
const User = require('../models/User');

// Load env vars - use path.resolve to get the correct path to .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('MONGO_URI:', process.env.MONGO_URI); // Add this to debug

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Articles to seed
const sampleArticles = [
  {
    title: 'Getting Started with Vue.js 3',
    content: `Vue.js 3 is the latest major version of Vue.js, a progressive JavaScript framework for building user interfaces. It brings significant improvements over Vue.js 2, including better performance, smaller bundle sizes, improved TypeScript support, and the Composition API.

In this article, we'll explore how to set up a new Vue.js 3 project and learn about its key features.

## Prerequisites
- Node.js (version 12 or higher)
- npm or yarn package manager

## Setting up a Vue.js 3 Project
The easiest way to get started with Vue.js 3 is using the Vue CLI. Run the following commands:

\`\`\`bash
npm install -g @vue/cli
vue create my-vue3-project
\`\`\`

When prompted, select the Vue.js 3 preset or manually configure your project with Vue.js 3 features.

Happy coding with Vue.js 3!`,
    tags: ['Vue.js', 'JavaScript', 'Frontend'],
  },
  {
    title: 'Understanding Express.js Middleware',
    content: `Middleware functions are a fundamental part of Express.js applications. They have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle.

Middleware functions can perform the following tasks:
- Execute any code
- Make changes to the request and response objects
- End the request-response cycle
- Call the next middleware in the stack

In this article, we'll explore how middleware works and common use cases.

## Basic Middleware Example

\`\`\`javascript
const express = require('express');
const app = express();

// A simple middleware function
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
\`\`\`

## Types of Middleware
1. Application-level middleware
2. Router-level middleware
3. Error-handling middleware
4. Built-in middleware
5. Third-party middleware

Middleware is a powerful concept that allows you to organize your Express application into reusable components.`,
    tags: ['Express.js', 'Node.js', 'Backend', 'Middleware'],
  },
  {
    title: 'MongoDB Atlas: Cloud Database for Modern Applications',
    content: `MongoDB Atlas is a fully-managed cloud database service for MongoDB. It handles all the complexity of deploying, managing, and healing deployments on the cloud service provider of your choice (AWS, Azure, and GCP).

## Key Features of MongoDB Atlas

1. **Automated Backups**: Continuous backups and point-in-time recovery.
2. **Scaling**: Scale your database up or down with no application downtime.
3. **Security**: Network isolation, VPC peering, IP whitelisting, and more.
4. **Monitoring**: Built-in monitoring tools to track the performance of your database.
5. **Global Clusters**: Distribute your data globally to reduce latency.

## Getting Started with MongoDB Atlas

1. Create a free account at MongoDB Atlas website
2. Deploy a free tier cluster
3. Configure your IP whitelist and database users
4. Connect your application using the connection string

MongoDB Atlas is an excellent choice for both small startups and large enterprises looking for a scalable, reliable database solution without the operational overhead.`,
    tags: ['MongoDB', 'Database', 'Cloud', 'Atlas'],
  },
  {
    title: 'JWT Authentication: A Complete Guide',
    content: `JSON Web Tokens (JWT) provide a secure way to transmit information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

## How JWT Works

A JWT consists of three parts:
1. **Header**: Identifies which algorithm is used to generate the signature
2. **Payload**: Contains the claims (data)
3. **Signature**: Ensures the token hasn't been altered

## JWT Authentication Flow

1. User logs in with credentials
2. Server validates credentials and returns a JWT
3. Client stores the JWT (typically in local storage)
4. Client includes JWT in Authorization header for subsequent requests
5. Server validates JWT signature before processing requests

## Implementing JWT Authentication with Node.js

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Verify token middleware
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};
\`\`\`

JWTs are widely used for authentication in modern web applications, especially in RESTful APIs and single-page applications.`,
    tags: ['Authentication', 'JWT', 'Security', 'API'],
  },
  {
    title: 'Building Responsive Web Designs with Modern CSS',
    content: `Responsive web design is crucial for creating websites that work well on all devices, from desktop computers to mobile phones. Modern CSS provides powerful tools to make responsive design easier and more flexible.

## Key Responsive Design Techniques

### 1. Fluid Layouts with Flexbox

Flexbox makes creating flexible layouts simple:

\`\`\`css
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item {
  flex: 1 1 300px; /* Grow, shrink, basis */
  margin: 10px;
}
\`\`\`

### 2. CSS Grid for Complex Layouts

Grid allows for two-dimensional layouts:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 20px;
}
\`\`\`

### 3. Media Queries

Target specific screen sizes:

\`\`\`css
/* Mobile styles */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
  }
}
\`\`\`

### 4. Modern Units

Use viewport-relative units for truly responsive designs:

\`\`\`css
.hero {
  height: 90vh;
  font-size: clamp(1.5rem, 5vw, 3rem);
}
\`\`\`

These modern CSS techniques allow developers to create websites that adapt beautifully to any screen size without relying on JavaScript or complex frameworks.`,
    tags: ['CSS', 'Responsive Design', 'Web Development', 'Frontend'],
  }
];

// Seed the database
const seedArticles = async () => {
  try {
    // Find the first user to set as author (or create one if none exists)
    let user = await User.findOne();
    
    if (!user) {
      user = await User.create({
        name: 'Seed User',
        email: 'seed@example.com',
        password: 'password123'
      });
    }
    
    // First, clear existing articles
    await Article.deleteMany({});
    
    // Add author ID to each article
    const articlesWithAuthor = sampleArticles.map(article => ({
      ...article,
      author: user._id
    }));
    
    // Insert articles
    await Article.insertMany(articlesWithAuthor);
    
    console.log('Database seeded successfully!');
    
    // Disconnect from MongoDB
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedArticles();
