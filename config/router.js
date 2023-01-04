import express from 'express';
import commentsController from '../controllers/commentsController.js';
import postsController from '../controllers/postsController.js';
import usersController from '../controllers/usersController.js';
import { PostModels } from '../models/post.js';

import secureRoute from '../middleware/secureRoute.js';

const Router = express.Router();

Router.route('/posts')
  .get(postsController.getAllPosts)
  .post(secureRoute, postsController.createNewPost);

Router.route('/posts/:id')
  .get(postsController.getSinglePost)
  .put(secureRoute, postsController.updateSinglePost)
  .delete(secureRoute, postsController.deleteSinglePost);

// Adding comment to another comment, so we past the Comment model as an argument
Router.route('/posts/:id/comments/:commentId')
  .put(secureRoute, commentsController.updateComment)
  .delete(secureRoute, commentsController.deleteComment);

Router.route('/comments/:commentId').post(secureRoute, (req, res, next) => {
  const id = req.params.commentId;
  return commentsController.createComment(req, res, next, PostModels.Comment, id);
});

// Adding comment to a post, so we pass the Post model as an argument
Router.route('/posts/:id/comments').post(secureRoute, (req, res, next) => {
  const id = req.params.id;
  commentsController.createComment(req, res, next, PostModels.Post, id);
});

Router.route('/register').post(usersController.registerUser);

Router.route('/login').post(usersController.loginUser);

export default Router;
