import mongoose, { Schema } from 'mongoose';
import type { ISessionModel } from '../../interfaces';
import AppConstants from '../../constants';

const { DBModelsNames } = AppConstants.getDbConstants();
const sessionSchema = new Schema<ISessionModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: DBModelsNames.USERS,
      required: [true, 'User ID is required'],
    },
    refreshToken: {
      type: String,
      required: [true, 'Refresh token is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expires at is required'],
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    deviceType: {
      type: String,
      default: null,
    },
    deviceModel: {
      type: String,
      default: null,
    },
    deviceOs: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<ISessionModel>(DBModelsNames.SESSIONS, sessionSchema, DBModelsNames.SESSIONS);
export default SessionModel;
