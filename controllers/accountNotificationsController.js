import AccountNotification from '../models/accountNotification.js';
import mongoose from 'mongoose';

const createNotification = async (
  _req,
  _res,
  _next,
  forUserId,
  fromUserId,
  contentType,
  contentId
) => {
  try {
    const newNotification = {
      forUser: forUserId,
      fromUser: fromUserId,
      contentType: contentType,
      contentId: contentId
    };

    const createdNotification = await AccountNotification.create(
      newNotification
    );

    if (createdNotification) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const getNotificationsForUser = async (req, res, next) => {
  try {
    const userNotifications = await AccountNotification.find({
      forUser: req.currentUser._id
    }).exec();

    if (!userNotifications) {
      return res.status(404).send({
        message: `Notifications could not be found for user ${req.currentUser._id}`
      });
    }
    return res.status(200).json(userNotifications);
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {};

export default {
  createNotification,
  getNotificationsForUser,
  deleteNotification
};
