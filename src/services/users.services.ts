import { LoggerManager, RequestManager } from '../config';
import AppConstants from '../constants';
import { UserModel } from '../db';
import { CWISplitAppException } from '../exceptions';
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
