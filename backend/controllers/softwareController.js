const Software = require('../models/Software');
const asyncHandler = require('express-async-handler');

// @desc    Get all software
// @route   GET /api/software
// @access  Public/Private (depends on isPublic flag)
const getSoftware = asyncHandler(async (req, res) => {
  // If user is not logged in, only return public software
  let query = {};
  if (!req.user) {
    query.isPublic = true;
  }

  const software = await Software.find(query)
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: software.length,
    data: software,
  });
});

// @desc    Get single software
// @route   GET /api/software/:id
// @access  Public/Private (depends on isPublic flag)
const getSingleSoftware = asyncHandler(async (req, res) => {
  const software = await Software.findById(req.params.id).populate('author', 'name email');

  if (!software) {
    res.status(404);
    throw new Error('Software not found');
  }

  // Check if software is private and user is not logged in
  if (!software.isPublic && !req.user) {
    res.status(401);
    throw new Error('Not authorized to access this software');
  }

  res.json({
    success: true,
    data: software,
  });
});

// @desc    Create a new software
// @route   POST /api/software
// @access  Private (admin/editor)
const createSoftware = asyncHandler(async (req, res) => {
  req.body.author = req.user.id;

  const software = await Software.create(req.body);

  res.status(201).json({
    success: true,
    data: software,
  });
});

// @desc    Update software
// @route   PUT /api/software/:id
// @access  Private (admin/editor)
const updateSoftware = asyncHandler(async (req, res) => {
  let software = await Software.findById(req.params.id);

  if (!software) {
    res.status(404);
    throw new Error('Software not found');
  }

  req.body.updatedAt = Date.now();

  software = await Software.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: software,
  });
});

// @desc    Delete software
// @route   DELETE /api/software/:id
// @access  Private (admin)
const deleteSoftware = asyncHandler(async (req, res) => {
  const software = await Software.findById(req.params.id);

  if (!software) {
    res.status(404);
    throw new Error('Software not found');
  }

  await Software.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    data: {},
  });
});

module.exports = {
  getSoftware,
  getSingleSoftware,
  createSoftware,
  updateSoftware,
  deleteSoftware,
};
