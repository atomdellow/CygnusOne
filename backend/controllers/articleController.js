const Article = require('../models/Article');
const asyncHandler = require('express-async-handler');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
  // Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const articles = await Article.find()
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Article.countDocuments();

  res.json({
    success: true,
    count: articles.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
    data: articles,
  });
});

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
const getArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id).populate('author', 'name email');

  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }

  res.json({
    success: true,
    data: article,
  });
});

// @desc    Create a new article
// @route   POST /api/articles
// @access  Private
const createArticle = asyncHandler(async (req, res) => {
  req.body.author = req.user.id;

  const article = await Article.create(req.body);

  res.status(201).json({
    success: true,
    data: article,
  });
});

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private
const updateArticle = asyncHandler(async (req, res) => {
  let article = await Article.findById(req.params.id);

  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }

  // Make sure user is the article author
  if (article.author.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this article');
  }

  req.body.updatedAt = Date.now();

  article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: article,
  });
});

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private
const deleteArticle = asyncHandler(async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404);
      throw new Error('Article not found');
    }

    // Make sure user is the article author
    if (article.author.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to delete this article');
    }

    // Use findByIdAndDelete instead of deleteOne for more reliability
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    
    if (!deletedArticle) {
      res.status(404);
      throw new Error('Failed to delete article');
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    // If it's not a handled error, set 500 status
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500);
    }
    throw error;
  }
});

module.exports = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
