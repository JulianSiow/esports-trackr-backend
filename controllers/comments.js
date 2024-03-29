const db = require('../models');

const all = (req, res) => {
  db.Comment.find({})
    .populate('user')
    .exec((err, allComments) => {
      if (err) {
        return console.log(err)
      };
      res.json({
        status: 200,
        count: allComments.length,
        data: allComments
      });
    });
};

const addComment = (req, res) => {
  const commentData = {...req.body, user: req.session.currentUser.id, match: req.params.matchId}
  db.Comment.create(commentData, (err, createdComment) => {
    if (err) return console.log(err);
    res.json({
      status: 201,
      data: createdComment
    })
  });
};

//PUT edit comment
const editComment = (req, res) => {
    db.Comment.findByIdAndUpdate(req.params.commentId, req.body, (err, updatedComment) => {
      if (err) return res.status(500);
      res.status(200).json({
        status: 200,
        data: updatedComment
      });
    });
};

//Delete One
const deleteComment = (req, res) => {
  db.Comment.findByIdAndDelete(req.params.commentId, (err, deletedComment) => {
    if (err) return console.log(err);
    res.json({
      status: 200,
      data: deletedComment
    });
  });
};

const yeet = (req, res) => {
  db.Comment.deleteMany({}, (err, deletedComments) => {
    if (err) return console.log(err);
    res.json({
      status: 200,
      message: 'YEET',
      data: deletedComments
    });
  });
};

module.exports = {
  all,
  addComment,
  editComment,
  deleteComment,
  yeet
}