import mongoose from 'mongoose';
import Patterns from '@book-junction/patterns';

import type { IUserModel } from '../../interfaces';
import AppConstants from '../../constants';
import { CryptoManager } from '../../config';

const { DBModelsNames } = AppConstants.getDbConstants();
const userSchema = new mongoose.Schema<IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      match: [Patterns.common.name, 'Name is invalid'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [Patterns.common.email, 'Email is invalid'],
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [Patterns.common.phone, 'Phone number is invalid'],
      default: null,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      match: [Patterns.common.password, 'Password is invalid'],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    photoUri: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  const cryptoManager = new CryptoManager();
  if (!this.isModified('password')) return;

  this.password = await cryptoManager.hashPassword(this.password);
});

userSchema.methods.comparePassword = async function (password: string) {
  const cryptoManager = new CryptoManager();
  return await cryptoManager.comparePassword(password, this.password);
};

const UserModel = mongoose.model<IUserModel>(DBModelsNames.USERS, userSchema, DBModelsNames.USERS);

export default UserModel;
