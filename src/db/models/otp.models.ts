import mongoose, { Schema } from 'mongoose';
import AppConstants, { OTPSource } from '../../constants';
import type { IOtpModel } from '../../interfaces';
import Patterns from '@book-junction/patterns';

const { DBModelsNames } = AppConstants.getDbConstants();

const otpSchema = new Schema<IOtpModel>(
  {
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [Patterns.common.phone, 'Phone number is invalid'],
    },
    otp: {
      type: Number,
      required: [true, 'OTP is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: [true, 'OTP expiry time is required'],
    },
    source: {
      type: String,
      enum: [OTPSource.EMAIL, OTPSource.SMS],
      default: OTPSource.EMAIL,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    blockedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const OtpModel = mongoose.model<IOtpModel>(DBModelsNames.OTP, otpSchema, DBModelsNames.OTP);

export default OtpModel;
