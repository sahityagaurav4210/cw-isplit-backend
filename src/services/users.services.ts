import { LoggerManager, RequestManager } from '../config';
import AppConstants, { OTPSource } from '../constants';
import { OtpModel, UserModel } from '../db';
import { CWISplitAppException } from '../exceptions';
import { TimeHelper, UtilsHelper } from '../helpers';
import type { ICreateUserDto, IServiceResponse } from '../interfaces';

export async function createUser(payload: ICreateUserDto) {
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    throw new CWISplitAppException(
      ApiStatus.BAD_REQUEST,
      'Please provide necessary details',
      HttpCodes.BAD_REQUEST,
      createUser.name
    );
  }

  const user = await UserModel.findOne({ email });

  if (user) {
    throw new CWISplitAppException(ApiStatus.BAD_REQUEST, 'User already exists', HttpCodes.BAD_REQUEST, createUser.name);
  }

  const newUser = new UserModel(payload);
  await newUser.save();

  return newUser.toJSON();
}

export async function editUserProfile(
  userId: string,
  hasFile: boolean,
  fileName: string,
  payload: Partial<ICreateUserDto>
): Promise<IServiceResponse<Record<string, any>>> {
  const logger = LoggerManager.getInstance();
  const reqId = RequestManager.getCurrentReqId();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const { name, email, phone } = payload;
  let photoUri: string | undefined;

  if (hasFile) {
    photoUri = `/assets/${fileName}`;
  }

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: userId, isBlocked: false, isDeleted: false },
    { name, email, phone, photoUri, updatedAt: new Date() },
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedUser) {
    logger.error(`Req Id: ${reqId} - User with ID ${userId} not found or is blocked/deleted. Cannot update profile.`);
    throw new CWISplitAppException(ApiStatus.NOT_FOUND, 'User not found', HttpCodes.NOT_FOUND, editUserProfile.name);
  }

  logger.info(`Req Id: ${reqId} - User profile updated successfully for user ID ${userId}.`);
  return { success: true, data: updatedUser.toJSON() };
}

export async function getUserProfile(userId: string): Promise<IServiceResponse<Record<string, any>>> {
  const logger = LoggerManager.getInstance();
  const reqId = RequestManager.getCurrentReqId();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();

  const user = await UserModel.findOne({ _id: userId, isBlocked: false, isDeleted: false }, '-createdAt, -__v');

  if (!user) {
    logger.error(`Req Id: ${reqId} - User with ID ${userId} not found or is blocked/deleted. Cannot get profile.`);
    throw new CWISplitAppException(ApiStatus.NOT_FOUND, 'User not found', HttpCodes.NOT_FOUND, getUserProfile.name);
  }

  logger.info(`Req Id: ${reqId} - User profile fetched successfully for user ID ${userId}.`);
  return { success: true, data: user.toJSON() };
}

export async function sendOtp(userId: string): Promise<IServiceResponse<Record<string, any>>> {
  const logger = LoggerManager.getInstance();
  const reqId = RequestManager.getCurrentReqId();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();

  const user = await UserModel.findOne({ _id: userId, isBlocked: false, isDeleted: false });

  if (!user) {
    logger.error(`Req Id: ${reqId} - User with ID ${userId} not found or is blocked/deleted. Cannot send OTP.`);
    throw new CWISplitAppException(ApiStatus.NOT_FOUND, 'User not found', HttpCodes.NOT_FOUND, sendOtp.name);
  }

  if (!user.phone) {
    logger.error(`Req Id: ${reqId} - User with ID ${userId} does not have a phone number. Cannot send OTP.`);
    throw new CWISplitAppException(
      ApiStatus.BAD_REQUEST,
      'User does not have a valid phone number',
      HttpCodes.BAD_REQUEST,
      sendOtp.name
    );
  }

  const otpDoc = await OtpModel.findOne({ phone: user.phone, isVerified: false, source: OTPSource.SMS });

  if (otpDoc && otpDoc.blockedUntil && otpDoc.blockedUntil > new Date()) {
    logger.error(
      `Req Id: ${reqId.padStart(10, '0')} - OTP already sent for user ID ${user._id} and phone number ${user.phone}. Please try again later.`
    );

    throw new CWISplitAppException(
      ApiStatus.BAD_REQUEST,
      `You've entered too many incorrect OTPs. Please try again after 2 minutes.`,
      HttpCodes.BAD_REQUEST,
      sendOtp.name
    );
  }

  const utilsHelper = new UtilsHelper();
  await utilsHelper.sendOtp(user.phone);

  logger.info(`Req Id: ${reqId} - OTP sent successfully for user ID ${user._id}.`);
  return { success: true };
}

