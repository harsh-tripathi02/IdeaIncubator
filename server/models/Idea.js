const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  tags: [String],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  upvotes: {
    type: [String],
    default: []
  },
  downvotes: {
    type: [String],
    default: []
  },
  comments: {
    type: [commentSchema],
    default: []
  }
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model('Idea', ideaSchema);
