const mongoose = require('mongoose');

const SoftwareSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  appUrl: {
    type: String,
    required: [true, 'Please add application URL']
  },
  iconUrl: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  meta: {
    path: String,
    structure: {
      hasFrontend: {
        type: Boolean,
        default: false
      },
      hasBackend: {
        type: Boolean,
        default: false
      },
      frontendTech: [String],
      backendTech: [String]
    },
    languages: [String],
    frameworks: [String],
    status: {
      type: String,
      enum: ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'],
      default: 'planning'
    },
    scheduling: {
      scheduledDateTime: Date,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      repeat: {
        type: Boolean,
        default: false
      },
      repeatFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'daily'
      },
      repeatInterval: {
        type: Number,
        default: 1
      },
      status: {
        type: String,
        enum: ['pending', 'active', 'paused', 'completed'],
        default: 'pending'
      },
      lastRun: Date,
      scheduleTime: {
        hour: Number,
        minute: Number
      },
      timeZone: {
        type: String,
        default: 'UTC'
      }
    },
    installedPackages: {
      frontend: [String],
      backend: [String]
    },
    scheduled: Date,
    isDeleted: {
      type: Boolean,
      default: false
    },
    promptHistory: [String],
    queueData: {
      buildAttempts: {
        type: Number,
        default: 0
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Software', SoftwareSchema);
