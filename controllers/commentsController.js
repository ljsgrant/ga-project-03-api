import { PostModels } from '../models/post.js';
import accountNotificationsController from './accountNotificationsController.js';

async function createComment(req, res, next, parentType, parentId) {
  const replyThreadDepthLimit = 6;
  try {
    const newComment = {
      ...req.body,
      addedBy: req.currentUser._id
    };

    const parent = await parentType.findById(parentId);
    if (!parent) {
      return res
        .status(404)
        .send({ message: `Parent with id ${parentId} not found` });
    }

    if (parent.replyThreadDepth === replyThreadDepthLimit) {
      return res.status(403).send({
        message: `Comment threads cannot be deeper than ${replyThreadDepthLimit} replies`
      });
    }

    if (parentType === PostModels.Post) {
      newComment.parentPostId = parentId;
      // if parent is a post, there is no ancestor, so parentPostId and parentAncestorId are the same
      newComment.ancestorPostId = parentId;
    }
    if (parentType === PostModels.Comment) {
      newComment.parentCommentId = parentId;
      // if parent is a comment, initialize with the parent's ancestorPostId
      newComment.ancestorPostId = parent.ancestorPostId;
    }

    newComment.replyThreadDepth = parent.replyThreadDepth + 1;

    const { _id } = await PostModels.Comment.create(newComment);

    parent.comments.push(_id);

    // await User.findOneAndUpdate(
    //   { _id: req.currentUser._id },
    //   { $push: { comments: _id._id } }
    // );

    const savedParent = await parent.save();

    console.log('parent.addedBy = ', parent.addedBy);
    console.log('req.currentUser = ', req.currentUser);

    if (parentType === PostModels.Comment) {
      await accountNotificationsController.createNotification(
        parent.addedBy,
        req.currentUser._id,
        'Comment',
        parentId
      );
    }
    if (parentType === PostModels.Post) {
      await accountNotificationsController.createNotification(
        parent.addedBy,
        req.currentUser._id,
        'Post',
        parentId
      );
    }

    return res.status(201).json(savedParent);
  } catch (error) {
    next(error);
  }
}

async function getComment(req, res, next) {
  try {
    const comment = await PostModels.Post.findById(req.params.id);
    return comment
      ? res.status(200).json(comment)
      : res
          .status(404)
          .json({ message: `No comment with id ${req.params.id}` });
  } catch (error) {
    next(error);
  }
}

async function updateComment(req, res, next) {
  try {
    const post = await PostModels.Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .send({ message: `No post found with id ${req.params.id}` });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).send({ message: 'No comment found' });
    }

    if (req.body.likeOrDislike) {
      console.log('hello world');

      if (req.body.likeOrDislike === 'like') {
        // if user hasn't already liked post
        if (!user.likedComments || !user.likedComments.includes(comment._id)) {
          await post.updateOne({ $inc: { likes: 1 } });
          await user.updateOne({ $push: { likedComments: req.params.id } });
          // if user has disliked post previously, remove post from their dislikes
          if (
            user.dislikedComments &&
            user.dislikedComments.includes(comment._id)
          ) {
            await post.updateOne({ $inc: { dislikes: -1 } });
            await user.updateOne({
              $pull: { dislikedComments: req.params.id }
            });
          }
        }
        // if user has already liked post
        if (user.likedComments && user.likedComments.includes(comment._id)) {
          await post.updateOne({ $inc: { likes: -1 } });
          await user.updateOne({ $pull: { likedComments: req.params.id } });
        }
      }
      if (req.body.likeOrDislike === 'dislike') {
        // if user hasn't already disliked post
        if (
          !user.dislikedComments ||
          !user.dislikedComments.includes(comment._id)
        ) {
          await post.updateOne({ $inc: { dislikes: 1 } });
          await user.updateOne({ $push: { dislikedComments: req.params.id } });
          // if user has liked post previously, remove post from their likes
          if (user.likedComments && user.likedComments.includes(comment._id)) {
            await post.updateOne({ $inc: { likes: -1 } });
            await user.updateOne({ $pull: { likedComments: req.params.id } });
          }
        }
        // if user has already disliked post
        if (
          user.dislikedComments &&
          user.dislikedComments.includes(comment._id)
        ) {
          await post.updateOne({ $inc: { dislikes: -1 } });
          await user.updateOne({ $pull: { dislikedComments: req.params.id } });
        }
      }
      const updatedPost = await post.save();
      return res.status(200).json(updatedPost);
    } else {
      if (!comment.addedBy.equals(req.currentUser._id)) {
        return res.status(301).send({
          message: 'Unauthorized: can not update other users comment'
        });
      }

      comment.set(req.body);

      const savedPost = await post.save();

      return res.status(200).json(savedPost);
    }
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const comment = await PostModels.Comment.findById(req.params.commentId);

    if (!comment) {
      return res
        .status(404)
        .send({ message: `No comment found with id ${req.params.commentId}` });
    }
    console.log(req.currentUser._id);
    console.log(comment.addedBy._id);

    if (
      comment.addedBy._id.equals(req.currentUser._id) ||
      req.currentUser.isAdmin
    ) {
      let parent;
      // if (comment.parentPostId) {
      //   parent = await PostModels.Post.findById(comment.parentPostId);
      // }
      if (comment.parentCommentId) {
        parent = await PostModels.Comment.findById(comment.parentCommentId);
        parent.deletedComments.push(req.params.commentId);
      }

      // if (!parent) {
      //   return res
      //     .status(404)
      //     .send({ message: `Couldn't find the parent of this post` });
      // }

      // const commentIndexToRemove = parent.comments.indexOf(
      //   (objectId) => objectId === req.params.commentId
      // );
      // console.log(commentIndexToRemove);

      // parent.comments.splice(commentIndexToRemove, 1);
      // const savedParent = await parent.save();

      const updatedComment = await comment.updateOne({
        $set: {
          text: '',
          isDeleted: true
        },
        $unset: {
          addedBy: ''
        }
      });

      return res.status(201).json(updatedComment);
    }

    return res.status(401).send({
      message: 'Unauthorized, deleteComment in commentsController'
    });
  } catch (error) {
    next(error);
  }
}

export default { createComment, updateComment, deleteComment, getComment };
