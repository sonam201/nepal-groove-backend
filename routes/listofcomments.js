const connectDB = require("../db/connect");

const Comment = require("../models/comments");

const usercomment = {
  path: "/api/comment",
  method: "post",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    console.log(req.body);
    const usercom = await Comment.create({
      CommentedBy: req.body.CommentedBy,
      CommentedTo: req.body.CommentedTo,
      Text: req.body.Text,
    });
    if (!usercom) {
      return res.status(400).json({ error: "something went wrong" });
    }
    console.log(usercomment);
    res.status(201).json({ usercom });
  },
};

const commentlists = {
  path: "/api/commentlists/:id",
  method: "get",
  handler: async (req, res) => {
    const db = connectDB(process.env.MONGO_URI);
    const { id: commentID } = req.params;
    const com = await Comment.find({ CommentedTo: commentID }).populate(
      "CommentedBy"
    );
    if (!com) {
      return res.sendStatus(400);
    }
    res.status(200).json({ com });
  },
};

module.exports = { usercomment, commentlists };