export async function verifyPhoneNumber(userId: string, otp: number): Promise<IServiceResponse<Record<string, any>>> {
  const logger = LoggerManager.getInstance();
  const reqId = RequestManager.getCurrentReqId();
  const { ApiStatus, HttpCodes } = AppConstants.getApiConstants();
  const timeHelper = new TimeHelper();
  const currentTime = new Date(timeHelper.getCurrentTime());

  const user = await UserModel.findOne({ _id: userId, isBlocked: false, isDeleted: false });

  if (!user) {
    logger.error(
      `Req Id: ${reqId.padStart(10, '0')} - User with ID ${userId} not found or is blocked/deleted. Cannot verify phone number.`
    );
    throw new CWISplitAppException(ApiStatus.NOT_FOUND, 'Invalid identity.', HttpCodes.NOT_FOUND, verifyPhoneNumber.name);
  }

  if (!user.phone) {
    logger.error(
      `Req Id: ${reqId.padStart(10, '0')} - User with ID ${userId} does not have a phone number. Cannot verify phone number.`
    );
    throw new CWISplitAppException(
      ApiStatus.BAD_REQUEST,
      'User does not have a valid phone number',
      HttpCodes.BAD_REQUEST,
      verifyPhoneNumber.name
    );
  }

  const otpDoc = await OtpModel.findOne({ phone: user.phone, isVerified: false, source: OTPSource.SMS });

  // Explanation: If OTP is not found, it means OTP was never sent.
  if (!otpDoc?.otp) {
    logger.error(
      `Req Id: ${reqId.padStart(10, '0')} - OTP not found for user ID ${user._id} and phone number ${user.phone}.`
    );
    throw new CWISplitAppException(
      ApiStatus.BAD_REQUEST,
      `Invalid OTP, please enter the correct OTP.`,
      HttpCodes.BAD_REQUEST,
      verifyPhoneNumber.name
    );
  }

  //Explanation: If user has entered wrong OTP more than 3 times, then show block message to the user.
  if (otpDoc.blockedUntil && otpDoc.blockedUntil > currentTime) {
    logger.error(
      `Req Id: ${reqId.padStart(10, '0')} - Too many phone number verification attempts for user ID ${user._id} therefore blocked until ${otpDoc.blockedUntil}.`
    );

    throw new CWISplitAppException(
      ApiStatus.BAD_REQUEST,
      `You've entered too many incorrect OTPs. Please try again after 2 minutes.`,
      HttpCodes.BAD_REQUEST,
      verifyPhoneNumber.name
    );
  }

  //Explanation: If user has entered wrong OTP more than 3 times, then block the user for 10 minutes and show the appropriate message to the user.
  if (otpDoc.failedAttempts >= 3 && !otpDoc.blockedUntil) {
    otpDoc.blockedUntil = new Date(timeHelper.plusMinutes(2));
    otpDoc.updatedAt = new Date();
    await otpDoc.save();

    logger.error(
      `Req Id: ${reqId.padStart(10, '0')} - Too many phone number verification attempts for user ID ${user._id} therefore blocked until ${otpDoc.blockedUntil}.`
    );
    throw new CWISplitAppException(
      ApiStatus.TOO_MANY_REQUESTS,
      `Too many failed attempts for phone number verification. Please try again after 2 minutes.`,
      HttpCodes.TOO_MANY_REQUESTS,
      verifyPhoneNumber.name
    );
  }

  //Explanation: If user has entered wrong OTP, then increment the failed attempts and show the appropriate message to the user.
  if (otpDoc.otp !== otp) {
    otpDoc.failedAttempts += 1;
    otpDoc.updatedAt = new Date();
    await otpDoc.save();

    logger.error(
      `Req Id: ${reqId.padStart(10, '0')} - Invalid OTP for user ID ${user._id} and phone number ${user.phone} therefore increased the failed attempts to ${otpDoc.failedAttempts}.`
    );
    throw new CWISplitAppException(
      ApiStatus.NOT_FOUND,
      `Invalid OTP, please enter the correct OTP.`,
      HttpCodes.NOT_FOUND,
      verifyPhoneNumber.name
    );
  }

  //Explanation: If OTP is expired, then show the appropriate message to the user.
  if (otpDoc.expiresAt < currentTime) {
    logger.error(`Req Id: ${reqId.padStart(10, '0')} - OTP expired for user ID ${user._id} and phone number ${user.phone}.`);
    throw new CWISplitAppException(ApiStatus.NOT_FOUND, 'OTP expired', HttpCodes.NOT_FOUND, verifyPhoneNumber.name);
  }

  otpDoc.isVerified = true;
  otpDoc.failedAttempts = 0;
  otpDoc.updatedAt = new Date();

  user.isPhoneVerified = true;
  user.updatedAt = new Date();

  await Promise.all([otpDoc.save(), user.save()]);

  logger.info(
    `Req Id: ${reqId.padStart(10, '0')} - User phone number (${user.phone}) verified successfully for user ID ${user._id}.`
  );
  return { success: true };
}
