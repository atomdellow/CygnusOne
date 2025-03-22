const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Software = require('../models/Software');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for software seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample software to seed
const sampleSoftware = [
  {
    title: "TaskApp",
    description: "An app that takes input from user to build tasks, has descriptions and times for when they will need to be done.",
    appUrl: "https://taskapp.example.com",
    iconUrl: "/icons/task-app.svg",
    isPublic: true,
    version: "1.2.0",
    tags: ["Productivity", "Task Management", "Time Planning"],
    meta: {
      path: "C:\\Users\\adamd\\OneDrive\\Documents\\Programming\\projects",
      structure: {
        hasFrontend: true,
        hasBackend: true,
        frontendTech: ["Vue", "Pinia", "Vue Router"],
        backendTech: ["Express", "MongoDB", "Mongoose"]
      },
      languages: [
        "node.js",
        "javascript"
      ],
      frameworks: [
        "vue3",
        "mongoose",
        "express",
        "mongodb"
      ],
      status: "completed",
      scheduling: {
        scheduledDateTime: null,
        priority: "medium",
        repeat: false,
        repeatFrequency: "daily",
        repeatInterval: 1,
        status: "completed",
        lastRun: new Date("2025-03-03T07:43:40.562Z"),
        scheduleTime: {
          hour: 0,
          minute: 0
        },
        timeZone: "UTC"
      },
      installedPackages: {
        frontend: ["vue", "pinia", "vue-router", "axios"],
        backend: ["express", "mongoose", "jsonwebtoken", "bcrypt"]
      },
      scheduled: new Date("2025-03-01T00:00:00.000Z"),
      isDeleted: false,
      promptHistory: [],
      queueData: {
        buildAttempts: 0
      }
    }
  },
  {
    title: "Budget Tracker",
    description: "Personal finance application to track income, expenses and financial goals",
    appUrl: "https://budget.example.com",
    iconUrl: "/icons/budget-tracker.svg",
    isPublic: true,
    version: "2.0.1",
    tags: ["Finance", "Budgeting", "Personal"],
    meta: {
      path: "C:\\Users\\adamd\\Projects\\BudgetTracker",
      structure: {
        hasFrontend: true,
        hasBackend: true,
        frontendTech: ["React", "Redux"],
        backendTech: ["Express", "PostgreSQL"]
      },
      languages: [
        "javascript",
        "typescript"
      ],
      frameworks: [
        "react",
        "express",
        "sequelize"
      ],
      status: "in_progress",
      scheduling: {
        priority: "high",
        status: "active"
      },
      installedPackages: {
        frontend: ["react", "redux", "react-router", "chart.js"],
        backend: ["express", "sequelize", "pg", "jsonwebtoken"]
      },
      isDeleted: false
    }
  },
  {
    title: "Weather Dashboard",
    description: "Real-time weather dashboard with forecasts and historical data",
    appUrl: "https://weather.example.com",
    iconUrl: "/icons/weather-dashboard.svg",
    isPublic: false,
    version: "1.0.0",
    tags: ["Weather", "Dashboard", "Forecasting"],
    meta: {
      path: "C:\\Users\\adamd\\Projects\\WeatherApp",
      structure: {
        hasFrontend: true,
        hasBackend: false,
        frontendTech: ["Angular"],
        backendTech: []
      },
      languages: [
        "typescript"
      ],
      frameworks: [
        "angular",
        "rxjs"
      ],
      status: "planning",
      scheduling: {
        priority: "low",
        status: "pending"
      },
      installedPackages: {
        frontend: ["angular", "rxjs", "d3", "chart.js"],
        backend: []
      },
      isDeleted: false
    }
  },
  {
    title: "Content Management System",
    description: "Enterprise CMS with workflow, permissions, and multi-site support",
    appUrl: "https://cms.example.com",
    iconUrl: "/icons/cms-app.svg",
    isPublic: true,
    version: "3.5.2",
    tags: ["CMS", "Enterprise", "Content"],
    meta: {
      path: "C:\\Users\\adamd\\OneDrive\\Documents\\Programming\\cms-project",
      structure: {
        hasFrontend: true,
        hasBackend: true,
        frontendTech: ["Next.js", "Tailwind"],
        backendTech: ["Django", "PostgreSQL"]
      },
      languages: [
        "javascript",
        "python"
      ],
      frameworks: [
        "next",
        "react",
        "django",
        "tailwind"
      ],
      status: "completed",
      scheduling: {
        priority: "medium",
        status: "completed"
      },
      installedPackages: {
        frontend: ["next", "react", "tailwindcss", "axios"],
        backend: ["django", "djangorestframework", "psycopg2", "pillow"]
      },
      isDeleted: false
    }
  },
  {
    title: "E-commerce Platform",
    description: "Fully-featured e-commerce platform with product management, cart, and checkout",
    appUrl: "https://ecommerce.example.com",
    iconUrl: "/icons/ecommerce.svg",
    isPublic: true,
    version: "2.1.0",
    tags: ["E-commerce", "Shopping", "Retail"],
    meta: {
      path: "C:\\Users\\adamd\\Projects\\EcommerceSystem",
      structure: {
        hasFrontend: true,
        hasBackend: true,
        frontendTech: ["Vue.js", "Nuxt.js"],
        backendTech: ["Node.js", "MongoDB"]
      },
      languages: [
        "javascript"
      ],
      frameworks: [
        "vue",
        "nuxt",
        "express",
        "mongodb"
      ],
      status: "completed",
      scheduling: {
        priority: "high",
        status: "active"
      },
      installedPackages: {
        frontend: ["nuxt", "vue", "vuex", "stripe-js"],
        backend: ["express", "mongoose", "stripe", "passport"]
      },
      isDeleted: false
    }
  }
];

// Seed the database
const seedSoftware = async () => {
  try {
    // Find the first user to set as author (or create one if none exists)
    let user = await User.findOne({ role: 'admin' });
    
    if (!user) {
      user = await User.findOne();
      
      if (!user) {
        user = await User.create({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin'
        });
      }
    }
    
    // First, clear existing software
    await Software.deleteMany({});
    
    // Add author ID to each software
    const softwareWithAuthor = sampleSoftware.map(software => ({
      ...software,
      author: user._id
    }));
    
    // Insert software
    await Software.insertMany(softwareWithAuthor);
    
    console.log('Software database seeded successfully!');
    
    // Disconnect from MongoDB
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error seeding software database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedSoftware();
